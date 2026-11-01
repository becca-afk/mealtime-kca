import React from 'react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotifDrawerOpen,
    setIsNotifDrawerOpen,
    notifications,
    unreadNotifsCount,
    markAllNotifsRead,
    status,
  } = useApp();

  if (!isNotifDrawerOpen) return null;

  return (
    <div className="notif-drawer-overlay">
      <div className="notif-drawer">
        <div className="notif-drawer-header">
          <div className="notif-drawer-title">
            <span>🔔 Cafeteria Notifications</span>
            {unreadNotifsCount > 0 && (
              <span className="badge-count">{unreadNotifsCount} New</span>
            )}
          </div>
          <button className="modal-close" onClick={() => setIsNotifDrawerOpen(false)} type="button">
            ✕
          </button>
        </div>

        <div className="notif-drawer-body">
          {/* Live Queue Status Summary in Drawer */}
          <div className="drawer-queue-summary">
            <div className="dqs-icon">⏱️</div>
            <div>
              <strong>Cafeteria Counter Status</strong>
              <p id="drawer-queue-text">
                Average prep speed: <strong>~{status.estimatedWaitMins} mins</strong> · Counter B Express
              </p>
            </div>
          </div>

          <div className="notif-list" id="notif-list">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`notif-card ${notif.read ? 'read' : ''}`}
                style={{
                  background: notif.read ? 'var(--surface)' : 'var(--surface-2)',
                  borderLeft: notif.read ? '3px solid var(--border)' : '3px solid var(--maroon)',
                }}
              >
                <div className="notif-icon" style={{ fontSize: '1.4rem' }}>
                  {notif.icon}
                </div>
                <div className="notif-content">
                  <strong style={{ fontSize: '0.9rem' }}>{notif.title}</strong>
                  <p style={{ fontSize: '0.82rem', margin: '4px 0', color: 'var(--text)' }}>
                    {notif.message}
                  </p>
                  <span className="notif-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="clear-notif-btn" onClick={markAllNotifsRead} type="button">
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
};
