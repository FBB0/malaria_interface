import modal
import logging
from pathlib import Path
from PIL import Image
import numpy as np
from ultralytics import YOLO
from fastapi import FastAPI, Request
import torch
import io
import os
from typing import Dict, List, Union

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the Modal image with all required dependencies
image = (
    modal.Image.debian_slim()
    .apt_install("libgl1", "libglib2.0-0")  # Install dependencies
    .pip_install(
        "ultralytics",
        "Pillow",
        "numpy",
        "fastapi",
        "torchvision"
    )
)

# Set up Modal app with the defined image
app = modal.App("malaria-detection-api", image=image)

# Define the volume and its mount path
volume = modal.Volume.from_name("malaria-model-volume")
volume_path = Path("/model")

# FastAPI app for endpoints
fastapi_app = FastAPI()

@fastapi_app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Malaria Detection API is running. Use /upload_image to process images or /health for a health check."}

@app.function(volumes={str(volume_path): volume})
def verify_model_exists():
    """Verify that the model file exists in the volume"""
    model_file_path = volume_path / 'model/best_yolo.pt'
    if not model_file_path.exists():
        raise Exception("Model file not found in volume")
    logger.info("Model file verified in volume")

def process_results(results) -> List[Dict[str, Union[str, float, List[int]]]]:
    """Process YOLO results and convert to serializable format"""
    detections = []
    
    # Get the first result
    result = results[0]
    
    # Process each detection
    for i in range(len(result.boxes)):
        box = result.boxes[i]
        # Convert coordinates to CPU and then to Python native types
        coords = box.xyxy[0].cpu().numpy()
        x_min, y_min, x_max, y_max = map(int, coords)
        
        # Convert confidence to Python float
        confidence = float(box.conf[0].cpu().numpy())
        
        # Get class label
        class_id = int(box.cls[0].cpu().numpy())
        label = result.names[class_id]
        
        detections.append({
            "label": label,
            "confidence": f"{confidence * 100:.2f}",
            "coordinates": [x_min, y_min, x_max, y_max]
        })
    
    return detections

@app.function(
    gpu="a10g",
    volumes={str(volume_path): volume},
    timeout=600,
    memory=4096
)
def run_yolo_inference(image_bytes: bytes) -> Dict:
    """Run YOLO model inference on the input image and return serializable results with detections mapped back to the original image size."""
    try:
        model_file_path = '/model/best_yolo.pt'
        if not os.path.exists(model_file_path):
            raise Exception("Model file not found in volume")

        # Load the YOLO model
        model = YOLO(model_file_path)

        # Force CUDA usage if available
        if torch.cuda.is_available():
            device = 'cuda'
            model.to(device)
            logger.info("Using device: cuda")
        else:
            device = 'cpu'
            model.to(device)
            logger.info("Using device: cpu")

        # Process image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        original_width, original_height = image.size
        logger.info(f"Original image size: {original_width}x{original_height}")

        # Resize image while maintaining aspect ratio
        target_size = (1280, 1280)
        aspect_ratio = original_width / original_height
        if aspect_ratio > 1:
            new_width = target_size[0]
            new_height = int(target_size[1] / aspect_ratio)
        else:
            new_height = target_size[1]
            new_width = int(target_size[0] * aspect_ratio)

        image_resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        logger.info(f"Resized image size: {new_width}x{new_height}")

        # Add padding to create a 1280x1280 image
        new_image = Image.new("RGB", target_size, (0, 0, 0))
        paste_x = (target_size[0] - new_width) // 2
        paste_y = (target_size[1] - new_height) // 2
        new_image.paste(image_resized, (paste_x, paste_y))
        logger.info(f"Image padded to target size: {target_size}")

        # Convert to numpy array
        img_array = np.array(new_image)

        # Run inference
        results = model.predict(
            source=img_array,
            device=device,
            save=False,
            stream=False
        )

        # Process results to convert coordinates back to original image dimensions
        detections = []
        for result in results:
            for box in result.boxes:
                # Original bounding box coordinates in the resized/padded image
                x_min, y_min, x_max, y_max = box.xyxy[0].cpu().numpy()

                # Adjust for padding
                x_min -= paste_x
                x_max -= paste_x
                y_min -= paste_y
                y_max -= paste_y

                # Scale back to original image dimensions
                x_min = int((x_min / new_width) * original_width)
                x_max = int((x_max / new_width) * original_width)
                y_min = int((y_min / new_height) * original_height)
                y_max = int((y_max / new_height) * original_height)

                # Convert confidence to Python float
                confidence = float(box.conf[0].cpu().numpy())

                # Get class label
                class_id = int(box.cls[0].cpu().numpy())
                label = result.names[class_id]

                # Append detection info
                detections.append({
                    "label": label,
                    "confidence": f"{confidence * 100:.2f}",
                    "coordinates": [x_min, y_min, x_max, y_max]
                })

        logger.info(f"Detections processed: {len(detections)} detections found")

        return {"status": "success", "detections": detections}

    except Exception as e:
        logger.error(f"Error in YOLO inference: {str(e)}")
        return {"status": "error", "message": str(e)}
        
@fastapi_app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        verify_model_exists.remote()
        return {"status": "healthy", "message": "Model loaded and ready"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "unhealthy", "message": str(e)}

@fastapi_app.post("/upload_image")
async def upload_image(request: Request):
    """Endpoint to handle image upload and processing."""
    try:
        body = await request.body()
        logger.info("Received an image for processing")

        # Run inference and get processed results
        result = run_yolo_inference.remote(body)
        
        return result

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.function(image=image)
@modal.asgi_app()
def serve():
    """Serve the FastAPI app."""
    return fastapi_app

@app.local_entrypoint()
def main():
    """Main entry point for the application."""
    logger.info("Starting the malaria detection API")
    verify_model_exists.remote()
    logger.info("Malaria detection API is running")