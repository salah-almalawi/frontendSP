import axios from 'axios';
import { store } from '../store/store'; // استيراد store للوصول إلى dispatch
import { logout } from '../store/slices/authSlice'; // استيراد أكشن تسجيل الخروج

// إنشاء نسخة axios أساسية
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // يمكنك وضع الرابط الأساسي هنا
  headers: {
    'Content-Type': 'application/json',
  },
});

// معترض الطلبات (Request Interceptor)
// هذا الكود سيعمل قبل إرسال أي طلب
apiClient.interceptors.request.use(
  (config) => {
    // الحصول على التوكن من حالة Redux أو localStorage
    const token = store.getState().auth.token || localStorage.getItem('token');

    // إذا كان التوكن موجودًا، قم بإضافته إلى رأس الطلب
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
      // إذا حدث خطأ 401، قم بتسجيل خروج المستخدم
      // هذا يضمن تنظيف الحالة وإزالة التوكن من localStorage
      store.dispatch(logout());
      // يمكنك أيضًا إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا أردت
      // window.location.href = '/login';
    }

    // إرجاع الخطأ ليتم التعامل معه في المكان الذي تم فيه استدعاء الطلب
    return Promise.reject(error);
  }
);

export default apiClient;