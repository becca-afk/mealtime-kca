import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComradeBudgetOptimizer } from './ComradeBudgetOptimizer';
import { ActiveOrderCard } from './ActiveOrderCard';
import { FoodImage } from './common/FoodImage';
import { MenuItem } from '../types';

export const StudentHome: React.FC = () => {
  const {
    currentUser,
    status,
    menu,
    addToCart,
    setCurrentPage,
    setDetailItem,
    setIsItemDetailOpen,
    setIsTopupOpen,
  } = useApp();

  const [dismissPeak, setDismissPeak] = useState(false);

  // Top picks: items rated >= 4.4
  const topPicks = menu.filter(m => m.rating >= 4.4).slice(0, 4);

  // Reorder strip: popular dishes
  const reorderItems = menu.slice(0, 5);

  const handleOpenDetail = (item: MenuItem) => {
    setDetailItem(item);
    setIsItemDetailOpen(true);
  };

  return (
    <section id="page-home" className="page active" style={{ display: 'block' }}>
      {/* Personalized Hero Banner */}
      <div className="hero-card">
        <div className="hero-kca-badge">KCA University · Comrade Dining</div>
        <div className="hero-text">
          <p className="hero-greeting" id="hero-greeting">
            Good day, {currentUser?.name || 'Rebecca Nabusambya'} 👋
          </p>
          <h2 className="hero-headline">
            Pre-order, skip queues &amp; <span className="gradient-text">eat fresh</span>.
          </h2>
        </div>

        <div className="hero-stat-pills">
          <div className="stat-pill green">
            <span className="pill-icon">⚡</span>
            <div>
              <span className="pill-num" id="hero-stat-wait">{status.estimatedWaitMins} min</span>
              <span className="pill-label">Est. Queue</span>
            </div>
          </div>
          <div className="stat-pill gold">
            <span className="pill-icon">🍽️</span>
            <div>
              <span className="pill-num">{menu.length}</span>
              <span className="pill-label">Meals Ready</span>
            </div>
          </div>
          <div className="stat-pill maroon">
            <span className="pill-icon">⭐</span>
            <div>
              <span className="pill-num">4.4</span>
              <span className="pill-label">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick MealCard Balance Strip as shown in SDS Page 14 */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '14px 18px',
          margin: '0 0 16px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            KCA STUDENT MEALCARD
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--maroon)' }}>
            KSh {currentUser?.walletBalance.toLocaleString() || '0'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsTopupOpen(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'var(--maroon)',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '0.85rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          Top up
        </button>
      </div>

      {/* Active Order Card Tracker per SRS Section 4.6 */}
      <ActiveOrderCard />

      {/* FEATURE: COMRADE BUDGET BUILDER (Smart Meal Optimizer - SRS Section 4.11) */}
      <ComradeBudgetOptimizer />

      {/* Peak Alert Banner */}
      {!dismissPeak && (
        <div className="peak-alert" id="peak-alert">
          <div className="peak-icon">📈</div>
          <div className="peak-text">
            <strong>Cafeteria Traffic Advisory</strong>
            <span>12:15 PM – 1:30 PM is usually crowded with long lines. Pre-order now for express pickup!</span>
          </div>
          <button
            className="peak-dismiss"
            onClick={() => setDismissPeak(true)}
            aria-label="Dismiss peak advisory"
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Order Again Carousel */}
      <div className="section-header">
        <h3>Order Again</h3>
        <button className="see-all-btn" onClick={() => setCurrentPage('menu')} type="button">
          Full menu →
        </button>
      </div>
      <div className="reorder-strip" id="reorder-strip" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
        {reorderItems.map(item => (
          <div
            key={item.id}
            style={{
              flex: '0 0 160px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{ width: '100%', height: '90px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => handleOpenDetail(item)}
            >
              <FoodImage src={item.img} alt={item.name} emoji={item.emoji} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.86rem', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.name}
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--maroon)' }}>KSh {item.price}</strong>
              <button
                type="button"
                onClick={() => addToCart(item.id, 1)}
                disabled={!item.available}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: item.available ? 'var(--maroon)' : 'var(--surface-3)',
                  color: item.available ? '#FFF' : 'var(--text-faint)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Top Student Picks */}
      <div className="section-header" style={{ marginTop: '20px' }}>
        <h3>Today&apos;s Top Student Picks ⭐</h3>
        <span className="section-badge">Nutrient Verified</span>
      </div>
      <div className="menu-grid" id="top-picks-grid">
        {topPicks.map(item => (
          <div
            key={item.id}
            className="menu-item-card"
            style={{
              background: 'var(--surface)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{ position: 'relative', width: '100%', height: '160px', cursor: 'pointer' }}
              onClick={() => handleOpenDetail(item)}
            >
              <FoodImage src={item.img} alt={item.name} emoji={item.emoji} />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'var(--maroon)',
                    color: '#FFF',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    zIndex: 3,
                  }}
                >
                  🔥 TOP PICK
                </span>
              )}
            </div>

            <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }} onClick={() => handleOpenDetail(item)}>
                  {item.name}
                </h4>
                <strong style={{ color: 'var(--maroon)' }}>KSh {item.price}</strong>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                🔥 {item.calories} kcal · 💪 {item.protein}g Protein · ⭐ {item.rating}
              </div>

              <button
                type="button"
                onClick={() => addToCart(item.id, 1)}
                disabled={!item.available}
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: item.available ? 'var(--maroon)' : 'var(--surface-3)',
                  color: item.available ? '#FFF' : 'var(--text-faint)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                }}
              >
                {item.available ? '+ Add to Tray' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-clearance-spacer"></div>
    </section>
  );
};
