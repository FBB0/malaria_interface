interface UploadSectionProps {
    onFileUpload: (file: File) => void;
    onSampleSelect: () => void;
  }
  
  export default function UploadSection({ onFileUpload, onSampleSelect }: UploadSectionProps) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        onFileUpload(event.target.files[0]);
      }
    };
  
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload file</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
  
          <button
            onClick={onSampleSelect}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Pick a sample
          </button>
        </div>
      </div>
    );
  }