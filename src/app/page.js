'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import styles from './page.module.css';

export default function Home() {
  const { loading, isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // انتظار التهيئة قبل اتخاذ أي قرار
    if (!initialized) {
      return;
    }

    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, router, initialized]);

  // إظهار شاشة التحميل حتى يتم التهيئة
  if (!initialized || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return null;
}
