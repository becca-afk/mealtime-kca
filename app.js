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

const API_BASE =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : '';

let MENU_ITEMS = [
  { id: 101, name: 'Eggs Curry', subname: 'Chef special healthy', emoji: '🍳', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80', price: 150, calories: 420, protein: 24, rating: 4.8, soldCount: 38, category: 'main', tags: ['halal'], allergen: 'Egg', desc: 'Healthy eggs curry with tomato and cucumber.', prepTime: '25 Mins', available: true, badge: 'hot' },
  { id: 102, name: 'Chicken Slice', subname: 'Real chicken & garden salad', emoji: '🥗', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80', price: 180, calories: 510, protein: 30, rating: 4.7, soldCount: 29, category: 'main', tags: ['halal'], allergen: 'None', desc: 'Lean chicken plate with greens.', prepTime: '20 Mins', available: true, badge: 'new' },
  { id: 1, name: 'Beef Stew + Ugali', subname: 'Slow-cooked hearty beef', emoji: '🍛', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80', price: 120, calories: 650, protein: 32, rating: 4.6, soldCount: 34, category: 'main', tags: ['halal', 'spicy'], allergen: 'None', desc: 'Slow-cooked beef stew served with ugali and greens.', prepTime: '18 Mins', available: true, badge: 'hot' },
  { id: 2, name: 'Pilau + Kachumbari', subname: 'Coastal spiced beef pilau', emoji: '🍚', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80', price: 150, calories: 580, protein: 22, rating: 4.4, soldCount: 28, category: 'main', tags: ['halal'], allergen: 'None', desc: 'Fragrant pilau rice with fresh kachumbari salad.', prepTime: '22 Mins', available: true },
  { id: 12, name: 'Fried Chicken + Chips', subname: 'Crispy fried chicken & fries', emoji: '🍗', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&auto=format&fit=crop&q=80', price: 220, calories: 780, protein: 42, rating: 4.8, soldCount: 50, category: 'main', tags: ['halal'], allergen: 'Gluten', desc: 'Crispy chicken and golden fries for hearty campus energy.', prepTime: '15 Mins', available: true, badge: 'hot' },
  { id: 5, name: 'Chicken Burger', subname: 'Crispy fillet burger', emoji: '🍔', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80', price: 200, calories: 620, protein: 35, rating: 4.7, soldCount: 41, category: 'snack', tags: ['halal'], allergen: 'Gluten', desc: 'Crispy fried chicken burger with lettuce and sauce.', prepTime: '12 Mins', available: true },
  { id: 6, name: 'Chapati + Beans', subname: 'Layered chapati & yellow beans', emoji: '🫓', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&auto=format&fit=crop&q=80', price: 60, calories: 480, protein: 18, rating: 4.3, soldCount: 22, category: 'main', tags: ['veg'], allergen: 'Gluten', desc: 'Soft chapati and well-seasoned beans, a classic budget favorite.', prepTime: '10 Mins', available: true },
  { id: 9, name: 'Beef Samosa (2 pcs)', subname: 'Crunchy golden pastry', emoji: '🥟', img: 'https://images.unsplash.com/photo-1601050690186-b48ff085ca88?w=700&auto=format&fit=crop&q=80', price: 40, calories: 260, protein: 12, rating: 4.3, soldCount: 38, category: 'snack', tags: ['halal'], allergen: 'Gluten', desc: 'Crisp golden pastry stuffed with seasoned beef.', prepTime: '8 Mins', available: true },
  { id: 3, name: 'Mandazi (3 pcs)', subname: 'Fresh morning batch', emoji: '🥐', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&auto=format&fit=crop&q=80', price: 30, calories: 320, protein: 6, rating: 4.1, soldCount: 55, category: 'snack', tags: ['veg'], allergen: 'Gluten', desc: 'Soft, sweet mandazi made fresh in small batches.', prepTime: '7 Mins', available: true },
  { id: 4, name: 'Githeri Special', subname: 'Boiled maize & beans', emoji: '🫘', img: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&auto=format&fit=crop&q=80', price: 80, calories: 460, protein: 24, rating: 3.8, soldCount: 18, category: 'main', tags: ['veg', 'halal'], allergen: 'None', desc: 'Simple, hearty githeri with maize and beans.', prepTime: '12 Mins', available: true },
  { id: 14, name: 'Tilapia Fish + Ugali', subname: 'Pan-fried whole fish', emoji: '🐟', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&auto=format&fit=crop&q=80', price: 140, calories: 590, protein: 38, rating: 4.1, soldCount: 15, category: 'main', tags: ['halal'], allergen: 'Fish', desc: 'Pan-fried tilapia with ugali and a side greens.', prepTime: '18 Mins', available: true },
  { id: 11, name: 'Fresh Mango Juice', subname: '100% natural pressed', emoji: '🧃', img: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=700&auto=format&fit=crop&q=80', price: 60, calories: 180, protein: 2, rating: 4.5, soldCount: 25, category: 'drink', tags: ['veg'], allergen: 'None', desc: 'Cool mango juice with a burst of tropical flavor.', prepTime: '5 Mins', available: true },
  { id: 13, name: 'Masala Spiced Chai', subname: 'Brewed ginger & cardamom', emoji: '☕', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80', price: 30, calories: 120, protein: 4, rating: 4.4, soldCount: 60, category: 'drink', tags: ['veg'], allergen: 'Dairy', desc: 'Warm masala chai with ginger and cardamom spice.', prepTime: '6 Mins', available: true },
  { id: 7, name: 'Maziwa Mala (500ml)', subname: 'Cultured probiotic milk', emoji: '🥛', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80', price: 40, calories: 280, protein: 16, rating: 4.0, soldCount: 30, category: 'drink', tags: ['veg'], allergen: 'Dairy', desc: 'Fresh cultured milk, smooth and cooling.', prepTime: '4 Mins', available: true },
  { id: 8, name: 'Soda (500ml)', subname: 'Cold soft drink', emoji: '🥤', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=700&auto=format&fit=crop&q=80', price: 50, calories: 210, protein: 0, rating: 3.9, soldCount: 45, category: 'drink', tags: [], allergen: 'None', desc: 'Cold soft drink to cool down after class.', prepTime: '3 Mins', available: true },
  { id: 10, name: 'Sukuma Wiki + Rice', subname: 'Collard greens & rice', emoji: '🍃', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80', price: 90, calories: 410, protein: 11, rating: 4.0, soldCount: 20, category: 'main', tags: ['veg', 'halal'], allergen: 'None', desc: 'Nutritious sukuma wiki and rice bowl.', prepTime: '14 Mins', available: true },
  { id: 16, name: 'Ndengu Special + Rice', subname: 'Green grams coconut curry', emoji: '🍲', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&auto=format&fit=crop&q=80', price: 80, calories: 450, protein: 21, rating: 4.3, soldCount: 29, category: 'main', tags: ['veg', 'halal'], allergen: 'None', desc: 'Comforting ndengu and rice with a coconut finish.', prepTime: '17 Mins', available: true },
  { id: 18, name: 'Egg Sandwich Toast', subname: 'Toasted fried egg sandwich', emoji: '🍳', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80', price: 50, calories: 310, protein: 14, rating: 4.0, soldCount: 18, category: 'snack', tags: ['veg'], allergen: 'Egg', desc: 'Toasted sandwich with egg for a quick, filling bite.', prepTime: '9 Mins', available: true }
];

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

const $ = id => document.getElementById(id);

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker Registration Failed!', err));
  }

  initLogin();
  initNotifications();
  initBudgetOptimizer();
  initNavigation();
  initCulinaryShowcase();
  initCart();
  initPaymentAndStk();
  initWalletTopup();
  initKdsSystem();
  initFeedbackModal();
  initQrModal();
  initThemeAndSettings();

  const resumeAudio = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
    }
    document.removeEventListener('click', resumeAudio);
    document.removeEventListener('keydown', resumeAudio);
  };
  document.addEventListener('click', resumeAudio);
  document.addEventListener('keydown', resumeAudio);

  const splash = $('splash-screen');
  const login = $('login-screen');

  if (splash) splash.style.display = 'none';
  if (login) login.classList.remove('hidden');

  try {
    await fetchCafeteriaStatus();
    await fetchMenuItems();
    await fetchOrders();
    await fetchDashboard();
  } catch (err) {
    console.warn('Backend offline, using seed data');
  }

  setInterval(fetchCafeteriaStatus, 4000);
  setInterval(fetchOrders, 4000);
  setInterval(fetchDashboard, 5000);
});

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
      if (!item || !item.id) return;
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

async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`Expected JSON but got ${contentType}: ${text.slice(0, 120)}`);
    }
    const data = await res.json();
    if (Array.isArray(data.orders)) {
      allOrders = data.orders;
      renderKdsBoard();
      const revenueText = $('kds-revenue');
      if (revenueText) revenueText.textContent = `KSh ${Number(data.revenue || 0).toLocaleString()}`;
      const profitText = $('kds-profit');
      if (profitText) profitText.textContent = `KSh ${Number(data.profit || 0).toLocaleString()}`;
    }
  } catch (err) {
    console.warn('Could not load dashboard:', err);
  }
}

async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`Expected JSON but got ${contentType}: ${text.slice(0, 120)}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      allOrders = data;
      const myActive = data.find(o => o.regNo === currentUser.regNo && (o.status === 'placed' || o.status === 'preparing' || o.status === 'ready'));
      if (myActive) {
        const oldStatus = activeOrder ? activeOrder.status : null;
        activeOrder = myActive;

        if (oldStatus && oldStatus !== myActive.status) {
          const statusMessages = {
            preparing: 'Your order is now being prepared! 🍳',
            ready: 'Order Ready! Please collect at Counter A 🍕',
            picked_up: 'Enjoy your meal! 😋'
          };
          const msg = statusMessages[myActive.status];
          if (msg) {
            sendNotification('Order Update', msg, myActive.status === 'ready' ? 'success' : 'info');
          }
        }

        if (myActive.status === 'ready' && (!oldStatus || oldStatus !== 'ready')) {
          playReadyChime();
        }
      }
      renderActiveOrderBanner();
      renderOrdersList();
      renderKdsBoard();
    }
  } catch (err) {
    console.warn('Could not fetch orders:', err);
  }
}

async function executeOrderPlacement(payload) {
  try {
    let orderData;
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          line: 'Counter B'
        })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Expected JSON but got ${contentType}: ${text.slice(0, 120)}`);
      }
      orderData = await res.json();
    } catch (e) {
      const mockOrder = {
        id: `KCA-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        ticketNo: `#KCA-${Math.floor(100 + Math.random() * 900)}`,
        regNo: payload.regNo,
        studentName: payload.studentName,
        items: payload.items,
        total: payload.items.reduce((a, b) => a + (b.price * b.qty), 0) + 5,
        status: 'placed',
        createdAt: new Date().toISOString(),
        line: 'Counter B',
        payMethod: payload.payMethod,
        paymentStatus: 'paid'
      };
      orderData = { success: true, order: mockOrder };
    }

    if (orderData.success) {
      closeCartModal();
      cart = {};
      updateCartUI();

      if (payload.payMethod === 'kca_wallet' && orderData.walletBalance !== null) {
        updateWalletDisplay(orderData.walletBalance);
      }

      showToast(`🎉 Order Placed Successfully! Ticket ${orderData.order.ticketNo}`, 'success');
      activeOrder = orderData.order;

      const existingIdx = allOrders.findIndex(o => o.id === orderData.order.id);
      if (existingIdx >= 0) {
        allOrders[existingIdx] = orderData.order;
      } else {
        allOrders.unshift(orderData.order);
      }
      try {
        localStorage.setItem('mealtime_orders', JSON.stringify(allOrders));
      } catch (e) {}

      renderActiveOrderBanner();
      renderOrdersList();
      renderKdsBoard();
      switchPage('home');
      fetchOrders();
      fetchDashboard();
    }
  } catch (err) {
    showToast('Failed to place order. Please try again.', 'error');
  }
}

function renderKdsBoard() {
  const container = $('kds-tickets-container');
  if (!container) return;

  let list = [...allOrders];
  if (currentKdsFilter !== 'all') {
    list = list.filter(o => o.status === currentKdsFilter);
  }

  const placedCount = allOrders.filter(o => o.status === 'placed').length;
  const cookingCount = allOrders.filter(o => o.status === 'preparing').length;
  const readyCount = allOrders.filter(o => o.status === 'ready').length;

  $('kds-count-new').textContent = placedCount;
  $('kds-count-cooking').textContent = cookingCount;
  $('kds-count-ready').textContent = readyCount;

  if (!list.length) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
        <p>👨‍🍳 No active orders in this filter right now.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(order => {
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const timeDisplay = isNaN(elapsedMinutes) ? 'Just now' : `${elapsedMinutes}m ago`;

    let actionBtnHTML = '';
    if (order.status === 'placed') {
      actionBtnHTML = `<button class="kds-action-btn start" onclick="updateOrderStatus('${order.id}', 'preparing')">🔥 Start Cooking</button>`;
    } else if (order.status === 'preparing') {
      actionBtnHTML = `<button class="kds-action-btn ready" onclick="updateOrderStatus('${order.id}', 'ready')">🔔 Mark Ready &amp; Chime</button>`;
    } else if (order.status === 'ready') {
      actionBtnHTML = `<button class="kds-action-btn complete" onclick="updateOrderStatus('${order.id}', 'picked_up')">✓ Complete Handover</button>`;
    }

    return `
      <div class="kds-card ${order.status}">
        <div class="kds-card-head">
          <span class="kds-ticket-id">${order.ticketNo || order.id}</span>
          <span class="kds-timer">⏱️ ${timeDisplay}</span>
        </div>

        <div class="kds-student-info">
          <div><strong>${order.studentName || 'Unknown Student'}</strong></div>
          <small>${order.regNo || 'No reg no'} · ${order.payMethod === 'mpesa' ? 'M-Pesa' : 'KCA MealCard'} · KSh ${Number(order.total || 0)}</small>
        </div>

        <div class="kds-payment-info">
          <span>Paid:</span>
          <strong>KSh ${Number(order.total || 0)}</strong>
        </div>

        <div class="kds-line">Line: ${order.line || 'Counter B'}</div>

        <div class="kds-items-list">
          ${order.items.map(it => `
            <div class="kds-item-row">
              <span>${it.qty}x ${it.name}</span>
              <span>KSh ${it.price * it.qty}</span>
            </div>
          `).join('')}
        </div>
        ${order.notes ? `<div class="kds-notes">Note: "${order.notes}"</div>` : ''}
        <div class="kds-actions-row">
          ${actionBtnHTML}
        </div>
      </div>
    `;
  }).join('');
}

window.updateOrderStatus = async function(orderId, newStatus) {
  try {
    await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (err) {
    console.warn('Updating status locally:', err);
  }

  updateOrderStatusLocal(orderId, newStatus);
};

function updateOrderStatusLocal(orderId, newStatus) {
  const order = allOrders.find(o => o.id === orderId);
  if (order) order.status = newStatus;
  try {
    localStorage.setItem('mealtime_orders', JSON.stringify(allOrders));
  } catch (e) {}

  if (activeOrder && activeOrder.id === orderId) {
    activeOrder.status = newStatus;
    renderActiveOrderBanner();

    if (newStatus === 'ready') {
      playReadyChime();
      showToast(`🔔 Ticket ${activeOrder.ticketNo} is READY FOR PICKUP at Counter B!`, 'success');
      sendNotification('Order Ready for Pickup! 🍽️', `Ticket ${activeOrder.ticketNo} is READY FOR PICKUP at Counter B! Show your QR code pass to collect.`, 'success');
      if ($('qr-status-pill')) {
        $('qr-status-pill').textContent = '✓ READY FOR PICKUP';
        $('qr-status-pill').className = 'qr-status ready-status';
      }
    } else if (newStatus === 'preparing') {
      showToast(`👨‍🍳 Chef started cooking Ticket ${activeOrder.ticketNo}`, 'info');
      sendNotification('Order in Kitchen 🍳', `Cafeteria staff started preparing Ticket ${activeOrder.ticketNo}.`, 'info');
    }
  }

  renderKdsBoard();
  renderOrdersList();
}

function simulateIncomingOrder() {
  const randomItems = [MENU_ITEMS[0], MENU_ITEMS[4], MENU_ITEMS[5]];
  const picked = randomItems[Math.floor(Math.random() * randomItems.length)];

  const mock = {
    id: `KCA-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    ticketNo: `#KCA-${Math.floor(100 + Math.random() * 900)}`,
    regNo: `250${Math.floor(1000 + Math.random() * 8999)}`,
    studentName: 'Campus Student',
    items: [{ id: picked.id, name: picked.name, price: picked.price, qty: 1 }],
    total: picked.price + 5,
    payMethod: 'mpesa',
    status: 'placed',
    createdAt: new Date().toISOString(),
    notes: 'Campus demo order',
    line: 'Counter B',
    paymentStatus: 'paid'
  };

  allOrders.unshift(mock);
  renderKdsBoard();
  showToast(`👨‍🍳 New ticket arrived: ${mock.ticketNo}!`, 'info');
}

async function fetchCafeteriaStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/status`);
    const data = await res.json();
    if (data && data.crowdStatus) {
      $('status-text').innerHTML = `Cafeteria Open · Queue: <strong>~${data.estimatedWaitMins} min wait</strong> · ${data.activeOrdersCount} orders ahead`;
      $('crowd-pill').textContent = data.crowdStatus;
      $('hero-stat-wait').textContent = `${data.estimatedWaitMins} min`;
    }
  } catch (e) {
    console.warn('Could not fetch queue status');
  }
}

function initKdsSystem() {
  document.querySelectorAll('.kds-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.kds-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentKdsFilter = tab.getAttribute('data-kds-filter');
      renderKdsBoard();
    });
  });

  $('kds-simulate-order-btn')?.addEventListener('click', () => {
    simulateIncomingOrder();
  });

  $('kds-exit-terminal-btn')?.addEventListener('click', () => {
    if (confirm('Exit Staff Kitchen Dispatch Terminal and return to Login?')) {
      window.location.reload();
    }
  });
}

// place the rest of the file unchanged below this point
