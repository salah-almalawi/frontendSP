import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios'; // استخدام النسخة المُعدة من axios

// تعريف ثانك (Thunk) غير متزامن للتعامل مع تسجيل الدخول
// هذا سيقوم بإدارة طلب API وتحديث الحالة بناءً على النتيجة (pending, fulfilled, rejected)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // استدعاء API لتسجيل الدخول باستخدام النسخة المُعدة
      const response = await apiClient.post('/auth/login', credentials);
      console.log("Server response data:", response.data); // طباعة استجابة الخادم بالكامل
      const { token } = response.data; // استخراج التوكن فقط

      // بما أن معلومات المستخدم لا تظهر في الاستجابة، سنفترض أنها غير متوفرة هنا
      // يمكنك تعديل هذا لاحقًا إذا كان الخادم يرسل معلومات المستخدم تحت مفتاح آخر
      const user = null; 

      // حفظ التوكن في localStorage لضمان بقاء الجلسة
      localStorage.setItem('token', token); // استخدام token
      localStorage.setItem('user', JSON.stringify(user)); // حفظ user (سيكون null حاليًا)
      console.log("Stored in localStorage - token:", localStorage.getItem('token'), "user:", localStorage.getItem('user'));

      // إرجاع البيانات ليتم حفظها في حالة Redux
      return { token: token, user: user }; // إرجاع token و user
    } catch (error) {
      // في حالة حدوث خطأ، قم بإرجاع رسالة الخطأ
      return rejectWithValue(error.response?.data?.message || 'فشل تسجيل الدخول');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false, // إضافة حالة التهيئة
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // أكشن لتسجيل الخروج
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // أكشن لتحميل بيانات المستخدم من localStorage عند بدء التطبيق
    rehydrateAuth: (state) => {
      console.log("Rehydrating auth state...");
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      console.log("localStorage token:", token);
      console.log("localStorage userString:", userString);

      let user = null;
      // التحقق مما إذا كانت القيمة موجودة وليست السلسلة النصية "undefined" أو "null"
      if (userString && userString !== 'undefined' && userString !== 'null') {
        try {
          user = JSON.parse(userString);
          console.log("Parsed user:", user);
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
          localStorage.removeItem('user');
        }
      }

      if (token) { // الشرط يعتمد فقط على وجود التوكن
        state.token = token;
        state.isAuthenticated = true;
        state.user = user; // تعيين user (قد يكون null إذا لم يتم إرساله من الخادم)
      } else {
        // إذا لم يكن هناك توكن، تأكد من أن حالة المصادقة خاطئة
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
      state.initialized = true; // تحديث حالة التهيئة
      console.log("Auth state after rehydration: isAuthenticated=", state.isAuthenticated, ", initialized=", state.initialized, ", user=", state.user);
    },
    // أكشن لحذف الأخطاء
    clearError: (state) => {
      state.error = null;
    },
  },
  // extraReducers لإدارة الحالات الناتجة عن createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        console.log('Login rejected, error:', action.payload); // إضافة console.log
      });
  },
});

export const { logout, rehydrateAuth, clearError } = authSlice.actions;

export default authSlice.reducer;