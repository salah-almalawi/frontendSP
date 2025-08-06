'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import styles from './AuthGuard.module.css';

export default function AuthGuard({ children }) {
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // إذا لم يكن المستخدم مسجل دخول وليس في صفحة تسجيل الدخول
    if (!loading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) {
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

  // إذا كان مسجل دخول وهو في صفحة تسجيل الدخول، اترك LoginForm يتعامل مع التوجيه
  if (isAuthenticated && pathname === '/login') {
    return <>{children}</>;
  }

  return <>{children}</>;
} 