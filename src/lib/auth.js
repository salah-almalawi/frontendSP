import apiClient from './axios';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// حفظ التوكن في localStorage
export const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// جلب التوكن من localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// حذف التوكن من localStorage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// تسجيل الدخول
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      username,
      password,
    });

    saveToken(response.data.token);
    return response.data;
  } catch (error) {
    // axios سيتعامل مع الأخطاء تلقائياً من خلال interceptors
    throw error;
  }
};

// تسجيل الخروج
export const logout = async () => {
  try {
    const token = getToken();
    if (!token) {
      removeToken();
      return;
    }

    await apiClient.post('/api/auth/logout');
    removeToken();
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    
    // دائماً نحذف التوكن حتى لو فشل الاتصال بالخادم
    removeToken();
  }
};

// جلب بيانات المستخدم الحالي
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) {
      // إذا لم يكن هناك توكن، لا نحاول الاتصال بالخادم
      return null;
    }

    // التحقق من صحة التوكن قبل محاولة الاتصال
    if (!isValidToken(token)) {
      console.warn('التوكن غير صالح، حذفه...');
      removeToken();
      return null;
    }

    const response = await apiClient.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    
    // إذا كان الخطأ 401، نحذف التوكن
    if (error.response?.status === 401) {
      removeToken();
      return null; // نعيد null بدلاً من رمي الخطأ
    }
    
    // إذا كان خطأ شبكة، لا نعيد رمي الخطأ لمنع إعادة المحاولة
    if (error.isNetworkError) {
      console.warn('خطأ في الشبكة - لا يمكن الاتصال بالخادم');
      return null; // نعيد null بدلاً من رمي الخطأ
    }
    
    // إعادة رمي الخطأ ليتم التعامل معه في المكونات
    throw error;
  }
};

// التحقق من وجود توكن صالح
export const isAuthenticated = () => {
  return getToken() !== null;
};

// التحقق من صحة التوكن (اختياري - للتحقق من التنسيق)
export const isValidToken = (token) => {
  if (!token) return false;
  
  // التحقق من أن التوكن يحتوي على 3 أجزاء (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // التحقق من أن التوكن ليس فارغاً
  return parts.every(part => part.length > 0);
};

// دالة مساعدة للتعامل مع أخطاء الشبكة (للتوافق مع الكود القديم)
export const handleNetworkError = (error) => {
  // axios يتعامل مع الأخطاء تلقائياً، لكن نحتفظ بهذه الدالة للتوافق
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return new Error('لا يمكن الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل بشكل صحيح.');
  }
  
  if (error.name === 'TypeError') {
    return new Error('خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
  }
  
  return error;
}; 