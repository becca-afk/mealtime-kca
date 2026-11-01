import React from 'react';
import { useApp } from '../context/AppContext';

export const FloatingTrayBar: React.FC = () => {
  const {
    cartCount,
    cartTotal,
    setIsCartOpen,
    isCartOpen,
    isStkOpen,
    isTopupOpen,
    isQrOpen,
    isFeedbackOpen,
    isItemDetailOpen,
  } = useApp();

  // Hide floating bar if cart is empty or if any modal is currently open
  if (
    cartCount === 0 ||
    isCartOpen ||
    isStkOpen ||
    isTopupOpen ||
    isQrOpen ||
    isFeedbackOpen ||
    isItemDetailOpen
  ) {
    return null;
  }

  const handleOpen = () => {
    setIsCartOpen(true);
  };

  return (
    <div
      className="floating-checkout-bar"
      id="floating-checkout-bar"
      onClick={handleOpen}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      title="Click to view tray and checkout"
    >
      <div className="fcb-content">
        <div className="fcb-left">
          <div className="fcb-badge" id="fcb-count">
            {cartCount}
          </div>
          <div className="fcb-text-wrap">
            <span className="fcb-label">Your Meal Tray</span>
            <strong className="fcb-total" id="fcb-total">
              KSh {(cartTotal + 5).toLocaleString()}
            </strong>
          </div>
        </div>
        <button
          className="fcb-btn"
          id="fcb-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          type="button"
        >
          <span>Checkout &amp; Pay</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};
