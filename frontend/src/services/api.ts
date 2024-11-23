import axios, { AxiosResponse } from 'axios';

// Types for our API responses
export interface Detection {
  label: string;
  confidence: string;
  thumbnail: string;
}

export interface DetectionResponse {
  img_data: string;
  base_img_data: string; // Add this line
  detections: Detection[];
  speed: string;
}

// Create axios instance with default config
const baseURL = import.meta.env.PROD 
  ? 'https://epoch-malaria-detection.onrender.com'
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  uploadImage: async (file: File): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Remove the '/api' prefix in production
      const endpoint = import.meta.env.PROD ? '/upload_image/' : '/api/upload_image/';
      const response: AxiosResponse<DetectionResponse> = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);  // Better error logging
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error uploading image');
      }
      throw new Error('Error uploading image');
    }
  },
};

export default apiService;