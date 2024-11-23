import axios from 'axios';

// Types for our API responses
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
  : 'http://localhost:8000';  // Changed from '/api' to direct localhost URL

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export const apiService = {
  uploadImage: async (file: File): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload Error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error uploading image');
      }
      throw new Error('Error uploading image');
    }
  },
};

export default apiService;