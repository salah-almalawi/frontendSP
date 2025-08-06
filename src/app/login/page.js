'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import NotificationService from '@/services/notificationService';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, isAuthenticated } = useAppSelector((state) => state.auth);

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                    <h1>نظام الدخول الموحد</h1>
                    <p>مرحباً بعودتك إلى المنصة</p>
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