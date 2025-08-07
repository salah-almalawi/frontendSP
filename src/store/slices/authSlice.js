import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // سنستخدم axios مباشرة هنا لعملية تسجيل الدخول الأولية

// تعريف ثانك (Thunk) غير متزامن للتعامل مع تسجيل الدخول
// هذا سيقوم بإدارة طلب API وتحديث الحالة بناءً على النتيجة (pending, fulfilled, rejected)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // استدعاء API لتسجيل الدخول
      const response = await axios.post('http://127.0.0.1:8000/api/login', credentials);
      const { access_token, user } = response.data;

      // حفظ التوكن في localStorage لضمان بقاء الجلسة
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // إرجاع البيانات ليتم حفظها في حالة Redux
      return { token: access_token, user };
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
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
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
      });
  },
});

export const { logout, rehydrateAuth } = authSlice.actions;

export default authSlice.reducer;