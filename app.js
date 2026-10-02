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
  { id: 1,  name: 'Beef Stew + Ugali',      emoji: '🍛', price: 120, calories: 650, protein: 32, rating: 4.6, orders: 34, category: 'main',  tags: ['halal', 'spicy'], allergens: 'None', desc: 'Slow-cooked beef stew with hot tender ugali. Hearty and rich.', badge: 'hot',  available: true,  soldCount: 34 },
  { id: 2,  name: 'Pilau + Kachumbari',     emoji: '🍚', price: 150, calories: 580, protein: 22, rating: 4.4, orders: 28, category: 'main',  tags: ['halal'],         allergens: 'None', desc: 'Fragrant coastal spiced pilau with fresh tomato-onion salad.', badge: null,  available: true,  soldCount: 28 },
  { id: 3,  name: 'Mandazi (3 pcs)',         emoji: '🥐', price: 30,  calories: 320, protein: 6,  rating: 4.1, orders: 55, category: 'snack', tags: ['veg'],           allergens: 'Gluten', desc: 'Golden fluffy fried mandazi. Fresh from morning batch.', badge: null,  available: true,  soldCount: 55 },
  { id: 4,  name: 'Githeri Special',         emoji: '🫘', price: 80,  calories: 460, protein: 24, rating: 3.8, orders: 18, category: 'main',  tags: ['veg', 'halal'],   allergens: 'None', desc: 'Boiled maize and kidney beans fried with tomatoes and dhania.', badge: 'veg',  available: true,  soldCount: 18 },
  { id: 5,  name: 'Chicken Burger',          emoji: '🍔', price: 200, calories: 620, protein: 35, rating: 4.7, orders: 41, category: 'snack', tags: ['halal'],         allergens: 'Gluten', desc: 'Crispy chicken fillet with shredded lettuce and creamy sauce in sesame bun.', badge: 'hot',  available: true,  soldCount: 41 },
  { id: 6,  name: 'Chapati + Beans',         emoji: '🫓', price: 60,  calories: 480, protein: 18, rating: 4.3, orders: 22, category: 'main',  tags: ['veg'],           allergens: 'Gluten', desc: 'Two soft layered chapatis with seasoned yellow bean curry.', badge: null,  available: true,  soldCount: 22 },
  { id: 7,  name: 'Maziwa Mala (500ml)',     emoji: '🥛', price: 40,  calories: 280, protein: 16, rating: 4.0, orders: 30, category: 'drink', tags: ['veg'],           allergens: 'Dairy', desc: 'Chilled fermented cultured milk. Probiotic and refreshing.', badge: null,  available: true,  soldCount: 30 },
  { id: 8,  name: 'Soda (500ml)',            emoji: '🥤', price: 50,  calories: 210, protein: 0,  rating: 3.9, orders: 45, category: 'drink', tags: [],                allergens: 'None', desc: 'Ice-cold soda: Coca-Cola, Fanta, or Sprite.', badge: null,  available: true,  soldCount: 45 },
  { id: 9,  name: 'Beef Samosa (2 pcs)',     emoji: '🥟', price: 40,  calories: 260, protein: 12, rating: 4.3, orders: 38, category: 'snack', tags: ['halal'],         allergens: 'Gluten', desc: 'Crunchy golden pastry triangles stuffed with spiced minced beef.', badge: 'new', available: true,  soldCount: 38 },
  { id: 10, name: 'Sukuma Wiki + Rice',      emoji: '🍃', price: 90,  calories: 410, protein: 11, rating: 4.0, orders: 20, category: 'main',  tags: ['veg', 'halal'],   allergens: 'None', desc: 'Fresh collard greens sauteed with onions, served with steamed white rice.', badge: 'veg',  available: true,  soldCount: 20 },
  { id: 11, name: 'Fresh Mango Juice',       emoji: '🧃', price: 60,  calories: 180, protein: 2,  rating: 4.5, orders: 25, category: 'drink', tags: ['veg'],           allergens: 'None', desc: '100% freshly pressed ripe mango juice without added preservatives.', badge: 'new',  available: true,  soldCount: 25 },
  { id: 12, name: 'Fried Chicken + Chips',   emoji: '🍗', price: 220, calories: 780, protein: 42, rating: 4.8, orders: 50, category: 'main',  tags: ['halal'],         allergens: 'Gluten', desc: 'Deep fried crispy chicken leg served with golden potato chips.', badge: 'hot',  available: true,  soldCount: 50 },
  { id: 13, name: 'Masala Spiced Chai',      emoji: '☕', price: 30,  calories: 120, protein: 4,  rating: 4.4, orders: 60, category: 'drink', tags: ['veg'],           allergens: 'Dairy', desc: 'Steaming hot brewed Kenyan tea infused with ginger and cardamom.', badge: null,  available: true,  soldCount: 60 },
  { id: 14, name: 'Tilapia Fish + Ugali',    emoji: '🐟', price: 140, calories: 590, protein: 38, rating: 4.1, orders: 15, category: 'main',  tags: ['halal'],         allergens: 'Fish', desc: 'Pan-fried whole lake tilapia served with ugali and sukuma.', badge: null,  available: true,  soldCount: 15 },
  { id: 15, name: 'Fresh Banana Bunch',      emoji: '🍌', price: 20,  calories: 110, protein: 1,  rating: 4.2, orders: 35, category: 'snack', tags: ['veg', 'halal'],   allergens: 'None', desc: 'Sweet ripe Cavendish bananas. Quick healthy brain fuel.', badge: null,  available: true,  soldCount: 35 },
  { id: 16, name: 'Ndengu Special + Rice',    emoji: '🍲', price: 80,  calories: 450, protein: 21, rating: 4.3, orders: 29, category: 'main',  tags: ['veg', 'halal'],   allergens: 'None', desc: 'Green grams simmered in coconut tomato gravy over fluffy rice.', badge: 'veg',  available: true,  soldCount: 29 },
  { id: 17, name: 'Yoghurt Cup (Strawberry)',emoji: '🍦', price: 50,  calories: 190, protein: 8,  rating: 4.2, orders: 22, category: 'drink', tags: ['veg'],           allergens: 'Dairy', desc: 'Smooth probiotic whole-milk strawberry yoghurt.', badge: null,  available: true,  soldCount: 22 },
  { id: 18, name: 'Egg Sandwich Toast',      emoji: '🍳', price: 50,  calories: 310, protein: 14, rating: 4.0, orders: 18, category: 'snack', tags: ['veg'],           allergens: 'Gluten,Egg', desc: 'Double toasted buttered bread with seasoned fried eggs.', badge: null,  available: true,  soldCount: 18 }
];

// App State
let currentUser = {
  regNo: '2502692',
  name: 'James Mwangi',
  email: '2502692@students.kcau.ac.ke',
  department: 'School of Technology (BIT)',
  walletBalance: 850
};

let currentRole = 'student'; // 'student' | 'staff'
let activeLoginRole = 'student'; // 'student' | 'staff'
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  // Register Service Worker for PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker Registration Failed!', err));
  }

  initLogin();
  initNotifications();
  initBudgetOptimizer();
  initNavigation();
  initCart();
  initPaymentAndStk();
  initWalletTopup();
  initKdsSystem();
  initFeedbackModal();
  initQrModal();
  initThemeAndSettings();

  // Resume AudioContext on first user interaction (Browser Policy)
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

  // Initial Splash Screen Sequence - Show login immediately
  const splash = $('splash-screen');
  const login = $('login-screen');
  
  if (splash) {
    splash.style.display = 'none';
  }
  
  if (login) {
    login.classList.remove('hidden');
  }

  // Load live data from backend server
  try {
    await fetchCafeteriaStatus();
    await fetchMenuItems();
    await fetchOrders();
  } catch (err) {
    console.warn('Backend offline, using seed data');
  }
  
  // Real-time synchronization interval
  setInterval(fetchCafeteriaStatus, 4000);
  setInterval(fetchOrders, 4000);
});

// ============================================================
// 1. ROLE-BASED LOGIN GATE (STUDENTS vs CAFETERIA STAFF)
// ============================================================
function initLogin() {
  const loginBtn = $('login-btn');
  const demoBtn = $('demo-student-btn');
  const demoLabel = $('demo-btn-label');
  const googleBtn = $('google-btn');
  const emailInput = $('login-email');
  const passInput = $('login-password');
  const togglePass = $('toggle-pass');
  const errorDiv = $('login-error');
  const errorText = $('login-error-text');

  const tabStudent = $('tab-login-student');
  const tabStaff = $('tab-login-staff');
  const roleTitle = $('login-card-role-title');
  const roleSub = $('login-card-role-sub');
  const emailLabel = $('login-email-label');
  const passLabel = $('login-pass-label');
  const emailHint = $('email-hint');
  const staffAlert = $('staff-security-alert');
  const googleDivider = $('google-divider');

  // Switch between Student and Staff Tabs on Login Gate
  tabStudent?.addEventListener('click', () => {
    activeLoginRole = 'student';
    tabStudent.classList.add('active');
    tabStaff.classList.remove('active');

    roleTitle.textContent = 'Student & Lecturer Access';
    roleSub.textContent = 'Sign in with your official university credentials';
    emailLabel.textContent = 'Student Email or Registration Number';
    emailInput.placeholder = '2502692@students.kcau.ac.ke';
    emailInput.value = '2502692@students.kcau.ac.ke';
    passLabel.textContent = 'Password / Portal PIN';
    passInput.placeholder = 'Enter password (default: 1234)';
    passInput.value = '1234';
    emailHint.innerHTML = 'Format: <strong>2502692@students.kcau.ac.ke</strong> or registration number <strong>2502692</strong>';
    demoLabel.innerHTML = '⚡ Use My Email: <strong>2502692@students.kcau.ac.ke</strong>';
    
    staffAlert?.classList.add('hidden');
    googleBtn?.classList.remove('hidden');
    googleDivider?.classList.remove('hidden');
    errorDiv?.classList.add('hidden');
  });

  tabStaff?.addEventListener('click', () => {
    activeLoginRole = 'staff';
    tabStaff.classList.add('active');
    tabStudent.classList.remove('active');

    roleTitle.textContent = 'Cafeteria Staff Dispatch Terminal';
    roleSub.textContent = 'Authorized kitchen cooks & counter personnel only';
    emailLabel.textContent = 'Official Staff Email';
    emailInput.placeholder = 'chef.otieno@kcau.ac.ke';
    emailInput.value = 'chef.otieno@kcau.ac.ke';
    passLabel.textContent = 'Kitchen Security Access PIN';
    passInput.placeholder = 'Enter 6-digit PIN (Demo: 882041)';
    passInput.value = '882041';
    emailHint.innerHTML = 'Restricted: Official <strong>@kcau.ac.ke</strong> staff catering accounts only.';
    demoLabel.innerHTML = '⚡ Fill Staff Creds: <strong>chef.otieno@kcau.ac.ke</strong>';
    
    staffAlert?.classList.remove('hidden');
    googleBtn?.classList.add('hidden');
    googleDivider?.classList.add('hidden');
    errorDiv?.classList.add('hidden');
  });

  // 1-Click Demo Fill for Fast Testing & Defense Presentations
  demoBtn?.addEventListener('click', () => {
    if (activeLoginRole === 'student') {
      emailInput.value = '2502692@students.kcau.ac.ke';
      passInput.value = '1234';
      showToast('Loaded: 2502692@students.kcau.ac.ke', 'info');
    } else {
      emailInput.value = 'chef.otieno@kcau.ac.ke';
      passInput.value = '882041';
      showToast('Loaded Staff: chef.otieno@kcau.ac.ke (PIN: 882041)', 'info');
    }
    emailInput.focus();
  });

  togglePass?.addEventListener('click', () => {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      $('eye-icon').innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
      passInput.type = 'password';
      $('eye-icon').innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
  });

  const performLogin = async (inputVal) => {
    const raw = inputVal || emailInput.value.trim();
    if (!raw) {
      showLoginError('Please enter your email or credentials');
      return;
    }

    // Call Backend Login Endpoint with role
    errorDiv.classList.add('hidden');
    $('email-wrap').classList.remove('error');
    $('login-btn-text').classList.add('hidden');
    $('login-spinner').classList.remove('hidden');
    loginBtn.style.pointerEvents = 'none';

    try {
      let data;
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: raw,
            password: passInput.value,
            role: activeLoginRole,
            staffPin: passInput.value
          })
        });
        data = await res.json();
      } catch (err) {
        // Fallback for offline file preview
        if (activeLoginRole === 'staff') {
          data = {
            success: true,
            role: 'staff',
            staff: { name: 'Chef Otieno', role: 'Head Kitchen Dispatcher', email: 'chef.otieno@kcau.ac.ke' }
          };
        } else {
          const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '');
          data = {
            success: true,
            role: 'student',
            student: {
              regNo: cleaned || '2502692',
              email: raw.includes('@') ? raw : `${cleaned || '2502692'}@students.kcau.ac.ke`,
              name: `Student ${cleaned || '2502692'}`,
              walletBalance: 850
            }
          };
        }
      }

      if (!data.success && data.error) {
        showLoginError(data.error);
        resetLoginBtn();
        return;
      }

      // Smooth Screen Transition - Show app immediately
      $('login-screen').style.display = 'none';

      if (data.role === 'staff') {
        // ENTER RESTRICTED STAFF TERMINAL
        currentRole = 'staff';
        $('header-campus-label').textContent = 'KCA Cafeteria Dispatch Terminal · Staff Session';
        $('header-wallet-btn').style.display = 'none';
        $('bottom-nav').style.display = 'none';
        $('user-avatar-text').textContent = '👨‍🍳';
        $('app').classList.remove('hidden');
        switchPage('kds');
        renderKdsBoard();
        showToast(`👨‍🍳 Staff Terminal Active: Logged in as ${data.staff.name}`, 'info');

      } else {
        // ENTER STUDENT DINING PORTAL
        currentRole = 'student';
        currentUser = data.student;
        updateStudentUI();
        $('header-wallet-btn').style.display = 'flex';
        $('bottom-nav').style.display = 'flex';
        $('header-campus-label').textContent = 'KCA University · Ruaraka Main Campus';
        $('app').classList.remove('hidden');
        switchPage('home');
        showToast(`Welcome back, ${currentUser.name}! 👋`, 'success');
      }

    } catch (e) {
      showLoginError('Network error connecting to KCA servers.');
      resetLoginBtn();
    }
  };

  loginBtn?.addEventListener('click', () => performLogin());
  googleBtn?.addEventListener('click', () => performLogin('2502692@students.kcau.ac.ke'));
  passInput?.addEventListener('keyup', e => { if (e.key === 'Enter') performLogin(); });
  emailInput?.addEventListener('keyup', e => { if (e.key === 'Enter') performLogin(); });

  function showLoginError(msg) {
    errorText.textContent = msg;
    errorDiv.classList.remove('hidden');
    $('email-wrap').classList.add('error');
  }

  function resetLoginBtn() {
    $('login-btn-text').classList.remove('hidden');
    $('login-spinner').classList.add('hidden');
    loginBtn.style.pointerEvents = 'auto';
  }
}

function updateStudentUI() {
  $('profile-reg-no').textContent = currentUser.regNo;
  $('profile-student-email').textContent = currentUser.email;
  $('hero-greeting').textContent = `Good day, ${currentUser.name.split(' ')[0]} 👋`;
  
  const initials = currentUser.regNo.substring(0, 2);
  $('user-avatar-text').textContent = initials;
  
  updateWalletDisplay(currentUser.walletBalance);
}

function updateWalletDisplay(amount) {
  const formatted = `KSh ${Number(amount).toLocaleString()}`;
  $('header-wallet-bal').textContent = formatted;
  $('profile-wallet-bal').textContent = formatted + '.00';
  $('cart-wallet-bal').textContent = formatted;
  currentUser.walletBalance = amount;
}

// ============================================================
// 2. INTERACTIVE NOTIFICATIONS & QUEUE CENTER DRAWER
// ============================================================
// Notification Store
let notifications = [
  { id: 1, title: 'Welcome to MealTime', text: 'Skip the queue, order ahead! All meals are currently fresh.', time: 'Just now', type: 'info', read: false },
  { id: 2, title: 'M-Pesa Topup Success', text: 'KSh 500 added to your wallet via M-Pesa.', time: '10m ago', type: 'success', read: true }
];

function sendNotification(title, text, type = 'info') {
  const id = Date.now();
  const newNotif = {
    id, title, text, type,
    time: 'Just now',
    read: false
  };
  notifications.unshift(newNotif);
  renderNotifications();
  
  // Update badge
  const badge = $('notif-badge');
  const unreadCount = notifications.filter(n => !n.read).length;
  if (unreadCount > 0) {
    badge.style.display = 'flex';
    badge.textContent = unreadCount;
    $('drawer-notif-count').textContent = unreadCount + ' New';
    
    // Play alert sound if it's a critical update
    if (type === 'success' || type === 'warning') {
      playReadyChime();
    }
  }
}

function renderNotifications() {
  const container = $('notif-list');
  if (!container) return;
  
  container.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}">
      <div class="notif-icon-wrap ${n.type}">
        ${n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : '🔔'}
      </div>
      <div class="notif-content">
        <div class="notif-title-row">
          <strong>${n.title}</strong>
          <span class="notif-time">${n.time}</span>
        </div>
        <p class="notif-text">${n.text}</p>
      </div>
      ${!n.read ? '<div class="unread-dot"></div>' : ''}
    </div>
  `).join('');
}

function initNotifications() {
  const notifBtn = $('notif-btn');
  const statusBanner = $('status-banner');
  const drawerOverlay = $('notif-drawer-overlay');
  const drawerClose = $('notif-drawer-close');
  const clearBtn = $('clear-notif-btn');
  const notifBadge = $('notif-badge');

  const openDrawer = () => {
    drawerOverlay.classList.remove('hidden');
    // Mark all as read when opening drawer
    notifications.forEach(n => n.read = true);
    renderNotifications();
    notifBadge.style.display = 'none';
    $('drawer-notif-count').textContent = '0 New';
  };

  const closeDrawer = () => {
    drawerOverlay.classList.add('hidden');
  };

  notifBtn?.addEventListener('click', openDrawer);
  statusBanner?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);

  drawerOverlay?.addEventListener('click', e => {
    if (e.target === drawerOverlay) closeDrawer();
  });

  clearBtn?.addEventListener('click', () => {
    notifications = [];
    renderNotifications();
    notifBadge.style.display = 'none';
    $('drawer-notif-count').textContent = '0 New';
    showToast('Notifications cleared', 'info');
  });

  renderNotifications();
}

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
    
    // Clear active preset
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
    
    // Add combo items to cart
    combo.items.forEach(item => {
      cart[item.id] = (cart[item.id] || 0) + 1;
    });

    updateCartUI();
    showToast(`Added ${combo.items.map(i => i.name).join(' + ')} to your tray!`, 'success');
    openCartModal();
  });

  // Calculate default KSh 120 combo
  recalculateCombo(120);
}

function calculateBestCombo(budget) {
  // Sort menu items by highest rating and value
  const available = MENU_ITEMS.filter(m => m.available && m.price <= budget);
  
  if (budget <= 50) {
    // Single snack / tea
    const item = available.sort((a,b) => b.rating - a.rating)[0];
    return item ? { items: [item], total: item.price, calories: item.calories, protein: item.protein } : { items: [], total: 0, calories: 0, protein: 0 };
  }

  // Look for pair of (Main Meal + Drink/Snack) within budget
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
    const total = bestPair.reduce((a,b) => a + b.price, 0);
    const calories = bestPair.reduce((a,b) => a + b.calories, 0);
    const protein = bestPair.reduce((a,b) => a + b.protein, 0);
    return { items: bestPair, total, calories, protein };
  }

  // Fallback to highest rated single item
  const bestSingle = available.sort((a,b) => b.rating - a.rating)[0];
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

// ============================================================
// 4. NAVIGATION & PAGES
// ============================================================
function initNavigation() {
  const navBtns = document.querySelectorAll('.bottom-nav .nav-item, [data-page]');
  navBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const page = btn.getAttribute('data-page');
      if (page === 'cart') {
        openCartModal();
      } else if (page) {
        switchPage(page);
      }
    });
  });

  // Category Filters on Menu Page
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(btn.getAttribute('data-filter'), $('menu-search')?.value || '', $('menu-sort')?.value || 'rating');
    });
  });

  // Search & Sort on Menu Page
  $('menu-search')?.addEventListener('input', e => {
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderMenu(activeFilter, e.target.value, $('menu-sort')?.value || 'rating');
  });

  $('menu-sort')?.addEventListener('change', e => {
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderMenu(activeFilter, $('menu-search')?.value || '', e.target.value);
  });

  // Orders Tab Switcher
  const orderTabs = document.querySelectorAll('.order-tab');
  orderTabs.forEach(t => {
    t.addEventListener('click', () => {
      orderTabs.forEach(b => b.classList.remove('active'));
      t.classList.add('active');
      const tab = t.getAttribute('data-tab');
      $('active-orders-list').classList.toggle('hidden', tab !== 'active');
      $('past-orders-list').classList.toggle('hidden', tab !== 'past');
    });
  });

  // Dismiss Peak Alert
  $('dismiss-peak')?.addEventListener('click', () => {
    $('peak-alert').style.display = 'none';
  });

  // Logout
  $('logout-btn')?.addEventListener('click', () => {
    if (confirm('Sign out from KCA MealTime?')) {
      window.location.reload();
    }
  });

  // Refresh status
  $('refresh-status')?.addEventListener('click', () => {
    fetchCafeteriaStatus();
    showToast('Refreshed cafeteria queue data', 'info');
  });
}

function switchPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = $(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update bottom navigation state
  document.querySelectorAll('.bottom-nav .nav-item').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-page') === pageId);
  });

  if (pageId === 'kds') {
    renderKdsBoard();
  } else if (pageId === 'orders') {
    renderOrdersList();
  } else if (pageId === 'analytics') {
    renderAnalyticsCharts();
  }
}

// ============================================================
// 5. MENU & HOME PAGE RENDERING
// ============================================================
async function fetchMenuItems() {
  try {
    const res = await fetch(`${API_BASE}/api/menu`);
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      MENU_ITEMS = data;
    }
  } catch (err) {
    console.warn('Using seeded menu items.');
  }

  renderTopPicks();
  renderOrderAgain();
  renderMenu('all', '', 'rating');
}

function renderTopPicks() {
  const container = $('top-picks-grid');
  if (!container) return;

  const topItems = [...MENU_ITEMS].sort((a,b) => b.rating - a.rating).slice(0, 4);
  container.innerHTML = topItems.map(item => createMealCardHTML(item)).join('');
  attachCardEvents(container);
}

function renderOrderAgain() {
  const container = $('reorder-strip');
  if (!container) return;

  const quickItems = [MENU_ITEMS[0], MENU_ITEMS[4], MENU_ITEMS[2], MENU_ITEMS[6]];
  container.innerHTML = quickItems.map(item => `
    <div class="reorder-chip" data-id="${item.id}">
      <span class="rc-emoji">${item.emoji}</span>
      <div class="rc-info">
        <strong>${item.name}</strong>
        <span>KSh ${item.price} · ⭐ ${item.rating}</span>
      </div>
      <button class="rc-add-btn" data-add="${item.id}">+ Add</button>
    </div>
  `).join('');

  container.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-add'), 10);
      addToCart(id);
    });
  });
}

function renderMenu(filter, query, sort) {
  const container = $('full-menu-grid');
  if (!container) return;

  let list = [...MENU_ITEMS];

  // Filtering
  if (filter === 'main')  list = list.filter(m => m.category === 'main');
  if (filter === 'snack') list = list.filter(m => m.category === 'snack');
  if (filter === 'drink') list = list.filter(m => m.category === 'drink');
  if (filter === 'veg')   list = list.filter(m => m.tags.includes('veg'));
  if (filter === 'halal') list = list.filter(m => m.tags.includes('halal'));

  // Search
  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
  }

  // Sort
  if (sort === 'rating') list.sort((a,b) => b.rating - a.rating);
  if (sort === 'price-asc') list.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (sort === 'protein-desc') list.sort((a,b) => b.protein - a.protein);
  if (sort === 'popular') list.sort((a,b) => (b.soldCount||0) - (a.soldCount||0));

  $('menu-count').textContent = `${list.length} items available`;

  container.innerHTML = list.map(item => createMealCardHTML(item)).join('');
  attachCardEvents(container);
}

function createMealCardHTML(item) {
  const halalBadge = item.tags.includes('halal') ? '<span class="tag-chip halal">Halal</span>' : '';
  const vegBadge = item.tags.includes('veg') ? '<span class="tag-chip veg">🌱 Veg</span>' : '';
  const hotBadge = item.badge === 'hot' ? '<span class="badge-ribbon hot">🔥 Top Seller</span>' : '';

  return `
    <div class="menu-card" data-item-id="${item.id}">
      <div class="mc-img-wrap">
        <span class="mc-emoji">${item.emoji}</span>
        ${hotBadge}
        <div class="mc-dietary-strip">${halalBadge}${vegBadge}</div>
      </div>
      <div class="mc-content">
        <div class="mc-title-row">
          <h4 class="mc-name">${item.name}</h4>
          <span class="mc-price">KSh ${item.price}</span>
        </div>
        <p class="mc-desc">${item.desc}</p>
        <div class="mc-nutri-row">
          <span class="mc-cal">🔥 ${item.calories} kcal</span>
          <span class="mc-prot">💪 ${item.protein}g Prot</span>
          <span class="mc-rating">⭐ ${item.rating}</span>
        </div>
        <button class="mc-add-btn" data-id="${item.id}" ${!item.available ? 'disabled' : ''}>
          ${item.available ? '+ Add to Tray' : 'Sold Out'}
        </button>
      </div>
    </div>
  `;
}

function attachCardEvents(container) {
  container.querySelectorAll('.mc-add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'), 10);
      addToCart(id);
    });
  });

  container.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-item-id'), 10);
      openItemModal(id);
    });
  });
}

// ============================================================
// 6. CART & TRAY MANAGEMENT
// ============================================================
function initCart() {
  $('cart-close')?.addEventListener('click', closeCartModal);
  $('cart-modal')?.addEventListener('click', e => {
    if (e.target === $('cart-modal')) closeCartModal();
  });

  // Payment radio card toggle
  const walletCard = $('method-wallet-card');
  const mpesaCard = $('method-mpesa-card');

  walletCard?.addEventListener('click', () => {
    walletCard.classList.add('active');
    mpesaCard.classList.remove('active');
    walletCard.querySelector('input').checked = true;
    $('pay-btn-text').textContent = 'Confirm Order with KCA MealCard';
  });

  mpesaCard?.addEventListener('click', () => {
    mpesaCard.classList.add('active');
    walletCard.classList.remove('active');
    mpesaCard.querySelector('input').checked = true;
    $('pay-btn-text').textContent = 'Send M-Pesa STK Push';
  });

  $('pay-btn')?.addEventListener('click', handleOrderSubmission);
}

function addToCart(itemId, qty = 1) {
  cart[itemId] = (cart[itemId] || 0) + qty;
  updateCartUI();
  const item = MENU_ITEMS.find(m => m.id === itemId);
  showToast(`Added ${item ? item.name : 'item'} to tray`, 'success');
}

function updateCartUI() {
  const badge = $('cart-badge');
  const itemsContainer = $('cart-items');
  const emptyView = $('cart-empty');
  const summaryView = $('cart-summary');

  const totalCount = Object.values(cart).reduce((a,b) => a + b, 0);

  if (totalCount > 0) {
    badge.textContent = totalCount;
    badge.classList.remove('hidden');
    emptyView.classList.add('hidden');
    summaryView.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
    emptyView.classList.remove('hidden');
    summaryView.classList.add('hidden');
  }

  // Render items
  let subtotal = 0;
  let totalKcal = 0;
  let totalProt = 0;

  itemsContainer.innerHTML = Object.entries(cart).map(([id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === parseInt(id, 10));
    if (!item) return '';

    const itemTotal = item.price * qty;
    subtotal += itemTotal;
    totalKcal += (item.calories * qty);
    totalProt += (item.protein * qty);

    return `
      <div class="cart-item-row">
        <div class="ci-left">
          <span class="ci-emoji">${item.emoji}</span>
          <div>
            <strong>${item.name}</strong>
            <span class="ci-meta">KSh ${item.price} each · 🔥 ${item.calories} kcal</span>
          </div>
        </div>
        <div class="ci-right">
          <div class="ci-qty-ctrl">
            <button onclick="changeCartQty(${item.id}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeCartQty(${item.id}, 1)">+</button>
          </div>
          <span class="ci-price">KSh ${itemTotal}</span>
        </div>
      </div>
    `;
  }).join('');

  $('cart-subtotal').textContent = `KSh ${subtotal}`;
  const grandTotal = subtotal > 0 ? (subtotal + 5) : 0;
  $('cart-total').textContent = `KSh ${grandTotal}`;
  $('tray-calories').textContent = totalKcal;
  $('tray-protein').textContent = totalProt;
}

window.changeCartQty = function(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
};

function openCartModal() {
  updateCartUI();
  $('cart-modal').classList.remove('hidden');
}

function closeCartModal() {
  $('cart-modal').classList.add('hidden');
}

// ============================================================
// 7. PAYMENT, STK PUSH & ORDER CREATION
// ============================================================
function initPaymentAndStk() {
  // STK keypad buttons
  document.querySelectorAll('.kbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStkPin.length < 4) {
        currentStkPin += btn.getAttribute('data-k');
        updatePinDots();
      }
    });
  });

  $('stk-del-btn')?.addEventListener('click', () => {
    currentStkPin = currentStkPin.slice(0, -1);
    updatePinDots();
  });

  $('stk-cancel-btn')?.addEventListener('click', () => {
    $('stk-modal').classList.add('hidden');
    currentStkPin = '';
    updatePinDots();
    showToast('M-Pesa payment cancelled.', 'warning');
  });

  $('stk-submit-btn')?.addEventListener('click', finalizeMpesaPayment);
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = $(`pdot-${i}`);
    if (dot) dot.classList.toggle('filled', i <= currentStkPin.length);
  }
}

async function handleOrderSubmission() {
  const itemEntries = Object.entries(cart);
  if (!itemEntries.length) {
    showToast('Your tray is empty!', 'warning');
    return;
  }

  const items = itemEntries.map(([id, qty]) => {
    const m = MENU_ITEMS.find(i => i.id === parseInt(id, 10));
    return { id: m.id, name: m.name, price: m.price, qty };
  });

  const subtotal = items.reduce((a,b) => a + (b.price * b.qty), 0);
  const total = subtotal + 5;
  const payMethod = document.querySelector('input[name="pay-method"]:checked')?.value || 'kca_wallet';
  const pickupTime = $('pickup-time')?.value || 'ASAP (~8 min)';
  const notes = $('order-special-notes')?.value || '';

  pendingOrderPayload = {
    regNo: currentUser.regNo,
    studentName: currentUser.name,
    items,
    pickupTime,
    payMethod,
    notes
  };

  if (payMethod === 'kca_wallet') {
    // Check balance
    if (currentUser.walletBalance < total) {
      showToast('Insufficient KCA MealCard balance! Please top up or pay via M-Pesa.', 'error');
      return;
    }

    // Direct Wallet Payment
    await executeOrderPlacement(pendingOrderPayload);

  } else {
    // Safaricom Lipa na M-Pesa STK Push
    closeCartModal();
    $('stk-amount-val').textContent = total;
    $('stk-reg-val').textContent = currentUser.regNo;
    currentStkPin = '';
    updatePinDots();
    $('stk-modal').classList.remove('hidden');

    // Auto-fill demo PIN after 800ms for convenience if user wants
    setTimeout(() => {
      if (currentStkPin.length === 0) {
        currentStkPin = '1234';
        updatePinDots();
      }
    }, 1000);
  }
}

async function finalizeMpesaPayment() {
  if (currentStkPin.length < 4) {
    showToast('Please enter your 4-digit M-Pesa PIN', 'warning');
    return;
  }

  // Show processing overlay in modal
  const submitBtn = $('stk-submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Processing…';

  // Simulate Daraja API Latency
  await new Promise(r => setTimeout(r, 2000));

  // 90% success rate for sandbox simulation
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    $('stk-modal').classList.add('hidden');
    showToast('PIN verified! M-Pesa transaction successful. ✅', 'success');
    sendNotification('M-Pesa Payment', `Transaction of KSh ${pendingOrderPayload.items.reduce((a,b) => a + (b.price * b.qty), 0) + 5} successful.`, 'success');
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    await executeOrderPlacement(pendingOrderPayload);
  } else {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    currentStkPin = '';
    updatePinDots();
    showToast('M-Pesa transaction timed out or PIN incorrect. Please try again.', 'error');
  }
}

async function executeOrderPlacement(payload) {
  try {
    let orderData;
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      orderData = await res.json();
    } catch (e) {
      // Local mock fallback if backend is offline
      const mockOrder = {
        id: `KCA-2024-${Math.floor(1000 + Math.random()*9000)}`,
        ticketNo: `#KCA-${Math.floor(100 + Math.random()*900)}`,
        regNo: payload.regNo,
        items: payload.items,
        total: payload.items.reduce((a,b) => a + (b.price * b.qty), 0) + 5,
        status: 'placed',
        createdAt: new Date().toISOString()
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
      renderActiveOrderBanner();
      switchPage('home');
      fetchOrders();

      // Trigger automatic preparation transition in 5s if testing
      setTimeout(() => {
        if (activeOrder && activeOrder.status === 'placed') {
          updateOrderStatusLocal(activeOrder.id, 'preparing');
        }
      }, 5000);

      // Trigger automatic ready status in 12s with sound chime
      setTimeout(() => {
        if (activeOrder && activeOrder.status === 'preparing') {
          updateOrderStatusLocal(activeOrder.id, 'ready');
        }
      }, 12000);
    }
  } catch (err) {
    showToast('Failed to place order. Please try again.', 'error');
  }
}

// ============================================================
// 8. KITCHEN DISPLAY SYSTEM (KDS) LOGIC
// ============================================================
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

function renderKdsBoard() {
  const container = $('kds-tickets-container');
  if (!container) return;

  let list = [...allOrders];

  if (currentKdsFilter !== 'all') {
    list = list.filter(o => o.status === currentKdsFilter);
  }

  // Count active stats
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
          Student Reg: <strong>${order.regNo}</strong> (${order.payMethod === 'mpesa' ? 'M-Pesa' : 'KCA MealCard'})
        </div>
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
  if (order) {
    order.status = newStatus;
  }

  if (activeOrder && activeOrder.id === orderId) {
    activeOrder.status = newStatus;
    renderActiveOrderBanner();

    // Play chime when order is ready!
    if (newStatus === 'ready') {
      playReadyChime();
      showToast(`🔔 Ticket ${activeOrder.ticketNo} is READY FOR PICKUP at Counter B!`, 'success');
      $('qr-status-pill').textContent = '✓ READY FOR PICKUP';
      $('qr-status-pill').className = 'qr-status ready-status';
    }
  }

  renderKdsBoard();
  renderOrdersList();
}

function simulateIncomingOrder() {
  const randomItems = [MENU_ITEMS[0], MENU_ITEMS[4], MENU_ITEMS[5]];
  const picked = randomItems[Math.floor(Math.random() * randomItems.length)];
  
  const mock = {
    id: `KCA-2024-${Math.floor(1000 + Math.random()*9000)}`,
    ticketNo: `#KCA-${Math.floor(100 + Math.random()*900)}`,
    regNo: `250${Math.floor(1000 + Math.random()*8999)}`,
    studentName: 'Campus Student',
    items: [{ id: picked.id, name: picked.name, price: picked.price, qty: 1 }],
    total: picked.price + 5,
    payMethod: 'mpesa',
    status: 'placed',
    createdAt: new Date().toISOString(),
    notes: 'Campus demo order'
  };

  allOrders.unshift(mock);
  renderKdsBoard();
  showToast(`👨‍🍳 New ticket arrived: ${mock.ticketNo}!`, 'info');
}

// ============================================================
// 9. ORDERS LIST & ACTIVE ORDER TRACKING
// ============================================================
async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    const data = await res.json();
    if (Array.isArray(data)) {
      allOrders = data;
      const myActive = data.find(o => o.regNo === currentUser.regNo && (o.status === 'placed' || o.status === 'preparing' || o.status === 'ready'));
      if (myActive) {
        const oldStatus = activeOrder ? activeOrder.status : null;
        activeOrder = myActive;
        
        if (oldStatus && oldStatus !== myActive.status) {
          const statusMessages = {
            'preparing': 'Your order is now being prepared! 🍳',
            'ready': 'Order Ready! Please collect at Counter A 🍕',
            'picked_up': 'Enjoy your meal! 😋'
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
    // console.warn('Could not fetch orders:', err);
  }
}

function renderActiveOrderBanner() {
  const card = $('active-order-card');
  if (!card) return;

  if (!activeOrder || activeOrder.status === 'picked_up') {
    card.classList.add('hidden');
    return;
  }

  card.classList.remove('hidden');
  $('ao-item-name').textContent = activeOrder.items.map(i => `${i.qty}x ${i.name}`).join(', ');
  $('ao-ticket-no').textContent = `Ticket ${activeOrder.ticketNo || activeOrder.id}`;

  const stepPlaced = $('step-placed');
  const stepPreparing = $('step-preparing');
  const stepReady = $('step-ready');
  const line1 = $('line-1');
  const line2 = $('line-2');

  if (activeOrder.status === 'placed') {
    $('ao-status-title').textContent = '📝 Order Placed';
    $('ao-badge').textContent = 'Queued';
    $('ao-eta').innerHTML = 'Est. ready in <strong>8 min</strong>';
    stepPlaced.className = 'ao-step active';
    stepPreparing.className = 'ao-step';
    stepReady.className = 'ao-step';
    line1.className = 'ao-line';
    line2.className = 'ao-line';
  } else if (activeOrder.status === 'preparing') {
    $('ao-status-title').textContent = '🍛 Order in Preparation';
    $('ao-badge').textContent = 'In Kitchen';
    $('ao-eta').innerHTML = 'Est. ready in <strong>4 min</strong>';
    stepPlaced.className = 'ao-step done';
    stepPreparing.className = 'ao-step active';
    stepReady.className = 'ao-step';
    line1.className = 'ao-line done';
    line2.className = 'ao-line';
  } else if (activeOrder.status === 'ready') {
    $('ao-status-title').textContent = '🎉 Your Meal is Ready!';
    $('ao-badge').textContent = 'Ready';
    $('ao-eta').innerHTML = '<strong style="color:var(--green)">Collect at Counter B</strong>';
    stepPlaced.className = 'ao-step done';
    stepPreparing.className = 'ao-step done';
    stepReady.className = 'ao-step active done';
    line1.className = 'ao-line done';
    line2.className = 'ao-line done';
  }

  $('show-qr-btn')?.addEventListener('click', () => {
    openQrPass(activeOrder);
  });
}

function renderOrdersList() {
  const activeContainer = $('active-orders-list');
  const pastContainer = $('past-orders-list');
  if (!activeContainer || !pastContainer) return;

  const myOrders = allOrders.filter(o => o.regNo === currentUser.regNo);
  const active = myOrders.filter(o => o.status !== 'picked_up');
  const past = myOrders.filter(o => o.status === 'picked_up');

  $('active-tab-count').textContent = active.length;

  if (!active.length) {
    activeContainer.innerHTML = `<div class="empty-orders"><p>No current active orders. Browse menu to order!</p></div>`;
  } else {
    activeContainer.innerHTML = active.map(o => createOrderCardHTML(o, true)).join('');
  }

  if (!past.length) {
    pastContainer.innerHTML = `<div class="empty-orders"><p>No past order history yet.</p></div>`;
  } else {
    pastContainer.innerHTML = past.map(o => createOrderCardHTML(o, false)).join('');
  }
}

function createOrderCardHTML(order, isActive) {
  const statusLabels = {
    placed: '🟡 Order Placed',
    preparing: '🟠 Cooking in Kitchen',
    ready: '🟢 Ready for Pickup',
    picked_up: '✓ Collected'
  };

  return `
    <div class="order-history-card">
      <div class="oh-header">
        <div>
          <span class="oh-ticket">${order.ticketNo || order.id}</span>
          <span class="oh-date">${new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <span class="oh-status ${order.status}">${statusLabels[order.status] || order.status}</span>
      </div>
      <div class="oh-items">
        ${order.items.map(it => `<div>${it.qty}x ${it.name} <span class="oh-p">KSh ${it.price * it.qty}</span></div>`).join('')}
      </div>
      <div class="oh-footer">
        <span>Paid via <strong>${order.payMethod === 'mpesa' ? 'M-Pesa' : 'KCA MealCard'}</strong></span>
        <strong>Total: KSh ${order.total}</strong>
      </div>
      <div class="oh-actions">
        ${isActive ? `
          <button class="oh-qr-btn" onclick="openQrPassById('${order.id}')">Show Pickup QR Code</button>
        ` : `
          <button class="oh-review-btn" onclick="openFeedbackModal('${order.id}', ${order.items[0].id}, '${order.items[0].name}')">
            ${order.reviewed ? '★ Reviewed' : '⭐ Rate this Meal'}
          </button>
        `}
      </div>
    </div>
  `;
}

// ============================================================
// 10. DYNAMIC QR CODE PASS & WEB AUDIO CHIME
// ============================================================
function initQrModal() {
  $('qr-close')?.addEventListener('click', () => $('qr-modal').classList.add('hidden'));
  $('qr-modal')?.addEventListener('click', e => {
    if (e.target === $('qr-modal')) $('qr-modal').classList.add('hidden');
  });
}

window.openQrPassById = function(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (order) openQrPass(order);
};

function openQrPass(order) {
  $('qr-modal').classList.remove('hidden');
  $('qr-ticket-pill').textContent = `Ticket ${order.ticketNo || order.id}`;
  $('qr-item-name').textContent = order.items.map(i => `${i.qty}x ${i.name}`).join(' + ');
  $('qr-reg-display').textContent = order.regNo || currentUser.regNo;
  $('qr-verified-text').textContent = order.payMethod === 'mpesa' ? 'M-Pesa Verified' : 'KCA SmartCard Paid';

  const isReady = order.status === 'ready';
  $('qr-status-pill').textContent = isReady ? '✓ READY FOR COLLECTION' : '⏳ IN KITCHEN PREPARATION';
  $('qr-status-pill').className = isReady ? 'qr-status ready-status' : 'qr-status';

  // Draw Dynamic QR Matrix on Canvas
  drawDynamicQrCanvas(order);
}

function drawDynamicQrCanvas(order) {
  const canvas = $('qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Draw QR code position patterns (Corner squares)
  ctx.fillStyle = '#6B1A2A'; // KCA Maroon
  drawCornerSquare(ctx, 15, 15, 45);
  drawCornerSquare(ctx, size - 60, 15, 45);
  drawCornerSquare(ctx, 15, size - 60, 45);

  // Seeded pseudorandom binary modules based on order ID
  const hash = String(order.id) + String(order.regNo);
  const gridSize = 21;
  const cellSize = (size - 30) / gridSize;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Avoid corner squares
      if ((r < 7 && c < 7) || (r < 7 && c > gridSize - 8) || (r > gridSize - 8 && c < 7)) {
        continue;
      }
      const charCode = hash.charCodeAt((r * gridSize + c) % hash.length);
      if ((charCode + r + c) % 2 === 0) {
        ctx.fillStyle = (r + c) % 3 === 0 ? '#C9981F' : '#6B1A2A';
        ctx.fillRect(15 + c * cellSize, 15 + r * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  // Draw Center KCA Logo badge
  ctx.fillStyle = '#FAF8F5';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#C9981F';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#6B1A2A';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KCA', size / 2, size / 2);
}

function drawCornerSquare(ctx, x, y, s) {
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 7, y + 7, s - 14, s - 14);
  ctx.fillStyle = '#6B1A2A';
  ctx.fillRect(x + 13, y + 13, s - 26, s - 26);
}

// Web Audio API Chime Synthesizer
function playReadyChime() {
  if (!isAudioEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Two-tone bell chime: E5 (659Hz) -> G#5 (830Hz)
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.15);
    gain2.gain.setValueAtTime(0.4, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 1.2);

  } catch (err) {
    console.warn('Web Audio chime not supported:', err);
  }
}

// Woosh Sound Effect (Noise Sweep)
function playWooshSound() {
  if (!isAudioEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(8000, now + 0.5);
    filter.frequency.exponentialRampToValueAtTime(100, now + 1.0);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
    gain.gain.linearRampToValueAtTime(0, now + 1.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 1.0);
  } catch (err) {
    console.warn('Woosh sound failed:', err);
  }
}

// ============================================================
// 11. CAFETERIA STATUS & ANALYTICS
// ============================================================
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
    // console.warn('Could not fetch queue status');
  }
}

function renderAnalyticsCharts() {
  // Predicted vs actual rush
  const barChart = $('bar-chart');
  if (!barChart) return;

  const hours = [
    { h: '7AM', act: 5, pred: 7 },
    { h: '8AM', act: 14, pred: 16 },
    { h: '10AM', act: 8, pred: 9 },
    { h: '12PM', act: 48, pred: 52 },
    { h: '1PM', act: 40, pred: 45 },
    { h: '3PM', act: 12, pred: 14 },
    { h: '5PM', act: 16, pred: 18 }
  ];

  barChart.innerHTML = hours.map(item => `
    <div class="bar-col">
      <div class="bars-wrap">
        <div class="bar-actual" style="height:${item.act * 1.5}px;" title="Actual: ${item.act}"></div>
        <div class="bar-pred" style="height:${item.pred * 1.5}px;" title="Predicted: ${item.pred}"></div>
      </div>
      <span class="bar-hour">${item.h}</span>
    </div>
  `).join('');

  // Top Sellers
  const topSellersList = $('top-sellers-list');
  if (topSellersList) {
    const top = [...MENU_ITEMS].sort((a,b) => (b.soldCount||0) - (a.soldCount||0)).slice(0, 3);
    topSellersList.innerHTML = top.map((item, idx) => `
      <div class="top-seller-row">
        <span>#${idx+1} ${item.emoji} ${item.name}</span>
        <strong>${item.soldCount || 35} orders today</strong>
      </div>
    `).join('');
  }

  // Low rated items
  const lowList = $('low-rated-list');
  if (lowList) {
    const low = MENU_ITEMS.filter(m => m.rating < 3.5);
    if (!low.length) {
      lowList.innerHTML = `<p style="font-size:0.8rem; color:var(--green);">✓ All cafeteria dishes currently meeting high quality standards (>3.5⭐)</p>`;
    } else {
      lowList.innerHTML = low.map(item => `
        <div class="low-rated-row">
          <span>${item.emoji} ${item.name}</span>
          <span style="color:var(--red); font-weight:700;">⭐ ${item.rating}</span>
        </div>
      `).join('');
    }
  }
}

// ============================================================
// 12. WALLET TOP UP MODAL
// ============================================================
function initWalletTopup() {
  $('open-topup-btn')?.addEventListener('click', () => {
    $('topup-modal').classList.remove('hidden');
  });

  $('topup-close')?.addEventListener('click', () => {
    $('topup-modal').classList.add('hidden');
  });

  document.querySelectorAll('.topup-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.topup-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      $('topup-custom-amt').value = chip.getAttribute('data-amt');
    });
  });

  $('confirm-topup-btn')?.addEventListener('click', async () => {
    const amt = parseInt($('topup-custom-amt').value, 10);
    const phone = $('topup-phone').value.trim();

    if (isNaN(amt) || amt < 10) {
      showToast('Enter valid top-up amount (min KSh 10)', 'warning');
      return;
    }

    $('topup-modal').classList.add('hidden');
    showToast(`M-Pesa STK prompt sent to ${phone}. Processing top up…`, 'info');

    try {
      let data;
      try {
        const res = await fetch(`${API_BASE}/api/wallet/topup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regNo: currentUser.regNo, amount: amt, phone })
        });
        data = await res.json();
      } catch (e) {
        data = { success: true, newBalance: currentUser.walletBalance + amt, ref: 'MP-' + Math.random().toString(36).substring(2,7).toUpperCase() };
      }

      if (data.success) {
        updateWalletDisplay(data.newBalance);
        showToast(`🎉 KSh ${amt} added to KCA MealCard! Ref: ${data.ref}`, 'success');
        sendNotification('M-Pesa Topup', `KSh ${amt} added successfully. Ref: ${data.ref}`, 'success');

        // Append to ledger list
        const txList = $('tx-list');
        if (txList) {
          const item = document.createElement('div');
          item.className = 'tx-item';
          item.innerHTML = `
            <span class="tx-icon green">↓</span>
            <div>
              <strong>M-Pesa Top Up</strong>
              <span>Just now · Ref: ${data.ref}</span>
            </div>
            <span class="tx-amount plus">+KSh ${amt}</span>
          `;
          txList.prepend(item);
        }
      }
    } catch (err) {
      showToast('Top up failed. Please try again.', 'error');
    }
  });
}

// ============================================================
// 13. FEEDBACK & STAR RATING MODAL
// ============================================================
let currentFeedbackTarget = null;
let selectedStar = 5;
let selectedEmoji = 5;

function initFeedbackModal() {
  $('feedback-close')?.addEventListener('click', () => $('feedback-modal').classList.add('hidden'));

  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach(s => {
    s.addEventListener('click', () => {
      selectedStar = parseInt(s.getAttribute('data-val'), 10);
      stars.forEach(st => {
        st.classList.toggle('active', parseInt(st.getAttribute('data-val'), 10) <= selectedStar);
      });
    });
  });

  const emojis = document.querySelectorAll('.emoji-reactions .emoji-btn');
  emojis.forEach(e => {
    e.addEventListener('click', () => {
      emojis.forEach(em => em.classList.remove('active'));
      e.classList.add('active');
      selectedEmoji = parseInt(e.getAttribute('data-val'), 10);
    });
  });

  $('feedback-submit')?.addEventListener('click', async () => {
    if (!currentFeedbackTarget) return;

    const comment = $('feedback-comment')?.value || '';
    try {
      await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: currentFeedbackTarget.orderId,
          itemId: currentFeedbackTarget.itemId,
          regNo: currentUser.regNo,
          rating: selectedStar,
          emoji: selectedEmoji,
          comment
        })
      });
    } catch (e) {
      console.warn('Recorded feedback locally.');
    }

    $('feedback-modal').classList.add('hidden');
    showToast('Thank you! Your feedback shapes cafeteria food quality.', 'success');
  });
}

window.openFeedbackModal = function(orderId, itemId, itemName) {
  currentFeedbackTarget = { orderId, itemId, itemName };
  $('feedback-item-name').textContent = itemName;
  $('feedback-modal').classList.remove('hidden');
};

// ============================================================
// 14. ITEM DETAIL MODAL
// ============================================================
function openItemModal(itemId) {
  const item = MENU_ITEMS.find(m => m.id === itemId);
  if (!item) return;

  $('item-detail-img').innerHTML = `<span style="font-size:4.5rem;">${item.emoji}</span>`;
  $('item-detail-name').textContent = item.name;
  $('item-detail-price').textContent = `KSh ${item.price}`;
  $('item-detail-rating').textContent = `⭐ ${item.rating}`;
  $('item-detail-orders').textContent = `📦 ${item.soldCount || 30} orders`;
  $('item-detail-avail').textContent = item.available ? '✓ In Stock' : '✕ Sold Out';
  $('item-detail-desc').textContent = item.desc;
  $('item-detail-allergens').textContent = `Allergen warning: ${item.allergens || 'None reported'}`;

  $('item-detail-nutri').innerHTML = `
    <span class="nutri-pill">🔥 ${item.calories} kcal</span>
    <span class="nutri-pill">💪 ${item.protein}g Protein</span>
    <span class="nutri-pill">${item.category.toUpperCase()}</span>
  `;

  let currentQty = 1;
  $('qty-val').textContent = currentQty;
  $('add-to-cart-price').textContent = `KSh ${item.price * currentQty}`;

  $('qty-minus').onclick = () => {
    if (currentQty > 1) {
      currentQty--;
      $('qty-val').textContent = currentQty;
      $('add-to-cart-price').textContent = `KSh ${item.price * currentQty}`;
    }
  };

  $('qty-plus').onclick = () => {
    currentQty++;
    $('qty-val').textContent = currentQty;
    $('add-to-cart-price').textContent = `KSh ${item.price * currentQty}`;
  };

  $('add-to-cart-btn').onclick = () => {
    addToCart(item.id, currentQty);
    $('item-modal').classList.add('hidden');
  };

  $('item-modal').classList.remove('hidden');
  $('item-close').onclick = () => $('item-modal').classList.add('hidden');
}

// ============================================================
// 15. THEME & SETTINGS
// ============================================================
function initThemeAndSettings() {
  const darkToggle = $('dark-toggle');
  darkToggle?.addEventListener('change', e => {
    document.body.classList.toggle('dark', e.target.checked);
    showToast(e.target.checked ? 'Dark theme enabled' : 'Light theme enabled', 'info');
  });

  const audioToggle = $('audio-toggle');
  audioToggle?.addEventListener('change', e => {
    isAudioEnabled = e.target.checked;
    showToast(isAudioEnabled ? 'Order chimes turned ON 🔔' : 'Order chimes MUTED 🔕', 'info');
  });
}

// ============================================================
// 16. TOAST NOTIFICATION UTILITY
// ============================================================
function showToast(message, type = 'info') {
  const container = $('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
