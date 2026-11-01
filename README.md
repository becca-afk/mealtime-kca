# MealTime — KCA University Campus Dining (PWA)

**Student Name:** Rebecca Nabusambya  
**Registration Number:** 2502692  
**Supervisor:** David Oloo  
**Course:** Diploma in Information Technology  
**Project:** STU 701 — Cafeteria Queuing Management System  
**Institution:** KCA University (Ruaraka Main Campus)

---

## 🍽️ System Overview

MealTime is the official Progressive Web App (PWA) designed to automate the food ordering and payment workflow at KCA University. The application solves long cafeteria queues, overcrowding during peak lunch hours (12:15 PM – 1:30 PM), and manual M-Pesa verification.

Built to full compliance with the **Software Requirements Specification (SRS)** and **System Design Specification (SDS)** documents.

---

## 🚀 Key Features

### 🎓 1. Student Portal
- **Authentication:** Sign in using official university email (`2502692@students.kcau.ac.ke`), registration number (`2502692`), or KCA Google Workspace SSO.
- **Student Registration (SRS Appendix C):** Self-service registration form collecting Full Name, Reg No, Student Email, and Password with confirm validation. New accounts start with KSh 0 wallet balance.
- **Digital KCA Student SmartCard (SRS 4.5):** Maroon & gold embossed university mealcard displaying available balance, cardholder name, student reg number, and transaction history.
- **Lipa na M-Pesa Wallet Top-Up:** Instant deposit into student MealCard with quick chips (KSh 200, 500, 1000, 2000) or custom amount (minimum KSh 10).
- **Comrade Budget Optimizer (SRS 4.11 / SDS 7.11):** Slider (KSh 30–300) and preset chips (KSh 70, 120, 160, 220) with optimal meal pairing algorithm finding the highest-rated meal combo within budget and one-click "Add Combo to Tray".
- **Real-Time Active Order Tracker (SRS 4.6):** Displays 3-step preparation progress (Placed → Cooking → Ready), estimated wait time (ETA), and live queue position (orders ahead).
- **Contactless QR Code Pickup Pass (SRS 4.7):** Official digital QR pass for rapid claim at Counter B (Express).
- **Public Food Ratings & Reviews (SRS 4.8):** 1–5 stars, emoji reaction, and mandatory text feedback with student registration number anonymization (`2502***`) for privacy protection under the Kenya Data Protection Act 2019.

### 👨‍🍳 2. Kitchen Display System (KDS)
- **Role-Based Access Control (RBAC):** Dual-factor login requiring staff email (`chef.otieno@kcau.ac.ke`) and 6-digit staff PIN (`882041`).
- **Kitchen Kanban Board:** Real-time tickets categorized into New Placed, In Kitchen, and Ready for Pickup.
- **Order Progression:** "Start Cooking" → "Mark Ready & Chime" → "Complete Handover".
- **Audio Chime System:** Web Audio API synthesizer chime triggered when an order is ready.
- **Stock & Inventory Control (SRS 3.2):** Ability for cafeteria cooks to toggle dishes as "Sold Out" or "In Stock" with instant reflection on the student menu.
- **Queue Simulation:** Test tool to inject incoming orders for live defense testing.

### 📊 3. Administrator Operations & Reports
- **Executive Oversight (SRS 3.3 / 4.10):** Daily meals served, average student rating, pickup speed, and low-rated quality alerts (< 3.5 stars).
- **Hourly Traffic Flow Chart:** Predicted vs. actual traffic comparison across peak hours.
- **Official Daily Sales Report (SRS Appendix D):** Exact reconciliation report with print / export options.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS / Custom KCA Design System
- **Backend:** Node.js (v22), Express.js (v5)
- **Database:** Structured JSON flat-file database (`data/db.json`)
- **Payment Gateway:** Safaricom Daraja M-Pesa STK Push Simulation (90% success rate with retry flow)
- **Audio:** Web Audio API synthesizer (Order Ready Chime)
- **PWA:** Web App Manifest & Service Worker caching for offline menu access

---

## 🏃 Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run type checking / linter
npm run lint
```
Dev server starts at `http://0.0.0.0:3000`.
