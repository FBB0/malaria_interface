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
const api = axios.create({
  baseURL: '/api',  // Keep this simple - the proxy will handle the routing
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  uploadImage: async (file: File): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: AxiosResponse<DetectionResponse> = await api.post('/api/upload_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error uploading image');
      }
      throw new Error('Error uploading image');
    }
  },
};

export default apiService;