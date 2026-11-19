# MealTime — KCA University Campus Dining & Queuing System

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs&logoColor=white)

> Full-stack **online-only** campus cafeteria ordering, MealCard wallet, M-Pesa STK Push simulation, and real-time Kitchen Display System (KDS) built for **Programming Project STU 701**.

**Author:** Rebecca Nabusambya (`2502692`) · **Supervisor:** David Oloo · **Programme:** Diploma in Information Technology

---

## System Overview

MealTime eliminates peak-hour cafeteria queues (12:15 PM – 1:30 PM) by allowing students and lecturers to browse live meal availability, compute affordable meal combos within a pocket budget, pay digitally, and collect prepared orders using a QR pickup pass.

By institutional policy, the application operates strictly in **Online-Only Mode** so wallet deductions, live stock status, and kitchen dispatch tickets stay synchronized with the central server at all times.

---

## Role-Based Modules

### 1. Student & Lecturer Portal
- **Authentication & Registration:** Sign in via student email (`2502692@students.kcau.ac.ke`), registration number (`2502692`), or register a new student account (starts with `KSh 0` wallet balance).
- **Digital KCA MealCard & M-Pesa Top-Up:** View live wallet balance, transaction ledger, and top up via simulated Safaricom M-Pesa STK Push (`KSh 10` minimum).
- **Comrade Budget Optimizer:** Dynamic slider (`KSh 30–300`) and quick presets (`KSh 70`, `120`, `160`, `220`) that suggest optimal food + drink pairings within budget.
- **Checkout & QR Pickup Pass:** Enforces online connectivity, computes subtotal + `KSh 5` service fee server-side, and generates a contactless QR pickup pass (`#KCA-XXX`).
- **Verified Food Reviews:** 1–5 star ratings, emoji reaction, mandatory written feedback, and masked registration numbers (`2502***`) for privacy.

### 2. Dedicated Kitchen Display System (KDS)
- **Dual-Factor Staff Access:** Requires `@kcau.ac.ke` staff email + 6-digit staff PIN (`882041`).
- **Isolated Terminal View:** Strips out student shopping menus and bottom navigation so kitchen staff focus strictly on incoming orders.
- **Live Ticket Progression:** `Placed` → `Preparing` → `Ready` (triggers student audio chime) → `Picked Up`.

### 3. Administrator Operations & Analytics Hub
- **Executive KPIs:** Meals served today, average student rating, average pickup time, and alerts for items rated below `3.5` stars.
- **Hourly Rush Analytics:** Predicted vs. actual traffic comparison across campus dining hours.
- **Daily Sales Audit Report:** Formatted financial summary with print and CSV export actions.

---

## Demo Credentials

| Role | Email / Identifier | Password / PIN | Notes |
| :--- | :--- | :--- | :--- |
| **Student** | `2502692@students.kcau.ac.ke` | `1234` | Starts with `KSh 850` MealCard balance |
| **Kitchen Staff (KDS)** | `chef.otieno@kcau.ac.ke` | `882041` | 6-digit staff terminal PIN |
| **Administrator** | `admin.catering@kcau.ac.ke` | `admin123` | Operations & analytics dashboard |

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js v5 REST API
- **Persistence:** JSON flat-file prototype store (`data/db.json`) with production migration path to PostgreSQL / MongoDB
- **Payments & Alerts:** Simulated Safaricom Daraja STK Push (90% success with retry) & Web Audio API ready chime

---

## Core API Endpoints

| Method & Route | Description |
| :--- | :--- |
| `GET /api/status` | Cafeteria open state, crowd level, and estimated wait time |
| `GET /api/menu` | Available menu items, prices, nutrition, and ratings |
| `POST /api/auth/login` | Student or Kitchen Staff authentication |
| `GET /api/wallet/:regNo` | MealCard balance and transaction history |
| `POST /api/wallet/topup` | Credits student wallet (min `KSh 10`) |
| `POST /api/mpesa/stkpush` | Simulated M-Pesa STK Push request |
| `GET / POST /api/orders` | List orders or create a new order (`+ KSh 5` service fee) |
| `PATCH /api/orders/:id/status` | KDS ticket status transition |
| `POST /api/feedback` | Submit food review and recalculate average rating |
| `GET /api/analytics` | Admin metrics, top sellers, and low-rated alerts |

---

## Running Locally

```bash
# Install dependencies
npm install

# Start full-stack dev server on http://localhost:3000
npm run dev

# Build production bundle
npm run build

# Type-check TypeScript
npm run lint
```
