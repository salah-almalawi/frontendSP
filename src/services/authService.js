import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';

class AuthService {
  // تسجيل الدخول
  async login(username, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });
      
      const { token } = response.data;
      
      // حفظ التوكن في localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // تسجيل الخروج
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // حتى لو فشل الطلب، نحذف التوكن محلياً
      console.error('Logout error:', error);
    } finally {
      // حذف التوكن من localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
  }

  // جلب بيانات المستخدم الحالي
  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      // إذا كان الخطأ 401، نحذف التوكن
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
      }
      throw error;
    }
  }

  // تسجيل مستخدم جديد
  async register(username, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        username,
        password,
      });
      
      const { token } = response.data;
      
      // حفظ التوكن في localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // التحقق من وجود توكن
  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  // جلب التوكن
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // حذف التوكن
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }
}

// Export singleton instance
export default new AuthService(); 