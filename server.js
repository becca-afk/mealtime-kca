const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial Data Seed
const DEFAULT_DB = {
  menu: [
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
  ],
  orders: [
    {
      id: 'KCA-2024-0046',
      ticketNo: '#KCA-046',
      regNo: '2502692',
      studentName: 'Student 2502692',
      items: [{ id: 5, name: 'Chicken Burger', qty: 1, price: 200 }],
      total: 205,
      payMethod: 'mpesa',
      mpesaRef: 'QJ92K810LA',
      status: 'picked_up',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      pickupCode: 'QR-KCA-046-OK',
      notes: 'No mayonnaise please'
    },
    {
      id: 'KCA-2024-0047',
      ticketNo: '#KCA-047',
      regNo: '2502692',
      studentName: 'Student 2502692',
      items: [{ id: 1, name: 'Beef Stew + Ugali', qty: 1, price: 120 }],
      total: 125,
      payMethod: 'kca_wallet',
      mpesaRef: 'WAL-KCA-9921',
      status: 'preparing',
      createdAt: new Date(Date.now() - 600000).toISOString(),
      pickupCode: 'QR-KCA-047-PREP',
      notes: 'Extra soup if available'
    }
  ],
  students: {
    '2502692': {
      regNo: '2502692',
      email: '2502692@students.kcau.ac.ke',
      name: 'James Mwangi',
      department: 'School of Technology (BIT)',
      walletBalance: 850,
      transactions: [
        { id: 'TX-101', type: 'topup', amount: 1000, date: 'Yesterday, 10:00 AM', ref: 'QH72KL918X' },
        { id: 'TX-102', type: 'debit', amount: 150, date: 'Yesterday, 1:15 PM', ref: 'ORDER #KCA-044' }
      ]
    }
  },
  feedbacks: [
    { id: 1, itemId: 1, regNo: '2502692', rating: 5, emoji: 5, comment: 'Ugali was hot and soft, stew had plenty of meat!', date: 'Today' },
    { id: 2, itemId: 5, regNo: '2502692', rating: 5, emoji: 5, comment: 'Best burger on campus by far.', date: 'Today' }
  ]
};

// DB Helper
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using default:', err);
    return DEFAULT_DB;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// ---------------- REST API ROUTES ----------------

// 1. Cafeteria Status & Live Traffic
app.get('/api/status', (req, res) => {
  const db = loadDB();
  const activeCount = db.orders.filter(o => o.status === 'placed' || o.status === 'preparing').length;
  const now = new Date();
  const hour = now.getHours();

  let crowdStatus = 'Low Traffic 🟢';
  let waitMin = Math.max(3, activeCount * 2);

  if (hour >= 12 && hour <= 14) {
    crowdStatus = 'Peak Lunch Rush 🔥';
    waitMin = Math.max(12, activeCount * 3);
  } else if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 18)) {
    crowdStatus = 'Moderate Rush 🟡';
    waitMin = Math.max(7, activeCount * 2.5);
  }

  res.json({
    open: true,
    campus: 'KCA University Main Campus (Ruaraka)',
    crowdStatus,
    activeOrdersCount: activeCount,
    estimatedWaitMins: Math.round(waitMin),
    serverTime: now.toLocaleTimeString()
  });
});

// 2. Menu Items
app.get('/api/menu', (req, res) => {
  const db = loadDB();
  res.json(db.menu);
});

// 3. Auth / Login / Student & Staff Lookup
app.post('/api/auth/login', (req, res) => {
  const { input, password, role, staffPin } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'Please enter your email or identifier' });
  }

  const raw = input.trim().toLowerCase();

  // If Staff / Kitchen Login
  if (role === 'staff') {
    const isStaffEmail = raw.endsWith('@kcau.ac.ke') || raw.endsWith('@kca.ac.ke') || raw === 'staff' || raw === 'chef';
    if (!isStaffEmail) {
      return res.status(403).json({ error: 'Staff access requires an official @kcau.ac.ke staff email' });
    }

    // Secure Staff PIN verification
    const pin = (staffPin || password || '').trim();
    const VALID_PINS = ['882041', '1234', 'KCA-CHEF', 'kca-chef'];
    if (!VALID_PINS.includes(pin)) {
      return res.status(401).json({ error: 'Invalid Staff Terminal Security PIN. Access denied.' });
    }

    return res.json({
      success: true,
      role: 'staff',
      staff: {
        id: 'KCA-STAFF-08',
        name: 'Chef Otieno',
        role: 'Kitchen Terminal Dispatcher',
        email: raw.includes('@') ? raw : 'chef.otieno@kcau.ac.ke',
        department: 'KCA Catering & Cafeteria Services'
      },
      token: `kca_staff_jwt_${Date.now()}`
    });
  }

  // Student / Lecturer Login
  const isKcaEmail = raw.endsWith('@students.kcau.ac.ke') ||
                     raw.endsWith('@students.kca.ac.ke') ||
                     raw.endsWith('@kcau.ac.ke') ||
                     raw.endsWith('@kca.ac.ke');
  
  let regNo = '';
  let email = '';

  if (isKcaEmail) {
    email = raw;
    regNo = raw.split('@')[0];
  } else {
    // Check if numeric or student ID format like 2502692
    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '');
    if (cleaned.length >= 4) {
      regNo = cleaned;
      email = `${regNo}@students.kcau.ac.ke`;
    } else {
      return res.status(400).json({
        error: 'Invalid student identifier. Use registration number (e.g. 2502692) or 2502692@students.kcau.ac.ke'
      });
    }
  }

  const db = loadDB();
  if (!db.students[regNo]) {
    // Auto-register student profile
    db.students[regNo] = {
      regNo,
      email,
      name: `Student ${regNo}`,
      department: 'KCA University Student',
      walletBalance: 750, // Starting meal allowance
      transactions: [
        { id: `TX-${Date.now()}`, type: 'welcome_grant', amount: 750, date: 'Today', ref: 'KCA-MEAL-GRANT' }
      ]
    };
    saveDB(db);
  }

  const student = db.students[regNo];
  res.json({
    success: true,
    role: 'student',
    student,
    token: `kca_jwt_${regNo}_${Date.now()}`
  });
});

// 4. Student Wallet
app.get('/api/wallet/:regNo', (req, res) => {
  const db = loadDB();
  const student = db.students[req.params.regNo];
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json({
    regNo: student.regNo,
    balance: student.walletBalance,
    transactions: student.transactions || []
  });
});

app.post('/api/wallet/topup', (req, res) => {
  const { regNo, amount, phone } = req.body;
  const numAmount = parseInt(amount, 10);
  if (!regNo || isNaN(numAmount) || numAmount < 10) {
    return res.status(400).json({ error: 'Invalid amount (min KSh 10)' });
  }

  const db = loadDB();
  if (!db.students[regNo]) {
    db.students[regNo] = { regNo, email: `${regNo}@students.kcau.ac.ke`, name: `Student ${regNo}`, walletBalance: 0, transactions: [] };
  }

  const ref = 'MP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  db.students[regNo].walletBalance += numAmount;
  db.students[regNo].transactions.unshift({
    id: `TX-${Date.now()}`,
    type: 'topup',
    amount: numAmount,
    phone: phone || '07XXXXXXXX',
    date: 'Just now',
    ref
  });

  saveDB(db);
  res.json({
    success: true,
    newBalance: db.students[regNo].walletBalance,
    ref
  });
});

// 5. Lipa na M-Pesa STK Push Simulation
app.post('/api/mpesa/stkpush', (req, res) => {
  const { phone, amount, regNo, accountRef } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone and amount are required' });
  }

  const checkoutRequestId = 'ws_CO_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
  const merchantRequestId = 'KCA-MERCH-' + Math.floor(Math.random() * 888888);

  res.json({
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    MerchantRequestID: merchantRequestId,
    CheckoutRequestID: checkoutRequestId,
    CustomerMessage: `Success. An STK push has been sent to ${phone}. Enter your M-Pesa PIN to complete payment of KSh ${amount}.`
  });
});

// 6. Orders: Get, Post, Update Status (for KDS & Student)
app.get('/api/orders', (req, res) => {
  const db = loadDB();
  const { regNo, status } = req.query;
  let list = db.orders;

  if (regNo) {
    list = list.filter(o => o.regNo === regNo);
  }
  if (status) {
    list = list.filter(o => o.status === status);
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(list);
});

app.post('/api/orders', (req, res) => {
  const { regNo, studentName, items, pickupTime, payMethod, notes } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order must contain at least 1 item' });
  }

  const db = loadDB();
  const student = db.students[regNo] || { name: studentName || `Student ${regNo || 'KCA'}` };

  const subtotal = items.reduce((acc, it) => acc + (it.price * it.qty), 0);
  const serviceFee = 5;
  const total = subtotal + serviceFee;

  // If paid via KCA Wallet, check balance and deduct
  if (payMethod === 'kca_wallet') {
    if (!db.students[regNo] || db.students[regNo].walletBalance < total) {
      return res.status(400).json({ error: 'Insufficient KCA MealCard balance. Please top up or pay with M-Pesa.' });
    }
    db.students[regNo].walletBalance -= total;
    db.students[regNo].transactions.unshift({
      id: `TX-${Date.now()}`,
      type: 'meal_payment',
      amount: total,
      date: 'Just now',
      ref: `MEAL-${items[0].name.substring(0, 8)}`
    });
  }

  const count = db.orders.length + 1;
  const ticketNo = `#KCA-${String(count).padStart(3, '0')}`;
  const orderId = `KCA-2024-${String(count).padStart(4, '0')}`;
  const mpesaRef = payMethod === 'mpesa' ? ('QK' + Math.random().toString(36).substring(2, 9).toUpperCase()) : `WAL-KCA-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: orderId,
    ticketNo,
    regNo: regNo || '2502692',
    studentName: student.name,
    items,
    subtotal,
    serviceFee,
    total,
    pickupTime: pickupTime || 'ASAP (~8 min)',
    payMethod: payMethod || 'mpesa',
    mpesaRef,
    status: 'placed',
    createdAt: new Date().toISOString(),
    pickupCode: `QR-${orderId}-SECURE`,
    notes: notes || '',
    reviewed: false
  };

  db.orders.unshift(newOrder);

  // Update item soldCount
  items.forEach(it => {
    const menuItem = db.menu.find(m => m.id === it.id);
    if (menuItem) {
      menuItem.soldCount = (menuItem.soldCount || 0) + it.qty;
    }
  });

  saveDB(db);

  res.status(201).json({
    success: true,
    order: newOrder,
    walletBalance: db.students[regNo] ? db.students[regNo].walletBalance : null
  });
});

// Update order status (used by KDS Kitchen Staff)
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['placed', 'preparing', 'ready', 'picked_up', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveDB(db);

  res.json({ success: true, order });
});

// 7. Student Feedback & Ratings
app.post('/api/feedback', (req, res) => {
  const { orderId, itemId, regNo, rating, emoji, comment } = req.body;
  const db = loadDB();

  const newFeedback = {
    id: Date.now(),
    orderId,
    itemId: parseInt(itemId, 10),
    regNo: regNo || '2502692',
    rating: parseInt(rating, 10) || 5,
    emoji: parseInt(emoji, 10) || 5,
    comment: comment || '',
    date: 'Just now'
  };

  db.feedbacks.unshift(newFeedback);

  // Recalculate item rating
  const item = db.menu.find(m => m.id === newFeedback.itemId);
  if (item) {
    const itemFeedbacks = db.feedbacks.filter(f => f.itemId === item.id);
    const sum = itemFeedbacks.reduce((a, b) => a + b.rating, 0);
    item.rating = parseFloat((sum / itemFeedbacks.length).toFixed(1));
  }

  // Mark order as reviewed
  if (orderId) {
    const ord = db.orders.find(o => o.id === orderId);
    if (ord) ord.reviewed = true;
  }

  saveDB(db);
  res.json({ success: true, feedback: newFeedback, updatedRating: item ? item.rating : null });
});

// 8. Analytics & Admin Metrics
app.get('/api/analytics', (req, res) => {
  const db = loadDB();
  const totalOrders = db.orders.length;
  const avgRating = (db.feedbacks.reduce((a, b) => a + b.rating, 0) / (db.feedbacks.length || 1)).toFixed(1);
  const lowRated = db.menu.filter(m => m.rating < 3.5);
  const topSellers = [...db.menu].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 4);

  res.json({
    ordersToday: totalOrders,
    avgRating: parseFloat(avgRating),
    lowRatedCount: lowRated.length,
    lowRatedItems: lowRated,
    topSellers
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🍽️  MEALTIME KCA BACKEND SERVER IS RUNNING!        `);
  console.log(` 🚀  Access URL: http://localhost:${PORT}             `);
  console.log(` 🏫  KCA University Campus Dining API Active         `);
  console.log(`====================================================`);
});
