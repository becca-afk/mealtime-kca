import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const FeedbackModal: React.FC = () => {
  const { isFeedbackOpen, setIsFeedbackOpen, feedbackTarget, submitReview } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [emoji, setEmoji] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isFeedbackOpen || !feedbackTarget) return null;

  const emojis = [
    { val: 1, char: '😠', label: 'Poor' },
    { val: 2, char: '😕', label: 'Cold/Salty' },
    { val: 3, char: '😐', label: 'Average' },
    { val: 4, char: '😊', label: 'Tasty' },
    { val: 5, char: '🤩', label: 'Excellent!' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    await submitReview(
      feedbackTarget.orderId,
      feedbackTarget.item.id,
      rating,
      emoji,
      comment
    );
    setLoading(false);
  };

  return (
    <div className="modal-overlay" id="feedback-modal">
      <div className="modal-sheet feedback-sheet">
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div>
            <h3>Rate Your Campus Meal</h3>
            <span className="sub-muted">Student Quality Feedback (SRS Section 4.8)</span>
          </div>
          <button className="modal-close" onClick={() => setIsFeedbackOpen(false)} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="feedback-item-name" style={{ textAlign: 'center', margin: '10px 0', fontSize: '1.1rem', fontWeight: 700 }}>
            {feedbackTarget.item.emoji} {feedbackTarget.item.name}
          </p>

          {/* 1-5 Star Rating */}
          <div className="star-rating" style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '14px 0' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
                style={{
                  fontSize: '2rem',
                  color: star <= rating ? 'var(--gold)' : 'var(--border)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  transform: star === rating ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                ★
              </button>
            ))}
          </div>

          {/* Emoji Reactions */}
          <div className="emoji-reactions" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            {emojis.map(e => (
              <button
                key={e.val}
                type="button"
                className={`emoji-btn ${emoji === e.val ? 'active' : ''}`}
                onClick={() => setEmoji(e.val)}
                title={e.label}
                style={{
                  fontSize: '1.8rem',
                  padding: '6px',
                  borderRadius: '50%',
                  background: emoji === e.val ? 'var(--gold-soft)' : 'none',
                  border: emoji === e.val ? '2px solid var(--gold)' : '2px solid transparent',
                  cursor: 'pointer',
                  transform: emoji === e.val ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                }}
              >
                {e.char}
              </button>
            ))}
          </div>

          {/* Mandatory Text Comment per SRS Section 4.8 */}
          <textarea
            className="feedback-textarea"
            placeholder="How was the portion size, temperature, or flavour? Your review directly impacts cafeteria ratings! (Mandatory per SRS 4.8)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.88rem',
              resize: 'none',
            }}
          />

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '6px 0 14px' }}>
            🔒 Note: Your review will be published with an anonymized Reg No (e.g. 2502***) to protect student privacy.
          </p>

          <button
            className="feedback-submit-btn"
            type="submit"
            disabled={loading || !comment.trim()}
            style={{ width: '100%', opacity: !comment.trim() ? 0.6 : 1 }}
          >
            <span>{loading ? 'Submitting…' : 'Submit Review & Earn +5 Points'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
