import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const StatusBanner: React.FC = () => {
  const { status, refreshStatus, setIsNotifDrawerOpen, isOnline } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshing(true);
    await refreshStatus();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div
      className="status-banner"
      id="status-banner"
      onClick={() => setIsNotifDrawerOpen(true)}
      title="Click to open Notifications & Cafeteria Queue Advisory"
      style={{ cursor: 'pointer' }}
    >
      <div
        className={`status-dot ${isOnline ? 'pulse' : ''}`}
        style={{ background: isOnline ? '#10B981' : '#EF4444' }}
      ></div>

      <span id="status-text">
        {isOnline ? (
          <>
            Cafeteria Open · Queue: <strong>~{status.estimatedWaitMins} min wait</strong> · {status.activeOrdersCount} active orders
          </>
        ) : (
          <>
            ⚠️ <strong>Server Disconnected</strong> · Active internet connection required for live dining queue
          </>
        )}
      </span>

      <span
        className="crowd-pill"
        id="crowd-pill"
        style={!isOnline ? { background: 'rgba(239, 68, 68, 0.15)', color: '#DC2626', borderColor: 'rgba(239, 68, 68, 0.3)' } : undefined}
      >
        {isOnline ? status.crowdStatus : 'Offline'}
      </span>

      {isOnline && (
        <button
          className="status-refresh"
          onClick={handleRefresh}
          title="Refresh live cafeteria queue status"
          type="button"
          style={{
            transform: refreshing ? 'rotate(360deg)' : 'none',
            transition: 'transform 0.5s ease',
          }}
        >
          ↻
        </button>
      )}
    </div>
  );
};
