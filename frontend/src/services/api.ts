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

// Use environment-specific base URL
const baseURL = import.meta.env.PROD 
  ? 'https://epoch-malaria-detection.onrender.com'  // Production backend
  : 'http://localhost:8000';  // Local development

const api = axios.create({
  baseURL,
  timeout: 120000,  // 2 minutes timeout for production
  headers: {
    'Accept': 'application/json',
  }
});

export const apiService = {
  uploadImage: async (file: File): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Environment:', import.meta.env.MODE);
      console.log('Uploading to:', `${baseURL}/upload_image/`);
      
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
      console.error('Upload failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Server error: ${error.response.data.detail || error.message}`);
      }
      throw new Error('Connection failed. Please try again later.');
    }
  },
};

export default apiService;