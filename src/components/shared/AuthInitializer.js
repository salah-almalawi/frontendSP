'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation'; // استيراد usePathname للتحقق من المسار الحالي
import { checkAuthStatus, _resetAuthState } from '@/store/slices/authSlice';
import AuthGuard from './AuthGuard';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname(); // الحصول على المسار الحالي

  useEffect(() => {
    // التحقق من المسار الحالي قبل إرسال حالة المصادقة
    if (pathname !== '/login') {
      dispatch(checkAuthStatus());
    } else {
      // إذا كان المسار هو /login، قم بإعادة تعيين حالة المصادقة لمنع ظهور شاشة التحميل
      dispatch(_resetAuthState());
    }
  }, [dispatch, pathname]); // إضافة pathname كاعتماد لـ useEffect

  return <AuthGuard>{children}</AuthGuard>;
};

export default AuthInitializer;