import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { App } from './App';
import '../style.css';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(err: unknown): ErrorBoundaryState {
    const message = err instanceof Error ? err.message : 'Unexpected display error';
    return { hasError: true, message };
  }

  handleReset = () => {
    try {
      sessionStorage.removeItem('mealtime_session');
      localStorage.removeItem('kca_orders_cache');
      localStorage.removeItem('kca_menu_cache');
      localStorage.removeItem('kca_feedbacks_cache');
      localStorage.removeItem('kca_student_user');
    } catch {
      // ignore storage errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(165deg, #5c0017 0%, #800020 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '420px',
              width: '100%',
              background: '#fff',
              color: '#1e293b',
              borderRadius: '20px',
              padding: '28px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>🍽️</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#800020', marginBottom: '8px' }}>
              MealTime Needs a Fresh Reload
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '18px', lineHeight: 1.5 }}>
              Saved browser cache conflicted with this update ({this.state.message}). Resetting local session will restore the Login screen.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#800020',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  (window as any).__MEALTIME_MOUNTED__ = true;
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <AppProvider>
          <App />
        </AppProvider>
      </AppErrorBoundary>
    </React.StrictMode>
  );
}

// Online-only policy: unregister any legacy service worker and purge old CacheStorage entries
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister().catch(() => {});
          });
        })
        .catch(() => {});
    }
    if ('caches' in window) {
      caches
        .keys()
        .then((names) => {
          names.forEach((name) => {
            caches.delete(name).catch(() => {});
          });
        })
        .catch(() => {});
    }
  });
}

