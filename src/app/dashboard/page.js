'use client';

import { useRouter } from 'next/navigation';
import useLogout from '@/hooks/useLogout'; // استيراد خطاف useLogout
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.auth);
  const handleLogout = useLogout(); // استخدام خطاف useLogout

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