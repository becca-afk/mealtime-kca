import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';

export const ComradeBudgetOptimizer: React.FC = () => {
  const { menu, addToCart, setIsCartOpen, showToast } = useApp();
  const [budget, setBudget] = useState<number>(120);

  const presets = [
    { label: '🪙 KSh 70 Quick Bite', amount: 70 },
    { label: '🍛 KSh 120 Best Meal', amount: 120 },
    { label: '🍗 KSh 160 Protein Pack', amount: 160 },
    { label: '👑 KSh 220 Feast', amount: 220 },
  ];

  // Algorithmic optimization per SRS Section 4.11
  const combo = useMemo(() => {
    const available = menu.filter(m => m.available && m.price <= budget);

    if (available.length === 0) {
      return { items: [] as MenuItem[], total: 0, calories: 0, protein: 0 };
    }

    if (budget <= 50) {
      const topSingle = [...available].sort((a, b) => b.rating - a.rating)[0];
      return topSingle
        ? { items: [topSingle], total: topSingle.price, calories: topSingle.calories, protein: topSingle.protein }
        : { items: [], total: 0, calories: 0, protein: 0 };
    }

    let bestPair: [MenuItem, MenuItem] | null = null;
    let highestRating = -1;

    for (let i = 0; i < available.length; i++) {
      for (let j = i + 1; j < available.length; j++) {
        const sum = available[i].price + available[j].price;
        if (sum <= budget) {
          const avgScore = (available[i].rating + available[j].rating) / 2;
          if (avgScore > highestRating) {
            highestRating = avgScore;
            bestPair = [available[i], available[j]];
          }
        }
      }
    }

    if (bestPair) {
      const total = bestPair[0].price + bestPair[1].price;
      const calories = bestPair[0].calories + bestPair[1].calories;
      const protein = bestPair[0].protein + bestPair[1].protein;
      return { items: bestPair, total, calories, protein };
    }

    const bestSingle = [...available].sort((a, b) => b.rating - a.rating)[0];
    if (bestSingle) {
      return { items: [bestSingle], total: bestSingle.price, calories: bestSingle.calories, protein: bestSingle.protein };
    }

    return { items: [], total: 0, calories: 0, protein: 0 };
  }, [menu, budget]);

  const handleAddCombo = () => {
    if (combo.items.length === 0) {
      showToast('No meals found under this budget.', 'warning');
      return;
    }
    combo.items.forEach(item => {
      addToCart(item.id, 1);
    });
    showToast(`Added combo: ${combo.items.map(i => i.name).join(' + ')}!`, 'success');
    setIsCartOpen(true);
  };

  return (
    <div className="budget-card" id="budget-optimizer-card">
      <div className="budget-header">
        <div className="budget-title-wrap">
          <span className="budget-icon">💰</span>
          <div>
            <h3>Comrade Budget Optimizer</h3>
            <p>Have an exact pocket budget? Let our algorithm calculate the best meal combo!</p>
          </div>
        </div>
        <div className="budget-amount-box">
          <span className="budget-cur">KSh</span>
          <span className="budget-val">{budget}</span>
        </div>
      </div>

      <div className="budget-slider-wrap">
        <input
          type="range"
          min="30"
          max="300"
          step="10"
          value={budget}
          onChange={e => setBudget(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--maroon)' }}
        />
        <div className="budget-ticks">
          <span>KSh 30 (Chai)</span>
          <span>KSh 100 (Beans+Chapati)</span>
          <span>KSh 180 (Full Lunch)</span>
          <span>KSh 300 (Feast)</span>
        </div>
      </div>

      <div className="budget-presets">
        {presets.map(p => (
          <button
            key={p.amount}
            type="button"
            className={`budget-chip ${budget === p.amount ? 'active' : ''}`}
            onClick={() => setBudget(p.amount)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="combo-result-box">
        <div className="combo-items-preview">
          {combo.items.length === 0 ? (
            <div className="combo-item-chip">
              <span>No meal available under KSh {budget}</span>
            </div>
          ) : (
            combo.items.map(item => (
              <div key={item.id} className="combo-item-chip">
                <span>
                  {item.emoji} {item.name}
                </span>
                <span className="chip-p">KSh {item.price}</span>
              </div>
            ))
          )}
        </div>

        <div className="combo-footer">
          <div className="combo-meta">
            <span className="combo-total-price">
              Total: KSh {combo.total}
              {budget - combo.total > 0 && ` (Saves KSh ${budget - combo.total})`}
            </span>
            <span className="combo-nutrition">
              🔥 {combo.calories} kcal · 💪 {combo.protein}g Protein
            </span>
          </div>

          <button
            className="combo-add-btn"
            onClick={handleAddCombo}
            disabled={combo.items.length === 0}
            type="button"
          >
            <span>Add Combo to Tray</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
