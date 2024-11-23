# Directory Structure:
# malaria_interface/
# ├── main.py
# ├── templates/
# │   └── index.html
# ├── static/
# │   ├── styles.css
# │   └── images/
# │       └── sample_image.jpg

# Below is the full code for each file required for the Malaria Detection App.

# main.py

from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import cv2
import numpy as np
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Initialize YOLO model
try:
    model = YOLO('best_yolo.pt')  # make sure this path is correct
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# API endpoints

# Add a root endpoint for health checks
@app.get("/")
async def root():
    return {"status": "healthy"}



@app.post("/api/upload_image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Convert original image to base64 before drawing boxes
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        base_img_str = base64.b64encode(buffered.getvalue()).decode()

        # Store original image as numpy array for thumbnails
        base_image_np = np.array(image)

        # Perform YOLO detection
        results = model.predict(image, save=False, stream=False)
        
        # Get inference speed from results
        speed = results[0].speed['inference']  # Speed in milliseconds

        # Draw bounding boxes on the image
        image_with_boxes, detections = draw_bounding_boxes(image, base_image_np, results)

        # Convert annotated image to base64 for frontend
        buffered = io.BytesIO()
        image_with_boxes.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return JSONResponse({
            "img_data": img_str,
            "base_img_data": base_img_str,
            "detections": detections,
            "speed": f"{round(speed, 2)}ms"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def draw_bounding_boxes(image, base_image_np, results):
    """
    Draws bounding boxes and returns the image with boxes and cropped thumbnails.
    """
    detections = []
    image_np = np.array(image)

    for result in results:
        for box in result.boxes:
            x_min, y_min, x_max, y_max = map(int, box.xyxy[0])
            confidence = box.conf.item()
            label = model.names[int(box.cls.item())]

            # Create a cropped thumbnail from the base image
            cropped_image = base_image_np[y_min:y_max, x_min:x_max]
            cropped_pil = Image.fromarray(cropped_image)
            buffered = io.BytesIO()
            cropped_pil.save(buffered, format="JPEG")
            thumbnail_str = base64.b64encode(buffered.getvalue()).decode()

            # Append detection info
            detections.append({
                "label": label,
                "confidence": f"{confidence * 100:.2f}",
                "thumbnail": thumbnail_str
            })

            # Set color based on label
            color = (0, 255, 0) if label == "WBC" else (255, 0, 0)  # Green for WBC, Red for trophozoite

            # Draw bounding box
            cv2.rectangle(image_np, (x_min, y_min), (x_max, y_max), color, 2)
            # Put label
            # Draw text with contour effect
            text = f"{label} {confidence * 100:.2f}%"
            cv2.putText(image_np, text, (x_min, y_min - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1.8, (0, 0, 0), 6) # Black outline
            cv2.putText(image_np, text, (x_min, y_min - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 1.8, color, 3) # Colored text

    # Convert back to PIL Image
    image_with_boxes = Image.fromarray(image_np)
    return image_with_boxes, detections

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable
    port = int(os.environ.get("PORT", 8000))
    
    print(f"Starting server on port {port}")  # Add this for debugging
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0",
        port=port,
        workers=1
    )