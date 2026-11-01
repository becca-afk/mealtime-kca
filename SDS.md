# Software Design Specification (SDS)
## MealTime — KCA University Campus Dining Application

**Document Version:** 1.0  
**Date:** October 2026  
**Author:** KCA University — School of Technology  
**System:** MealTime Progressive Web App (PWA)

---

## 1. System Architecture Overview

MealTime follows a **client-server architecture** with a PWA frontend and an Express.js REST API backend. Both are served from the same Node.js server.

```
┌─────────────────────────────────────────────┐
│              CLIENT (PWA)                   │
│  index.html + style.css + app.js + sw.js   │
│  Renders UI, handles state, calls API       │
└────────────────────┬────────────────────────┘
                     │ HTTP/REST (fetch API)
┌────────────────────▼────────────────────────┐
│           SERVER (Node.js + Express)         │
│                  server.js                  │
│   /api/menu  /api/orders  /api/auth/login   │
│   /api/mpesa/stkpush  /api/wallet  etc.     │
└────────────────────┬────────────────────────┘
                     │ fs.readFileSync/writeFileSync
┌────────────────────▼────────────────────────┐
│           DATABASE (JSON File)               │
│              data/db.json                   │
│  { menu[], orders[], students{}, feedbacks[] }│
└─────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript | UI rendering and state management |
| Fonts | Google Fonts (Inter, Outfit, Playfair Display) | Typography |
| Backend | Node.js v18+, Express.js v5 | REST API server |
| Database | JSON flat file (`data/db.json`) | Data persistence |
| PWA | Web App Manifest + Service Worker (`sw.js`) | Offline support + installability |
| Payment | Safaricom Daraja API (simulated) | M-Pesa STK Push |
| Audio | Web Audio API | Order ready chime |
| QR Code | HTML5 Canvas API | Dynamic pickup pass |

---

## 2. File Structure

```
Mealtime/
├── index.html          # Main HTML shell — all screens/pages/modals
├── style.css           # Complete CSS design system (3200+ lines)
├── app.js              # Full frontend JavaScript (1900+ lines)
├── server.js           # Express.js REST API backend (471 lines)
├── sw.js               # Service Worker (PWA offline caching)
├── manifest.json       # PWA Web App Manifest
├── package.json        # Node.js dependencies (express, cors)
├── assets/
│   └── logo.jpg        # KCA University / MealTime logo
└── data/
    └── db.json         # JSON database (auto-created on first run)
```

---

## 3. Database Schema (`data/db.json`)

### 3.1 Menu Item Schema
```json
{
  "id": 1,
  "name": "Beef Stew + Ugali",
  "emoji": "🍛",
  "price": 120,
  "calories": 650,
  "protein": 32,
  "rating": 4.6,
  "orders": 34,
  "category": "main",
  "tags": ["halal", "spicy"],
  "allergens": "None",
  "desc": "Slow-cooked beef stew with hot tender ugali.",
  "badge": "hot",
  "available": true,
  "soldCount": 34
}
```

### 3.2 Order Schema
```json
{
  "id": "KCA-2024-0046",
  "ticketNo": "#KCA-046",
  "regNo": "2502692",
  "studentName": "James Mwangi",
  "items": [{ "id": 5, "name": "Chicken Burger", "qty": 1, "price": 200 }],
  "subtotal": 200,
  "serviceFee": 5,
  "total": 205,
  "pickupTime": "ASAP (~8 min)",
  "payMethod": "mpesa",
  "mpesaRef": "QJ92K810LA",
  "status": "placed",
  "createdAt": "2026-10-10T07:15:00.000Z",
  "pickupCode": "QR-KCA-046-SECURE",
  "notes": "",
  "reviewed": false
}
```
**Status Values:** `placed` | `preparing` | `ready` | `picked_up` | `cancelled`

### 3.3 Student Schema
```json
{
  "regNo": "2502692",
  "email": "2502692@students.kcau.ac.ke",
  "name": "James Mwangi",
  "department": "School of Technology (BIT)",
  "walletBalance": 850,
  "transactions": [
    { "id": "TX-101", "type": "topup", "amount": 1000, "date": "Today", "ref": "QH72KL918X" }
  ]
}
```

### 3.4 Feedback Schema
```json
{
  "id": 1704891234000,
  "orderId": "KCA-2024-0046",
  "itemId": 5,
  "regNo": "2502692",
  "rating": 5,
  "emoji": 5,
  "comment": "Best burger on campus by far!",
  "date": "Today"
}
```

---

## 4. REST API Endpoints

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `GET` | `/api/status` | Cafeteria live status + crowd level + wait time | None |
| `GET` | `/api/menu` | All menu items | None |
| `POST` | `/api/auth/login` | Student or staff login | Body credentials |
| `GET` | `/api/orders` | All orders (filterable by regNo, status) | None |
| `POST` | `/api/orders` | Place a new order | Body payload |
| `PATCH` | `/api/orders/:id/status` | Update order status (KDS) | Staff |
| `GET` | `/api/wallet/:regNo` | Get student wallet balance + transactions | RegNo |
| `POST` | `/api/wallet/topup` | Top up wallet via M-Pesa | Body payload |
| `POST` | `/api/mpesa/stkpush` | Initiate M-Pesa STK Push | Body payload |
| `POST` | `/api/feedback` | Submit food rating and review | Body payload |
| `GET` | `/api/analytics` | Cafeteria metrics, top sellers, low-rated items | Staff |

### Example: POST /api/orders Request Body
```json
{
  "regNo": "2502692",
  "studentName": "James Mwangi",
  "items": [{ "id": 1, "name": "Beef Stew + Ugali", "price": 120, "qty": 1 }],
  "pickupTime": "ASAP (~8 min)",
  "payMethod": "mpesa",
  "phone": "0712345678",
  "notes": "Extra soup if available"
}
```

---

## 5. Frontend Architecture (`app.js`)

The frontend is organized into **16 logical modules** using functions:

| Module | Function | Description |
|--------|----------|-------------|
| 1 | `initLogin()` | Role-based login gate, tab switching, API auth call |
| 2 | `initNotifications()` | In-app notification drawer, badge counter |
| 3 | `initBudgetOptimizer()` | Budget slider, combo calculator, presets |
| 4 | `initNavigation()` | Page routing, filter buttons, search, sorting |
| 5 | `fetchMenuItems()` | Load menu from API, render top picks and full menu |
| 6 | `initCart()` | Cart management, quantity control, payment selection |
| 7 | `initPaymentAndStk()` | M-Pesa PIN keypad, STK modal, payment flow |
| 8 | `initKdsSystem()` | KDS tab filters, simulate order, exit terminal |
| 9 | `fetchOrders()` | Load orders from API, detect status changes, chime |
| 10 | `initQrModal()` | QR code canvas rendering, pickup pass display |
| 11 | `fetchCafeteriaStatus()` | Live queue wait time, crowd status |
| 12 | `initWalletTopup()` | Wallet top-up modal, M-Pesa top-up call |
| 13 | `initFeedbackModal()` | Star rating, emoji reaction, review submission |
| 14 | `openItemModal()` | Item detail view with public reviews |
| 15 | `initThemeAndSettings()` | Dark mode toggle, audio chime toggle |
| 16 | `showToast()` | Toast notification utility |

### State Variables
```javascript
let MENU_ITEMS = [];      // Live menu from API
let currentUser = {};     // Logged-in student object
let currentRole = 'student'; // 'student' | 'staff'
let cart = {};            // { [itemId]: qty }
let allOrders = [];       // All orders from API
let activeOrder = null;   // Current in-progress order
let allPublicReviews = []; // Public reviews for item modal
```

---

## 6. UI Page Structure

| Page ID | Name | Accessible By |
|---------|------|--------------|
| `page-home` | Student Home (menu highlights, budget optimizer, active order) | Students |
| `page-menu` | Full Menu Page (search, filter, sort, all items) | Students |
| `page-orders` | My Order Tickets (active + history tabs) | Students |
| `page-kds` | Kitchen Display System | Staff only |
| `page-analytics` | Cafeteria Operations Dashboard | Staff only |
| `page-profile` | Student Profile + Digital MealCard + Wallet | Students |

### Modal Components
- `#cart-modal` — Shopping tray, payment method selector, M-Pesa phone field
- `#stk-modal` — Safaricom M-Pesa STK Push virtual keypad
- `#topup-modal` — Wallet top-up form
- `#qr-modal` — QR Code pickup pass (Canvas rendering)
- `#feedback-modal` — Star rating + emoji + text review
- `#item-modal` — Item detail view with public reviews
- `#notif-drawer-overlay` — Notifications drawer

---

## 7. M-Pesa Payment Flow

```
Student selects items → Opens Cart Modal
         ↓
Selects "Lipa na M-Pesa" payment method
         ↓
M-Pesa phone field appears → Student enters phone (e.g. 0712345678)
         ↓
Clicks "Send M-Pesa STK Push"
         ↓
Frontend validates phone (min 9 digits)
         ↓
Cart closes → STK Modal opens showing:
  • Amount (KSh)
  • Phone number
  • Student Ref (Reg No)
         ↓
Student enters 4-digit PIN on virtual keypad
         ↓
[POST /api/mpesa/stkpush] called with phone + amount
         ↓
2-second processing animation (simulates Daraja latency)
         ↓
Success (90%) → [POST /api/orders] creates order
         ↓
Order confirmation toast + Active Order card appears
         ↓
Auto-transitions: placed(5s) → preparing(12s) → ready(chime!)
```

---

## 8. Order Lifecycle and Queue System

```
Order Placed (status: "placed")
   ↓ Staff clicks "Start Cooking" in KDS
Order Preparing (status: "preparing")
   ↓ Staff clicks "Mark Ready" in KDS
Order Ready (status: "ready")
   → Audio chime plays on student device
   → "COLLECT AT COUNTER B" notification sent
   → QR Pass activates for pickup
   ↓ Staff clicks "Complete Handover" in KDS
Order Complete (status: "picked_up")
   → Student prompted to leave a review
```

**Queue Position Calculation:**
```javascript
// Number of orders placed BEFORE this student's order that are still active
const activeAhead = allOrders.filter(o =>
  (o.status === 'placed' || o.status === 'preparing') &&
  new Date(o.createdAt) < new Date(activeOrder.createdAt)
).length;
```

---

## 9. Food Reviews Design

- **Submission:** Rating modal accessible from Order History (past orders only)
- **Storage:** `db.feedbacks[]` array in database; also `allPublicReviews[]` in frontend memory
- **Display:** Shown in Item Detail modal (`#item-modal`) → `#item-public-reviews` section
- **Anonymization:** Registration numbers partially masked: `2502***` (first 4 digits shown)
- **Rating Update:** After each new review, item's average rating recalculated server-side and updated in `db.menu[]`

---

## 10. PWA Design

### Service Worker (`sw.js`)
- Caches HTML, CSS, JS, and assets on install
- Serves cached content when offline (Cache-first strategy)
- Updates cache on network requests when online

### Web App Manifest (`manifest.json`)
```json
{
  "name": "MealTime KCA University",
  "short_name": "MealTime",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#800020",
  "background_color": "#800020",
  "start_url": "/index.html"
}
```

---

## 11. Security Design

| Security Measure | Implementation |
|-----------------|----------------|
| Staff PIN auth | PIN compared against VALID_PINS array; failed attempts blocked |
| Role separation | `currentRole` variable; staff-only pages hidden for students |
| Session isolation | Student data keyed by regNo; no cross-session access |
| No sensitive data on client | Wallet balance fetched from server; never stored in localStorage |
| Input sanitization | Email/reg inputs stripped of special chars before processing |
| CORS | Enabled on Express server for API access control |

---

## 12. Color Design System (CSS Variables)

| Variable | Value | Usage |
|----------|-------|-------|
| `--maroon` | `#800020` | KCA primary brand color |
| `--gold` | `#FFD700` | Accent — star ratings, highlights |
| `--green` | `#00C853` | Success states, availability |
| `--bg` | `#FAF8F5` | App background (light mode) |
| `--surface` | `#FFFFFF` | Card surfaces |
| `--text` | `#1C1410` | Primary text |
| `--text-muted` | `#6B5D50` | Secondary text |

Dark mode variables override via `.dark` class toggled on `<body>`.

---

*MealTime SDS v1.0 — KCA University School of Technology, October 2026*
