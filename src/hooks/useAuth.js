'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = isAuthenticated();
        setAuthenticated(isAuth);

        if (isAuth) {
          // فقط نحاول جلب بيانات المستخدم إذا كان هناك توكن
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          // إذا لم يكن هناك توكن، نتأكد من أن user هو null
          setUser(null);
        }
      } catch (error) {
        console.error('خطأ في التحقق من المصادقة:', error);
        
        // لا نعرض رسالة خطأ هنا لأن NotificationManager سيتعامل معها
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    loading,
    authenticated,
    setUser,
    setAuthenticated,
  };
}; 