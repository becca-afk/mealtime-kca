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

// Determine API Base URL intelligently:
// If on port 3000, relative is fine.
// If on another port (e.g. 5500 Live Server, 8080, etc.) or file://, target http://localhost:3000.
// If deployed to a real domain (not localhost/127.0.0.1), use relative.
function getApiBase() {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  const { protocol, hostname, port } = window.location;
  if (port === '3000') return '';
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && protocol.startsWith('http')) return '';
  return 'http://localhost:3000';
}
const API_BASE = getApiBase();

async function safeApiFetch(endpoint, options = {}) {
  const urlsToTry = [];
  const primary = `${API_BASE}${endpoint}`;
  urlsToTry.push(primary);
  if (API_BASE !== '' && !urlsToTry.includes(endpoint)) {
    urlsToTry.push(endpoint);
  }
  if (!urlsToTry.includes(`http://localhost:3000${endpoint}`)) {
    urlsToTry.push(`http://localhost:3000${endpoint}`);
  }

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, options);
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
      }
    } catch (e) {
      // try next fallback candidate
    }
  }
  return { ok: false, status: 0, data: null };
}

// ===== DATA SEED (FALLBACK & INITIAL STATE) =====
let MENU_ITEMS = [
  {
    "id": 101,
    "name": "Eggs Curry",
    "subname": "Chef special healthy",
    "emoji": "🍳",
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80",
    "price": 150,
    "prepTime": "25 Mins",
    "calories": 420,
    "protein": 24,
    "rating": 4.8,
    "orders": 48,
    "category": "main",
    "tags": [
      "veg"
    ],
    "allergens": "Egg",
    "desc": "Eggs Curry with tomato and cucumbers, chef special healthy dish for energy and nutrition.",
    "badge": "hot",
    "available": true,
    "soldCount": 48
  },
  {
    "id": 102,
    "name": "Chicken Slice",
    "subname": "Real chicken & garden salad",
    "emoji": "🥗",
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80",
    "price": 180,
    "prepTime": "20 Mins",
    "calories": 490,
    "protein": 38,
    "rating": 4.7,
    "orders": 36,
    "category": "main",
    "tags": [
      "halal"
    ],
    "allergens": "None",
    "desc": "Tender seasoned grilled chicken breast slices served over crisp garden salad with light olive vinaigrette.",
    "badge": "new",
    "available": true,
    "soldCount": 36
  },
  {
    "id": 1,
    "name": "Beef Stew + Ugali",
    "subname": "Slow-cooked hearty beef",
    "emoji": "🍛",
    "img": "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80",
    "price": 120,
    "prepTime": "10 Mins",
    "calories": 650,
    "protein": 32,
    "rating": 4.6,
    "orders": 34,
    "category": "main",
    "tags": [
      "halal",
      "spicy"
    ],
    "allergens": "None",
    "desc": "Slow-cooked beef stew with hot tender ugali. Hearty, rich and satisfying.",
    "badge": "hot",
    "available": true,
    "soldCount": 34
  },
  {
    "id": 2,
    "name": "Pilau + Kachumbari",
    "subname": "Coastal spiced beef pilau",
    "emoji": "🍚",
    "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80",
    "price": 150,
    "prepTime": "15 Mins",
    "calories": 580,
    "protein": 22,
    "rating": 4.5,
    "orders": 28,
    "category": "main",
    "tags": [
      "halal"
    ],
    "allergens": "None",
    "desc": "Fragrant coastal spiced pilau with fresh tomato-onion kachumbari salad.",
    "badge": null,
    "available": true,
    "soldCount": 28
  },
  {
    "id": 12,
    "name": "Fried Chicken + Chips",
    "subname": "Crispy fried chicken & fries",
    "emoji": "🍗",
    "img": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&auto=format&fit=crop&q=80",
    "price": 220,
    "prepTime": "15 Mins",
    "calories": 780,
    "protein": 42,
    "rating": 4.8,
    "orders": 50,
    "category": "main",
    "tags": [
      "halal"
    ],
    "allergens": "Gluten",
    "desc": "Deep fried crispy chicken leg served with freshly made golden potato chips.",
    "badge": "hot",
    "available": true,
    "soldCount": 50
  },
  {
    "id": 4,
    "name": "Githeri Special",
    "subname": "Boiled maize & beans",
    "emoji": "🫘",
    "img": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&auto=format&fit=crop&q=80",
    "price": 80,
    "prepTime": "8 Mins",
    "calories": 460,
    "protein": 24,
    "rating": 3.8,
    "orders": 18,
    "category": "main",
    "tags": [
      "veg",
      "halal"
    ],
    "allergens": "None",
    "desc": "Boiled maize and kidney beans fried with tomatoes, onions and fresh coriander.",
    "badge": "veg",
    "available": true,
    "soldCount": 18
  },
  {
    "id": 6,
    "name": "Chapati + Beans",
    "subname": "Layered chapati & yellow beans",
    "emoji": "🫓",
    "img": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&auto=format&fit=crop&q=80",
    "price": 60,
    "prepTime": "5 Mins",
    "calories": 480,
    "protein": 18,
    "rating": 4.3,
    "orders": 22,
    "category": "main",
    "tags": [
      "veg"
    ],
    "allergens": "Gluten",
    "desc": "Two soft layered chapatis served with seasoned yellow bean curry.",
    "badge": null,
    "available": true,
    "soldCount": 22
  },
  {
    "id": 10,
    "name": "Sukuma Wiki + Rice",
    "subname": "Collard greens & steamed rice",
    "emoji": "🍃",
    "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80",
    "price": 90,
    "prepTime": "8 Mins",
    "calories": 410,
    "protein": 11,
    "rating": 4,
    "orders": 20,
    "category": "main",
    "tags": [
      "veg",
      "halal"
    ],
    "allergens": "None",
    "desc": "Fresh collard greens sauteed with sweet onions, served with steamed white rice.",
    "badge": "veg",
    "available": true,
    "soldCount": 20
  },
  {
    "id": 14,
    "name": "Tilapia Fish + Ugali",
    "subname": "Pan-fried whole lake fish",
    "emoji": "🐟",
    "img": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&auto=format&fit=crop&q=80",
    "price": 140,
    "prepTime": "15 Mins",
    "calories": 590,
    "protein": 38,
    "rating": 4.1,
    "orders": 15,
    "category": "main",
    "tags": [
      "halal"
    ],
    "allergens": "Fish",
    "desc": "Pan-fried whole lake tilapia served with ugali and sauteed traditional greens.",
    "badge": null,
    "available": true,
    "soldCount": 15
  },
  {
    "id": 16,
    "name": "Ndengu Special + Rice",
    "subname": "Green grams coconut curry",
    "emoji": "🍲",
    "img": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&auto=format&fit=crop&q=80",
    "price": 80,
    "prepTime": "10 Mins",
    "calories": 450,
    "protein": 21,
    "rating": 4.3,
    "orders": 29,
    "category": "main",
    "tags": [
      "veg",
      "halal"
    ],
    "allergens": "None",
    "desc": "Green grams simmered in coconut tomato gravy over fluffy steamed rice.",
    "badge": "veg",
    "available": true,
    "soldCount": 29
  },
  {
    "id": 5,
    "name": "Chicken Burger",
    "subname": "Crispy fillet burger",
    "emoji": "🍔",
    "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80",
    "price": 200,
    "prepTime": "12 Mins",
    "calories": 620,
    "protein": 35,
    "rating": 4.7,
    "orders": 41,
    "category": "snack",
    "tags": [
      "halal"
    ],
    "allergens": "Gluten",
    "desc": "Crispy chicken fillet with shredded lettuce and creamy sauce in sesame bun.",
    "badge": "hot",
    "available": true,
    "soldCount": 41
  },
  {
    "id": 9,
    "name": "Beef Samosa (2 pcs)",
    "subname": "Crunchy golden pastry",
    "emoji": "🥟",
    "img": "https://images.unsplash.com/photo-1601050690186-b48ff085ca88?w=700&auto=format&fit=crop&q=80",
    "price": 40,
    "prepTime": "5 Mins",
    "calories": 260,
    "protein": 12,
    "rating": 4.3,
    "orders": 38,
    "category": "snack",
    "tags": [
      "halal"
    ],
    "allergens": "Gluten",
    "desc": "Crunchy golden pastry triangles stuffed with spiced minced beef.",
    "badge": "new",
    "available": true,
    "soldCount": 38
  },
  {
    "id": 3,
    "name": "Mandazi (3 pcs)",
    "subname": "Fresh morning batch",
    "emoji": "🥐",
    "img": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&auto=format&fit=crop&q=80",
    "price": 30,
    "prepTime": "3 Mins",
    "calories": 320,
    "protein": 6,
    "rating": 4.1,
    "orders": 55,
    "category": "snack",
    "tags": [
      "veg"
    ],
    "allergens": "Gluten",
    "desc": "Golden fluffy fried mandazi. Fresh from the morning batch.",
    "badge": null,
    "available": true,
    "soldCount": 55
  },
  {
    "id": 15,
    "name": "Fresh Banana Bunch",
    "subname": "Sweet ripe bananas",
    "emoji": "🍌",
    "img": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&auto=format&fit=crop&q=80",
    "price": 20,
    "prepTime": "1 Mins",
    "calories": 110,
    "protein": 1,
    "rating": 4.2,
    "orders": 35,
    "category": "snack",
    "tags": [
      "veg",
      "halal"
    ],
    "allergens": "None",
    "desc": "Sweet ripe Cavendish bananas. Quick healthy brain fuel between lectures.",
    "badge": null,
    "available": true,
    "soldCount": 35
  },
  {
    "id": 18,
    "name": "Egg Sandwich Toast",
    "subname": "Toasted fried egg sandwich",
    "emoji": "🍳",
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80",
    "price": 50,
    "prepTime": "5 Mins",
    "calories": 310,
    "protein": 14,
    "rating": 4,
    "orders": 18,
    "category": "snack",
    "tags": [
      "veg"
    ],
    "allergens": "Gluten,Egg",
    "desc": "Double toasted buttered bread with seasoned fried eggs and tomato slice.",
    "badge": null,
    "available": true,
    "soldCount": 18
  },
  {
    "id": 19,
    "name": "Campus Smocha",
    "subname": "Smokie wrapped in warm chapati",
    "emoji": "🌯",
    "img": "https://images.unsplash.com/photo-1627042633145-b780d842ba45?w=700&auto=format&fit=crop&q=80",
    "price": 60,
    "prepTime": "3 Mins",
    "calories": 380,
    "protein": 15,
    "rating": 4.9,
    "orders": 72,
    "category": "snack",
    "tags": [
      "halal"
    ],
    "allergens": "Gluten",
    "desc": "The iconic campus snack: grilled beef smokie wrapped in a warm soft chapati with fresh kachumbari and spicy sauce.",
    "badge": "hot",
    "available": true,
    "soldCount": 72
  },
  {
    "id": 8,
    "name": "Coca Cola (500ml)",
    "subname": "Ice-cold original taste",
    "emoji": "🥤",
    "img": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=700&auto=format&fit=crop&q=80",
    "price": 50,
    "prepTime": "1 Mins",
    "calories": 210,
    "protein": 0,
    "rating": 4.6,
    "orders": 68,
    "category": "drink",
    "tags": [],
    "allergens": "None",
    "desc": "Ice-cold Coca-Cola classic in 500ml chilled bottle.",
    "badge": "hot",
    "available": true,
    "soldCount": 68
  },
  {
    "id": 20,
    "name": "Fanta Orange (500ml)",
    "subname": "Zesty sparkling citrus soda",
    "emoji": "🍊",
    "img": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=700&auto=format&fit=crop&q=80",
    "price": 50,
    "prepTime": "1 Mins",
    "calories": 210,
    "protein": 0,
    "rating": 4.5,
    "orders": 45,
    "category": "drink",
    "tags": [],
    "allergens": "None",
    "desc": "Sparkling orange flavored soft drink, ice-chilled and refreshing.",
    "badge": null,
    "available": true,
    "soldCount": 45
  },
  {
    "id": 21,
    "name": "Diet Pepsi (500ml)",
    "subname": "Zero sugar crisp cola",
    "emoji": "🥤",
    "img": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=700&auto=format&fit=crop&q=80",
    "price": 55,
    "prepTime": "1 Mins",
    "calories": 0,
    "protein": 0,
    "rating": 4.3,
    "orders": 32,
    "category": "drink",
    "tags": [],
    "allergens": "None",
    "desc": "Crisp sugar-free cola drink with zero calories. Served ice cold.",
    "badge": null,
    "available": true,
    "soldCount": 32
  },
  {
    "id": 22,
    "name": "Iced Passion Cold Drink",
    "subname": "Ice-cold brewed tea & passion juice",
    "emoji": "🧋",
    "img": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=700&auto=format&fit=crop&q=80",
    "price": 60,
    "prepTime": "2 Mins",
    "calories": 140,
    "protein": 1,
    "rating": 4.7,
    "orders": 54,
    "category": "drink",
    "tags": [
      "veg"
    ],
    "allergens": "None",
    "desc": "Freshly brewed cold herbal tea infused with real passion fruit juice and ice cubes.",
    "badge": "new",
    "available": true,
    "soldCount": 54
  },
  {
    "id": 23,
    "name": "Iced Cold Coffee",
    "subname": "Chilled rich espresso & milk over ice",
    "emoji": "🧊",
    "img": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&auto=format&fit=crop&q=80",
    "price": 70,
    "prepTime": "3 Mins",
    "calories": 160,
    "protein": 5,
    "rating": 4.8,
    "orders": 40,
    "category": "drink",
    "tags": [
      "veg"
    ],
    "allergens": "Dairy",
    "desc": "Smooth Kenyan Arabica cold brew with fresh creamy milk served over crystal ice cubes.",
    "badge": "hot",
    "available": true,
    "soldCount": 40
  },
  {
    "id": 11,
    "name": "Fresh Mango Juice",
    "subname": "100% natural cold pressed",
    "emoji": "🧃",
    "img": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=700&auto=format&fit=crop&q=80",
    "price": 60,
    "prepTime": "3 Mins",
    "calories": 180,
    "protein": 2,
    "rating": 4.5,
    "orders": 25,
    "category": "drink",
    "tags": [
      "veg"
    ],
    "allergens": "None",
    "desc": "100% freshly pressed ripe mango juice without added sugar or preservatives.",
    "badge": "new",
    "available": true,
    "soldCount": 25
  },
  {
    "id": 7,
    "name": "Maziwa Mala (500ml)",
    "subname": "Chilled cultured probiotic milk",
    "emoji": "🥛",
    "img": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80",
    "price": 40,
    "prepTime": "2 Mins",
    "calories": 280,
    "protein": 16,
    "rating": 4,
    "orders": 30,
    "category": "drink",
    "tags": [
      "veg"
    ],
    "allergens": "Dairy",
    "desc": "Chilled fermented cultured milk. Probiotic and refreshing companion for ugali.",
    "badge": null,
    "available": true,
    "soldCount": 30
  },
  {
    "id": 13,
    "name": "Masala Spiced Chai",
    "subname": "Steaming hot ginger & cardamom tea",
    "emoji": "☕",
    "img": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80",
    "price": 30,
    "prepTime": "3 Mins",
    "calories": 120,
    "protein": 4,
    "rating": 4.4,
    "orders": 60,
    "category": "drink",
    "tags": [
      "veg"
    ],
    "allergens": "Dairy",
    "desc": "Steaming hot brewed Kenyan tea infused with ginger, cardamom and cinnamon spices.",
    "badge": null,
    "available": true,
    "soldCount": 60
  },
  {
    "id": 17,
    "name": "Yoghurt Cup (Strawberry)",
    "subname": "Creamy probiotic strawberry yoghurt",
    "emoji": "🍦",
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&auto=format&fit=crop&q=80",
    "price": 50,
    "prepTime": "1 Mins",
    "calories": 190,
    "protein": 8,
    "rating": 4.2,
    "orders": 22,
    "category": "drink",
    "tags": [
      "veg"
    ],
    "allergens": "Dairy",
    "desc": "Smooth probiotic whole-milk strawberry yoghurt with real fruit bits.",
    "badge": null,
    "available": true,
    "soldCount": 22
  },
  {
    "id": 24,
    "name": "Chilled Mineral Water (500ml)",
    "subname": "Pure spring bottled drinking water",
    "emoji": "💧",
    "img": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=700&auto=format&fit=crop&q=80",
    "price": 30,
    "prepTime": "1 Mins",
    "calories": 0,
    "protein": 0,
    "rating": 4.9,
    "orders": 85,
    "category": "drink",
    "tags": [
      "veg"
    ],
    "allergens": "None",
    "desc": "Pure crisp Kenyan natural mineral water, ice-cold and hydrating.",
    "badge": null,
    "available": true,
    "soldCount": 85
  }
];

// App State
let currentUser = {
  regNo: '2502692',
  name: 'Rebecca Amani',
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

function initModalFocusMode() {
  const overlays = document.querySelectorAll('.modal-overlay');
  const updateVisibility = () => {
    const modalIsOpen = [...overlays].some(overlay => !overlay.classList.contains('hidden'));
    $('bottom-nav')?.classList.toggle('modal-focus-hidden', modalIsOpen);
    $('floating-checkout-bar')?.classList.toggle('modal-focus-hidden', modalIsOpen);
  };

  overlays.forEach(overlay => {
    new MutationObserver(updateVisibility).observe(overlay, {
      attributes: true,
      attributeFilter: ['class']
    });
  });
  updateVisibility();
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  initModalFocusMode();

  // Register Service Worker for PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker Registration Failed!', err));
  }

  initLogin();
  initNotifications();
  initNavigation();
  initCulinaryShowcase();
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
  $('home-wallet-balance').textContent = formatted;
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
        if (!$('cart-modal').classList.contains('hidden')) {
          closeCartModal();
        }
        switchPage(page);
      }
    });
  });

  function selectCafeteria(category, preferGrid = true) {
    const cat = category || 'all';
    const meta = {
      'main': { title: '🍛 Kenyan Food Cafeteria Counter', icon: '🍛' },
      'snack': { title: '🥟 Smochas & Snacks Cafeteria Counter', icon: '🥟' },
      'drink': { title: '🧃 Drinks Shop & Cold Beverages', icon: '🧃' },
      'all': { title: 'All Campus Dishes & Counters', icon: '🏛️' }
    }[cat] || { title: 'All Campus Dishes & Counters', icon: '🏛️' };

    if ($('ccb-title')) $('ccb-title').textContent = meta.title;
    if ($('ccb-icon')) $('ccb-icon').textContent = meta.icon;

    document.querySelectorAll('.ccb-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-cafeteria-target') === cat);
    });

    const gridCategory = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
    if (gridCategory) {
      document.querySelectorAll('.filter-btn').forEach(button => button.classList.remove('active'));
      gridCategory.classList.add('active');
    }

    const railCategory = document.querySelector(`.cat-pill[data-rail-cat="${cat}"]`);
    if (railCategory) {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      railCategory.classList.add('active');
    }

    currentShowcaseCat = cat;
    renderCulinaryShowcase(cat, $('menu-search')?.value || '');
    renderMenu(cat, $('menu-search')?.value || '', $('menu-sort')?.value || 'rating');

    if (preferGrid) {
      $('btn-view-grid')?.click();
    }
  }

  window.selectCafeteria = selectCafeteria;

  document.querySelectorAll('.cafeteria-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const category = card.getAttribute('data-cafeteria-filter') || 'all';
      switchPage('menu');
      selectCafeteria(category, true);
    });
  });

  document.querySelectorAll('.ccb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-cafeteria-target') || 'all';
      selectCafeteria(target, false);
    });
  });

  $('home-wallet-topup')?.addEventListener('click', () => $('open-topup-btn')?.click());

  // Role switcher in header (1-tap switch between student & kitchen staff)
  $('role-switch-header-btn')?.addEventListener('click', toggleRole);

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

function toggleRole() {
  if (currentRole === 'student') {
    currentRole = 'staff';
    $('header-campus-label').textContent = 'KCA Cafeteria Dispatch Terminal · Staff Session';
    $('header-wallet-btn').style.display = 'none';
    $('bottom-nav').style.display = 'none';
    $('floating-checkout-bar')?.classList.add('hidden');
    $('user-avatar-text').textContent = '👨‍🍳';
    $('role-switch-icon').textContent = '🎓';
    $('role-switch-label').textContent = 'Student Portal';
    switchPage('kds');
    renderKdsBoard();
    showToast('👨‍🍳 Switched to Kitchen Staff Dispatch Terminal', 'info');
  } else {
    currentRole = 'student';
    $('header-campus-label').textContent = 'KCA University · Ruaraka Main Campus';
    $('header-wallet-btn').style.display = 'flex';
    $('bottom-nav').style.display = 'flex';
    if (Object.values(cart).reduce((a,b)=>a+b, 0) > 0) {
      $('floating-checkout-bar')?.classList.remove('hidden');
    }
    const initials = (currentUser.regNo || '25').substring(0, 2);
    $('user-avatar-text').textContent = initials;
    $('role-switch-icon').textContent = '👨‍🍳';
    $('role-switch-label').textContent = 'Kitchen KDS';
    switchPage('home');
    showToast('🎓 Switched to Student Portal', 'success');
  }
}

// ============================================================
// 5. MENU & HOME PAGE RENDERING
// ============================================================
async function fetchMenuItems() {
  try {
    const apiResult = await safeApiFetch('/api/menu');
    if (apiResult.ok && Array.isArray(apiResult.data) && apiResult.data.length) {
      MENU_ITEMS = apiResult.data;
    }
  } catch (err) {
    console.warn('Using seeded menu items.');
  }

  renderTopPicks();
  renderOrderAgain();
  renderMenu('all', '', 'rating');
  renderCulinaryShowcase(currentShowcaseCat, currentShowcaseSearch);
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
  const halalBadge = item.tags.includes('halal') ? '<span class="tag-chip halal">☪ Halal</span>' : '';
  const vegBadge = item.tags.includes('veg') ? '<span class="tag-chip veg">🌱 Veg</span>' : '';
  const hotBadge = item.badge === 'hot' ? '<span class="badge-ribbon hot">🔥 Top Seller</span>' : '';
  const newBadge = item.badge === 'new' ? '<span class="badge-ribbon new-badge">✨ New</span>' : '';
  const vegRibbon = item.badge === 'veg' ? '<span class="badge-ribbon veg-ribbon">🌱 Veg</span>' : '';

  // Build star display
  const fullStars = Math.floor(item.rating);
  const halfStar = item.rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const starsHTML = '★'.repeat(fullStars) + (halfStar ? '⯨' : '') + '☆'.repeat(emptyStars);

  const imgHTML = item.img 
    ? `<img src="${item.img}" alt="${item.name}" class="mc-photo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="mc-fallback-emoji" style="display:none;"><div class="mc-emoji-bg"></div><span class="mc-emoji">${item.emoji}</span></div>`
    : `<div class="mc-emoji-bg"></div><span class="mc-emoji">${item.emoji}</span>`;

  return `
    <div class="menu-card" data-item-id="${item.id}">
      <div class="mc-img-wrap">
        ${imgHTML}
        ${hotBadge}${newBadge}${vegRibbon}
        <div class="mc-dietary-strip">${halalBadge}${vegBadge}</div>
      </div>
      <div class="mc-content">
        <div class="mc-title-row">
          <h4 class="mc-name">${item.name}</h4>
        </div>
        <p class="mc-desc">${item.desc}</p>
        <div class="mc-rating-row">
          <span class="mc-stars">${starsHTML}</span>
          <span class="mc-rating-num">${item.rating}</span>
          <span class="mc-review-count">(${item.soldCount || 0} reviews)</span>
        </div>
        <div class="mc-nutri-row">
          <span class="mc-cal">🔥 ${item.calories} kcal</span>
          <span class="mc-prot">💪 ${item.protein}g</span>
        </div>
        <div class="mc-footer">
          <span class="mc-price-big">KSh ${item.price}</span>
          <button class="mc-add-btn" data-id="${item.id}" ${!item.available ? 'disabled' : ''}>
            ${item.available ? '+ Add' : 'Sold Out'}
          </button>
        </div>
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
// 5B. CULINARY SHOWCASE CONTROLLER (Pinterest Luxury Dining UI)
// ============================================================
let currentShowcaseItem = MENU_ITEMS[0];
let currentShowcaseCat = 'all';
let currentShowcaseSearch = '';
let showcaseFavorites = new Set([101, 1]); // Eggs Curry & Beef Stew favorited by default

function initCulinaryShowcase() {
  const btnShowcase = $('btn-view-showcase');
  const btnGrid = $('btn-view-grid');
  const showcaseView = $('culinary-showcase-view');
  const gridView = $('classic-grid-view');

  // View switchers
  btnShowcase?.addEventListener('click', () => {
    btnShowcase.classList.add('active');
    btnGrid?.classList.remove('active');
    showcaseView?.classList.remove('hidden');
    gridView?.classList.add('hidden');
    renderCulinaryShowcase(currentShowcaseCat, currentShowcaseSearch);
  });

  btnGrid?.addEventListener('click', () => {
    btnGrid.classList.add('active');
    btnShowcase?.classList.remove('active');
    showcaseView?.classList.add('hidden');
    gridView?.classList.remove('hidden');
    const filter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderMenu(filter, currentShowcaseSearch, $('menu-sort')?.value || 'rating');
  });

  // Rail Cart button
  $('rail-cart-btn')?.addEventListener('click', openCartModal);

  // Rail Profile button
  $('rail-profile-btn')?.addEventListener('click', () => switchPage('profile'));

  // Rail Category Pills
  const catPills = document.querySelectorAll('.rail-pill.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentShowcaseCat = pill.getAttribute('data-rail-cat') || 'all';
      renderCulinaryShowcase(currentShowcaseCat, currentShowcaseSearch);
    });
  });

  // Search input syncing
  $('menu-search')?.addEventListener('input', e => {
    currentShowcaseSearch = e.target.value;
    renderCulinaryShowcase(currentShowcaseCat, currentShowcaseSearch);
    const activeGridFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderMenu(activeGridFilter, currentShowcaseSearch, $('menu-sort')?.value || 'rating');
  });

  // Featured Card: Previous and Next buttons (< and ...)
  $('feature-prev-btn')?.addEventListener('click', () => cycleShowcaseItem(-1));
  $('feature-next-btn')?.addEventListener('click', () => cycleShowcaseItem(1));

  // Featured Card: Details / Reviews buttons
  $('feature-more-btn')?.addEventListener('click', () => {
    if (currentShowcaseItem) openItemModal(currentShowcaseItem.id);
  });
  $('feature-reviews-btn')?.addEventListener('click', () => {
    if (currentShowcaseItem) openItemModal(currentShowcaseItem.id);
  });

  // Featured Card: Favorite Heart toggle
  $('feature-fav-btn')?.addEventListener('click', () => {
    if (!currentShowcaseItem) return;
    toggleFavorite(currentShowcaseItem.id);
  });

  // Featured Card: Signature Black Pill Add to Cart
  $('feature-add-cart-btn')?.addEventListener('click', () => {
    if (!currentShowcaseItem) return;
    addToCart(currentShowcaseItem.id);
    
    // Quick micro-animation
    const btn = $('feature-add-cart-btn');
    if (btn) {
      btn.style.transform = 'scale(0.93)';
      setTimeout(() => { btn.style.transform = ''; }, 180);
    }
  });

  // Initial render
  renderCulinaryShowcase('all', '');
}

function getFilteredShowcaseList(cat = 'all', query = '') {
  let list = [...MENU_ITEMS];
  if (cat === 'main')  list = list.filter(m => m.category === 'main');
  else if (cat === 'snack') list = list.filter(m => m.category === 'snack');
  else if (cat === 'drink') list = list.filter(m => m.category === 'drink');
  else if (cat === 'veg')   list = list.filter(m => m.tags && m.tags.includes('veg'));
  else if (cat === 'favs')  list = list.filter(m => showcaseFavorites.has(m.id));

  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(m => m.name.toLowerCase().includes(q) || (m.desc && m.desc.toLowerCase().includes(q)));
  }
  return list;
}

function renderCulinaryShowcase(cat = 'all', query = '') {
  const container = $('showcase-dish-list');
  if (!container) return;

  const list = getFilteredShowcaseList(cat, query);
  const countEl = $('showcase-list-count');
  if (countEl) countEl.textContent = `${list.length} items`;

  if (!list.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
        <p style="font-size: 1.5rem; margin-bottom: 6px;">🍽️</p>
        <p style="font-size: 0.85rem; font-weight: 600;">No dishes found</p>
        <p style="font-size: 0.75rem; color: var(--text-faint);">Try searching another craving</p>
      </div>
    `;
    return;
  }

  // Ensure currentShowcaseItem is valid
  if (!currentShowcaseItem || !list.some(m => m.id === currentShowcaseItem.id)) {
    currentShowcaseItem = list[0];
  }

  container.innerHTML = list.map(item => {
    const isActive = currentShowcaseItem && item.id === currentShowcaseItem.id;
    const isFav = showcaseFavorites.has(item.id);
    return `
      <div class="showcase-dish-card ${isActive ? 'active' : ''}" data-showcase-id="${item.id}">
        <div class="sdc-plate-wrap">
          <img class="sdc-img" src="${item.img || ''}" alt="${item.name}" onerror="this.src='assets/logo.jpg'" />
        </div>
        <div class="sdc-info">
          <strong class="sdc-name">${item.name}</strong>
          <span class="sdc-sub">${item.subname || (item.desc ? item.desc.substring(0, 24) + '…' : '')}</span>
          <div class="sdc-price-row">
            <span class="sdc-price">KSh ${item.price}</span>
            <button class="sdc-fav ${isFav ? 'active' : ''}" data-fav-id="${item.id}" type="button" title="Favorite">
              ${isFav ? '❤️' : '♡'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Card click events
  container.querySelectorAll('.showcase-dish-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.sdc-fav')) return;
      const id = parseInt(card.getAttribute('data-showcase-id'), 10);
      const found = MENU_ITEMS.find(m => m.id === id);
      if (found) selectShowcaseItem(found);
    });
  });

  // Favorite icon clicks inside card
  container.querySelectorAll('.sdc-fav').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-fav-id'), 10);
      toggleFavorite(id);
    });
  });

  updateShowcaseFeatureCard(currentShowcaseItem);
}

function selectShowcaseItem(item) {
  currentShowcaseItem = item;

  // Highlight in sidebar
  document.querySelectorAll('.showcase-dish-card').forEach(card => {
    const cardId = parseInt(card.getAttribute('data-showcase-id'), 10);
    card.classList.toggle('active', cardId === item.id);
  });

  updateShowcaseFeatureCard(item);
}

function updateShowcaseFeatureCard(item) {
  if (!item) return;

  const plateImg = $('feature-plate-img');
  if (plateImg) {
    plateImg.style.opacity = '0';
    plateImg.style.transform = 'scale(0.85) rotate(-5deg)';
    setTimeout(() => {
      plateImg.src = item.img || 'assets/logo.jpg';
      plateImg.style.transition = 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
      plateImg.style.opacity = '1';
      plateImg.style.transform = 'scale(1) rotate(0deg)';
    }, 100);
  }

  const nameEl = $('feature-dish-name');
  if (nameEl) nameEl.textContent = item.name;

  const timeEl = $('feature-prep-time');
  if (timeEl) timeEl.textContent = item.prepTime || '20 Mins';

  const descEl = $('feature-dish-desc');
  if (descEl) descEl.textContent = item.desc;

  const calEl = $('feature-cal');
  if (calEl) calEl.textContent = `🔥 ${item.calories} kcal`;

  const protEl = $('feature-prot');
  if (protEl) protEl.textContent = `💪 ${item.protein}g Protein`;

  const revEl = $('feature-reviews-btn');
  if (revEl) revEl.textContent = `⭐ ${item.rating} (${item.soldCount || 30} reviews) 💬`;

  const priceEl = $('feature-price-amount');
  if (priceEl) priceEl.textContent = `KSh ${item.price}`;

  const badgePill = $('feature-dish-badge-pill');
  if (badgePill) {
    if (item.badge === 'hot') badgePill.textContent = "Chef's Signature Pick 🔥";
    else if (item.badge === 'new') badgePill.textContent = "✨ Fresh On Menu";
    else if (item.tags && item.tags.includes('veg')) badgePill.textContent = "🌱 Pure Healthy";
    else badgePill.textContent = "⭐ Comrade Choice";
  }

  const favBtn = $('feature-fav-btn');
  if (favBtn) {
    favBtn.classList.toggle('active', showcaseFavorites.has(item.id));
  }
}

function cycleShowcaseItem(direction = 1) {
  const list = getFilteredShowcaseList(currentShowcaseCat, currentShowcaseSearch);
  if (!list.length) return;

  const currentIndex = list.findIndex(m => m.id === currentShowcaseItem?.id);
  let nextIndex = currentIndex + direction;
  if (nextIndex < 0) nextIndex = list.length - 1;
  if (nextIndex >= list.length) nextIndex = 0;

  selectShowcaseItem(list[nextIndex]);
}

function toggleFavorite(itemId) {
  if (showcaseFavorites.has(itemId)) {
    showcaseFavorites.delete(itemId);
    showToast('Removed from favorites', 'info');
  } else {
    showcaseFavorites.add(itemId);
    showToast('Added to favorite cravings! ❤️', 'success');
  }
  renderCulinaryShowcase(currentShowcaseCat, currentShowcaseSearch);
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
    $('mpesa-phone-field')?.classList.remove('visible');
  });

  mpesaCard?.addEventListener('click', () => {
    mpesaCard.classList.add('active');
    walletCard.classList.remove('active');
    mpesaCard.querySelector('input').checked = true;
    $('pay-btn-text').textContent = 'Continue to M-Pesa Demo';
    $('mpesa-phone-field')?.classList.add('visible');
    $('cart-mpesa-phone')?.focus();
  });

  $('pay-btn')?.addEventListener('click', handleOrderSubmission);
  $('fcb-btn')?.addEventListener('click', openCartModal);
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

  const railBadge = $('rail-cart-count');
  if (railBadge) railBadge.textContent = totalCount;

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

  // Sync Floating Checkout Bar
  const fcb = $('floating-checkout-bar');
  if (fcb) {
    if (totalCount > 0 && currentRole === 'student') {
      fcb.classList.remove('hidden');
      const countEl = $('fcb-count');
      if (countEl) countEl.textContent = totalCount;
      const totalEl = $('fcb-total');
      if (totalEl) totalEl.textContent = `KSh ${grandTotal}`;
    } else {
      fcb.classList.add('hidden');
    }
  }
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
    if (!m) return null;
    return { id: m.id, name: m.name, price: m.price, qty: Number(qty) };
  }).filter(Boolean);

  if (!items.length) {
    showToast('Your tray is empty or items unavailable!', 'warning');
    return;
  }

  const subtotal = items.reduce((a,b) => a + (b.price * b.qty), 0);
  const total = subtotal + 5;
  const payMethod = document.querySelector('input[name="pay-method"]:checked')?.value || 'kca_wallet';
  const pickupTime = $('pickup-time')?.value || 'ASAP (~8 min)';
  const notes = $('order-special-notes')?.value || '';
  const mpesaPhone = $('cart-mpesa-phone')?.value?.trim() || '0712345678';

  pendingOrderPayload = {
    regNo: currentUser.regNo,
    studentName: currentUser.name,
    items,
    pickupTime,
    payMethod,
    notes,
    phone: mpesaPhone
  };

  if (payMethod === 'kca_wallet') {
    // Check balance
    if (currentUser.walletBalance < total) {
      showToast('Insufficient KCA MealCard balance! Please top up or pay via M-Pesa.', 'error');
      return;
    }
    await executeOrderPlacement(pendingOrderPayload);

  } else {
    // Validate phone for M-Pesa
    if (!mpesaPhone || mpesaPhone.length < 9) {
      showToast('Please enter your M-Pesa phone number to continue.', 'warning');
      $('cart-mpesa-phone')?.focus();
      return;
    }
    // Safaricom Lipa na M-Pesa STK Push
    closeCartModal();
    $('stk-amount-val').textContent = total;
    $('stk-reg-val').textContent = currentUser.regNo;
    $('stk-phone-display').textContent = mpesaPhone;
    currentStkPin = '';
    updatePinDots();
    $('stk-modal').classList.remove('hidden');

    // Auto-fill demo PIN after 1s for convenience
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

  // Realistic Safaricom Daraja STK Network Latency simulation
  await new Promise(r => setTimeout(r, 1400));

  // Guaranteed 100% success for university defense demo presentations
  const isSuccess = true;

  if (isSuccess) {
    $('stk-modal').classList.add('hidden');
    showToast('M-Pesa demo payment simulation successful. ✅', 'success');
    sendNotification('M-Pesa Demo Payment', `Simulated payment of KSh ${pendingOrderPayload.items.reduce((a,b) => a + (b.price * b.qty), 0) + 5} successful.`, 'success');
    
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
    let orderData = null;
    const apiResult = await safeApiFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (apiResult.ok && apiResult.data && apiResult.data.success && apiResult.data.order) {
      orderData = apiResult.data;
    } else if (apiResult.data && apiResult.data.error) {
      throw new Error(apiResult.data.error);
    } else {
      // Offline / Live Server fallback: seamlessly create ticket and record order locally
      const lastTicket = allOrders.reduce((max, o) => {
        const m = String(o.ticketNo || '').match(/#?KCA-(\d+)$/i);
        return m ? Math.max(max, Number(m[1])) : max;
      }, 50);
      const ticketNo = `#KCA-${String(lastTicket + 1).padStart(3, '0')}`;
      const subtotal = payload.items.reduce((acc, it) => acc + (it.price * it.qty), 0);
      const total = subtotal + 5;
      const orderId = `KCA-${new Date().getFullYear()}-${Date.now().toString(36)}`;
      
      if (payload.payMethod === 'kca_wallet') {
        currentUser.walletBalance = Math.max(0, currentUser.walletBalance - total);
        updateWalletDisplay(currentUser.walletBalance);
      }

      const localOrder = {
        id: orderId,
        ticketNo,
        regNo: payload.regNo || currentUser.regNo,
        studentName: payload.studentName || currentUser.name,
        items: payload.items,
        subtotal,
        serviceFee: 5,
        total,
        pickupTime: payload.pickupTime || 'ASAP (~8 min)',
        payMethod: payload.payMethod || 'kca_wallet',
        mpesaRef: payload.payMethod === 'mpesa' ? ('QK' + Math.random().toString(36).substring(2, 9).toUpperCase()) : `WAL-KCA-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'placed',
        createdAt: new Date().toISOString(),
        pickupCode: `QR-${orderId}-SECURE`,
        notes: payload.notes || '',
        reviewed: false
      };

      orderData = {
        success: true,
        order: localOrder,
        walletBalance: currentUser.walletBalance
      };
    }

    if (orderData && orderData.success) {
      closeCartModal();
      cart = {};
      updateCartUI();

      if (payload.payMethod === 'kca_wallet' && orderData.walletBalance != null) {
        updateWalletDisplay(orderData.walletBalance);
      }

      showToast(`🎉 Order Placed Successfully! Ticket ${orderData.order.ticketNo}`, 'success');
      activeOrder = orderData.order;

      // Add to allOrders immediately so Staff KDS sees it right away!
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
      fetchOrders().catch(() => {});
    }
  } catch (err) {
    console.error('Order placement failed:', err);
    showToast(err.message || 'Failed to place order. Please try again.', 'error');
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
    await safeApiFetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    updateOrderStatusLocal(orderId, newStatus);
    fetchOrders().catch(() => {});
  } catch (err) {
    updateOrderStatusLocal(orderId, newStatus);
  }
};

function updateOrderStatusLocal(orderId, newStatus) {
  const order = allOrders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
  }
  try {
    localStorage.setItem('mealtime_orders', JSON.stringify(allOrders));
  } catch (e) {}

  if (activeOrder && activeOrder.id === orderId) {
    activeOrder.status = newStatus;
    renderActiveOrderBanner();

    // Play chime & send notification ONLY when order is marked ready by staff!
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

async function simulateIncomingOrder() {
  const randomItems = [MENU_ITEMS[0], MENU_ITEMS[4], MENU_ITEMS[5]];
  const picked = randomItems[Math.floor(Math.random() * randomItems.length)];

  try {
    const apiResult = await safeApiFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        regNo: currentUser.regNo,
        studentName: currentUser.name,
        items: [{ id: picked.id, qty: 1 }],
        payMethod: 'mpesa',
        notes: 'Campus demo order'
      })
    });
    if (apiResult.ok && apiResult.data && apiResult.data.order) {
      await fetchOrders();
      showToast(`👨‍🍳 New shared ticket arrived: ${apiResult.data.order.ticketNo}!`, 'info');
    }
  } catch (err) {
    console.error('Demo order creation failed:', err);
  }
}

// ============================================================
// 9. ORDERS LIST & ACTIVE ORDER TRACKING
// ============================================================
async function fetchOrders() {
  try {
    const apiResult = await safeApiFetch('/api/orders');
    if (apiResult.ok && Array.isArray(apiResult.data)) {
      allOrders = apiResult.data;
      const myActive = apiResult.data.find(o => o.regNo === currentUser.regNo && (o.status === 'placed' || o.status === 'preparing' || o.status === 'ready'));
      const myLatest = apiResult.data.find(o => o.regNo === currentUser.regNo);
      const myOrder = myActive || myLatest;
      if (myOrder) {
        const oldStatus = activeOrder ? activeOrder.status : null;
        activeOrder = myOrder;
        
        if (oldStatus && oldStatus !== myOrder.status) {
          const statusMessages = {
            'preparing': 'Your order is now being prepared! 🍳',
            'ready': 'Order Ready! Please collect at Counter A 🍕',
            'picked_up': 'Enjoy your meal! 😋'
          };
          const msg = statusMessages[myOrder.status];
          if (msg) {
            sendNotification('Order Update', msg, myOrder.status === 'ready' ? 'success' : 'info');
          }
        }

        if (myOrder.status === 'ready' && (!oldStatus || oldStatus !== 'ready')) {
          playReadyChime();
        }
      }
      renderActiveOrderBanner();
      renderOrdersList();
      renderKdsBoard();
    }
  } catch (err) {
    console.warn('Could not synchronize orders with the cafeteria server:', err);
  }
}

function renderActiveOrderBanner() {
  const card = $('active-order-card');
  if (!card) return;

  if (!activeOrder || activeOrder.status === 'picked_up' || activeOrder.status === 'cancelled') {
    card.classList.add('hidden');
    $('home-order-empty')?.classList.remove('hidden');
    return;
  }

  card.classList.remove('hidden');
  $('home-order-empty')?.classList.add('hidden');
  $('ao-item-name').textContent = activeOrder.items.map(i => `${i.qty}x ${i.name}`).join(', ');
  $('ao-ticket-no').textContent = `Ticket ${activeOrder.ticketNo || activeOrder.id}`;

  // Calculate live queue position
  const myOrderTime = new Date(activeOrder.createdAt).getTime();
  const activeAhead = allOrders.filter(o =>
    (o.status === 'placed' || o.status === 'preparing') &&
    new Date(o.createdAt).getTime() < myOrderTime
  ).length;
  const queueEl = $('ao-queue-position');
  if (queueEl) {
    if (activeOrder.status === 'ready') {
      queueEl.textContent = '';
    } else if (activeAhead === 0) {
      queueEl.innerHTML = '🟢 <strong>You are next!</strong>';
    } else {
      queueEl.innerHTML = `⏳ Queue position: <strong>#${activeAhead + 1}</strong> (${activeAhead} order${activeAhead > 1 ? 's' : ''} ahead)`;
    }
  }

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
    $('ao-eta').innerHTML = '<strong style="color:var(--green)">Collect at Counter B Express</strong>';
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
    if (!comment.trim()) {
      showToast('Please write a short review before submitting!', 'warning');
      return;
    }
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

    // Add review to local public reviews store immediately
    allPublicReviews.unshift({
      itemId: currentFeedbackTarget.itemId,
      regNo: currentUser.regNo,
      rating: selectedStar,
      comment,
      date: 'Just now',
      emoji: selectedEmoji
    });

    // Update the menu item rating locally
    const menuItem = MENU_ITEMS.find(m => m.id === currentFeedbackTarget.itemId);
    if (menuItem) {
      const itemRevs = allPublicReviews.filter(r => r.itemId === menuItem.id);
      menuItem.rating = parseFloat((itemRevs.reduce((a,b) => a + b.rating, 0) / itemRevs.length).toFixed(1));
    }

    $('feedback-modal').classList.add('hidden');
    $('feedback-comment').value = '';
    showToast('🎉 Review submitted! Thank you for improving campus dining quality.', 'success');
    sendNotification('Review Submitted', `Your review for ${currentFeedbackTarget.itemName} has been recorded and is now public.`, 'success');
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
// Public reviews store (loaded from backend feedbacks)
let allPublicReviews = [
  { itemId: 1, regNo: '2502692', rating: 5, comment: 'Ugali was hot and soft, stew had plenty of meat! 10/10 comrade meal.', date: 'Today', emoji: 5 },
  { itemId: 5, regNo: '2501188', rating: 5, comment: 'Best burger on campus by far. The sauce was 🔥', date: 'Today', emoji: 5 },
  { itemId: 12, regNo: '2498833', rating: 5, comment: 'Crispy chicken and chips were perfect for evening class energy!', date: 'Yesterday', emoji: 5 },
  { itemId: 2, regNo: '2503412', rating: 4, comment: 'Pilau was well-spiced, kachumbari was fresh. Would order again.', date: 'Yesterday', emoji: 4 },
  { itemId: 3, regNo: '2499021', rating: 4, comment: 'Mandazi was fluffy and golden. Great for breakfast or a quick snack.', date: '2 days ago', emoji: 4 },
  { itemId: 6, regNo: '2500744', rating: 4, comment: 'Chapati soft and fresh, beans well cooked. Budget-friendly comrade choice!', date: 'Today', emoji: 4 },
  { itemId: 13, regNo: '2501902', rating: 5, comment: 'Masala chai is the GOAT. Hot and strong every morning ☕', date: 'Today', emoji: 5 },
  { itemId: 11, regNo: '2502100', rating: 4, comment: 'Fresh mango juice tasted real, not watered down. Refreshing!', date: 'Yesterday', emoji: 5 }
];

function openItemModal(itemId) {
  const item = MENU_ITEMS.find(m => m.id === itemId);
  if (!item) return;

  // Emoji background colour
  const emojiColors = { main: '#FFF3E0', snack: '#E8F5E9', drink: '#E3F2FD' };
  const bgColor = emojiColors[item.category] || '#FFF3E0';
  $('item-detail-img').style.background = bgColor;
  $('item-detail-img').innerHTML = `<span style="font-size:5rem; filter:drop-shadow(0 4px 12px rgba(0,0,0,0.15));">${item.emoji}</span>`;
  $('item-detail-name').textContent = item.name;
  $('item-detail-price').textContent = `KSh ${item.price}`;

  const fullStars = Math.floor(item.rating);
  const halfStar = item.rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const starsHTML = '<span style="color:#FFD700">' + '★'.repeat(fullStars) + (halfStar ? '⯨' : '') + '</span>' + '<span style="color:#ddd">☆</span>'.repeat(emptyStars);
  $('item-detail-rating').innerHTML = `${starsHTML} <span style="font-weight:700;">${item.rating}</span>`;
  $('item-detail-orders').textContent = `📦 ${item.soldCount || 30} sold today`;
  $('item-detail-avail').textContent = item.available ? '✓ In Stock' : '✕ Sold Out';
  $('item-detail-desc').textContent = item.desc;
  $('item-detail-allergens').textContent = `⚠ Allergens: ${item.allergens || 'None reported'}`;

  $('item-detail-nutri').innerHTML = `
    <span class="nutri-pill">🔥 ${item.calories} kcal</span>
    <span class="nutri-pill">💪 ${item.protein}g Protein</span>
    <span class="nutri-pill">${item.category === 'main' ? '🍛 Main' : item.category === 'snack' ? '🥟 Snack' : '🧃 Drink'}</span>
    ${item.tags.includes('halal') ? '<span class="nutri-pill halal-pill">☪ Halal</span>' : ''}
    ${item.tags.includes('veg') ? '<span class="nutri-pill veg-pill">🌱 Veg</span>' : ''}
  `;

  // Render public reviews for this item
  const itemReviews = allPublicReviews.filter(r => r.itemId === itemId);
  const reviewsContainer = $('item-public-reviews');
  if (reviewsContainer) {
    if (!itemReviews.length) {
      reviewsContainer.innerHTML = `<p class="no-reviews">No reviews yet. Be the first to rate this meal!</p>`;
    } else {
      const emojiMap = { 1: '😠', 2: '😕', 3: '😐', 4: '😊', 5: '🤩' };
      reviewsContainer.innerHTML = `
        <h4 class="reviews-heading">What students say (${itemReviews.length} review${itemReviews.length > 1 ? 's' : ''})</h4>
        ${itemReviews.map(r => `
          <div class="pub-review-item">
            <div class="pub-review-header">
              <span class="pub-review-avatar">${r.regNo.substring(0,2)}</span>
              <div class="pub-review-meta">
                <span class="pub-review-reg">${r.regNo.replace(/./g, (c, i) => i > 3 ? (i < 7 ? '*' : c) : c)}</span>
                <span class="pub-review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
              </div>
              <span class="pub-review-emoji">${emojiMap[r.emoji] || '😊'}</span>
              <span class="pub-review-date">${r.date}</span>
            </div>
            <p class="pub-review-comment">${r.comment}</p>
          </div>
        `).join('')}
      `;
    }
  }

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

// After submitting a review, push it to allPublicReviews so it appears immediately
const _originalFeedbackSubmit = window.openFeedbackModal;
window.openFeedbackModal = function(orderId, itemId, itemName) {
  currentFeedbackTarget = { orderId, itemId: parseInt(itemId, 10), itemName };
  $('feedback-item-name').textContent = itemName;
  $('feedback-modal').classList.remove('hidden');
};

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
