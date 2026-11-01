import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const OrdersView: React.FC = () => {
  const {
    orders,
    currentUser,
    setQrOrder,
    setIsQrOpen,
    setFeedbackTarget,
    setIsFeedbackOpen,
    menu,
  } = useApp();

  const [tab, setTab] = useState<'active' | 'past'>('active');

  const myOrders = orders.filter(o => o.regNo === (currentUser?.regNo || '2502692'));

  const activeOrders = myOrders.filter(
    o => o.status === 'placed' || o.status === 'preparing' || o.status === 'ready'
  );

  const pastOrders = myOrders.filter(
    o => o.status === 'picked_up' || o.status === 'cancelled'
  );

  const handleOpenQR = (order: Order) => {
    setQrOrder(order);
    setIsQrOpen(true);
  };

  const handleOpenFeedback = (order: Order) => {
    const mainItem = menu.find(m => m.id === order.items[0]?.id) || menu[0];
    setFeedbackTarget({ orderId: order.id, item: mainItem });
    setIsFeedbackOpen(true);
  };

  return (
    <section id="page-orders" className="page active" style={{ display: 'block' }}>
      <div className="page-hero gold-hero">
        <div className="hero-pattern"></div>
        <h2>My Order Tickets</h2>
        <p>Track current orders &amp; review past dining receipts</p>
      </div>

      <div className="orders-tabs">
        <button
          className={`order-tab ${tab === 'active' ? 'active' : ''}`}
          onClick={() => setTab('active')}
          type="button"
        >
          Active Orders (<span id="active-tab-count">{activeOrders.length}</span>)
        </button>
        <button
          className={`order-tab ${tab === 'past' ? 'active' : ''}`}
          onClick={() => setTab('past')}
          type="button"
        >
          Order History ({pastOrders.length})
        </button>
      </div>

      {tab === 'active' ? (
        <div className="orders-list">
          {activeOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>🍽️</span>
              <h3>No Active Orders</h3>
              <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                You don&apos;t have any meals in progress right now. Head over to the menu to order ahead!
              </p>
            </div>
          ) : (
            activeOrders.map(order => {
              const isReady = order.status === 'ready';
              const isCooking = order.status === 'preparing';

              return (
                <div key={order.id} className="order-ticket-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', marginBottom: '14px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--maroon)' }}>
                        {order.ticketNo}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Target: {order.pickupTime || 'ASAP'} · {order.line || 'Counter B (Express)'}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        background: isReady ? 'var(--green)' : isCooking ? 'rgba(255, 170, 0, 0.15)' : 'rgba(128,0,32,0.1)',
                        color: isReady ? '#FFF' : isCooking ? '#D97706' : 'var(--maroon)',
                      }}
                    >
                      {isReady ? '✓ READY FOR PICKUP' : isCooking ? '👨‍🍳 Cooking' : '⏳ Queued'}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '10px 0', margin: '10px 0' }}>
                    {order.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                        <span><strong>{it.qty}x</strong> {it.name}</span>
                        <span>KSh {it.price * it.qty}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 800, marginTop: '8px', color: 'var(--text)' }}>
                      <span>Total Paid</span>
                      <span>KSh {order.total} ({order.payMethod === 'mpesa' ? 'M-Pesa' : 'MealCard'})</span>
                    </div>
                  </div>

                  {order.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '10px' }}>
                      &quot;{order.notes}&quot;
                    </p>
                  )}

                  <button
                    className="qr-btn"
                    onClick={() => handleOpenQR(order)}
                    type="button"
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <rect x="7" y="7" width="3" height="3" />
                      <rect x="14" y="7" width="3" height="3" />
                      <rect x="7" y="14" width="3" height="3" />
                      <path d="M14 14h3v3h-3z" />
                    </svg>
                    <span>Show Pickup QR Code</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="orders-list">
          {pastOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>📜</span>
              <h3>No Past Orders</h3>
              <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>Your completed dining receipts will appear here.</p>
            </div>
          ) : (
            pastOrders.map(order => (
              <div key={order.id} className="order-ticket-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{order.ticketNo}</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()} · Ref: {order.mpesaRef || 'MealCard'}
                    </div>
                  </div>
                  <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(0, 200, 83, 0.12)', color: 'var(--green)' }}>
                    ✓ Collected
                  </span>
                </div>

                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  {order.items.map(it => `${it.qty}x ${it.name}`).join(', ')} · <strong>KSh {order.total}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenQR(order)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.82rem', fontWeight: 600 }}
                  >
                    View Receipt QR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenFeedback(order)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: order.reviewed ? 'var(--surface-2)' : 'linear-gradient(135deg, var(--gold) 0%, #E6C200 100%)',
                      color: '#1C1410',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    {order.reviewed ? '⭐ Reviewed' : '★ Rate Meal (SRS 4.8)'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="nav-clearance-spacer"></div>
    </section>
  );
};
