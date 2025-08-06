'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser, clearNetworkError } from '@/store/slices/authSlice';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function NetworkStatus() {
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, networkError, loading } = useAppSelector((state) => state.auth);
  const [isOnline, setIsOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // إذا كان هناك خطأ شبكة وتم حل مشكلة الاتصال، نحاول إعادة المحاولة
      if (networkError) {
        dispatch(clearNetworkError());
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, networkError]);

  const handleRetry = async () => {
    if (isRetrying || loading) return;
    
    setIsRetrying(true);
    try {
      if (isAuthenticated) {
        await dispatch(fetchCurrentUser()).unwrap();
      }
    } catch (error) {
      console.error('فشل في إعادة المحاولة:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // إظهار التحذير فقط إذا كان هناك خطأ شبكة أو عدم اتصال بالإنترنت
  const showNetworkError = !isOnline || networkError;

  if (!showNetworkError) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
      {!isOnline ? (
        <>
          <WifiOff size={16} />
          <span>لا يوجد اتصال بالإنترنت</span>
        </>
      ) : (
        <>
          <Wifi size={16} />
          <span>لا يمكن الاتصال بالخادم</span>
          {isAuthenticated && (
            <button
              onClick={handleRetry}
              disabled={isRetrying || loading}
              className="ml-2 p-1 rounded hover:bg-red-600 disabled:opacity-50"
              title="إعادة المحاولة"
            >
              <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} />
            </button>
          )}
        </>
      )}
    </div>
  );
} 