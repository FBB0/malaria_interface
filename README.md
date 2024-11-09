# Malaria Detection App

This repository contains the source code for the **Malaria Detection App**, which is a web application for detecting malaria-infected cells in blood smear images using a YOLO-based object detection model. The app allows users to upload images, processes them using a machine learning model, and provides detection results.

## Repository Structure
```
malaria_interface/
├── main.py              # Main FastAPI application
├── models/
│   └── best.pt          # YOLO model file
├── requirements.txt     # Python dependencies
├── static/              # Static assets (CSS, images)
│   ├── styles.css
│   └── images/
│       └── sample_image.jpg
├── templates/           # HTML templates for the web app
│   ├── index.html
│   └── model-info.html
└── README.md            # This README file
```

## Model Information
The Malaria Detection App uses a **YOLO (You Only Look Once)** model, which is designed for real-time object detection. The model has been trained on a large dataset of blood smear images to accurately identify and classify malaria-infected cells such as trophozoites and WBCs.

### How It Works
- The uploaded image is processed by the YOLO model to identify regions of interest.
- Detected regions are highlighted and presented with confidence scores.
- The app showcases the top 4 detected regions, if available.

For more detailed information, see the **Model Info** page of the app.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
