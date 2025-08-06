'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/slices/authSlice';
import NotificationService from '@/services/notificationService';

export default function NotificationManager() {
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const { loading, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const lastErrorRef = useRef(null);
  const lastAuthStateRef = useRef({ isAuthenticated: false, user: null });

  useEffect(() => {
    if (authError && authError !== lastErrorRef.current) {
      // تجنب تكرار نفس الخطأ
      lastErrorRef.current = authError;
      
      // استخدام الدالة المساعدة للتعامل مع أنواع مختلفة من الأخطاء
      NotificationService.handleError(authError);
      
      // حذف الخطأ من Redux store بعد فترة قصيرة
      setTimeout(() => {
        dispatch(clearError());
        lastErrorRef.current = null;
        // إعادة تعيين متغير التتبع في NotificationService
        NotificationService.resetErrorTracking();
      }, 100);
    }
  }, [authError, dispatch]);

  // إظهار رسالة نجاح تسجيل الدخول
  useEffect(() => {
    const currentState = { isAuthenticated, user };
    const lastState = lastAuthStateRef.current;
    
    // إذا أصبح المستخدم مصادق عليه حديثاً (لم يكن مصادق عليه من قبل)
    if (isAuthenticated && user && !lastState.isAuthenticated && !loading) {
      NotificationService.showLoginSuccess();
    }
    
    lastAuthStateRef.current = currentState;
  }, [isAuthenticated, user, loading]);

  return null; // هذا المكون لا يعرض أي شيء مرئي
} 