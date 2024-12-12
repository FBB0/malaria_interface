import { useState } from 'react';
import Header from '../components/Header';
import UploadSection from '../components/UploadSection';
// import ModelSteps from '../components/ModelSteps';
import { DetectionInfoPopover } from '../components/DetectionInfoPopover'
import { apiService } from '../services/api';
import Footer from '../components/Footer';

interface Detection {
  label: string;
  confidence: string;
  thumbnail: string;
}

interface Results {
  img_data: string;
  base_img_data: string;
  detections: Detection[];
  speed?: string;
}


export default function Home() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSampleMenu, setShowSampleMenu] = useState<boolean>(false);
  const samples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Add the sample numbers you have available
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting upload for file:', file.name); // Debug log
      const data = await apiService.uploadImage(file);
      console.log('Upload successful:', data); // Debug log
      setResults(data);
    } catch (err) {
      console.error('Upload Error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSampleSelect = async (sampleNumber: number) => {
    try {
      setShowSampleMenu(false);
      setLoading(true);
      setError(null);
      
      // Update the path to match your public/assets/samples structure
      const samplePath = `/assets/samples/sample_${sampleNumber}.jpg`;
      
      console.log('Loading sample from:', samplePath); // Debug log
      
      const response = await fetch(samplePath);
      if (!response.ok) {
        throw new Error(`Failed to load sample image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], `sample_${sampleNumber}.jpg`, { type: 'image/jpeg' });
      
      await handleFileUpload(file);
    } catch (err) {
      console.error('Sample loading error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sample image');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{
      backgroundImage: "url('/Epoch_Background_Light.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-8 sm:space-y-16">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2 sm:mb-4 mt-4 sm:mt-8">
                Welcome to the Malaria Detection App
              </h1>
              <p className="text-gray-600">
                Upload an image to detect malaria-infected cells. Choose a file from your device, 
                or select a blood sample provided on the website.
              </p>
            </div>

            <UploadSection
              onSampleSelect={() => setShowSampleMenu(true)}
              onFileUpload={handleFileUpload}
              showSampleMenu={showSampleMenu}
              onCloseSampleMenu={() => setShowSampleMenu(false)}
              samples={samples}
              onSampleNumberSelect={handleSampleSelect}
            />

            {/* <ModelSteps /> */}

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
            ) : results?.base_img_data ? (
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
                    <DetectionInfoPopover 
                      stage={results.detections[0]?.label || "Unknown"}
                      confidence={Number(results.detections[0]?.confidence) || 0}
                      thumbnail={results.detections[0]?.thumbnail}
                    />
                  </div>

                  {results.detections.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {results.detections.map((detection, index) => (
                        <div key={index} className="text-center">
                          <div className="w-20 h-20 mx-auto mb-2">
                            <img
                              src={`data:image/jpeg;base64,${detection.thumbnail}`}
                              alt={detection.label}
                              className={`w-full h-full object-cover rounded-full border-2 ${
                                detection.label === 'WBC' ? 'border-green-500' : 'border-red-500'
                              }`}
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
      <Footer />
    </div>
  );
}