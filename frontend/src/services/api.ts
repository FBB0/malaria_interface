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
  : 'http://localhost:8000';  // Direct connection to backend in development

const api = axios.create({
  baseURL,
  timeout: 60000,  // Increased timeout for large images
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
        },
        onUploadProgress: (progressEvent) => {
          console.log('Upload progress:', progressEvent); // Debug log
        },
      });

      console.log('Upload response:', response); // Debug log
      return response.data;
    } catch (error) {
      console.error('Upload Error Details:', {
        error,
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? error.response?.data : null,
      });

      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Upload failed: ${error.response.data.detail || error.message}`);
      }
      throw new Error('Network error or server is not responding');
    }
  },
};

export default apiService;