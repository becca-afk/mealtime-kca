import React from 'react';
import { useApp } from '../../context/AppContext';

export const InstallAppModal: React.FC = () => {
  const { isInstallOpen, setIsInstallOpen, canInstallPWA, triggerPWAInstall } = useApp();

  if (!isInstallOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10001 }}>
      <div className="modal-sheet" style={{ maxWidth: '440px', padding: '24px' }}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/icon-192.png"
              alt="MealTime"
              style={{ width: '38px', height: '38px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Install MealTime</h3>
              <span className="sub-muted" style={{ fontSize: '0.78rem' }}>
                KCA University Progressive Web App (PWA)
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={() => setIsInstallOpen(false)} type="button">
            ✕
          </button>
        </div>

        <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick Direct Install Button if supported by browser */}
          {canInstallPWA ? (
            <button
              type="button"
              onClick={triggerPWAInstall}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span>📲</span> <span>1-Tap Install App on this Device</span>
            </button>
          ) : (
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--surface-2)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                lineHeight: 1.45,
              }}
            >
              <strong>⚡ Instant Home-Screen App:</strong> MealTime runs offline, launches full-screen without URL bars, and sends real-time order alerts.
            </div>
          )}

          {/* Android Installation Instructions */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>🤖</span>
              <strong style={{ fontSize: '0.92rem' }}>Android &amp; Google Chrome</strong>
            </div>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <li>Tap the <strong>⋮ (three dots)</strong> menu in Chrome.</li>
              <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
              <li>MealTime will appear with its own icon in your app drawer alongside native apps.</li>
            </ol>
          </div>

          {/* iOS Safari Installation Instructions */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1.5px solid var(--border)',
              background: 'var(--surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>🍎</span>
              <strong style={{ fontSize: '0.92rem' }}>Apple iOS (iPhone / iPad)</strong>
            </div>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <li>Open this page in <strong>Safari</strong>.</li>
              <li>Tap the <strong>Share</strong> button (box with an arrow pointing up).</li>
              <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</li>
              <li>Tap <strong>Add</strong> — it launches full-screen like an App Store app!</li>
            </ol>
          </div>

          {/* Architecture & Store Packaging Note for Presentation / Defense */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(128, 0, 32, 0.06)',
              border: '1.5px solid rgba(128, 0, 32, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.2rem' }}>🎓</span>
              <strong style={{ fontSize: '0.88rem', color: 'var(--maroon)' }}>
                App Store &amp; Google Play Architecture (Defense Q&amp;A)
              </strong>
            </div>
            <div style={{ fontSize: '0.79rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 6px 0' }}>
                <strong>• Google Play Store:</strong> Packaged via <em>Bubblewrap CLI / PWABuilder (Trusted Web Activity - TWA)</em> into a compliant Android App Bundle (<code>.aab</code>). Delivers seamless over-the-air updates without re-submitting to Google for daily menu changes.
              </p>
              <p style={{ margin: 0 }}>
                <strong>• Apple App Store:</strong> Wrappable via <em>Capacitor (@capacitor/ios)</em> for native iOS App Store binary distribution, or deployable as an Apple WebClip PWA with standalone sandbox.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsInstallOpen(false)}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '10px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
