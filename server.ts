import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'data', 'db.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return null;
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// 1. Cafeteria Status & Queue
app.get('/api/status', (req, res) => {
  const db = loadDB();
  const orders = db?.orders || [];
  const activeCount = orders.filter((o: any) => o.status === 'placed' || o.status === 'preparing').length;
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
    serverTime: now.toLocaleTimeString(),
  });
});

// 2. Menu Items
app.get('/api/menu', (req, res) => {
  const db = loadDB();
  if (db?.menu) {
    return res.json(db.menu);
  }
  res.json([]);
});

// 3. Kitchen Dashboard
app.get('/api/dashboard', (req, res) => {
  const db = loadDB();
  const orders = db?.orders || [];
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const todayOrders = orders.filter((order: any) => new Date(order.createdAt) >= startOfDay);
  const revenue = todayOrders.reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0);
  const ingredientCost = todayOrders.reduce((sum: number, order: any) => {
    const itemCost = (order.items || []).reduce((total: number, item: any) => {
      const unitPrice = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      return total + (unitPrice * qty * 0.55);
    }, 0);
    return sum + itemCost;
  }, 0);

  res.json({
    orders,
    todayOrders,
    revenue,
    cost: ingredientCost,
    profit: revenue - ingredientCost,
    pending: orders.filter((o: any) => o.status !== 'picked_up').length,
    ready: orders.filter((o: any) => o.status === 'ready').length,
  });
});

// 4. Auth / Login (Student, Staff, Admin)
app.post('/api/auth/login', (req, res) => {
  const { input, password, role, staffPin } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'Please enter your email or identifier' });
  }

  const raw = String(input).trim().toLowerCase();

  if (role === 'staff') {
    const isStaffEmail = raw.endsWith('@kcau.ac.ke') || raw.endsWith('@kca.ac.ke') || raw === 'staff' || raw === 'chef';
    if (!isStaffEmail) {
      return res.status(403).json({ error: 'Staff access requires an official @kcau.ac.ke staff email' });
    }

    const pin = String(staffPin || password || '').trim();
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
        department: 'KCA Catering & Cafeteria Services',
      },
      token: `kca_staff_jwt_${Date.now()}`,
    });
  }

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
    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '');
    if (cleaned.length >= 4) {
      regNo = cleaned;
      email = `${regNo}@students.kcau.ac.ke`;
    } else {
      return res.status(400).json({
        error: 'Invalid student identifier. Use registration number (e.g. 2502692) or 2502692@students.kcau.ac.ke',
      });
    }
  }

  const db = loadDB() || { students: {}, orders: [], menu: [], feedbacks: [] };
  if (!db.students) db.students = {};

  if (!db.students[regNo]) {
    db.students[regNo] = {
      regNo,
      email,
      name: regNo === '2502692' ? 'Rebecca Nabusambya' : `Student ${regNo}`,
      department: 'Diploma in Information Technology (STU 701)',
      walletBalance: 850,
      transactions: [
        { id: `TX-${Date.now()}`, type: 'welcome_grant', amount: 850, date: 'Today', ref: 'KCA-MEAL-GRANT' },
      ],
    };
    saveDB(db);
  }

  const student = db.students[regNo];
  res.json({
    success: true,
    role: 'student',
    student,
    token: `kca_jwt_${regNo}_${Date.now()}`,
  });
});

// 5. Wallet
app.get('/api/wallet/:regNo', (req, res) => {
  const db = loadDB();
  const student = db?.students?.[req.params.regNo];
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json({
    regNo: student.regNo,
    balance: student.walletBalance,
    transactions: student.transactions || [],
  });
});

app.post('/api/wallet/topup', (req, res) => {
  const { regNo, amount, phone } = req.body;
  const numAmount = parseInt(amount, 10);
  if (!regNo || isNaN(numAmount) || numAmount < 10) {
    return res.status(400).json({ error: 'Invalid amount (min KSh 10 per SRS Section 4.5)' });
  }

  const db = loadDB() || { students: {} };
  if (!db.students) db.students = {};

  if (!db.students[regNo]) {
    db.students[regNo] = {
      regNo,
      email: `${regNo}@students.kcau.ac.ke`,
      name: regNo === '2502692' ? 'Rebecca Nabusambya' : `Student ${regNo}`,
      walletBalance: 0,
      transactions: [],
    };
  }

  const ref = 'MP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  db.students[regNo].walletBalance += numAmount;
  if (!db.students[regNo].transactions) db.students[regNo].transactions = [];
  db.students[regNo].transactions.unshift({
    id: `TX-${Date.now()}`,
    type: 'topup',
    amount: numAmount,
    phone: phone || '0712345678',
    date: 'Just now',
    ref,
  });

  saveDB(db);
  res.json({
    success: true,
    newBalance: db.students[regNo].walletBalance,
    ref,
  });
});

// 6. M-Pesa STK Push
app.post('/api/mpesa/stkpush', (req, res) => {
  const { phone, amount, regNo } = req.body;
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
    CustomerMessage: `Success. An STK push has been sent to ${phone}. Enter your M-Pesa PIN to complete payment of KSh ${amount}.`,
  });
});

// 7. Orders
app.get('/api/orders', (req, res) => {
  const db = loadDB() || { orders: [] };
  const { regNo, status } = req.query;
  let list = db.orders || [];

  if (regNo) {
    list = list.filter((o: any) => o.regNo === regNo);
  }
  if (status) {
    list = list.filter((o: any) => o.status === status);
  }

  list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

app.post('/api/orders', (req, res) => {
  const { regNo, studentName, items, pickupTime, payMethod, notes, line } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order must contain at least 1 item' });
  }

  const db = loadDB() || { students: {}, orders: [], menu: [] };
  if (!db.orders) db.orders = [];
  if (!db.students) db.students = {};

  const student = db.students[regNo] || { name: studentName || `Student ${regNo || 'KCA'}` };

  const subtotal = items.reduce((acc: number, it: any) => acc + (it.price * it.qty), 0);
  const serviceFee = 5;
  const total = subtotal + serviceFee;

  if (payMethod === 'kca_wallet') {
    if (!db.students[regNo] || db.students[regNo].walletBalance < total) {
      return res.status(400).json({ error: 'Insufficient KCA MealCard balance. Please top up or pay with M-Pesa.' });
    }
    db.students[regNo].walletBalance -= total;
    if (!db.students[regNo].transactions) db.students[regNo].transactions = [];
    db.students[regNo].transactions.unshift({
      id: `TX-${Date.now()}`,
      type: 'meal_payment',
      amount: total,
      date: 'Just now',
      ref: `MEAL-${items[0]?.name?.substring(0, 8) || 'DISH'}`,
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
    studentName: student.name || studentName || 'Rebecca Nabusambya',
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
    reviewed: false,
    line: line || 'Counter B (Express)',
    paymentStatus: 'paid',
  };

  db.orders.unshift(newOrder);

  if (db.menu) {
    items.forEach((it: any) => {
      const menuItem = db.menu.find((m: any) => m.id === it.id);
      if (menuItem) {
        menuItem.soldCount = (menuItem.soldCount || 0) + it.qty;
      }
    });
  }

  saveDB(db);

  res.status(201).json({
    success: true,
    order: newOrder,
    walletBalance: db.students[regNo] ? db.students[regNo].walletBalance : null,
  });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['placed', 'preparing', 'ready', 'picked_up', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = loadDB();
  const order = db?.orders?.find((o: any) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveDB(db);

  res.json({ success: true, order });
});

// 8. Feedback
app.post('/api/feedback', (req, res) => {
  const { orderId, itemId, regNo, rating, emoji, comment } = req.body;
  const db = loadDB() || { feedbacks: [], menu: [], orders: [] };
  if (!db.feedbacks) db.feedbacks = [];

  const newFeedback = {
    id: Date.now(),
    orderId,
    itemId: parseInt(itemId, 10),
    regNo: regNo || '2502692',
    studentName: regNo ? `${String(regNo).slice(0, 4)}***` : '2502***',
    rating: parseInt(rating, 10) || 5,
    emoji: parseInt(emoji, 10) || 5,
    comment: comment || '',
    date: 'Just now',
  };

  db.feedbacks.unshift(newFeedback);

  let updatedRating = null;
  if (db.menu) {
    const item = db.menu.find((m: any) => m.id === newFeedback.itemId);
    if (item) {
      const itemFeedbacks = db.feedbacks.filter((f: any) => f.itemId === item.id);
      const sum = itemFeedbacks.reduce((a: number, b: any) => a + b.rating, 0);
      item.rating = parseFloat((sum / itemFeedbacks.length).toFixed(1));
      updatedRating = item.rating;
    }
  }

  if (orderId && db.orders) {
    const ord = db.orders.find((o: any) => o.id === orderId);
    if (ord) ord.reviewed = true;
  }

  saveDB(db);
  res.json({ success: true, feedback: newFeedback, updatedRating });
});

// 9. Analytics
app.get('/api/analytics', (req, res) => {
  const db = loadDB() || { orders: [], feedbacks: [], menu: [] };
  const totalOrders = db.orders?.length || 0;
  const avgRating = db.feedbacks?.length
    ? (db.feedbacks.reduce((a: number, b: any) => a + b.rating, 0) / db.feedbacks.length).toFixed(1)
    : '4.4';

  const lowRated = (db.menu || []).filter((m: any) => m.rating < 3.5);
  const topSellers = [...(db.menu || [])]
    .sort((a: any, b: any) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 4);

  res.json({
    ordersToday: totalOrders,
    avgRating: parseFloat(avgRating),
    lowRatedCount: lowRated.length,
    lowRatedItems: lowRated,
    topSellers,
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(` 🍽️  MEALTIME KCA FULL-STACK SERVER RUNNING!       `);
    console.log(` 🚀  Access URL: http://0.0.0.0:${PORT}               `);
    console.log(` 🏫  KCA University Campus Dining API Active         `);
    console.log(`====================================================`);
  });
}

startServer();
