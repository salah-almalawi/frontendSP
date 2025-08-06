import "./globals.css";
import { ReduxProvider } from '@/components/shared/ReduxProvider';
import AuthWatcher from '@/components/shared/AuthWatcher';
import AuthGuard from '@/components/shared/AuthGuard';
import ErrorBoundaryWrapper from '@/components/shared/ErrorBoundary';
import NotificationManager from '@/components/shared/NotificationManager';
import NetworkStatus from '@/components/shared/NetworkStatus';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';

export const metadata = {
  title: "SmartPresentation - تسجيل الدخول",
  description: "نظام العروض التقديمية الذكية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">

      <body>
        <ReduxProvider>
          <ErrorBoundaryWrapper>
            <AuthWatcher />
            <NotificationManager />
            <NetworkStatus />
            <AuthGuard>
              {children}
            </AuthGuard>
            <ToastContainer
              position="bottom-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastStyle={{
                direction: 'rtl',
                textAlign: 'right',
                fontFamily: 'inherit',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </ErrorBoundaryWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
