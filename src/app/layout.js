'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateAuth } from '../store/slices/authSlice';
import { ReduxProvider } from '../components/shared/ReduxProvider';
import AuthGuard from '../components/shared/AuthGuard'; // استيراد AuthGuard // تأكد من أن المسار صحيح
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

// هذا المكون هو "مراقب المصادقة" الجديد والمبسط
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // عند تحميل التطبيق، حاول استعادة حالة المصادقة من localStorage
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return <AuthGuard>{children}</AuthGuard>;
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ReduxProvider>
          <AuthInitializer>{children}</AuthInitializer>
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{
              direction: 'rtl',
              fontFamily: 'inherit'
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}