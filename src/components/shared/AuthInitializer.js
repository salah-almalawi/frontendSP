'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '@/store/slices/authSlice';
import AuthGuard from './AuthGuard';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <AuthGuard>{children}</AuthGuard>;
};

export default AuthInitializer;