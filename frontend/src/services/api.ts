import axios from 'axios';

export interface Detection {
  label: string;
  confidence: string;
  thumbnail: string;
}

export interface DetectionResponse {
  img_data: string;
  base_img_data: string;
  detections: Detection[];
  speed: string;
}

const baseURL = import.meta.env.PROD 
  ? 'https://epoch-malaria-detection.onrender.com'
  : 'http://localhost:8000';

const api = axios.create({
  baseURL,
  timeout: 300000, // 5 minutes timeout for production
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

export const apiService = {
  uploadImage: async (file: File): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // First verify the server is responsive
      await api.get('/health');
      
      console.log('Starting upload:', file.name, 'Size:', file.size);
      
      const response = await api.post('/upload_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          console.log('Upload progress:', percentCompleted + '%');
        },
      });

      return response.data;
    } catch (error) {
      console.error('Upload Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. The server is taking too long to respond.');
        }
        if (!error.response) {
          throw new Error('Network error. The server may be down or restarting.');
        }
        throw new Error(error.response.data?.detail || 'Server error occurred');
      }
      
      throw new Error('An unexpected error occurred');
    }
  },
};

export default apiService;