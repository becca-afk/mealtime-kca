import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const StatusBanner: React.FC = () => {
  const { status, refreshStatus, setIsNotifDrawerOpen } = useApp();
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
      <div className="status-dot pulse"></div>
      <span id="status-text">
        Cafeteria Open · Queue: <strong>~{status.estimatedWaitMins} min wait</strong> · {status.activeOrdersCount} active orders
      </span>
      <span className="crowd-pill" id="crowd-pill">
        {status.crowdStatus}
      </span>
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
    </div>
  );
};
