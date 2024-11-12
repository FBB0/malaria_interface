export default function ModelInfo() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">How the Model Works</h1>
          <p className="mb-4">
            The Malaria Detection App uses a YOLO (You Only Look Once) model, which is a state-of-the-art object detection model, to identify malaria-infected cells in blood smear images.
          </p>
          {/* Add more content from your original model-info.html */}
        </div>
      </div>
    )
  }