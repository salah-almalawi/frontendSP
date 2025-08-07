'use client';

import { useRouter } from 'next/navigation';
import useLogout from '@/hooks/useLogout'; // استيراد خطاف useLogout
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import NotificationService from '@/services/notificationService';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.auth);
  const handleLogout = useLogout(); // استخدام خطاف useLogout

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <button
              onClick={handleBackToDashboard}
              className={styles.backButton}
            >
              ← العودة للوحة التحكم
            </button>
            <h1 className={styles.navTitle}>
              الملف الشخصي
            </h1>
          </div>
          <div className={styles.navActions}>
            <span className={styles.userInfo}>
              {user?.username}
            </span>
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
        <div className={styles.profileCard}>
          <h2 className={styles.title}>
            معلومات المستخدم
          </h2>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label className={styles.label}>
                اسم المستخدم
              </label>
              <p className={styles.value}>
                {user?.username}
              </p>
            </div>
            
            <div className={styles.infoItem}>
              <label className={styles.label}>
                معرف المستخدم
              </label>
              <p className={styles.value}>
                {user?._id}
              </p>
            </div>
            
            <div className={styles.infoItem}>
              <label className={styles.label}>
                تاريخ الإنشاء
              </label>
              <p className={styles.value}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : 'غير متوفر'}
              </p>
            </div>
            
            <div className={styles.infoItem}>
              <label className={styles.label}>
                عدد العروض التقديمية
              </label>
              <p className={styles.value}>
                {user?.presentationIDs?.length || 0} عرض تقديمي
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 