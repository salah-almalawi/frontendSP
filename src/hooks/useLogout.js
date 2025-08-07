'use client';

import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import NotificationService from '@/services/notificationService';

const useLogout = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    try {
      dispatch(logoutUser());
      NotificationService.showLogoutSuccess();
      // AuthGuard will handle the redirect automatically
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      // يمكنك إظهار إشعار خطأ هنا إذا أردت
    }
  };

  return handleLogout;
};

export default useLogout;