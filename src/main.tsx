import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { App } from './App';
import '../style.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
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

