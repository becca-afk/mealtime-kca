import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const WalletTopupModal: React.FC = () => {
  const { isTopupOpen, setIsTopupOpen, topupWallet, showToast } = useApp();

  const [amount, setAmount] = useState<number>(500);
  const [phone, setPhone] = useState('0712345678');
  const [loading, setLoading] = useState(false);

  if (!isTopupOpen) return null;

  const chips = [200, 500, 1000, 2000];

  const handleTopup = async () => {
    if (amount < 10) {
      showToast('Minimum top-up amount is KSh 10 (SRS Section 4.5)', 'warning');
      return;
    }

    setLoading(true);
    await topupWallet(amount, phone);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" id="topup-modal">
      <div className="modal-sheet topup-sheet">
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div>
            <h3>Top Up KCA MealCard</h3>
            <span className="sub-muted">Direct deposit via Lipa na M-Pesa</span>
          </div>
          <button className="modal-close" onClick={() => setIsTopupOpen(false)} type="button">
            ✕
          </button>
        </div>

        <div className="topup-body" style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Deposit lunch funds directly into your student smartcard using M-Pesa:
          </p>

          <div className="topup-amount-chips">
            {chips.map(c => (
              <button
                key={c}
                type="button"
                className={`topup-chip ${amount === c ? 'active' : ''}`}
                onClick={() => setAmount(c)}
              >
                + KSh {c.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="login-field" style={{ marginTop: '14px' }}>
            <label>Custom Top-up Amount (KSh, Min 10)</label>
            <input
              type="number"
              value={amount}
              min="10"
              onChange={e => setAmount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            />
          </div>

          <div className="login-field">
            <label>M-Pesa Registered Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <button
            className="pay-confirm-btn"
            onClick={handleTopup}
            disabled={loading || amount < 10}
            type="button"
            style={{ marginTop: '18px' }}
          >
            <span>{loading ? 'Sending M-Pesa Request…' : `Send M-Pesa Top Up Request (KSh ${amount.toLocaleString()})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
