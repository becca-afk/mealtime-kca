import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const KdsBoard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    simulateIncomingOrder,
    setRole,
    setCurrentPage,
    currentStaff,
    menu,
    toggleItemAvailability,
    logout,
    isOnline,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'placed' | 'preparing' | 'ready'>('all');
  const [showInventory, setShowInventory] = useState(false);

  const activeOrders = orders.filter(o => o.status !== 'picked_up' && o.status !== 'cancelled');

  const filteredOrders = activeOrders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const countNew = activeOrders.filter(o => o.status === 'placed').length;
  const countCooking = activeOrders.filter(o => o.status === 'preparing').length;
  const countReady = activeOrders.filter(o => o.status === 'ready').length;

  const handleExit = () => {
    logout();
  };

  return (
    <section id="page-kds" className="page active" style={{ display: 'block' }}>
      {/* KDS Header Banner */}
      <div className="kds-hero">
        <div className="kds-hero-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <div className="kds-badge">👨‍🍳 Kitchen Staff Terminal · Restricted Access (SRS NFR-04)</div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                background: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: isOnline ? '#34D399' : '#F87171',
                padding: '3px 8px',
                borderRadius: '20px',
                border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#34D399' : '#F87171' }}></span>
              <span>{isOnline ? '🟢 Live Cloud Server Connected' : '🔴 Server Offline'}</span>
            </div>
          </div>
          <h2>Kitchen Display System (KDS)</h2>
          <p id="kds-staff-status-sub" style={{ fontSize: '0.84rem', color: 'var(--gold-light)' }}>
            Authenticated Staff: <strong>{currentStaff?.name || 'Chef Otieno'}</strong> ({currentStaff?.email || 'chef.otieno@kcau.ac.ke'}) · <strong>Dual Auth Verified (PIN: 882041)</strong>
          </p>
        </div>
        <div className="kds-stats-strip">
          <div className="kds-stat">
            <span className="kds-stat-num" id="kds-count-new">{countNew}</span>
            <span className="kds-stat-label">New Placed</span>
          </div>
          <div className="kds-stat">
            <span className="kds-stat-num" id="kds-count-cooking">{countCooking}</span>
            <span className="kds-stat-label">In Kitchen</span>
          </div>
          <div className="kds-stat">
            <span className="kds-stat-num" id="kds-count-ready">{countReady}</span>
            <span className="kds-stat-label">Ready for Pickup</span>
          </div>
        </div>
      </div>

      {/* KDS Controls */}
      <div className="kds-filter-bar">
        <div className="kds-filter-tabs">
          <button
            className={`kds-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            type="button"
          >
            All Active Tickets ({activeOrders.length})
          </button>
          <button
            className={`kds-tab ${filter === 'placed' ? 'active' : ''}`}
            onClick={() => setFilter('placed')}
            type="button"
          >
            🟡 New Orders ({countNew})
          </button>
          <button
            className={`kds-tab ${filter === 'preparing' ? 'active' : ''}`}
            onClick={() => setFilter('preparing')}
            type="button"
          >
            🟠 Cooking ({countCooking})
          </button>
          <button
            className={`kds-tab ${filter === 'ready' ? 'active' : ''}`}
            onClick={() => setFilter('ready')}
            type="button"
          >
            🟢 Ready for Pickup ({countReady})
          </button>
        </div>

        <div className="kds-btn-group">
          <button
            className="kds-sim-btn"
            onClick={simulateIncomingOrder}
            type="button"
            title="Inject a mock student ticket to test order dispatch"
          >
            <span>+ Simulate Incoming Order</span>
          </button>

          <button
            className="kds-sim-btn"
            onClick={() => setShowInventory(!showInventory)}
            type="button"
            style={{ background: 'var(--surface-3)', color: 'var(--text)' }}
          >
            <span>📦 {showInventory ? 'Hide' : 'Manage'} Kitchen Inventory</span>
          </button>

          <button className="kds-exit-btn" onClick={handleExit} type="button">
            <span>🚪 Sign Out Terminal</span>
          </button>
        </div>
      </div>

      {/* Inventory Control Drawer per SRS Section 3.2 */}
      {showInventory && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
            margin: '0 0 20px 0',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Kitchen Stock &amp; Inventory Availability Control</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Toggling a dish as &quot;Sold Out&quot; disables it immediately on the student ordering menu (SRS Section 3.2).
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {menu.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: item.available ? 'var(--surface-2)' : 'rgba(255, 23, 68, 0.08)',
                  border: item.available ? '1px solid var(--border)' : '1px solid rgba(255, 23, 68, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.emoji}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleItemAvailability(item.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: item.available ? 'var(--green)' : 'var(--red)',
                    color: '#FFF',
                  }}
                >
                  {item.available ? 'IN STOCK' : 'SOLD OUT'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Ticket Cards Grid */}
      <div className="kds-board" id="kds-tickets-container">
        {filteredOrders.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.3rem', marginBottom: '6px' }}>👨‍🍳 No active orders in this filter right now.</p>
            <p style={{ fontSize: '0.9rem' }}>Click &quot;+ Simulate Incoming Order&quot; above to generate test kitchen tickets!</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const elapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
            const timeDisplay = isNaN(elapsed) || elapsed < 1 ? 'Just now' : `${elapsed}m ago`;

            return (
              <div key={order.id} className={`kds-card ${order.status}`}>
                <div className="kds-card-head">
                  <span className="kds-ticket-id">{order.ticketNo}</span>
                  <span className="kds-timer">⏱️ {timeDisplay}</span>
                </div>

                <div className="kds-student-info">
                  <div><strong>{order.studentName}</strong></div>
                  <small>
                    Reg: {order.regNo} · {order.payMethod === 'mpesa' ? 'Lipa na M-Pesa' : 'KCA MealCard'} · Total: KSh {order.total}
                  </small>
                </div>

                <div className="kds-payment-info">
                  <span>Payment Status:</span>
                  <strong style={{ color: 'var(--green)' }}>✓ Verified Paid ({order.mpesaRef || 'MealCard'})</strong>
                </div>

                <div className="kds-line">
                  Pickup Counter: <strong>{order.line || 'Counter B (Express)'}</strong> · Slot: {order.pickupTime || 'ASAP'}
                </div>

                <div className="kds-items-list">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="kds-item-row">
                      <span><strong>{it.qty}x</strong> {it.name}</span>
                      <span>KSh {it.price * it.qty}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="kds-notes">
                    <strong>Special Note:</strong> &quot;{order.notes}&quot;
                  </div>
                )}

                <div className="kds-actions-row">
                  {order.status === 'placed' && (
                    <button
                      className="kds-action-btn start"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      type="button"
                    >
                      🔥 Start Cooking
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      className="kds-action-btn ready"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      type="button"
                    >
                      🔔 Mark Ready &amp; Chime
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      className="kds-action-btn complete"
                      onClick={() => updateOrderStatus(order.id, 'picked_up')}
                      type="button"
                    >
                      ✓ Complete Handover
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="nav-clearance-spacer"></div>
    </section>
  );
};
