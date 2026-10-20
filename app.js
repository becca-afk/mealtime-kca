/* ============================================================
   MEALTIME — KCA UNIVERSITY FULL-STACK LOGIC
   Featuring:
   - Real Backend REST API sync (Express /api/*)
   - Student Reg No (e.g. 2502692) & KCA Email Authentication
   - Comrade Budget Builder (Smart Meal Optimizer)
   - Kitchen Display System (KDS) Live Order Dispatching
   - Realistic Safaricom M-Pesa STK Push Simulation
   - Digital KCA University Student SmartCard Meal Wallet
   - Web Audio API Order Ready Chime
   - Dynamic QR Code Pickup Pass
   - Dietary Badges (Halal, Veg, Calories, Protein)
   ============================================================ */

// API Base URL (Relative if served via Node Express, or localhost if testing)
const API_BASE = window.location.protocol.startsWith('http') ? '' : 'http://localhost:3000';

// ===== DATA SEED (FALLBACK & INITIAL STATE) =====
let MENU_ITEMS = [
  { id: 101, name: 'Eggs Curry', subname: 'Chef special healthy', emoji: '🍳', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80', price: 150, calories: 420, protein: 24, rating: 4.8, soldCount: 38, category: 'main', tags: ['halal'], allergen: 'Egg', desc: 'Healthy eggs curry with tomato and cucumber.', prepTime: '25 Mins', available: true, badge: 'hot' },
  { id: 102, name: 'Chicken Slice', subname: 'Real chicken & garden salad', emoji: '🥗', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80', price: 180, calories: 510, protein: 30, rating: 4.7, soldCount: 29, category: 'main', tags: ['halal'], allergen: 'None', desc: 'Lean chicken plate with greens.', prepTime: '20 Mins', available: true, badge: 'new' },
  { id: 1,  name: 'Beef Stew + Ugali', subname: 'Slow-cooked hearty beef', emoji: '🍛', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80', price: 120, calories: 650, protein: 32, rating: 4.6, soldCount: 34, category: 'main', tags: ['halal', 'spicy'], allergen: 'None', desc: 'Slow-cooked beef stew served with ugali and greens.', prepTime: '18 Mins', available: true, badge: 'hot' },
  { id: 2,  name: 'Pilau + Kachumbari', subname: 'Coastal spiced beef pilau', emoji: '🍚', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80', price: 150, calories: 580, protein: 22, rating: 4.4, soldCount: 28, category: 'main', tags: ['halal'], allergen: 'None', desc: 'Fragrant pilau rice with fresh kachumbari salad.', prepTime: '22 Mins', available: true },
  { id: 12, name: 'Fried Chicken + Chips', subname: 'Crispy fried chicken & fries', emoji: '🍗', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&auto=format&fit=crop&q=80', price: 220, calories: 780, protein: 42, rating: 4.8, soldCount: 50, category: 'main', tags: ['halal'], allergen: 'Gluten', desc: 'Crispy chicken and golden fries for hearty campus energy.', prepTime: '15 Mins', available: true, badge: 'hot' },
  { id: 5,  name: 'Chicken Burger', subname: 'Crispy fillet burger', emoji: '🍔', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80', price: 200, calories: 620, protein: 35, rating: 4.7, soldCount: 41, category: 'snack', tags: ['halal'], allergen: 'Gluten', desc: 'Crispy fried chicken burger with lettuce and sauce.', prepTime: '12 Mins', available: true },
  { id: 6,  name: 'Chapati + Beans', subname: 'Layered chapati & yellow beans', emoji: '🫓', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&auto=format&fit=crop&q=80', price: 60, calories: 480, protein: 18, rating: 4.3, soldCount: 22, category: 'main', tags: ['veg'], allergen: 'Gluten', desc: 'Soft chapati and well-seasoned beans, a classic budget favorite.', prepTime: '10 Mins', available: true },
  { id: 9,  name: 'Beef Samosa (2 pcs)', subname: 'Crunchy golden pastry', emoji: '🥟', img: 'https://images.unsplash.com/photo-1601050690186-b48ff085ca88?w=700&auto=format&fit=crop&q=80', price: 40, calories: 260, protein: 12, rating: 4.3, soldCount: 38, category: 'snack', tags: ['halal'], allergen: 'Gluten', desc: 'Crisp golden pastry stuffed with seasoned beef.', prepTime: '8 Mins', available: true },
  { id: 3,  name: 'Mandazi (3 pcs)', subname: 'Fresh morning batch', emoji: '🥐', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&auto=format&fit=crop&q=80', price: 30, calories: 320, protein: 6, rating: 4.1, soldCount: 55, category: 'snack', tags: ['veg'], allergen: 'Gluten', desc: 'Soft, sweet mandazi made fresh in small batches.', prepTime: '7 Mins', available: true },
  { id: 4,  name: 'Githeri Special', subname: 'Boiled maize & beans', emoji: '🫘', img: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&auto=format&fit=crop&q=80', price: 80, calories: 460, protein: 24, rating: 3.8, soldCount: 18, category: 'main', tags: ['veg', 'halal'], allergen: 'None', desc: 'Simple, hearty githeri with maize and beans.', prepTime: '12 Mins', available: true },
  { id: 14, name: 'Tilapia Fish + Ugali', subname: 'Pan-fried whole fish', emoji: '🐟', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&auto=format&fit=crop&q=80', price: 140, calories: 590, protein: 38, rating: 4.1, soldCount: 15, category: 'main', tags: ['halal'], allergen: 'Fish', desc: 'Pan-fried tilapia with ugali and a side greens.', prepTime: '18 Mins', available: true },
  { id: 11, name: 'Fresh Mango Juice', subname: '100% natural pressed', emoji: '🧃', img: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=700&auto=format&fit=crop&q=80', price: 60, calories: 180, protein: 2, rating: 4.5, soldCount: 25, category: 'drink', tags: ['veg'], allergen: 'None', desc: 'Cool mango juice with a burst of tropical flavor.', prepTime: '5 Mins', available: true },
  { id: 13, name: 'Masala Spiced Chai', subname: 'Brewed ginger & cardamom', emoji: '☕', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80', price: 30, calories: 120, protein: 4, rating: 4.4, soldCount: 60, category: 'drink', tags: ['veg'], allergen: 'Dairy', desc: 'Warm masala chai with ginger and cardamom spice.', prepTime: '6 Mins', available: true },
  { id: 7,  name: 'Maziwa Mala (500ml)', subname: 'Cultured probiotic milk', emoji: '🥛', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80', price: 40, calories: 280, protein: 16, rating: 4.0, soldCount: 30, category: 'drink', tags: ['veg'], allergen: 'Dairy', desc: 'Fresh cultured milk, smooth and cooling.', prepTime: '4 Mins', available: true },
  { id: 8,  name: 'Soda (500ml)', subname: 'Cold soft drink', emoji: '🥤', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=700&auto=format&fit=crop&q=80', price: 50, calories: 210, protein: 0, rating: 3.9, soldCount: 45, category: 'drink', tags: [], allergen: 'None', desc: 'Cold soft drink to cool down after class.', prepTime: '3 Mins', available: true },
  { id: 10, name: 'Sukuma Wiki + Rice', subname: 'Collard greens & rice', emoji: '🍃', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80', price: 90, calories: 410, protein: 11, rating: 4.0, soldCount: 20, category: 'main', tags: ['veg', 'halal'], allergen: 'None', desc: 'Nutritious sukuma wiki and rice bowl.', prepTime: '14 Mins', available: true },
  { id: 16, name: 'Ndengu Special + Rice', subname: 'Green grams coconut curry', emoji: '🍲', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&auto=format&fit=crop&q=80', price: 80, calories: 450, protein: 21, rating: 4.3, soldCount: 29, category: 'main', tags: ['veg', 'halal'], allergen: 'None', desc: 'Comforting ndengu and rice with a coconut finish.', prepTime: '17 Mins', available: true },
  { id: 18, name: 'Egg Sandwich Toast', subname: 'Toasted fried egg sandwich', emoji: '🍳', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80', price: 50, calories: 310, protein: 14, rating: 4.0, soldCount: 18, category: 'snack', tags: ['veg'], allergen: 'Egg', desc: 'Toasted sandwich with egg for a quick, filling bite.', prepTime: '9 Mins', available: true }
];

// App State
let currentUser = {
  regNo: '2502692',
  name: 'James Mwangi',
  email: '2502692@students.kcau.ac.ke',
  department: 'School of Technology (BIT)',
  walletBalance: 850
};

let currentRole = 'student';
let activeLoginRole = 'student';
let cart = {};
let allOrders = [];
let activeOrder = null;
let currentBudget = 120;
let currentKdsFilter = 'all';
let currentStkPin = '';
let pendingOrderPayload = null;
let isAudioEnabled = true;

// DOM Helper
const $ = id => document.getElementById(id);

// ============================================================
// 3. COMRADE BUDGET BUILDER (SMART MEAL OPTIMIZER)
// ============================================================
function initBudgetOptimizer() {
  const range = $('budget-range');
  const valDisplay = $('budget-slider-val');
  const presetChips = document.querySelectorAll('.budget-chip');
  const addComboBtn = $('combo-add-btn');

  range?.addEventListener('input', e => {
    currentBudget = parseInt(e.target.value, 10);
    valDisplay.textContent = currentBudget;
    recalculateCombo(currentBudget);
    presetChips.forEach(c => c.classList.remove('active'));
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const b = parseInt(chip.getAttribute('data-budget'), 10);
      currentBudget = b;
      range.value = b;
      valDisplay.textContent = b;
      recalculateCombo(b);
    });
  });

  addComboBtn?.addEventListener('click', () => {
    const combo = calculateBestCombo(currentBudget);
    if (!combo.items.length) {
      showToast('No meals found under this budget.', 'warning');
      return;
    }

    combo.items.forEach(item => {
      cart[item.id] = (cart[item.id] || 0) + 1;
    });

    updateCartUI();
    showToast(`Added ${combo.items.map(i => i.name).join(' + ')} to your tray!`, 'success');
    openCartModal();
  });

  recalculateCombo(120);
}

function calculateBestCombo(budget) {
  const available = MENU_ITEMS.filter(m => (m.available ?? true) && m.price <= budget);

  if (!available.length) {
    return { items: [], total: 0, calories: 0, protein: 0 };
  }

  if (budget <= 50) {
    const item = [...available].sort((a, b) => b.rating - a.rating)[0];
    return item ? { items: [item], total: item.price, calories: item.calories, protein: item.protein } : { items: [], total: 0, calories: 0, protein: 0 };
  }

  let bestPair = null;
  let highestRating = -1;

  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      const sum = available[i].price + available[j].price;
      if (sum <= budget) {
        const combinedScore = (available[i].rating + available[j].rating) / 2;
        if (combinedScore > highestRating) {
          highestRating = combinedScore;
          bestPair = [available[i], available[j]];
        }
      }
    }
  }

  if (bestPair) {
    const total = bestPair.reduce((a, b) => a + b.price, 0);
    const calories = bestPair.reduce((a, b) => a + b.calories, 0);
    const protein = bestPair.reduce((a, b) => a + b.protein, 0);
    return { items: bestPair, total, calories, protein };
  }

  const bestSingle = [...available].sort((a, b) => b.rating - a.rating)[0];
  if (bestSingle) {
    return { items: [bestSingle], total: bestSingle.price, calories: bestSingle.calories, protein: bestSingle.protein };
  }

  return { items: [], total: 0, calories: 0, protein: 0 };
}

function recalculateCombo(budget) {
  const container = $('combo-items-preview');
  const combo = calculateBestCombo(budget);

  if (!combo.items.length) {
    container.innerHTML = `<div class="combo-item-chip"><span>No combo available under KSh ${budget}</span></div>`;
    $('combo-total-price').textContent = `Total: KSh 0`;
    $('combo-nutrition').textContent = `0 kcal · 0g Protein`;
    return;
  }

  container.innerHTML = combo.items.map(item => `
    <div class="combo-item-chip">
      <span>${item.emoji} ${item.name}</span>
      <span class="chip-p">KSh ${item.price}</span>
    </div>
  `).join('');

  $('combo-total-price').textContent = `Total: KSh ${combo.total} (Saves KSh ${budget - combo.total})`;
  $('combo-nutrition').textContent = `🔥 ${combo.calories} kcal · 💪 ${combo.protein}g Protein`;
}

