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

// Production URL for the backend
const baseURL = 'https://epoch-malaria-detection.onrender.com';

const api = axios.create({
  baseURL,
  timeout: 60000,
});

export const apiService = {
  uploadImage: async (file: File): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading to:', `${baseURL}/upload_image/`); // Debug log
      
      const response = await api.post('/upload_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('No response data received');
      }

      return response.data;
    } catch (error) {
      console.error('Upload Error Details:', {
        error,
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? error.response?.data : null,
      });

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.message;
        throw new Error(`Upload failed: ${message}`);
      }
      throw new Error('Network error or server is not responding');
    }
  },
};

export default apiService;