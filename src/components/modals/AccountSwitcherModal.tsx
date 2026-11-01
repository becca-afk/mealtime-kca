import React from 'react';
import { useApp } from '../../context/AppContext';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({ isOpen, onClose }) => {
  const {
    role,
    currentUser,
    currentStaff,
    currentAdmin,
    loginStudent,
    loginStaff,
    loginAdmin,
    logout,
    setCurrentPage,
    triggerPWAInstall,
  } = useApp();

  if (!isOpen) return null;

  const handleSelectStudent = () => {
    loginStudent({
      regNo: '2502692',
      email: '2502692@students.kcau.ac.ke',
      name: 'Rebecca Nabusambya',
      department: 'Diploma in Information Technology (STU 701)',
      walletBalance: 850,
      transactions: [],
    });
    setCurrentPage('home');
    onClose();
  };

  const handleSelectStaff = () => {
    loginStaff({
      id: 'KCA-STAFF-08',
      name: 'Chef Otieno',
      role: 'Kitchen Terminal Dispatcher',
      email: 'chef.otieno@kcau.ac.ke',
      department: 'KCA Catering & Cafeteria Services',
    });
    setCurrentPage('kds');
    onClose();
  };

  const handleSelectAdmin = () => {
    loginAdmin({
      id: 'KCA-ADMIN-01',
      name: 'John Doe (Supervisor / Admin)',
      email: 'admin.catering@kcau.ac.ke',
      role: 'System Administrator',
    });
    setCurrentPage('analytics');
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal-sheet" style={{ maxWidth: '420px', padding: '20px' }}>
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Account &amp; Role Sessions</h3>
            <span className="sub-muted">Demonstrate Student, Kitchen Staff &amp; Admin</span>
          </div>
          <button className="modal-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div style={{ margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Active Status Badge */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'var(--surface-2)',
              border: '1.5px solid var(--border)',
              fontSize: '0.84rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: 700 }}>
              CURRENTLY SIGNED IN AS:
            </span>
            <strong style={{ fontSize: '1rem', color: 'var(--maroon)' }}>
              {role === 'student'
                ? `🎓 Student: ${currentUser?.name || 'Rebecca Nabusambya'} (${currentUser?.regNo || '2502692'})`
                : role === 'staff'
                ? `👨‍🍳 Kitchen Staff: ${currentStaff?.name || 'Chef Otieno'}`
                : `🛡️ Administrator: ${currentAdmin?.name || 'John Doe'}`}
            </strong>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Switch directly to a persona or sign out to demonstrate the credential entry screen:
          </p>

          {/* Student Persona */}
          <div
            onClick={handleSelectStudent}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              border: role === 'student' ? '2px solid var(--maroon)' : '1px solid var(--border)',
              background: role === 'student' ? 'rgba(128, 0, 32, 0.08)' : 'var(--surface)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎓</span>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Rebecca Nabusambya</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Student Reg: 2502692 · KCA Student Portal
                </div>
              </div>
            </div>
            {role === 'student' && <span style={{ color: 'var(--maroon)', fontWeight: 800, fontSize: '0.8rem' }}>ACTIVE</span>}
          </div>

          {/* Kitchen Staff Persona */}
          <div
            onClick={handleSelectStaff}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              border: role === 'staff' ? '2px solid #D97706' : '1px solid var(--border)',
              background: role === 'staff' ? 'rgba(217, 119, 6, 0.08)' : 'var(--surface)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍🍳</span>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Chef Otieno (Kitchen KDS)</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  chef.otieno@kcau.ac.ke · 6-Digit PIN: 882041
                </div>
              </div>
            </div>
            {role === 'staff' && <span style={{ color: '#D97706', fontWeight: 800, fontSize: '0.8rem' }}>ACTIVE</span>}
          </div>

          {/* Administrator Persona */}
          <div
            onClick={handleSelectAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              border: role === 'admin' ? '2px solid #2563EB' : '1px solid var(--border)',
              background: role === 'admin' ? 'rgba(37, 99, 235, 0.08)' : 'var(--surface)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>John Doe (Supervisor / Admin)</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  admin.catering@kcau.ac.ke · System Administrator
                </div>
              </div>
            </div>
            {role === 'admin' && <span style={{ color: '#2563EB', fontWeight: 800, fontSize: '0.8rem' }}>ACTIVE</span>}
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Download MealTime Mobile App */}
          <button
            type="button"
            onClick={() => {
              onClose();
              triggerPWAInstall();
            }}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'var(--surface-2)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <span>📲 Download MealTime App</span>
          </button>

          {/* Button to physically demonstrate login screen to supervisor */}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--maroon) 0%, var(--maroon-deep) 100%)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span>🚪 Log Out to Login Screen (Show Credential Form)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
