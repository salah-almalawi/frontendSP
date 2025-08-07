import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios'; // استخدام النسخة المُعدة من axios

// تعريف ثانك (Thunk) غير متزامن للتعامل مع تسجيل الدخول
// هذا سيقوم بإدارة طلب API وتحديث الحالة بناءً على النتيجة (pending, fulfilled, rejected)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (process.env.NODE_ENV === 'development') {
        console.log("Server response data:", response.data);
      }
      // لا نقوم بتخزين التوكن في localStorage بعد الآن، الخادم يرسله في HTTP-only cookie
      // بعد تسجيل الدخول بنجاح، نقوم بالتحقق من حالة المصادقة لجلب بيانات المستخدم
      await dispatch(checkAuthStatus());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل تسجيل الدخول');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'فشل تسجيل الخروج');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me'); // endpoint to get current user data
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth status check response:", response.data);
      }
      return response.data.user; // Assuming the backend returns { user: userData }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth status check failed:", error.response?.data?.message || error.message);
      }
      // إضافة تفصيل أكثر لرسالة الخطأ الافتراضية
      return rejectWithValue(error.response?.data?.message || 'فشل التحقق من حالة المصادقة: قد يكون هناك انقطاع في الاتصال أو انتهاء الجلسة.');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // هذا reducer سيتم استدعاؤه داخليًا بعد تسجيل الخروج من قبل thunk
    _resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // isAuthenticated and user will be set by checkAuthStatus
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        if (process.env.NODE_ENV === 'development') {
          console.log('Login rejected, error:', action.payload);
        }
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        // Optionally redirect or show success message
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (process.env.NODE_ENV === 'development') {
          console.log('Logout rejected, error:', action.payload);
        }
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.initialized = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.initialized = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('Check auth status rejected, error:', action.payload);
        }
      });
  },
});

export const { clearError, _resetAuthState } = authSlice.actions;

export default authSlice.reducer;