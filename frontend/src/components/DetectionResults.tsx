interface Detection {
    label: string;
    confidence: string;
    thumbnail: string;
  }
  
  interface DetectionResultsProps {
    imageData?: string;
    detections: Detection[];
    detectionSpeed?: string;
  }
  
  export default function DetectionResults({ imageData, detections, detectionSpeed }: DetectionResultsProps) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Detection Results</h2>
          <span className="text-gray-500">Detection speed: {detectionSpeed || '-s'}</span>
        </div>
  
        {imageData ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={`data:image/jpeg;base64,${imageData}`}
              alt="Detection Results"
              className="w-full rounded-lg"
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            Select a sample to view the results here
          </div>
        )}
  
        {detections.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Found malaria parasites
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {detections.map((detection, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${detection.thumbnail}`}
                      alt={detection.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2 font-semibold">{detection.label}</div>
                  <div className="text-gray-500">{detection.confidence}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }