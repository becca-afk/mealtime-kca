import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, cartCount, setIsCartOpen, role } = useApp();

  return (
    <nav className="bottom-nav" id="bottom-nav">
      <button
        className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentPage('home')}
        aria-label="Home"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>

      <button
        className={`nav-item ${currentPage === 'menu' ? 'active' : ''}`}
        onClick={() => setCurrentPage('menu')}
        aria-label="Menu"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span>Menu</span>
      </button>

      {/* Center floating order tray button */}
      <button
        className="nav-item nav-order-btn"
        onClick={() => setIsCartOpen(true)}
        aria-label="Tray"
        type="button"
      >
        <div className="nav-order-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.56l1.65-8.44H6" />
          </svg>
        </div>
        <span>Tray</span>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      <button
        className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`}
        onClick={() => setCurrentPage('orders')}
        aria-label="My Orders"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span>Orders</span>
      </button>

      {role === 'staff' ? (
        <button
          className={`nav-item ${currentPage === 'kds' ? 'active' : ''}`}
          onClick={() => setCurrentPage('kds')}
          aria-label="Kitchen KDS"
          type="button"
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>👨‍🍳</span>
          <span>KDS</span>
        </button>
      ) : role === 'admin' ? (
        <button
          className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`}
          onClick={() => setCurrentPage('analytics')}
          aria-label="Analytics"
          type="button"
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>📊</span>
          <span>Reports</span>
        </button>
      ) : (
        <button
          className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentPage('profile')}
          aria-label="Profile"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </button>
      )}
    </nav>
  );
};
