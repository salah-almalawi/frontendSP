import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, getCurrentUser, getToken, isValidToken } from '@/lib/auth';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await login(username, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      // التحقق من أننا لم نحاول جلب البيانات مؤخراً
      const state = getState();
      const { lastFetchAttempt, user } = state.auth;
      const now = Date.now();
      
      // منع إعادة المحاولة خلال 5 ثوانٍ
      if (lastFetchAttempt && (now - lastFetchAttempt) < 5000) {
        throw new Error('TOO_MANY_ATTEMPTS');
      }

      // إذا كان لدينا بيانات مستخدم بالفعل، لا نحاول جلبها مرة أخرى
      if (user) {
        return user;
      }

      const userData = await getCurrentUser();
      return userData;
    } catch (error) {
      // إذا كان خطأ شبكة، نعيد رسالة خاصة لمنع إعادة المحاولة
      if (error.isNetworkError) {
        return rejectWithValue('NETWORK_ERROR');
      }
      
      // إذا كان خطأ محاولات كثيرة، نعيد رسالة خاصة
      if (error.message === 'TOO_MANY_ATTEMPTS') {
        return rejectWithValue('TOO_MANY_ATTEMPTS');
      }
      
      return rejectWithValue(error.message);
    }
  }
);

// دالة جديدة للتهيئة الأولية
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch, getState }) => {
    const state = getState();
    
    // إذا تم التهيئة من قبل، لا نحاول مرة أخرى
    if (state.auth.initialized) {
      return;
    }

    const token = getToken();
    
    // إذا كان هناك توكن صالح، نحاول جلب بيانات المستخدم
    if (token && isValidToken(token)) {
      dispatch(setToken(token));
      try {
        const result = await dispatch(fetchCurrentUser());
        return result.payload;
      } catch (error) {
        // إعادة رمي الخطأ للتعامل معه في extraReducers
        throw error;
      }
    }
    
    return null;
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
  lastFetchAttempt: null,
  networkError: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.networkError = false;
    },
    setNetworkError: (state, action) => {
      state.networkError = action.payload;
    },
    clearNetworkError: (state) => {
      state.networkError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        // لا نعرض خطأ للتهيئة الأولية إلا إذا كان خطأ شبكة
        if (action.payload === 'NETWORK_ERROR') {
          state.error = action.payload;
          state.networkError = true;
        }
        // إذا كان خطأ 401، نحذف التوكن
        if (action.payload && action.payload.includes('401')) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
        // إذا كان خطأ محاولات كثيرة، لا نعرض خطأ
        if (action.payload === 'TOO_MANY_ATTEMPTS') {
          return;
        }
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.networkError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.networkError = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.networkError = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastFetchAttempt = Date.now();
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
        state.networkError = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        
        // إذا كان خطأ شبكة، نضع علامة ولا نحاول مرة أخرى
        if (action.payload === 'NETWORK_ERROR') {
          state.error = 'لا يمكن الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل بشكل صحيح.';
          state.networkError = true;
          return;
        }
        
        // إذا كان خطأ محاولات كثيرة، لا نعرض خطأ للمستخدم
        if (action.payload === 'TOO_MANY_ATTEMPTS') {
          return;
        }
        
        // لا نحذف التوكن إلا إذا كان الخطأ 401 (غير مصرح)
        const errorMessage = action.payload || '';
        if (errorMessage.includes('401') || errorMessage.includes('غير مصرح')) {
          state.user = null;
          state.isAuthenticated = false;
          state.token = null;
        }
        
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setToken, 
  clearAuth, 
  setNetworkError, 
  clearNetworkError 
} = authSlice.actions;
export default authSlice.reducer; 