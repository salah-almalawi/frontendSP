'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation'; // استيراد usePathname
import styles from './AuthGuard.module.css'; // لإضافة شاشة تحميل

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname(); // الحصول على المسار الحالي
  const { isAuthenticated, loading, initialized } = useSelector((state) => state.auth); // إضافة initialized

  // المسارات العامة التي لا تتطلب مصادقة
  const publicPaths = ['/login'];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // انتظر حتى يتم تهيئة حالة المصادقة
    if (!initialized) {
      return;
    }

    // إذا كان المسار عامًا، لا تقم بإعادة التوجيه
    if (isPublicPath) {
      return;
    }

    // إذا لم يكن المستخدم مصادقًا، قم بإعادة التوجيه إلى صفحة تسجيل الدخول
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, initialized, isPublicPath, router]);

  // أثناء التحقق الأولي، أظهر شاشة تحميل لتجنب وميض المحتوى
  // أو إذا كان المسار عامًا، اعرض المحتوى مباشرة
  if (loading || !initialized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جارِ التحقق من المصادقة...</p>
      </div>
    );
  }

  // إذا كان المسار عامًا، اعرض المحتوى مباشرة
  if (isPublicPath) {
    return <>{children}</>;
  }

  // إذا كان المستخدم مصادقًا، أظهر المحتوى المحمي
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // في حالة عدم المصادقة والمسار ليس عامًا، لا تعرض أي شيء (سيتم إعادة التوجيه)
  return null;
};

export default AuthGuard;