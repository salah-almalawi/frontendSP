'use client';

import { Component } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { clearAuth } from '@/store/slices/authSlice';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Clear auth state if there's an authentication error
    if (this.state.error?.message?.includes('auth')) {
      this.props.dispatch(clearAuth());
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            حدث خطأ غير متوقع
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            عذراً، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to provide dispatch to class component
export default function ErrorBoundaryWrapper({ children }) {
  const dispatch = useAppDispatch();
  
  return (
    <ErrorBoundary dispatch={dispatch}>
      {children}
    </ErrorBoundary>
  );
} 