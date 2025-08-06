'use client';

import { createContext, useContext } from 'react';
import { useAppSelector } from '@/store/hooks';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const auth = {
    user,
    isAuthenticated,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}; 