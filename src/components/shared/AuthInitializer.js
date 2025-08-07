'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation'; // استيراد usePathname للتحقق من المسار الحالي
import { checkAuthStatus } from '@/store/slices/authSlice';
import AuthGuard from './AuthGuard';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname(); // الحصول على المسار الحالي

  useEffect(() => {
    // التحقق من المسار الحالي قبل إرسال حالة المصادقة
    if (pathname !== '/login') {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, pathname]); // إضافة pathname كاعتماد لـ useEffect

  return <AuthGuard>{children}</AuthGuard>;
};

export default AuthInitializer;