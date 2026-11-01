import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const StudentRegistrationModal: React.FC = () => {
  const { isRegisterOpen, setIsRegisterOpen, registerStudent, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isRegisterOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !regNo.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    registerStudent({
      name: fullName.trim(),
      regNo: regNo.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-sheet" style={{ maxWidth: '440px' }}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div>
            <h3>Student Registration</h3>
            <span className="sub-muted">KCA University Dining Account</span>
          </div>
          <button className="modal-close" onClick={() => setIsRegisterOpen(false)} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
          <div className="login-field">
            <label>Full Name</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder="e.g. Rebecca Nabusambya"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Registration Number</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="7" y1="16" x2="12" y2="16" />
              </svg>
              <input
                type="text"
                placeholder="e.g. 2502692"
                value={regNo}
                onChange={e => {
                  setRegNo(e.target.value);
                  if (!email || email.includes('@students.kcau.ac.ke')) {
                    setEmail(`${e.target.value}@students.kcau.ac.ke`);
                  }
                }}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Student Email Address</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,12 2,6" />
              </svg>
              <input
                type="email"
                placeholder="2502692@students.kcau.ac.ke"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Create secure password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Confirm Password</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(201, 152, 31, 0.12)',
              border: '1px solid rgba(201, 152, 31, 0.3)',
              fontSize: '0.82rem',
              color: 'var(--text)',
            }}
          >
            ℹ️ <strong>SRS Section 4.1 Notice:</strong> New student accounts start with a MealCard balance of KSh 0. You will top up your wallet via M-Pesa before placing your first order.
          </div>

          {error && (
            <div className="login-error" style={{ display: 'flex' }}>
              <span>⚠</span> <span>{error}</span>
            </div>
          )}

          <button className="login-btn" type="submit" style={{ marginTop: '8px' }}>
            <span>Create Student Account</span>
          </button>
        </form>
      </div>
    </div>
  );
};
