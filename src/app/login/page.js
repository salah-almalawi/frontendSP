'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import NotificationService from '@/services/notificationService';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation'; // استيراد useRouter

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const { loading, isAuthenticated, error } = useAppSelector((state) => state.auth); // إضافة isAuthenticated و error
    const router = useRouter(); // تهيئة useRouter

    // useEffect لإعادة التوجيه إذا كان المستخدم مصادقًا بالفعل
    useEffect(() => {
        if (isAuthenticated) {
            // router.replace('/dashboard'); // تم التعليق مؤقتاً لتشخيص مشكلة تحديث الصفحة
        }
    }, [isAuthenticated, router]);

    // useEffect لعرض الأخطاء من Redux store
    useEffect(() => {
        if (error) {
            console.log('Error detected in Redux store:', error); // إضافة console.log
            NotificationService.showError('خطأ في تسجيل الدخول', error);
        }
    }, [error]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            NotificationService.showWarning('تحذير', 'يرجى إدخال اسم المستخدم وكلمة المرور');
            return;
        }

        console.log('Attempting login for user:', username); // إضافة console.log
        const resultAction = await dispatch(loginUser({ username, password }));
        
        // التحقق من نجاح تسجيل الدخول وإعادة التوجيه
        if (loginUser.fulfilled.match(resultAction)) {
            console.log('Login successful, redirecting to dashboard.'); // إضافة console.log
            // router.push('/dashboard'); // تم التعليق مؤقتاً لتشخيص مشكلة تحديث الصفحة
        } else {
            console.log('Login failed, resultAction:', resultAction); // إضافة console.log
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.patternBg}></div>

            <div className={styles.loginContainer}>
                <div className={styles.loginHeader}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoIcon}>
                            <Shield size={40} />
                        </div>
                    </div>
                    <h1>SPP</h1>
                    <h1>منصة العروض التقديمية الذكية</h1>
                    <h2>Smart Presentation Platform</h2>
                    <h3>تسجيل الدخول</h3>

                </div>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">اسم المستخدم</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={styles.formControl}
                                placeholder="أدخل اسم المستخدم"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <User size={18} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">كلمة المرور</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className={styles.formControl}
                                placeholder="أدخل كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock size={18} />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.loginBtn} ${loading ? styles.loading : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
} 