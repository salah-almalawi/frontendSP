'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initializeAuth, fetchCurrentUser } from '@/store/slices/authSlice';

export default function AuthWatcher() {
  const dispatch = useAppDispatch();
  const { initialized, isAuthenticated, user, loading, networkError, error } = useAppSelector((state) => state.auth);
  const hasInitialized = useRef(false);
  const hasAttemptedFetch = useRef(false);

  // تهيئة المصادقة مرة واحدة فقط عند تحميل التطبيق
  useEffect(() => {
    if (!hasInitialized.current && !initialized) {
      dispatch(initializeAuth());
      hasInitialized.current = true;
    }
  }, [dispatch, initialized]);

  // إعادة المحاولة فقط إذا كان هناك خطأ شبكة وتم حل المشكلة
  useEffect(() => {
    // إذا كان هناك خطأ شبكة، لا نحاول إعادة المحاولة تلقائياً
    if (networkError) {
      hasAttemptedFetch.current = false; // إعادة تعيين عند حل مشكلة الشبكة
      return;
    }

    // إذا كان المستخدم مصادق عليه ولكن لا توجد بيانات مستخدم، نحاول جلبها مرة واحدة فقط
    if (isAuthenticated && !user && !loading && !hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      dispatch(fetchCurrentUser());
    }

    // إعادة تعيين العلامة إذا تم جلب البيانات بنجاح أو إذا لم يعد المستخدم مصادق عليه
    if (user || !isAuthenticated) {
      hasAttemptedFetch.current = false;
    }
  }, [dispatch, isAuthenticated, user, loading, networkError]);

  // لا نعرض أي شيء - هذا مكون خفي
  return null;
} 