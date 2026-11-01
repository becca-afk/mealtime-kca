import React from 'react';
import { useApp } from '../../context/AppContext';

export const QrPassModal: React.FC = () => {
  const { isQrOpen, setIsQrOpen, qrOrder } = useApp();

  if (!isQrOpen || !qrOrder) return null;

  const isReady = qrOrder.status === 'ready';

  return (
    <div className="modal-overlay" id="qr-modal">
      <div className="modal-sheet qr-sheet" style={{ maxWidth: '400px' }}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div>
            <h3>Official Pickup Pass</h3>
            <span className="sub-muted">KCA University Cafeteria Express</span>
          </div>
          <button className="modal-close" onClick={() => setIsQrOpen(false)} type="button">
            ✕
          </button>
        </div>

        <p className="qr-instruction" style={{ textAlign: 'center', margin: '10px 0 16px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Present this QR code to cafeteria staff at <strong>{qrOrder.line || 'Counter B (Express)'}</strong> to claim your meal.
        </p>

        {/* Dynamic Stylized QR Matrix */}
        <div className="qr-box" style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            style={{
              background: '#FFF',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {/* Corner Markers */}
            <rect x="10" y="10" width="46" height="46" rx="6" fill="#800020" />
            <rect x="20" y="20" width="26" height="26" rx="3" fill="#FFF" />
            <rect x="27" y="27" width="12" height="12" rx="2" fill="#800020" />

            <rect x="144" y="10" width="46" height="46" rx="6" fill="#800020" />
            <rect x="154" y="20" width="26" height="26" rx="3" fill="#FFF" />
            <rect x="161" y="27" width="12" height="12" rx="2" fill="#800020" />

            <rect x="10" y="144" width="46" height="46" rx="6" fill="#800020" />
            <rect x="20" y="154" width="26" height="26" rx="3" fill="#FFF" />
            <rect x="27" y="161" width="12" height="12" rx="2" fill="#800020" />

            {/* Simulated Data Matrix dots based on Ticket No */}
            <g fill="#1C1410">
              <rect x="68" y="18" width="10" height="10" rx="2" />
              <rect x="88" y="18" width="10" height="10" rx="2" />
              <rect x="108" y="18" width="10" height="10" rx="2" />
              <rect x="128" y="18" width="10" height="10" rx="2" />

              <rect x="68" y="38" width="10" height="10" rx="2" />
              <rect x="98" y="38" width="10" height="10" rx="2" />
              <rect x="118" y="38" width="10" height="10" rx="2" />

              <rect x="18" y="68" width="10" height="10" rx="2" />
              <rect x="38" y="68" width="10" height="10" rx="2" />
              <rect x="68" y="68" width="10" height="10" rx="2" />
              <rect x="88" y="68" width="10" height="10" rx="2" />
              <rect x="118" y="68" width="10" height="10" rx="2" />
              <rect x="148" y="68" width="10" height="10" rx="2" />
              <rect x="172" y="68" width="10" height="10" rx="2" />

              <rect x="28" y="88" width="10" height="10" rx="2" />
              <rect x="48" y="88" width="10" height="10" rx="2" />
              <rect x="78" y="88" width="10" height="10" rx="2" />
              <rect x="118" y="88" width="10" height="10" rx="2" />
              <rect x="158" y="88" width="10" height="10" rx="2" />

              <rect x="18" y="108" width="10" height="10" rx="2" />
              <rect x="38" y="108" width="10" height="10" rx="2" />
              <rect x="68" y="108" width="10" height="10" rx="2" />
              <rect x="98" y="108" width="10" height="10" rx="2" />
              <rect x="138" y="108" width="10" height="10" rx="2" />
              <rect x="168" y="108" width="10" height="10" rx="2" />

              <rect x="28" y="128" width="10" height="10" rx="2" />
              <rect x="58" y="128" width="10" height="10" rx="2" />
              <rect x="88" y="128" width="10" height="10" rx="2" />
              <rect x="128" y="128" width="10" height="10" rx="2" />
              <rect x="158" y="128" width="10" height="10" rx="2" />

              <rect x="68" y="148" width="10" height="10" rx="2" />
              <rect x="98" y="148" width="10" height="10" rx="2" />
              <rect x="128" y="148" width="10" height="10" rx="2" />
              <rect x="168" y="148" width="10" height="10" rx="2" />

              <rect x="68" y="168" width="10" height="10" rx="2" />
              <rect x="108" y="168" width="10" height="10" rx="2" />
              <rect x="148" y="168" width="10" height="10" rx="2" />
            </g>

            {/* Central Badge */}
            <circle cx="100" cy="100" r="18" fill="#FFD700" stroke="#800020" strokeWidth="3" />
            <text x="100" y="105" fontSize="14" textAnchor="middle" fill="#800020" fontWeight="bold">
              KCA
            </text>
          </svg>
        </div>

        <div className="qr-order-info" style={{ marginTop: '16px', textAlign: 'center' }}>
          <div className="qr-ticket-pill" style={{ display: 'inline-block', margin: '0 auto 8px' }}>
            {qrOrder.ticketNo}
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0' }}>
            {qrOrder.items.map(it => `${it.qty}x ${it.name}`).join(' + ')}
          </h4>
          <div className="qr-meta-row" style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.84rem', color: 'var(--text-muted)', margin: '8px 0' }}>
            <span>Reg: <strong>{qrOrder.regNo}</strong></span>
            <span>Paid: <strong>KSh {qrOrder.total} ({qrOrder.payMethod === 'mpesa' ? 'M-Pesa' : 'MealCard'})</strong></span>
          </div>
          <span
            className={`qr-status ${isReady ? 'ready-status' : ''}`}
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: isReady ? 'var(--green)' : 'rgba(255, 170, 0, 0.15)',
              color: isReady ? '#FFF' : '#D97706',
              marginTop: '6px',
            }}
          >
            {isReady ? '✓ READY FOR PICKUP AT COUNTER B' : '⏳ IN KITCHEN PREPARATION'}
          </span>
        </div>
      </div>
    </div>
  );
};
