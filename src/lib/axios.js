import axios from 'axios';
import { API_CONFIG } from '../config/api'; // استيراد إعدادات API

// إنشاء نسخة axios أساسية
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // تمكين إرسال ملفات تعريف الارتباط (cookies) مع الطلبات
});



// معترض الطلبات (Request Interceptor)
// هذا الكود سيعمل قبل إرسال أي طلب
apiClient.interceptors.request.use(
  (config) => {
    // لا حاجة لإضافة التوكن يدوياً بعد الآن، المتصفح يرسل الكوكيز تلقائياً
    return config;
  },
  (error) => {
    // في حالة حدوث خطأ أثناء إعداد الطلب
    return Promise.reject(error);
  }
);

// معترض الاستجابات (Response Interceptor)
// هذا الكود سيعمل عند استلام أي استجابة من الخادم
apiClient.interceptors.response.use(
  (response) => {
    // إذا كانت الاستجابة ناجحة، قم بإرجاعها مباشرة
    return response;
  },
  (error) => {
    // التحقق مما إذا كان الخطأ هو 401 (غير مصرح به)
    if (error.response && error.response.status === 401) {
      if (process.env.NODE_ENV === 'development') {
        console.log('401 Unauthorized error detected. Clearing localStorage and redirecting to login.');
      }
      // لا حاجة لحذف التوكن من localStorage بعد الآن
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // إرجاع الخطأ ليتم التعامل معه في المكان الذي تم فيه استدعاء الطلب
    return Promise.reject(error);
  }
);

export default apiClient;