import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const MpesaStkModal: React.FC = () => {
  const { isStkOpen, setIsStkOpen, stkPayload, confirmMpesaOrder, showToast } = useApp();

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isStkOpen || !stkPayload) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleCancel = () => {
    setPin('');
    setErrorMsg('');
    setIsStkOpen(false);
    showToast('M-Pesa payment cancelled by user', 'info');
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setErrorMsg('Please enter your 4-digit M-Pesa PIN');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await confirmMpesaOrder(pin);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Payment failed. Please retry.');
      setPin('');
    }
  };

  return (
    <div className="modal-overlay" id="stk-modal">
      <div className="stk-phone-frame">
        <div className="safaricom-prompt-card">
          {/* Official Safaricom Header */}
          <div className="stk-saf-header">
            <div className="stk-saf-logo">M-PESA</div>
            <span className="stk-sim-pill">SIM 1</span>
          </div>

          <div className="stk-body">
            <p className="stk-text-main">
              Do you want to pay <strong>KSh {stkPayload.amount.toLocaleString()}</strong> to{' '}
              <strong>KCA CAFETERIA</strong>?
            </p>
            <p className="stk-phone-line">
              Payment from: <strong>{stkPayload.phone}</strong> &bull; Ref: <span>{stkPayload.regNo}</span>
            </p>

            {/* PIN Dots */}
            <div className="stk-pin-field">
              <label>Enter M-Pesa PIN:</label>
              <div className="stk-pin-dots">
                <span className={`pin-dot ${pin.length >= 1 ? 'filled' : ''}`}></span>
                <span className={`pin-dot ${pin.length >= 2 ? 'filled' : ''}`}></span>
                <span className={`pin-dot ${pin.length >= 3 ? 'filled' : ''}`}></span>
                <span className={`pin-dot ${pin.length >= 4 ? 'filled' : ''}`}></span>
              </div>
            </div>

            {/* Error Message & Retry per SRS Section 4.4 */}
            {errorMsg && (
              <div
                style={{
                  color: 'var(--red)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  margin: '8px 0',
                  textAlign: 'center',
                  background: 'rgba(255, 23, 68, 0.1)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Virtual Keypad */}
            <div className="stk-keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => (
                <button key={n} type="button" className="kbtn" onClick={() => handleKeyPress(n)}>
                  {n}
                </button>
              ))}
              <button type="button" className="kbtn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" className="kbtn" onClick={() => handleKeyPress('0')}>
                0
              </button>
              <button type="button" className="kbtn-del" onClick={handleDelete}>
                ⌫
              </button>
            </div>

            <div className="stk-actions">
              <button
                className="stk-submit-btn"
                onClick={handleSubmit}
                disabled={loading || pin.length < 4}
                type="button"
              >
                <span>{loading ? 'Processing via Daraja API…' : 'Send PIN & Pay'}</span>
              </button>
            </div>

            <p className="stk-sec-note">
              🔒 Secured by Safaricom Daraja API Gateway (Simulated Flow per SRS 4.4)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
