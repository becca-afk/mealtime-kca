import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CartModal: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    menu,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCalories,
    cartProtein,
    currentUser,
    placeOrder,
    setCurrentPage,
    setIsTopupOpen,
    showToast,
  } = useApp();

  const [payMethod, setPayMethod] = useState<'kca_wallet' | 'mpesa'>('kca_wallet');
  const [phone, setPhone] = useState('0712345678');
  const [pickupTime, setPickupTime] = useState('ASAP (~8 min)');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isCartOpen) return null;

  const cartEntries = Object.entries(cart)
    .map(([idStr, qty]) => {
      const item = menu.find(m => m.id === Number(idStr));
      return item ? { item, qty } : null;
    })
    .filter(Boolean) as { item: (typeof menu)[0]; qty: number }[];

  const serviceFee = 5;
  const grandTotal = cartTotal + serviceFee;
  const walletBal = currentUser?.walletBalance || 0;
  const isWalletInsufficient = payMethod === 'kca_wallet' && walletBal < grandTotal;

  const handleConfirm = async () => {
    if (loading) return;

    if (payMethod === 'kca_wallet' && isWalletInsufficient) {
      showToast(
        `Insufficient MealCard balance (KSh ${walletBal.toLocaleString()} available, KSh ${grandTotal.toLocaleString()} needed). Please top up or switch to Lipa na M-Pesa.`,
        'warning'
      );
      setIsTopupOpen(true);
      return;
    }

    if (payMethod === 'mpesa') {
      const cleanedPhone = phone.replace(/[^0-9]/g, '');
      if (cleanedPhone.length < 9) {
        showToast('Please enter a valid M-Pesa phone number (e.g. 0712345678)', 'warning');
        return;
      }
    }

    setLoading(true);
    try {
      const success = await placeOrder(payMethod, pickupTime, notes, phone);
      if (success) {
        // Modal closes automatically inside placeOrder
      }
    } catch (err) {
      showToast('Error processing order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" id="cart-modal">
      <div className="modal-sheet">
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div>
            <h3>Your Campus Dining Tray</h3>
            <span className="sub-muted">Freshly prepared at KCA Cafeteria</span>
          </div>
          <button className="modal-close" onClick={() => setIsCartOpen(false)} type="button">
            ✕
          </button>
        </div>

        {cartEntries.length === 0 ? (
          <div className="cart-empty" style={{ display: 'block', textAlign: 'center', padding: '30px 10px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🛒</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
              Your meal tray is currently empty.<br />Browse the menu or use the Budget Optimizer!
            </p>
            <button
              className="go-menu-btn"
              onClick={() => {
                setIsCartOpen(false);
                setCurrentPage('menu');
              }}
              type="button"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Tray items list */}
            <div className="cart-items-list">
              {cartEntries.map(({ item, qty }) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--maroon)', fontWeight: 700 }}>
                        KSh {(item.price * qty).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="qty-row" style={{ margin: 0 }}>
                    <button className="qty-btn" onClick={() => removeFromCart(item.id)} type="button">
                      −
                    </button>
                    <span className="qty-val">{qty}</span>
                    <button className="qty-btn" onClick={() => addToCart(item.id, 1)} type="button">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tray Nutritional Summary Bar */}
            <div className="tray-nutrition-bar">
              <span className="nutri-pill">🔥 <strong>{cartCalories}</strong> kcal</span>
              <span className="nutri-pill">💪 <strong>{cartProtein}</strong>g Protein</span>
              <span className="nutri-badge">Balanced Comrade Meal</span>
            </div>

            {/* Price breakdown */}
            <div className="cart-summary" style={{ padding: 0 }}>
              <div className="summary-row">
                <span>Meal Subtotal</span>
                <span>KSh {cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Cafeteria packaging &amp; service fee</span>
                <span>KSh {serviceFee}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Payable</span>
                <span style={{ color: 'var(--maroon)' }}>KSh {grandTotal.toLocaleString()}</span>
              </div>

              {/* Payment Method Selector per SRS Section 4.3 & 4.5 */}
              <div className="pay-method-selector">
                <label className="pay-method-label">Select Payment Method:</label>
                <div className="pay-radio-group">
                  <label
                    className={`pay-radio-card ${payMethod === 'kca_wallet' ? 'active' : ''}`}
                    onClick={() => setPayMethod('kca_wallet')}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="pay-method"
                      value="kca_wallet"
                      checked={payMethod === 'kca_wallet'}
                      onChange={() => setPayMethod('kca_wallet')}
                    />
                    <div className="pay-radio-body">
                      <strong>💳 KCA Student MealCard</strong>
                      <span className="wallet-opt-bal">
                        Balance: <strong>KSh {walletBal.toLocaleString()}</strong> (Instant 1-Tap)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`pay-radio-card ${payMethod === 'mpesa' ? 'active' : ''}`}
                    onClick={() => setPayMethod('mpesa')}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="pay-method"
                      value="mpesa"
                      checked={payMethod === 'mpesa'}
                      onChange={() => setPayMethod('mpesa')}
                    />
                    <div className="pay-radio-body">
                      <strong>🟢 Lipa na M-Pesa</strong>
                      <span>Safaricom STK Push to Phone</span>
                    </div>
                  </label>
                </div>

                {/* M-Pesa Phone field */}
                {payMethod === 'mpesa' && (
                  <div className="mpesa-phone-field" style={{ display: 'block', marginTop: '10px' }}>
                    <label>📱 M-Pesa Mobile Number</label>
                    <div className="mpesa-phone-input-wrap">
                      <span className="phone-prefix">+254</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="712 345 678"
                        maxLength={12}
                      />
                    </div>
                    <span className="phone-hint">The STK prompt will be triggered to this Safaricom line.</span>
                  </div>
                )}

                {/* Insufficient balance notification */}
                {isWalletInsufficient && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 23, 68, 0.1)',
                      border: '1px solid var(--red)',
                      color: 'var(--red)',
                      fontSize: '0.84rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Insufficient MealCard balance!</span>
                    <button
                      type="button"
                      onClick={() => setIsTopupOpen(true)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        background: 'var(--maroon)',
                        color: '#FFF',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      + Top Up Now
                    </button>
                  </div>
                )}
              </div>

              {/* Pickup Time Slot */}
              <div className="pickup-slot">
                <label>📅 Target Pickup Time Slot</label>
                <select value={pickupTime} onChange={e => setPickupTime(e.target.value)}>
                  <option value="ASAP (~8 min)">ASAP (~6-8 min)</option>
                  <option value="12:15 PM (Lunch Rush)">12:15 PM (Pre-order for lunch)</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="1:30 PM">1:30 PM</option>
                  <option value="4:00 PM (Evening Class)">4:00 PM (Evening Break)</option>
                </select>
              </div>

              {/* Special Instructions */}
              <div className="special-notes-box">
                <input
                  type="text"
                  placeholder="Special instructions (e.g. extra soup, no chilli, separate pack)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {/* Confirm / Pay Button */}
              <button
                className="pay-btn"
                id="pay-btn"
                onClick={handleConfirm}
                disabled={loading}
                type="button"
                style={{
                  cursor: loading ? 'wait' : 'pointer',
                  background:
                    isWalletInsufficient
                      ? 'linear-gradient(135deg, var(--maroon) 0%, var(--maroon-deep) 100%)'
                      : 'linear-gradient(135deg, #00A651 0%, #007A3D 100%)',
                }}
              >
                <span>
                  {loading
                    ? 'Processing Order…'
                    : isWalletInsufficient
                    ? `Top Up MealCard to Pay (KSh ${grandTotal.toLocaleString()})`
                    : payMethod === 'kca_wallet'
                    ? `Confirm Order with MealCard (KSh ${grandTotal.toLocaleString()})`
                    : `Initiate M-Pesa STK Push (KSh ${grandTotal.toLocaleString()})`}
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
