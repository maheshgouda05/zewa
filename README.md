# 🌱 ZEWA (Zero Waste) • Food Surplus Marketplace

> **A real-time, dynamic food surplus marketplace connecting restaurants, nearby customers, and eco-delivery partners to eradicate urban food waste.**

---

## 🌟 Executive Summary & Concept

Restaurants, bakeries, cafes, and food carts prepare fresh meals daily. Towards closing time, safe, high-quality unsold food frequently goes to waste solely due to timing mismatch.

**ZEWA** solves this through **dynamic time-decay pricing**:
- As restaurant closing time approaches, surplus food discounts increase continuously (from ~30% up to 75% off).
- **Core Principle:** *Food availability determines the discount, not customer demand alone.*
- Strict **Fair Share Limit:** Max **2 units per customer per listing** prevents commercial hoarding and ensures equitable community distribution.
- **10-Minute Inventory Reservation Hold:** Locks portions while customer finishes prepaid checkout.
- **Prepaid Verification:** Real-time bank payment verification before dispatching kitchen orders.
- **Eco-Delivery Partner Dispatch:** Automated nearest-partner matching with turn-by-turn Google Maps routing.

---

## 🏗️ Architecture Overview

The application is structured into three clean layers:

```
├── frontend/                     # Mobile-first frontend client (HTML5, CSS3, ES6)
│   ├── index.html                # Single-page application with 3 platform views
│   ├── css/
│   │   └── style.css             # Earthy, modern design system (Instagram-like simplicity)
│   └── js/
│       ├── app.js                # Master coordinator, toast system & navigation
│       ├── auth.js               # Multi-role authentication & 1-click demo switcher
│       ├── customer.js           # Live 1s countdown timer & dynamic price decay engine
│       ├── orders.js             # 10-min reservation hold, payments & 5-stage live tracking
│       ├── restaurant.js         # Kitchen dashboard, stats & dynamic decay curve simulator
│       ├── delivery.js           # Partner dashboard, duty toggle, route directions
│       ├── maps.js               # Geolocation & Google Maps navigation generator
│       └── supabase.js           # API client for Express backend & Supabase
├── backend/                      # Node.js + Express.js REST API
│   ├── config/env.js             # Environment loader
│   ├── controllers/              # Auth, Customer, Restaurant, Order, Delivery controllers
│   ├── middleware/               # Bearer JWT and Role-Based Access Control (RBAC)
│   ├── routes/                   # Clean RESTful route definitions (/api/*)
│   ├── services/
│   │   ├── discount.service.js   # Dynamic time-decay pricing mathematical model
│   │   ├── inventory.service.js  # Atomic inventory reservation & 2-unit limit validation
│   │   ├── delivery.service.js   # Haversine distance & nearest-partner matching
│   │   ├── payment.service.js    # Session signing & server-side payment verification
│   │   └── supabase.service.js   # Live Supabase connection + high-fidelity fallback DB
│   └── server.js                 # Express server & static asset mount
└── database/
    └── schema.sql                # Production PostgreSQL schema for Supabase (11 tables, RLS)
```

---

## 👥 Three Complete User Platforms

### 1. Customer Platform (`#view-customer`)
- **Location Detection:** GPS auto-detection or Indiranagar, Bengaluru default fallback.
- **Live Food Feed:** Real-time portions nearby with closing countdown timers.
- **Live Dynamic Pricing:** Discounts rise automatically every second as kitchen closing time nears.
- **Category & Dietary Filters:** Meals, Bakery, Snacks, Sweets, Beverages, and Pure Veg toggle.
- **Purchase Restriction:** Enforces maximum **2 units per customer per listing** on both frontend and backend.
- **10-Minute Reservation Hold:** Locks inventory temporarily during checkout.
- **Order Tracking:** 5-step live visual stepper:
  1. `Prepaid Verified` ➔ 2. `Order Confirmed` ➔ 3. `Kitchen Packing Food` ➔ 4. `Out for Delivery` ➔ 5. `Delivered`.
- **Navigation:** One-click Google Maps directions to view delivery progress.

### 2. Restaurant & Food Cart Platform (`#view-restaurant`)
- **Key Metrics:** Active listings, portions rescued, kilograms of waste prevented, and revenue earned.
- **Add Surplus Food Modal:**
  - Original price, starting price, minimum floor price.
  - Category, freshness notes, closing time.
  - **Interactive Dynamic Pricing Simulator:** Visualizes price decay curve before publishing.
- **Inventory Management:** Instant stock controls and removal.
- **Kitchen Order Management:** Live incoming prepaid orders with "Start Packing" and "Mark Ready for Pickup" workflow.

### 3. Delivery Partner Platform (`#view-delivery`)
- **Duty Toggle:** Instant Online/Offline status switch with GPS broadcaster.
- **Trip Earnings:** Daily completed trip counter and payout tracker.
- **Automated Assignment Card:** Displays pickup kitchen address and customer doorstep.
- **Turn-by-Turn Navigation:** One-tap Google Maps directions directly to kitchen and customer.
- **Workflow Steps:** "Confirm Food Picked Up from Kitchen" ➔ "Mark Order Delivered to Customer".

---

## ⚡ 1-Click Demo Accounts (Top Switcher Bar)

For immediate evaluation without manual typing, use the top bar or modal demo buttons:

| Role | Demo Name | Email | Password |
|---|---|---|---|
| **Customer** | Aarav Sharma | `customer@zewa.demo` | `demo_password_123` |
| **Restaurant** | Ramesh Gowda (Annapoorna Kitchen) | `restaurant@zewa.demo` | `demo_password_123` |
| **Delivery Partner** | Karthik Raja (Eco-Rider) | `delivery@zewa.demo` | `demo_password_123` |

---

## 🧮 Dynamic Pricing Mathematical Formula

The price decay engine runs on both the backend and client side using a non-linear convex decay model:

$$\text{Time Ratio} = \max\left(0, \min\left(1, \frac{T_{\text{closing}} - T_{\text{current}}}{T_{\text{window}}}\right)\right)$$

$$\text{Decay Multiplier} = (1 - \text{Time Ratio})^{1.35}$$

$$\text{Current Price} = \text{round}\left(P_{\text{start}} - (P_{\text{start}} - P_{\text{min}}) \times \text{Decay Multiplier}\right)$$

- Early in the window, price stays near $P_{\text{start}}$ (~30–40% discount).
- Towards the final 45–60 minutes, the curve accelerates towards $P_{\text{min}}$ (up to 70–75% discount) to incentivize immediate customer rescue.

---

## 🛡️ Anti-Hoarding & Fair Share Rule

To prevent commercial bulk buying and ensure fair community distribution:
- **Per-Listing Limit:** Each customer can purchase a maximum of **2 units** per surplus food listing within a 12-hour window.
- **Enforcement:**
  - Evaluated on backend during inventory reservation (`inventory.service.js`).
  - Evaluated on frontend in quantity steppers (`customer.js`).
  - Active temporary reservations count towards the 2-unit limit.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Application Server
```bash
npm start
```
The server will boot at **`http://localhost:4000`**.
Open your browser to `http://localhost:4000` to interact with the full application!

> *Note on VS Code Live Server:* If you open the frontend via Live Server (port 5500), it automatically connects to the backend API running on `http://localhost:4000/api`. Make sure `npm start` is running in your terminal.

### 3. Optional: Connect Live Supabase Database
By default, ZEWA includes a resilient local database pre-seeded with sample restaurants, surplus foods, and demo users.
To connect a live Supabase project:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Run `database/schema.sql` in your Supabase SQL Editor.
3. Add your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env`.
4. Restart the server.

---

## 🧪 Automated Testing

ZEWA includes an end-to-end integration test suite verifying the complete lifecycle:
```bash
node test_e2e.js
```
The test verifies:
1. Customer authentication and session persistence.
2. Dynamic pricing calculation and countdown accuracy.
3. Strict 2-unit purchase restriction enforcement (rejects 3 units).
4. 10-minute inventory reservation hold.
5. Online payment session signing and server-side verification.
6. Order dispatch to restaurant kitchen.
7. Delivery assignment, pickup confirmation, and completed delivery.

---

## 📄 License
MIT License. Created for the ZEWA Zero Waste Initiative.
