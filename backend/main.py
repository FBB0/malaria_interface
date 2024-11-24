# main.py
from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import cv2
import numpy as np
import base64
import os
import requests
import logging

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://malaria-interface.onrender.com",  # Production frontend
        "http://localhost:5173",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Add a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": "production"}

@app.get("/")
async def root():
    return {"status": "healthy"}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the inference API endpoint
INFERENCE_API_URL = "https://fbb0--malaria-detection-api-serve.modal.run/upload_image"

@app.post("/upload_image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file upload: {file.filename}")
        contents = await file.read()
        logger.info(f"File size: {len(contents)} bytes")
        
        # Open the image using PIL and log its properties
        try:
            image = Image.open(io.BytesIO(contents)).convert("RGB")
            logger.info(f"Image opened successfully: {image.size}")
        except Exception as e:
            raise ValueError(f"Cannot identify image file. Ensure the image is valid: {e}")

        # Store original image as numpy array for thumbnails later
        base_image_np = np.array(image)

        # Send the image to the external YOLO inference API as binary data
        response = requests.post(
            INFERENCE_API_URL,
            data=contents,  # Sending the original image bytes directly
            headers={"Content-Type": "image/jpeg"}
        )

        # Check if the API call was successful
        if response.status_code != 200:
            logger.error(f"Inference API call failed with status code {response.status_code}")
            raise HTTPException(status_code=500, detail="Failed to process the image with the inference API")

        # Process the response from the inference API
        results = response.json()
        logger.info(f"Inference API Response: {results}")

        if 'detections' not in results:
            raise KeyError("'detections' key not found in the response")
        logger.info(f"YOLO detection completed: {len(results['detections'])} results")

        # Get inference speed from results (if available)
        speed = results.get('speed', 'N/A')

        # Draw bounding boxes on the image
        image_with_boxes, detections = draw_bounding_boxes(image, base_image_np, results)
        logger.info(f"Generated {len(detections)} detections")

        # Convert annotated image to base64 for frontend
        buffered = io.BytesIO()
        image_with_boxes.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        response_data = {
            "img_data": img_str,
            "base_img_data": base64.b64encode(contents).decode(),  # Using the original content for the base image
            "detections": detections,
            "speed": f"{speed}ms"
        }
        logger.info("Sending response back to client")
        return JSONResponse(response_data)

    except ValueError as e:
        logger.error(f"Value error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    except KeyError as e:
        logger.error(f"Key error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during image processing.")


def draw_bounding_boxes(image, base_image_np, results):
    """
    Draws bounding boxes and returns the image with boxes and cropped thumbnails.
    """
    detections = []
    image_np = np.array(image)

    for detection in results["detections"]:
        x_min, y_min, x_max, y_max = detection["coordinates"]
        confidence = float(detection["confidence"])
        label = detection["label"]

        # Create a cropped thumbnail from the base image
        cropped_image = base_image_np[y_min:y_max, x_min:x_max]
        cropped_pil = Image.fromarray(cropped_image)
        buffered = io.BytesIO()
        cropped_pil.save(buffered, format="JPEG")
        thumbnail_str = base64.b64encode(buffered.getvalue()).decode()

        # Append detection info
        detections.append({
            "label": label,
            "confidence": f"{confidence:.2f}",
            "thumbnail": thumbnail_str
        })

        # Set color based on label
        color = (0, 255, 0) if label == "WBC" else (255, 0, 0)  # Green for WBC, Red for trophozoite

        # Draw bounding box
        cv2.rectangle(image_np, (x_min, y_min), (x_max, y_max), color, 2)
        # Draw text with contour effect
        text = f"{label} {confidence:.2f}%"
        cv2.putText(image_np, text, (x_min, y_min - 10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 6)  # Black outline
        cv2.putText(image_np, text, (x_min, y_min - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)  # Colored text

    # Convert back to PIL Image
    image_with_boxes = Image.fromarray(image_np)
    return image_with_boxes, detections

if __name__ == "__main__":
    import uvicorn

    # Get port from environment variable
    port = int(os.environ.get("PORT", 8000))

    print(f"Starting server on port {port}")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        workers=1,
        log_level="info"
    )
