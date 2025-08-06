// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  // يمكن إضافة المزيد من النقاط النهائية هنا
  PRESENTATIONS: {
    LIST: '/api/presentations',
    CREATE: '/api/presentations',
    GET: (id) => `/api/presentations/${id}`,
    UPDATE: (id) => `/api/presentations/${id}`,
    DELETE: (id) => `/api/presentations/${id}`,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'لا يمكن الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل بشكل صحيح.',
  TIMEOUT_ERROR: 'انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
  UNAUTHORIZED: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.',
  FORBIDDEN: 'ممنوع الوصول لهذا المورد.',
  NOT_FOUND: 'المورد المطلوب غير موجود.',
  SERVER_ERROR: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  LOGIN_FAILED: 'فشل في تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.',
  LOGOUT_FAILED: 'فشل في تسجيل الخروج. يرجى المحاولة مرة أخرى.',
  FETCH_USER_FAILED: 'فشل في جلب بيانات المستخدم. يرجى المحاولة مرة أخرى.',
  CONNECTION_ERROR: 'خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
  SERVER_OFFLINE: 'الخادم غير متاح حالياً. يرجى المحاولة لاحقاً.',
}; 