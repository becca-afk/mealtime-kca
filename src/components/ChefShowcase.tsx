import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodImage } from './common/FoodImage';
import { MenuItem, ProductCategory } from '../types';

export const ChefShowcase: React.FC = () => {
  const { menu, addToCart, setIsCartOpen, setDetailItem, setIsItemDetailOpen, cartCount, setCurrentPage } = useApp();
  const [selectedCat, setSelectedCat] = useState<ProductCategory>('all');
  const [favorites, setFavorites] = useState<{ [id: number]: boolean }>({});

  const filteredDishes = menu.filter(m => {
    if (selectedCat === 'all') return true;
    if (selectedCat === 'veg') return m.tags.includes('veg');
    return m.category === selectedCat;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = filteredDishes[currentIndex % (filteredDishes.length || 1)] || menu[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredDishes.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + filteredDishes.length) % filteredDishes.length);
  };

  const toggleFav = (id: number) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenDetail = (dish: MenuItem) => {
    setDetailItem(dish);
    setIsItemDetailOpen(true);
  };

  return (
    <div className="culinary-showcase-container" id="culinary-showcase-view">
      {/* Left Floating Action Rail */}
      <aside className="showcase-rail">
        <button
          className="rail-pill cart-pill"
          onClick={() => setIsCartOpen(true)}
          type="button"
          title="Open Dining Tray"
        >
          <span className="rail-icon">🛒</span>
          <span className="rail-badge">{cartCount}</span>
        </button>

        <div className="rail-nav-group">
          <button
            className={`rail-pill cat-pill ${selectedCat === 'all' ? 'active' : ''}`}
            onClick={() => { setSelectedCat('all'); setCurrentIndex(0); }}
            type="button"
            title="All Meals"
          >
            <span className="rail-icon">🍽️</span>
          </button>
          <button
            className={`rail-pill cat-pill ${selectedCat === 'main' ? 'active' : ''}`}
            onClick={() => { setSelectedCat('main'); setCurrentIndex(0); }}
            type="button"
            title="Main Meals"
          >
            <span className="rail-icon">🍛</span>
          </button>
          <button
            className={`rail-pill cat-pill ${selectedCat === 'snack' ? 'active' : ''}`}
            onClick={() => { setSelectedCat('snack'); setCurrentIndex(0); }}
            type="button"
            title="Snacks"
          >
            <span className="rail-icon">🥟</span>
          </button>
          <button
            className={`rail-pill cat-pill ${selectedCat === 'drink' ? 'active' : ''}`}
            onClick={() => { setSelectedCat('drink'); setCurrentIndex(0); }}
            type="button"
            title="Drinks"
          >
            <span className="rail-icon">🧃</span>
          </button>
          <button
            className={`rail-pill cat-pill ${selectedCat === 'veg' ? 'active' : ''}`}
            onClick={() => { setSelectedCat('veg'); setCurrentIndex(0); }}
            type="button"
            title="Vegetarian"
          >
            <span className="rail-icon">🌱</span>
          </button>
        </div>

        <button
          className="rail-pill user-pill"
          onClick={() => setCurrentPage('profile')}
          type="button"
          title="Student Profile"
        >
          <span className="rail-icon">👤</span>
        </button>
      </aside>

      {/* Side Dishes Selector Column */}
      <div className="showcase-dish-column">
        <div className="showcase-column-title">
          <span>Popular Dishes</span>
          <span className="item-counter">{filteredDishes.length} items</span>
        </div>
        <div className="showcase-dish-list">
          {filteredDishes.map((dish, idx) => {
            const isCurrent = dish.id === featured?.id;
            return (
              <div
                key={dish.id}
                className={`showcase-thumb-card ${isCurrent ? 'selected' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: isCurrent ? 'var(--surface-2)' : 'var(--surface)',
                  border: isCurrent ? '2px solid var(--maroon)' : '1px solid var(--border)',
                  marginBottom: '10px',
                  transition: 'all 0.2s ease',
                  opacity: dish.available ? 1 : 0.6,
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                  <FoodImage src={dish.img} alt={dish.name} emoji={dish.emoji} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dish.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                    <strong style={{ color: 'var(--maroon)' }}>KSh {dish.price}</strong>
                    <span>⭐ {dish.rating}</span>
                  </div>
                </div>
                {!dish.available && (
                  <span style={{ fontSize: '0.72rem', background: 'var(--red-soft)', color: 'var(--red)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    SOLD OUT
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Centerpiece Featured Glassmorphic Card */}
      {featured && (
        <div className="showcase-feature-stage">
          <div className="showcase-feature-card">
            {/* Floating leaf micro-accents */}
            <div className="floating-leaf leaf-top-right">🍃</div>
            <div className="floating-leaf leaf-bottom-left">🌿</div>
            <div className="floating-leaf leaf-far-right">🍃</div>
            <div className="floating-leaf leaf-tiny">🌱</div>

            {/* Top Row: <, Badge, Details */}
            <div className="feature-card-header">
              <button className="feature-round-btn" onClick={handlePrev} type="button" title="Previous Dish">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="feature-dish-badge-pill">
                <span>{featured.badge === 'hot' ? '🔥 Chef Special' : featured.badge === 'new' ? '✨ New Dish' : '⭐ Top Rated'}</span>
              </div>
              <button
                className="feature-round-btn"
                onClick={() => handleOpenDetail(featured)}
                type="button"
                title="View Full Reviews & Details"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="19" cy="12" r="1.5"></circle>
                  <circle cx="5" cy="12" r="1.5"></circle>
                </svg>
              </button>
            </div>

            {/* Big Photographic Dish Plate Hero */}
            <div className="feature-plate-container">
              <div className="feature-plate-shadow"></div>
              <div
                style={{
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto',
                  border: '6px solid rgba(255, 215, 0, 0.45)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <FoodImage src={featured.img} alt={featured.name} emoji={featured.emoji} />
              </div>
              <div className="feature-plate-ring"></div>
            </div>

            {/* Dish Details */}
            <div className="feature-info-section">
              <div className="feature-title-row">
                <h2 className="feature-dish-name">{featured.name}</h2>
                <div className="feature-time-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{featured.prepTime || '15 Mins'}</span>
                </div>
              </div>

              <p className="feature-dish-desc">{featured.desc}</p>

              {/* Nutrition & Rating Meta Strip */}
              <div className="feature-meta-strip">
                <span className="f-meta-item">🔥 {featured.calories} kcal</span>
                <span className="f-meta-item">💪 {featured.protein}g Protein</span>
                <span
                  className="f-meta-item"
                  onClick={() => handleOpenDetail(featured)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view student reviews"
                >
                  ⭐ {featured.rating} ({featured.orders || 30} reviews) 💬
                </span>
              </div>

              {/* Bottom Row: Price + Heart + Add to Cart */}
              <div className="feature-card-footer">
                <div className="feature-price-block">
                  <span className="feature-price-label">Price</span>
                  <span className="feature-price-amount">KSh {featured.price}</span>
                </div>

                <div className="feature-actions-block">
                  <button
                    className={`feature-heart-btn ${favorites[featured.id] ? 'active' : ''}`}
                    onClick={() => toggleFav(featured.id)}
                    type="button"
                    title="Add to favorites"
                    style={{ color: favorites[featured.id] ? 'var(--red)' : 'inherit' }}
                  >
                    <svg viewBox="0 0 24 24" fill={favorites[featured.id] ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" width="20" height="20">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  <button
                    className="feature-add-pill"
                    onClick={() => addToCart(featured.id, 1)}
                    disabled={!featured.available}
                    type="button"
                    style={{ opacity: featured.available ? 1 : 0.6 }}
                  >
                    <span className="pill-text">{featured.available ? 'Add to Tray' : 'Sold Out'}</span>
                    <span className="pill-circle-plus">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
