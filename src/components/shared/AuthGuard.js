'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import styles from './AuthGuard.module.css';

export default function AuthGuard({ children }) {
  const { loading, isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);
  const lastPathname = useRef(pathname);

  useEffect(() => {
    // انتظار التهيئة قبل اتخاذ أي قرار
    if (!initialized) {
      return;
    }

    // إذا كان المستخدم مسجل دخول وهو في صفحة تسجيل الدخول، اوجهه للداشبورد
    if (!loading && isAuthenticated && pathname === '/login' && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/dashboard');
      return;
    }

    // إذا لم يكن المستخدم مسجل دخول وليس في صفحة تسجيل الدخول
    if (!loading && !isAuthenticated && pathname !== '/login' && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/login');
      return;
    }

    // إعادة تعيين العلامة إذا تغير المسار
    if (pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      hasRedirected.current = false;
    }
  }, [loading, isAuthenticated, pathname, router, initialized]);

  // إظهار شاشة التحميل حتى يتم التهيئة
  if (!initialized || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // إذا لم يكن مسجل دخول وليس في صفحة تسجيل الدخول، لا تعرض أي شيء
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
} 