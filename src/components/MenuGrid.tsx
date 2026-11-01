import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodImage } from './common/FoodImage';
import { ChefShowcase } from './ChefShowcase';
import { MenuItem, ProductCategory } from '../types';

export const MenuGrid: React.FC = () => {
  const {
    menu,
    addToCart,
    setDetailItem,
    setIsItemDetailOpen,
    role,
    toggleItemAvailability,
  } = useApp();

  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'protein-desc' | 'popular'>('rating');

  // Filter & Search
  const filtered = menu.filter(item => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.desc.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    // Category
    if (category === 'all') return true;
    if (category === 'veg') return item.tags.includes('veg');
    if (category === 'halal') return item.tags.includes('halal');
    return item.category === category;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'protein-desc') return b.protein - a.protein;
    if (sortBy === 'popular') return (b.soldCount || 0) - (a.soldCount || 0);
    return 0;
  });

  const handleOpenDetail = (item: MenuItem) => {
    setDetailItem(item);
    setIsItemDetailOpen(true);
  };

  return (
    <section id="page-menu" className="page active" style={{ display: 'block' }}>
      {/* View Mode Switcher Header */}
      <div className="menu-showcase-header">
        <div className="view-mode-pill-wrap">
          <button
            className={`view-mode-pill ${viewMode === 'showcase' ? 'active' : ''}`}
            onClick={() => setViewMode('showcase')}
            type="button"
          >
            <span>✨ Chef Showcase</span>
          </button>
          <button
            className={`view-mode-pill ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            type="button"
          >
            <span>📋 All Dishes Grid</span>
          </button>
        </div>

        <div className="showcase-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search campus meals, snacks, drinks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {viewMode === 'showcase' && !search.trim() ? (
        <ChefShowcase />
      ) : (
        <div className="classic-grid-view">
          {/* Category Filter Chips */}
          <div className="filter-strip" id="filter-strip">
            <button
              className={`filter-btn ${category === 'all' ? 'active' : ''}`}
              onClick={() => setCategory('all')}
              type="button"
            >
              All Items
            </button>
            <button
              className={`filter-btn ${category === 'main' ? 'active' : ''}`}
              onClick={() => setCategory('main')}
              type="button"
            >
              🍛 Main Meals
            </button>
            <button
              className={`filter-btn ${category === 'snack' ? 'active' : ''}`}
              onClick={() => setCategory('snack')}
              type="button"
            >
              🥟 Snacks
            </button>
            <button
              className={`filter-btn ${category === 'drink' ? 'active' : ''}`}
              onClick={() => setCategory('drink')}
              type="button"
            >
              🧃 Drinks
            </button>
            <button
              className={`filter-btn ${category === 'veg' ? 'active' : ''}`}
              onClick={() => setCategory('veg')}
              type="button"
            >
              🌱 Vegetarian
            </button>
            <button
              className={`filter-btn ${category === 'halal' ? 'active' : ''}`}
              onClick={() => setCategory('halal')}
              type="button"
            >
              ☪ Halal Certified
            </button>
          </div>

          {/* Sort selector bar */}
          <div className="sort-row">
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="rating">Highest Rated ⭐</option>
              <option value="price-asc">Price: Low → High 💰</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="protein-desc">Highest Protein (g) 💪</option>
              <option value="popular">Most Ordered 🔥</option>
            </select>
            <span className="menu-count">{sorted.length} dishes available</span>
          </div>

          {/* Dishes Grid */}
          <div className="menu-grid" id="full-menu-grid">
            {sorted.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🍽️ No matching dishes found</p>
                <p style={{ fontSize: '0.9rem' }}>Try clearing your search term or picking another category filter.</p>
              </div>
            ) : (
              sorted.map(item => (
                <div
                  key={item.id}
                  className="menu-item-card"
                  style={{
                    position: 'relative',
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: item.available ? 1 : 0.65,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Photo container with FoodImage */}
                  <div
                    style={{ position: 'relative', width: '100%', height: '180px', cursor: 'pointer' }}
                    onClick={() => handleOpenDetail(item)}
                  >
                    <FoodImage src={item.img} alt={item.name} emoji={item.emoji} />

                    {/* Badge */}
                    {item.badge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: item.badge === 'hot' ? 'var(--maroon)' : 'var(--gold)',
                          color: item.badge === 'hot' ? '#FFF' : '#1C1410',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          zIndex: 3,
                        }}
                      >
                        {item.badge === 'hot' ? '🔥 Hot' : '✨ New'}
                      </span>
                    )}

                    {!item.available && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.55)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                          fontWeight: 800,
                          fontSize: '1rem',
                          letterSpacing: '0.05em',
                          zIndex: 4,
                        }}
                      >
                        SOLD OUT
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--text)',
                          lineHeight: 1.3,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleOpenDetail(item)}
                      >
                        {item.name}
                      </h4>
                      <span
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: 'var(--maroon)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        KSh {item.price}
                      </span>
                    </div>

                    {item.subname && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.subname}
                      </p>
                    )}

                    {/* Dietary Tags & Allergens */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                      {item.tags.includes('halal') && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 200, 83, 0.12)', color: 'var(--green)', fontWeight: 600 }}>
                          ☪ Halal
                        </span>
                      )}
                      {item.tags.includes('veg') && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 200, 83, 0.12)', color: 'var(--green)', fontWeight: 600 }}>
                          🌱 Veg
                        </span>
                      )}
                      {item.allergens && item.allergens !== 'None' && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 23, 68, 0.1)', color: 'var(--red)', fontWeight: 600 }}>
                          ⚠️ {item.allergens}
                        </span>
                      )}
                    </div>

                    {/* Nutrition Strip */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginTop: '10px',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '8px',
                      }}
                    >
                      <span>🔥 {item.calories} kcal</span>
                      <span>💪 {item.protein}g Protein</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text)' }}>
                        ⭐ {item.rating}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => addToCart(item.id, 1)}
                        disabled={!item.available}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: item.available ? 'var(--maroon)' : 'var(--surface-3)',
                          color: item.available ? '#FFF' : 'var(--text-faint)',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          cursor: item.available ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: item.available ? 'var(--shadow-sm)' : 'none',
                        }}
                      >
                        <span>{item.available ? '+ Add to Tray' : 'Unavailable'}</span>
                      </button>

                      {/* Staff & Admin Inventory Toggle button */}
                      {(role === 'staff' || role === 'admin') && (
                        <button
                          type="button"
                          onClick={() => toggleItemAvailability(item.id)}
                          title="Toggle Available vs Sold Out (Kitchen Inventory Control)"
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: item.available ? 'rgba(255, 23, 68, 0.1)' : 'rgba(0, 200, 83, 0.15)',
                            color: item.available ? 'var(--red)' : 'var(--green)',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        >
                          {item.available ? 'Mark Sold Out' : 'Mark In Stock'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <div className="nav-clearance-spacer"></div>
    </section>
  );
};
