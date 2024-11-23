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

// import axios, { AxiosResponse } from 'axios';

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
      console.log('Uploading to:', baseURL); // Debug log
      
      const response: AxiosResponse<DetectionResponse> = await api.post('/upload_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Add timeout and better error handling
        timeout: 30000,
        validateStatus: (status) => status < 500,
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      console.log('Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Upload Error Details:', {
        error,
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? error.response?.data : null,
      });

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.message || 'Error uploading image';
        throw new Error(`Upload failed: ${message}`);
      }
      throw new Error('Error uploading image');
    }
  },
};
export default apiService;