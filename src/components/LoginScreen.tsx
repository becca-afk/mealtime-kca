import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Role } from '../types';

export const LoginScreen: React.FC = () => {
  const {
    isLoggedIn,
    loginStudent,
    loginStaff,
    loginAdmin,
    setIsRegisterOpen,
    showToast,
    triggerPWAInstall,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Role>('student');
  const [emailInput, setEmailInput] = useState('2502692@students.kcau.ac.ke');
  const [password, setPassword] = useState('1234');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isLoggedIn) return null;

  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setError('');
    if (role === 'student') {
      setEmailInput('2502692@students.kcau.ac.ke');
      setPassword('1234');
    } else if (role === 'staff') {
      setEmailInput('chef.otieno@kcau.ac.ke');
      setPassword('882041');
    } else {
      setEmailInput('admin.catering@kcau.ac.ke');
      setPassword('admin123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'admin') {
        if (!emailInput.toLowerCase().includes('admin')) {
          setError('Invalid administrator email. Use admin.catering@kcau.ac.ke');
          setLoading(false);
          return;
        }
        loginAdmin({
          id: 'KCA-ADMIN-01',
          name: 'John Doe (Supervisor / Admin)',
          email: emailInput,
          role: 'System Administrator',
        });
        setLoading(false);
        return;
      }

      const res = await api.login({
        input: emailInput,
        password,
        role: activeTab as 'student' | 'staff',
        staffPin: activeTab === 'staff' ? password : undefined,
      });

      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      if (res.role === 'staff' && res.staff) {
        loginStaff(res.staff);
      } else if (res.role === 'student' && res.student) {
        loginStudent(res.student);
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginStudent({
      regNo: '2502692',
      email: '2502692@students.kcau.ac.ke',
      name: 'Rebecca Nabusambya',
      department: 'Diploma in Information Technology (STU 701)',
      walletBalance: 850,
      transactions: [],
    });
    showToast('Signed in via KCA Google Workspace SSO', 'success');
  };

  return (
    <div id="login-screen">
      <div className="login-bg"></div>
      <div className="login-content">
        <div className="login-logo-wrap">
          <img src="/assets/logo.jpg" alt="MealTime" className="login-logo" />
          <div className="login-logo-ring"></div>
        </div>

        <h1 className="login-title">MealTime</h1>
        <p className="login-uni">KCA University · Official Campus Dining</p>
        <p className="login-tagline">
          Order ahead. Skip the queue.<br />
          Smart dining for comrades.
        </p>

        <div className="login-card">
          {/* Role Tabs */}
          <div className="login-role-tabs">
            <button
              type="button"
              className={`login-role-tab ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => handleTabChange('student')}
            >
              <span>🎓 Student</span>
            </button>
            <button
              type="button"
              className={`login-role-tab ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => handleTabChange('staff')}
            >
              <span>👨‍🍳 Kitchen Staff</span>
            </button>
            <button
              type="button"
              className={`login-role-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => handleTabChange('admin')}
            >
              <span>🛡️ Admin</span>
            </button>
          </div>

          <div className="login-card-header">
            <span className="login-shield">
              {activeTab === 'student' ? '🔐' : activeTab === 'staff' ? '👨‍🍳' : '🛡️'}
            </span>
            <div>
              <strong>
                {activeTab === 'student'
                  ? 'Student & Lecturer Access'
                  : activeTab === 'staff'
                  ? 'Cafeteria Staff Terminal'
                  : 'Administrator Operations Hub'}
              </strong>
              <span>
                {activeTab === 'student'
                  ? 'Sign in with your official university credentials'
                  : activeTab === 'staff'
                  ? 'Requires 6-digit staff terminal security PIN'
                  : 'Supervisor & catering manager reporting access'}
              </span>
            </div>
          </div>

          {/* Quick 1-Click Demo Fill for Defense Presentations */}
          <div className="demo-chip-wrap">
            {activeTab === 'student' && (
              <button
                type="button"
                className="demo-chip-btn"
                onClick={() => {
                  setEmailInput('2502692@students.kcau.ac.ke');
                  setPassword('1234');
                }}
              >
                <span>⚡ Use Student: <strong>2502692@students.kcau.ac.ke</strong></span>
              </button>
            )}
            {activeTab === 'staff' && (
              <button
                type="button"
                className="demo-chip-btn"
                onClick={() => {
                  setEmailInput('chef.otieno@kcau.ac.ke');
                  setPassword('882041');
                }}
              >
                <span>⚡ Use Staff: <strong>chef.otieno@kcau.ac.ke (PIN: 882041)</strong></span>
              </button>
            )}
            {activeTab === 'admin' && (
              <button
                type="button"
                className="demo-chip-btn"
                onClick={() => {
                  setEmailInput('admin.catering@kcau.ac.ke');
                  setPassword('admin123');
                }}
              >
                <span>⚡ Use Admin: <strong>admin.catering@kcau.ac.ke</strong></span>
              </button>
            )}
          </div>

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label>
                {activeTab === 'student'
                  ? 'Student Email or Registration Number'
                  : activeTab === 'staff'
                  ? 'Official Staff Email'
                  : 'Administrator Email'}
              </label>
              <div className="login-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,12 2,6" />
                </svg>
                <input
                  type="text"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder={
                    activeTab === 'student'
                      ? '2502692@students.kcau.ac.ke'
                      : activeTab === 'staff'
                      ? 'chef.otieno@kcau.ac.ke'
                      : 'admin.catering@kcau.ac.ke'
                  }
                  required
                />
              </div>
              {activeTab === 'student' && (
                <span className="field-hint">
                  Format: <strong>2502692@students.kcau.ac.ke</strong> or registration number <strong>2502692</strong>
                </span>
              )}
            </div>

            <div className="login-field">
              <label>
                {activeTab === 'staff' ? 'Staff Terminal 6-Digit PIN' : 'Password / Portal PIN'}
              </label>
              <div className="login-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={activeTab === 'staff' ? 'Enter 6-digit PIN (e.g. 882041)' : 'Enter password'}
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Security Warning for Staff Terminal per SRS Section 5.2 */}
            {activeTab === 'staff' && (
              <div className="staff-security-alert" style={{ display: 'flex' }}>
                <span>🔒 Restricted Terminal: Dual-factor authentication (Email AND 6-digit PIN) enforced per SRS NFR-04.</span>
              </div>
            )}

            {error && (
              <div className="login-error" style={{ display: 'flex' }}>
                <span>⚠</span> <span>{error}</span>
              </div>
            )}

            <button className="login-btn" type="submit" disabled={loading}>
              <span>{loading ? 'Verifying Credentials…' : `Sign In as ${activeTab === 'student' ? 'Student' : activeTab === 'staff' ? 'Cafeteria Staff' : 'Administrator'}`}</span>
              {loading && <span className="spinner-sm"></span>}
            </button>
          </form>

          {activeTab === 'student' && (
            <>
              <div className="login-divider"><span>or continue with</span></div>

              <button className="google-btn" type="button" onClick={handleGoogleLogin}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                KCA Google Workspace
              </button>

              <p className="login-note">
                New Student?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  style={{ color: 'var(--maroon-mid)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Create account (SRS Form) →
                </button>
              </p>
            </>
          )}
        </div>

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="demo-chip-btn"
            onClick={() => triggerPWAInstall()}
            style={{ padding: '7px 16px', fontSize: '0.82rem', background: 'rgba(255,255,255,0.92)' }}
          >
            <span>📲 Download MealTime App</span>
          </button>
        </div>

        <p className="login-footer">
          MealTime PWA · Programming Project STU 701 · Supervisor: John Doe
        </p>
      </div>
    </div>
  );
};
