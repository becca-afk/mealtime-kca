import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AccountSwitcherModal } from './modals/AccountSwitcherModal';

export const Header: React.FC = () => {
  const {
    role,
    currentUser,
    currentStaff,
    currentAdmin,
    unreadNotifsCount,
    setIsNotifDrawerOpen,
    setCurrentPage,
    triggerPWAInstall,
    logout,
  } = useApp();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const getRoleBadge = () => {
    if (role === 'student') {
      return { icon: '🎓', label: 'Student', name: currentUser?.name || 'Rebecca Nabusambya' };
    }
    if (role === 'staff') {
      return { icon: '👨‍🍳', label: 'Kitchen KDS', name: currentStaff?.name || 'Chef Otieno' };
    }
    return { icon: '🛡️', label: 'Admin Hub', name: currentAdmin?.name || 'John Doe' };
  };

  const badge = getRoleBadge();

  const userInitials = () => {
    if (role === 'student') return 'RN';
    if (role === 'staff') return 'CO';
    return 'JD';
  };

  return (
    <>
      <header className="app-header">
        <div className="header-left" onClick={() => setCurrentPage(role === 'staff' ? 'kds' : role === 'admin' ? 'analytics' : 'home')} style={{ cursor: 'pointer' }}>
          <img src="/assets/logo.jpg" alt="MealTime" className="header-logo" />
          <div>
            <span className="header-brand">
              MealTime{role === 'staff' ? ' · KDS' : role === 'admin' ? ' · Admin' : ''}
            </span>
            <span className="header-campus" id="header-campus-label">
              {role === 'staff'
                ? 'Kitchen Order Dispatch Terminal · Counter B'
                : role === 'admin'
                ? 'Campus Catering Administration Hub'
                : 'KCA University · Ruaraka Main Campus'}
            </span>
          </div>
        </div>

        <div className="header-right">
          {/* Active Role Indicator & Switcher Button */}
          <button
            className="role-switch-header-btn"
            onClick={() => setIsSwitcherOpen(true)}
            type="button"
            title="Click to switch account or log out to credential screen"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
            <span style={{ opacity: 0.6, fontSize: '0.68rem' }}>▼</span>
          </button>

          {/* Download MealTime App Button */}
          <button
            className="icon-btn"
            onClick={() => triggerPWAInstall()}
            aria-label="Download MealTime App"
            title="Download MealTime App"
            type="button"
          >
            <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>📲</span>
          </button>

          {/* Notifications Button */}
          <button
            className="icon-btn"
            onClick={() => setIsNotifDrawerOpen(true)}
            aria-label="Notifications"
            title="Notifications & Queue Center"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadNotifsCount > 0 && <span className="notif-badge">{unreadNotifsCount}</span>}
          </button>

          {/* Wallet Balance Badge (Student Only) */}
          {role === 'student' && (
            <button
              className="wallet-badge-btn"
              onClick={() => setCurrentPage('profile')}
              title="KCA MealCard Balance"
              type="button"
            >
              <span className="wallet-badge-icon">💳</span>
              <span className="wallet-badge-val">
                KSh {currentUser?.walletBalance.toLocaleString() || '0'}
              </span>
            </button>
          )}

          {/* User Avatar with Profile or Switcher */}
          <button
            className="avatar-btn"
            onClick={() => setIsSwitcherOpen(true)}
            aria-label="Account Menu"
            title={`Signed in as ${badge.name}. Click to switch role or log out.`}
            type="button"
          >
            <span>{userInitials()}</span>
          </button>
        </div>
      </header>

      {/* Account Switcher Modal */}
      <AccountSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
};
