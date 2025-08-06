import axios from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '@/config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - only clear token and redirect if it's not a login request
          if (typeof window !== 'undefined' && !error.config.url.includes('/login')) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          error.message = data?.message || ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case 403:
          error.message = data?.message || ERROR_MESSAGES.FORBIDDEN;
          break;
        case 404:
          error.message = data?.message || ERROR_MESSAGES.NOT_FOUND;
          break;
        case 500:
          error.message = data?.message || ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          error.message = data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      }
    } else if (error.request) {
      // Network error - الخادم مغلق أو لا يمكن الوصول إليه
      if (error.code === 'ECONNABORTED') {
        error.message = 'انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى.';
        error.isNetworkError = true;
      } else if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
        error.message = 'لا يمكن الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل بشكل صحيح.';
        // إضافة علامة خاصة لأخطاء الشبكة لمنع إعادة المحاولة
        error.isNetworkError = true;
      } else {
        error.message = ERROR_MESSAGES.NETWORK_ERROR;
        error.isNetworkError = true;
      }
      
      // إضافة معلومات إضافية لتتبع أخطاء الشبكة
      console.warn('خطأ في الشبكة:', {
        message: error.message,
        code: error.code,
        config: error.config?.url
      });
    } else {
      // Other errors
      error.message = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 