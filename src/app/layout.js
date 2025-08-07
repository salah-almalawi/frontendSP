'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateAuth } from '../store/slices/authSlice';
import { ReduxProvider } from '../components/shared/ReduxProvider'; // تأكد من أن المسار صحيح
import './globals.css';

// هذا المكون هو "مراقب المصادقة" الجديد والمبسط
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // عند تحميل التطبيق، حاول استعادة حالة المصادقة من localStorage
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ReduxProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}