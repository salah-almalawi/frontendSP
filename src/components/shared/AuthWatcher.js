'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser, setToken } from '@/store/slices/authSlice';
import { getToken } from '@/lib/auth';

export default function AuthWatcher() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    
    const token = getToken();
    
    if (token && !isAuthenticated) {
      dispatch(setToken(token));
      dispatch(fetchCurrentUser());
    }
    
    hasInitialized.current = true;
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    // Only fetch user data if we have a token but no user data and not loading
    if (isAuthenticated && !user && !loading) {
      const token = getToken();
      if (token) {
        dispatch(fetchCurrentUser());
      }
    }
  }, [dispatch, isAuthenticated, user, loading]);

  return null;
} 