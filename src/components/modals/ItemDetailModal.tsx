import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodImage } from '../common/FoodImage';

export const ItemDetailModal: React.FC = () => {
  const {
    isItemDetailOpen,
    setIsItemDetailOpen,
    detailItem,
    addToCart,
    feedbacks,
    setFeedbackTarget,
    setIsFeedbackOpen,
  } = useApp();

  const [qty, setQty] = useState(1);

  if (!isItemDetailOpen || !detailItem) return null;

  const itemReviews = feedbacks.filter(f => f.itemId === detailItem.id);

  const handleAdd = () => {
    addToCart(detailItem.id, qty);
    setIsItemDetailOpen(false);
    setQty(1);
  };

  const handleOpenReview = () => {
    setFeedbackTarget({ item: detailItem });
    setIsItemDetailOpen(false);
    setIsFeedbackOpen(true);
  };

  return (
    <div className="modal-overlay" id="item-modal">
      <div className="modal-sheet item-sheet" style={{ maxWidth: '480px' }}>
        <div className="modal-handle"></div>
        <button
          className="modal-close item-close"
          onClick={() => {
            setIsItemDetailOpen(false);
            setQty(1);
          }}
          type="button"
        >
          ✕
        </button>

        {/* Food Image */}
        <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', margin: '6px 0 14px' }}>
          <FoodImage src={detailItem.img} alt={detailItem.name} emoji={detailItem.emoji} />
        </div>

        <div className="item-detail-body">
          <div className="item-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{detailItem.name}</h3>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--maroon)' }}>
              KSh {detailItem.price}
            </span>
          </div>

          {detailItem.subname && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {detailItem.subname}
            </p>
          )}

          {/* Meta chips */}
          <div className="item-detail-meta" style={{ display: 'flex', gap: '8px', margin: '10px 0', flexWrap: 'wrap' }}>
            <span className="rating-chip">⭐ {detailItem.rating}</span>
            <span className="orders-chip">🔥 {detailItem.orders || detailItem.soldCount || 30} ordered</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: detailItem.available ? 'rgba(0, 200, 83, 0.12)' : 'rgba(255, 23, 68, 0.1)',
                color: detailItem.available ? 'var(--green)' : 'var(--red)',
                fontWeight: 700,
              }}
            >
              {detailItem.available ? 'In Stock 🟢' : 'Sold Out 🔴'}
            </span>
          </div>

          {/* Nutritional Data */}
          <div className="item-nutrition-chips" style={{ display: 'flex', gap: '8px', margin: '10px 0' }}>
            <span className="nutri-pill">🔥 <strong>{detailItem.calories}</strong> kcal</span>
            <span className="nutri-pill">💪 <strong>{detailItem.protein}</strong>g Protein</span>
            {detailItem.prepTime && <span className="nutri-pill">⏱️ <strong>{detailItem.prepTime}</strong></span>}
          </div>

          <p className="item-detail-desc" style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5, margin: '10px 0' }}>
            {detailItem.desc}
          </p>

          {/* Dietary Tags & Allergens */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
            {detailItem.tags.map(t => (
              <span key={t} style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', background: 'var(--surface-3)', fontWeight: 600 }}>
                #{t}
              </span>
            ))}
            {detailItem.allergens && detailItem.allergens !== 'None' && (
              <span style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 23, 68, 0.1)', color: 'var(--red)', fontWeight: 600 }}>
                ⚠️ Allergen: {detailItem.allergens}
              </span>
            )}
          </div>

          {/* Public Reviews Section per SRS Section 4.8 */}
          <div
            style={{
              margin: '16px 0',
              borderTop: '1px solid var(--border)',
              paddingTop: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                Comrade Reviews ({itemReviews.length})
              </h4>
              <button
                type="button"
                onClick={handleOpenReview}
                style={{ fontSize: '0.78rem', color: 'var(--maroon-mid)', fontWeight: 700, textDecoration: 'underline' }}
              >
                + Write Review
              </button>
            </div>

            {itemReviews.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first comrade to rate this dish!
              </p>
            ) : (
              itemReviews.slice(0, 3).map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--surface-2)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong>Student {r.studentName || `${r.regNo.slice(0, 4)}***`}</strong>
                    <span style={{ color: 'var(--gold)' }}>{'★'.repeat(r.rating)}</span>
                  </div>
                  <p style={{ color: 'var(--text)', fontStyle: 'italic', margin: 0 }}>
                    &quot;{r.comment}&quot;
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Qty & Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px' }}>
            <div className="qty-row" style={{ margin: 0 }}>
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} type="button">
                −
              </button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)} type="button">
                +
              </button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={handleAdd}
              disabled={!detailItem.available}
              type="button"
              style={{ flex: 1, margin: 0, opacity: detailItem.available ? 1 : 0.6 }}
            >
              <span>{detailItem.available ? `Add to Tray — KSh ${(detailItem.price * qty).toLocaleString()}` : 'Sold Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
