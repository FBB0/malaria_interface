import { useState } from 'react';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
import ModelSteps from '../components/ModelSteps';
import DetectionResults from '../components/DetectionResults';
import { apiService } from '../services/api';

interface Detection {
  label: string;
  confidence: string;
  thumbnail: string;
}

interface Results {
  img_data: string;
  detections: Detection[];
  speed?: string;
}

export default function Home() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.uploadImage(file);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleSelect = async () => {
    // This would typically load a pre-selected sample image
    try {
      const response = await fetch('/src/assets/sample_image.jpg');
      const blob = await response.blob();
      const file = new File([blob], 'sample_image.jpg', { type: 'image/jpeg' });
      await handleFileUpload(file);
      setSelectedSample('sample_image.jpg');
    } catch (err) {
      setError('Failed to load sample image');
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{
      backgroundImage: "url('/Epoch_Background_Light.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-16">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-4 mt-8">
                Welcome to the Malaria Detection App
              </h1>
              <p className="text-gray-600">
                Upload an image to detect malaria-infected cells. Choose a file from your device, 
                or select a blood sample provided on the website.
              </p>
            </div>

            <UploadSection
              onFileUpload={handleFileUpload}
              onSampleSelect={handleSampleSelect}
            />

            <ModelSteps />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Detection Results</h2>
              <span className="text-gray-500 text-sm">
                Detection speed: {results?.speed || '-s'}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : results?.img_data ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <img
                    src={`data:image/jpeg;base64,${results.img_data}`}
                    alt="Detection Results"
                    className="w-full rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Found malaria parasites</h3>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="Detection information"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  {results.detections.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {results.detections.map((detection, index) => (
                        <div key={index} className="text-center">
                          <div className="w-20 h-20 mx-auto mb-2">
                            <img
                              src={`data:image/jpeg;base64,${detection.thumbnail}`}
                              alt={detection.label}
                              className="w-full h-full object-cover rounded-full border-2 border-green-500"
                            />
                          </div>
                          <div className="font-medium text-sm">{detection.label}</div>
                          <div className="text-gray-500 text-sm">{detection.confidence}%</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No detections found. Try uploading a different image.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Select a sample to view the results here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}