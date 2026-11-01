import React from 'react';
import { useApp } from '../context/AppContext';

export const SmartCardProfile: React.FC = () => {
  const {
    currentUser,
    setIsTopupOpen,
    audioEnabled,
    setAudioEnabled,
    darkTheme,
    setDarkTheme,
    logout,
    showToast,
    triggerPWAInstall,
  } = useApp();

  const handleEditPref = (title: string) => {
    showToast(`Preferences updated: ${title}`, 'success');
  };

  return (
    <section id="page-profile" className="page active" style={{ display: 'block' }}>
      {/* Digital KCA University Student SmartCard */}
      <div className="smartcard-container">
        <div className="kca-smartcard">
          <div className="smartcard-top">
            <div className="smartcard-brand">
              <img src="/assets/logo.jpg" alt="KCA" className="smartcard-logo" />
              <div>
                <span className="smartcard-uni">KCA UNIVERSITY</span>
                <span className="smartcard-type">OFFICIAL STUDENT MEALCARD</span>
              </div>
            </div>
            <div className="smartcard-chip"></div>
          </div>

          <div className="smartcard-middle">
            <div className="smartcard-bal-label">AVAILABLE MEAL BALANCE</div>
            <div className="smartcard-bal-val">
              KSh {currentUser?.walletBalance.toLocaleString() || '0'}.00
            </div>
          </div>

          <div className="smartcard-bottom">
            <div>
              <span className="smartcard-sub">STUDENT REG NO</span>
              <span className="smartcard-holder">{currentUser?.regNo || '2502692'}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="smartcard-sub">OFFICIAL EMAIL</span>
              <span className="smartcard-name">
                {currentUser?.email || '2502692@students.kcau.ac.ke'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Operations per SRS Section 4.5 */}
      <div className="profile-section">
        <h3>KCA Meal Wallet Operations</h3>
        <div className="wallet-action-row">
          <button
            className="topup-action-btn"
            onClick={() => setIsTopupOpen(true)}
            type="button"
          >
            <span>+ Top Up via Lipa na M-Pesa (Min KSh 10)</span>
          </button>
        </div>

        <div className="wallet-transactions-box" id="wallet-tx-box">
          <h4>Recent MealCard Transactions</h4>
          <div className="tx-list" id="tx-list">
            {!currentUser?.transactions || currentUser.transactions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', padding: '12px 0' }}>
                No recent transactions. Top up to start pre-ordering meals!
              </p>
            ) : (
              currentUser.transactions.map((tx, idx) => {
                const isPlus = tx.type === 'topup' || tx.type === 'welcome_grant';
                return (
                  <div key={idx} className="tx-item">
                    <span className={`tx-icon ${isPlus ? 'green' : 'maroon'}`}>
                      {isPlus ? '↓' : '↑'}
                    </span>
                    <div>
                      <strong>{isPlus ? 'M-Pesa Wallet Top Up' : 'Cafeteria Meal Payment'}</strong>
                      <span>{tx.date} · Ref: {tx.ref}</span>
                    </div>
                    <span className={`tx-amount ${isPlus ? 'plus' : 'minus'}`}>
                      {isPlus ? `+KSh ${tx.amount.toLocaleString()}` : `-KSh ${tx.amount.toLocaleString()}`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Dietary & Health Preferences */}
      <div className="profile-section">
        <h3>Dietary &amp; Health Preferences</h3>
        <div className="pref-item">
          <span>Dietary Preference: <strong>Flexitarian / Halal Certified</strong></span>
          <button className="pref-edit-btn" onClick={() => handleEditPref('Dietary saved')} type="button">
            Edit
          </button>
        </div>
        <div className="pref-item">
          <span>Nutritional Goal: <strong>High Protein (&gt;30g per meal)</strong></span>
          <button className="pref-edit-btn" onClick={() => handleEditPref('Nutritional goal set')} type="button">
            Edit
          </button>
        </div>
      </div>

      {/* Settings & Audio Notifications */}
      <div className="profile-section">
        <h3>Dining Settings &amp; Audio Notifications</h3>
        <div className="settings-list">
          <div className="setting-row">
            <span>Order Ready Audio Chime 🔔</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={audioEnabled}
                onChange={e => setAudioEnabled(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-row">
            <span>Peak Hour Rush Alerts 📈</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-row">
            <span>Dark Theme 🌙</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={darkTheme}
                onChange={e => setDarkTheme(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile App Download Card */}
      <div className="profile-section">
        <h3>Download MealTime Mobile App</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
          Install MealTime directly on your device for instant pre-ordering, offline digital MealCard access, and live order alerts.
        </p>
        <button
          className="topup-action-btn"
          onClick={() => triggerPWAInstall()}
          type="button"
          style={{
            background: 'linear-gradient(135deg, var(--maroon) 0%, var(--maroon-deep) 100%)',
            border: 'none',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>📲 Download MealTime App</span>
        </button>
      </div>

      {/* Sign Out Button */}
      <button className="logout-btn" onClick={logout} type="button">
        Sign Out from Session
      </button>

      <div className="nav-clearance-spacer"></div>
    </section>
  );
};
