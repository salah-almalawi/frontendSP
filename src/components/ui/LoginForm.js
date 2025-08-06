'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import NotificationService from '@/services/notificationService';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, initialized } = useAppSelector((state) => state.auth);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    // انتظار التهيئة قبل اتخاذ أي قرار
    if (!initialized) {
      return;
    }

    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, initialized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      NotificationService.showWarning('تحذير', 'يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    const result = await dispatch(loginUser({ username, password }));
    
    if (loginUser.fulfilled.match(result)) {
      NotificationService.showLoginSuccess();
      router.push('/dashboard');
    }
    // إذا كان هناك خطأ، سيتعامل معه NotificationManager تلقائياً
  };

  // إظهار شاشة التحميل حتى يتم التهيئة
  if (!initialized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>تسجيل الدخول</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
} 