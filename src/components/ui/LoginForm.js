'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  // الحصول على حالة المصادقة من Redux store
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // استدعاء الأكشن للتعامل مع تسجيل الدخول
    // createAsyncThunk سيتولى الباقي (طلب API, تحديث الحالة, معالجة الأخطاء)
    dispatch(loginUser({ email, password })).then((result) => {
      // التحقق مما إذا كان تسجيل الدخول ناجحًا
      if (loginUser.fulfilled.match(result)) {
        router.push('/dashboard'); // إعادة التوجيه بعد النجاح
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password">كلمة المرور</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? 'جارِ تسجيل الدخول...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
};

export default LoginForm;