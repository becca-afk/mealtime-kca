import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const InstallAppModal: React.FC = () => {
  const { isInstallOpen, setIsInstallOpen, canInstallPWA, triggerPWAInstall } = useApp();
  const [downloading, setDownloading] = useState(false);

  if (!isInstallOpen) return null;

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleDownloadClick = async () => {
    setDownloading(true);
    await triggerPWAInstall();
    setTimeout(() => setDownloading(false), 800);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 10001 }}>
      <div
        className="modal-sheet"
        style={{
          maxWidth: '420px',
          padding: '24px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        }}
      >
        <div className="modal-handle"></div>

        {/* Header with App Icon and Official Badge */}
        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/icon-192.png"
              alt="MealTime"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                boxShadow: '0 4px 14px rgba(128,0,32,0.22)',
                border: '1.5px solid rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  MealTime
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#059669',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  ✓ Official
                </span>
              </div>
              <span className="sub-muted" style={{ fontSize: '0.82rem', display: 'block', marginTop: '2px' }}>
                KCA University Dining
              </span>
            </div>
          </div>
          <button
            className="modal-close"
            onClick={() => setIsInstallOpen(false)}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* App Store / Google Play style Meta Specs Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            background: 'var(--surface-2)',
            borderRadius: '14px',
            padding: '12px 10px',
            marginBottom: '18px',
            textAlign: 'center',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ★ 4.9
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              1.4K Ratings
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
              2.1 MB
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Instant
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
              ⚡ Live Cloud
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-Time Sync
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: 'var(--text-main)' }}>
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <span><strong>Pre-order &amp; skip</strong> the cafeteria queue during rush hour</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: 'var(--text-main)' }}>
            <span style={{ fontSize: '1.1rem' }}>💳</span>
            <span><strong>1-tap MealCard</strong> and instant M-Pesa automatic checkout</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: 'var(--text-main)' }}>
            <span style={{ fontSize: '1.1rem' }}>🔔</span>
            <span><strong>Live kitchen alerts</strong> when your order is cooked and ready</span>
          </div>
        </div>

        {/* iOS subtle 1-line note if user is on Safari/iOS */}
        {isIOS && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              fontSize: '0.78rem',
              color: 'var(--text-main)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>💡</span>
            <span>
              On iPhone / iPad: Tap <strong>Share ⎋</strong> in Safari, then select <strong>Add to Home Screen</strong>.
            </span>
          </div>
        )}

        {/* Primary Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={handleDownloadClick}
            disabled={downloading}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--maroon) 0%, var(--maroon-deep) 100%)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.98rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(128, 0, 32, 0.28)',
              transition: 'transform 0.15s ease',
            }}
          >
            <span>📲</span>
            <span>{canInstallPWA ? 'Download & Install MealTime' : 'Download MealTime App'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsInstallOpen(false)}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
};
