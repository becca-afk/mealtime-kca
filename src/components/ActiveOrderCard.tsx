import React from 'react';
import { useApp } from '../context/AppContext';

export const ActiveOrderCard: React.FC = () => {
  const { activeOrder, orders, setQrOrder, setIsQrOpen } = useApp();

  if (!activeOrder) return null;

  // Calculate live queue position: how many orders ahead that are 'placed' or 'preparing'
  const activeOrdersList = orders.filter(o => o.status === 'placed' || o.status === 'preparing');
  const myIndex = activeOrdersList.findIndex(o => o.id === activeOrder.id);
  const queuePos = myIndex >= 0 ? myIndex + 1 : 1;
  const ordersAhead = Math.max(0, queuePos - 1);

  const isPlaced = activeOrder.status === 'placed';
  const isCooking = activeOrder.status === 'preparing';
  const isReady = activeOrder.status === 'ready';

  const statusTitle = isReady
    ? '🎉 Order Ready for Pickup!'
    : isCooking
    ? '👨‍🍳 Cooking in Cafeteria Kitchen'
    : '⏳ Order Placed & Queued';

  const eta = isReady
    ? 'Collect Now at Counter B'
    : isCooking
    ? 'Est. ready in ~4-6 min'
    : 'Est. ready in ~8 min';

  const handleOpenQR = () => {
    setQrOrder(activeOrder);
    setIsQrOpen(true);
  };

  return (
    <div className="active-order-card" id="active-order-card">
      <div className="ao-header">
        <span className="ao-title">{statusTitle}</span>
        <span className={`ao-badge ${isReady ? 'ready' : ''}`}>
          {isReady ? 'Ready for Pickup' : isCooking ? 'In Kitchen' : 'Queued'}
        </span>
      </div>

      <div className="ao-queue-position">
        {isReady ? (
          <span>🟢 Food is packed and waiting at <strong>Counter B (Express)</strong></span>
        ) : (
          <span>⏳ Live queue position: <strong>#{queuePos}</strong> ({ordersAhead} order{ordersAhead === 1 ? '' : 's'} ahead)</span>
        )}
      </div>

      <div className="ao-progress">
        <div className={`ao-step ${isPlaced || isCooking || isReady ? 'done' : ''}`}>
          <span>✓</span> Placed
        </div>
        <div className={`ao-line ${isCooking || isReady ? 'done' : ''}`}></div>
        <div className={`ao-step ${isCooking ? 'active' : isReady ? 'done' : ''}`}>
          {isCooking && <span className="spinner-sm"></span>}
          {isReady ? <span>✓</span> : !isCooking && <span>○</span>} Cooking
        </div>
        <div className={`ao-line ${isReady ? 'done' : ''}`}></div>
        <div className={`ao-step ${isReady ? 'active done' : ''}`}>
          <span>{isReady ? '✓' : '○'}</span> Ready
        </div>
      </div>

      <div className="ao-footer">
        <div>
          <span className="ao-main-item">
            {activeOrder.items[0]?.name}
            {activeOrder.items.length > 1 ? ` + ${activeOrder.items.length - 1} more` : ''}
          </span>
          <span className="ao-ticket">{activeOrder.ticketNo}</span>
        </div>
        <span id="ao-eta">
          <strong>{eta}</strong>
        </span>
      </div>

      <button className="qr-btn" onClick={handleOpenQR} type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <rect x="7" y="7" width="3" height="3" />
          <rect x="14" y="7" width="3" height="3" />
          <rect x="7" y="14" width="3" height="3" />
          <path d="M14 14h3v3h-3z" />
        </svg>
        <span>Show Official Pickup QR Pass</span>
      </button>
    </div>
  );
};
