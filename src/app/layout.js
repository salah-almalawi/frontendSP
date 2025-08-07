import { ReduxProvider } from '../components/shared/ReduxProvider';
import AuthInitializer from '../components/shared/AuthInitializer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

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