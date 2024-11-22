import { useEffect, useState } from 'react';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  onSampleSelect: () => void;
  showSampleMenu: boolean;
  onCloseSampleMenu: () => void;
  samples: number[];
  onSampleNumberSelect: (sampleNumber: number) => void;
}
  
export default function UploadSection({ 
  onFileUpload, 
  onSampleSelect, 
  showSampleMenu, 
  onCloseSampleMenu,
  samples,
  onSampleNumberSelect 
}: UploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsUploading(true);
      onFileUpload(event.target.files[0]);
      setTimeout(() => setIsUploading(false), 100); // Reset after a brief delay
    }
  };

  const handleSampleClick = (sampleNumber: number) => {
    onCloseSampleMenu();
    onSampleNumberSelect(sampleNumber);
  };

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = () => {  // Remove the event parameter
      if (showSampleMenu) {
        onCloseSampleMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSampleMenu, onCloseSampleMenu]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 relative">
        {/* File Upload Button */}
        <label className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-6 rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition-all text-lg ${
          isUploading ? 'bg-gray-100 text-gray-700' : 'bg-white text-gray-600'
        }`}>
          <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="whitespace-nowrap">Upload file</span>
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>

        {/* Sample Selection Button and Menu */}
        <div className="relative flex-1 min-w-[200px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              showSampleMenu ? onCloseSampleMenu() : onSampleSelect();
            }}
            className={`w-full flex items-center justify-center gap-2 px-6 py-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-lg ${
              showSampleMenu ? 'bg-gray-100 text-gray-700' : 'bg-white text-gray-600'
            }`}
          >
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="whitespace-nowrap">Pick a sample</span>
          </button>

          {showSampleMenu && (
            <div className="absolute top-full mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" onClick={e => e.stopPropagation()}>
              <div className="py-1" role="menu">
                {samples.map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleSampleClick(sample)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                    role="menuitem"
                  >
                    <img 
                      src={`/src/assets/samples/sample_${sample}.jpg`}
                      alt={`Sample ${sample}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="text-sm text-gray-700">Sample {sample}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}