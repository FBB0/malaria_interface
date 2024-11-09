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
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
from PIL import Image
import io
import cv2
import numpy as np
import base64

app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates directory
templates = Jinja2Templates(directory="templates")

# Load the YOLO model
model = YOLO('best_yolo.pt')#This is not actually our best model, it will be changed after the competition ends

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/model-info", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("model-info.html", {"request": request})

@app.post("/upload_image/", response_class=HTMLResponse)
async def upload_image(request: Request, file: UploadFile = File(...)):
    try:
        # Read image contents
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Perform YOLO detection
        results = model.predict(image, save=False, stream=False)

        # Draw bounding boxes on the image
        image_with_boxes, detections = draw_bounding_boxes(image, results)

        # Convert image to base64 for HTML embedding
        buffered = io.BytesIO()
        image_with_boxes.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        # Render the results in the template
        return templates.TemplateResponse("index.html", {
            "request": request,
            "img_data": img_str,
            "detections": detections,
            "show_results": True
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def draw_bounding_boxes(image, results):
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

            # Create a cropped thumbnail of the detected area
            cropped_image = image_np[y_min:y_max, x_min:x_max]
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

            # Draw bounding box
            cv2.rectangle(image_np, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
            # Put label
            cv2.putText(image_np, f"{label} {confidence:.2f}", (x_min, y_min - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Convert back to PIL Image
    image_with_boxes = Image.fromarray(image_np)
    return image_with_boxes, detections


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


