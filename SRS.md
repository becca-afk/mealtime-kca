# Software Requirements Specification (SRS)
## MealTime — KCA University Campus Dining Application

**Document Version:** 1.0  
**Date:** October 2026  
**Author:** KCA University — School of Technology  
**System:** MealTime Progressive Web App (PWA)  

---

## 1. Introduction

### 1.1 Purpose
This SRS document describes functional and non-functional requirements for **MealTime** — the official digital campus dining platform for KCA University.

### 1.2 Scope
MealTime is a mobile-first Progressive Web App (PWA) that enables:
- Students/Lecturers to browse menu, pre-order meals, pay via M-Pesa or KCA MealCard, track orders in real time, and review food
- Cafeteria staff to manage and dispatch orders via a Kitchen Display System (KDS)

### 1.3 Definitions
| Term | Definition |
|------|-----------|
| PWA | Progressive Web App (installable on mobile/desktop) |
| KDS | Kitchen Display System — staff order management terminal |
| STK Push | Safaricom M-Pesa payment prompt |
| MealCard | Digital KCA Student Meal Wallet (balance-based) |
| Reg No | Student Registration Number (e.g., 2502692) |

---

## 2. Overall Description

### 2.1 User Classes

| User Class | Description | Access |
|-----------|-------------|--------|
| **Student** | Uses app to order, pay, track, review | Standard |
| **Lecturer** | Same as student, @kcau.ac.ke email | Standard |
| **Cafeteria Staff** | Kitchen dispatch terminal only | Restricted (staff email + PIN) |

### 2.2 Operating Environment
- Mobile-first PWA (Chrome/Safari, Android/iOS)
- Node.js + Express.js backend
- JSON flat-file database (upgradeable to MongoDB)
- Safaricom Daraja API for M-Pesa (simulation in current version)
- Works offline via Service Worker cache

---

## 3. Functional Requirements

### FR-01: Authentication
- Students log in via reg number or @students.kcau.ac.ke email
- Staff log in via @kcau.ac.ke email + 6-digit PIN
- New students auto-register with KSh 750 default wallet balance
- Separate login tabs prevent cross-role access

### FR-02: Menu Display
- Show items with name, price, emoji, description, calories, protein, dietary tags (Halal/Veg), and star rating
- Filter by category (Main, Snacks, Drinks, Vegetarian, Halal)
- Sort by rating, price, protein, popularity
- Search by name or description
- Mark sold-out items as non-orderable

### FR-03: Cart and Order Placement
- Add items with quantity controls; view nutritional totals
- Select pickup time slot; add special instructions
- Browse cafeterias from Home and open a menu filtered by meal, snack, or drink category
- Hide fixed navigation and checkout controls while a modal is open so checkout actions remain accessible
- Place order via KCA MealCard or M-Pesa

### FR-04: M-Pesa Payment
- Collect student's M-Pesa phone number at checkout
- Show a clearly labeled simulated M-Pesa prompt; no live Safaricom request is sent
- Student enters a demo 4-digit PIN on the virtual keypad
- 90% success rate simulation; show error and retry on failure

### FR-05: KCA MealCard (Wallet)
- Display wallet balance (KSh) on Home, header, and profile page
- Deduct order total on wallet payment; reject if insufficient
- Top up via M-Pesa (min KSh 10)
- Display full transaction history

### FR-06: Order Tracking and Queue
- Order lifecycle: placed → preparing → ready → picked_up; cancellation is also supported
- Active order card shows current status, ticket number, ETA
- Display live queue position (orders ahead of student)
- Student and staff dashboards synchronize persisted orders and status changes through the shared API, polled every 4 seconds
- Give each order a unique ID and sequential visible KCA ticket number
- Audio chime when order becomes ready
- In-app push notification on status change

### FR-07: QR Code Pickup Pass
- Generate unique QR code per order with ticket no, reg no, items, payment status
- Accessible from active order card and order history

### FR-08: Food Reviews and Ratings
- Students rate completed orders (1–5 stars + emoji reaction + text comment)
- All reviews publicly visible on item detail page, anonymized (e.g., 2502***)
- Average rating recalculated after each new review
- Review required before submission (no empty reviews)

### FR-09: Kitchen Display System (KDS)
- Staff see all active orders as Kanban ticket cards
- Filter by status (New, Cooking, Ready)
- Advance status: "Start Cooking" → "Mark Ready" → "Complete Handover"
- Marking Ready triggers audio chime on student's device
- Demo "Simulate Incoming Order" button creates a persisted shared ticket for testing

### FR-10: Analytics Dashboard (Staff)
- Metrics: meals served today, avg rating, avg pickup speed, items under review
- Bar chart: predicted vs. actual hourly traffic
- Top sellers list by order count
- Low-rated items alert (< 3.5 stars)

### FR-11: Student Home Dashboard
- Focus Home on wallet balance, active order tracking, and cafeteria shortcuts
- Do not duplicate the full menu on Home

### FR-12: Budget Optimizer (Deferred)
- Slider (KSh 30–300) or quick preset chips to set budget
- Algorithm returns highest-rated meal combo within budget
- One-click "Add Combo to Tray" button

---

## 4. Non-Functional Requirements

| ID | Requirement |
|----|------------|
| NFR-01 | App loads within 3 seconds on 4G |
| NFR-02 | Fully usable on 360px-wide mobile screens |
| NFR-03 | All touch targets ≥ 44×44px (WCAG 2.1) |
| NFR-04 | Works offline via Service Worker cache |
| NFR-05 | Staff access requires email AND PIN (dual auth) |
| NFR-06 | Installable as PWA (Web App Manifest) |
| NFR-07 | API responses return within 1 second |
| NFR-08 | No plain-text credentials stored on device |

---

## 5. Use Cases Summary

| UC-ID | Use Case | Actor |
|-------|----------|-------|
| UC-01 | Student Login | Student |
| UC-02 | Browse & Search Menu | Student |
| UC-03 | Add to Cart & Checkout | Student |
| UC-04 | Pay via simulated M-Pesa prompt | Student |
| UC-05 | Pay via KCA MealCard | Student |
| UC-06 | Track Active Order + Queue | Student |
| UC-07 | Show QR Pickup Pass | Student |
| UC-08 | Submit Food Review | Student |
| UC-09 | Staff Login (KDS Terminal) | Staff |
| UC-10 | Dispatch Order (KDS) | Staff |
| UC-11 | View Analytics Dashboard | Staff |
| UC-12 | Top-Up Wallet via M-Pesa | Student |
| UC-13 | Use Budget Optimizer (deferred) | Student |

---

## 6. System Constraints
1. **M-Pesa is simulated** — production requires Safaricom business registration and live Daraja API credentials
2. **Flat-file DB** — `data/db.json` suitable for demo; production should migrate to MongoDB/PostgreSQL
3. **Auth is simplified** — production needs JWT expiry and bcrypt password hashing
4. **English only** — Swahili language support is a planned future enhancement

---

*MealTime SRS v1.0 — KCA University School of Technology, October 2026*
