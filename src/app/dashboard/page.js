'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import NotificationService from '@/services/notificationService';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(result)) {
        NotificationService.showLogoutSuccess();
        // لا نحتاج للتوجيه اليدوي - AuthGuard سيتعامل مع ذلك
      }
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className="flex items-center">
            <h1 className={styles.navTitle}>
              لوحة التحكم
            </h1>
          </div>
          <div className={styles.navActions}>
            <span className={styles.userInfo}>
              مرحباً، {user?.username}
            </span>
            <button
              onClick={handleProfileClick}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              الملف الشخصي
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className={`${styles.btn} ${styles.btnDanger}`}
            >
              {loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <h2 className={styles.title}>
              مرحباً بك في لوحة التحكم
            </h2>
            <p className={styles.description}>
              هذه الصفحة محمية ولا يمكن الوصول إليها إلا بعد تسجيل الدخول
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 