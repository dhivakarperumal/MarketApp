import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://192.168.1.2:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Retry configuration
const MAX_RETRIES = 3;
let retryCount = 0;

// Add a request interceptor to attach the auth token automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to retrieve token:', error);
    }
    
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    retryCount = 0; // Reset on success
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Network error - retry logic
    if (
      error.message === 'Network Error' ||
      (error.code && !error.response)
    ) {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.warn(`🔄 Network error. Retry ${retryCount}/${MAX_RETRIES}`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return api(originalRequest);
      }
      
      console.error('❌ Network error after retries:', error.message);
      return Promise.reject({
        status: 'network_error',
        message: 'Network connection failed. Please check:\n1. Backend server is running on 192.168.1.9:5000\n2. Your device is connected to the same WiFi\n3. Firewall is not blocking port 5000',
      });
    }

    // Server responded with error status
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'Server error',
        data: error.response.data,
      });
    }

    // Request made but no response
    if (error.request) {
      console.error('❌ No response received:', error.request);
      return Promise.reject({
        status: 'no_response',
        message: 'Server did not respond. Make sure the backend is running.',
      });
    }

    // Error in request setup
    console.error('❌ Request setup error:', error.message);
    return Promise.reject({
      status: 'request_error',
      message: error.message,
    });
  }
);

export default api;
