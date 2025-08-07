'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styles from './AuthGuard.module.css'; // لإضافة شاشة تحميل

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // لا تقم بإعادة التوجيه أثناء التحميل الأولي
    if (loading) {
      return;
    }

    // إذا انتهى التحميل والمستخدم غير مصادق، قم بإعادة التوجيه
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  // أثناء التحقق الأولي، أظهر شاشة تحميل لتجنب وميض المحتوى
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جارِ التحقق من المصادقة...</p>
      </div>
    );
  }

  // إذا كان المستخدم مصادقًا، أظهر المحتوى المحمي
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // في حالة عدم المصادقة، لا تعرض أي شيء (سيتم إعادة التوجيه)
  return null;
};

export default AuthGuard;