# ZEWA – ZERO WASTE (Surplus Food Marketplace)
### Hyperlocal Surplus Food Redistribution Network — Frontend Client & Mobile Experience

**ZEWA (Zero Waste)** is a modern, responsive food-surplus marketplace prototype that connects restaurants, bakeries, cafes, and hotels with nearby customers and college students. Restaurants can list safe, unsold surplus food at 50%–70% discounts, and customers can discover, reserve, and collect these meals before the pickup deadline, preventing avoidable landfill waste and cutting carbon emissions.

---

## 🌿 1. Human-Crafted Artisanal Palette & Typography

ZEWA has been redesigned with a distinctive editorial aesthetic inspired by sustainable gastronomy, slow food movements, and local organic farms:

- **Deep Forest Green (`#244C3A`):** Primary brand anchor representing grounded environmental impact, stability, and authenticity.
- **Olive Green (`#71865A`):** Secondary herbal tone for cuisine tags, subtitles, and eco-badges.
- **Warm Cream (`#F7F4EA`):** Warm, inviting canvas background reminiscent of unbleached parchment and artisan flour.
- **Soft Beige (`#E9E1D2` / `#F1EBE0`):** Tactile card backgrounds and subtle architectural borders.
- **Terracotta (`#C87855`):** Warm clay accent for savings badges, discounts, and visual focus points.
- **Charcoal (`#30352F`):** Gentle, high-contrast text color that is much softer and more human than harsh pure black.
- **Typography:** **`DM Serif Display`** for editorial display headlines paired with **`DM Sans`** for crisp, highly readable mobile body text and UI labels.

---

## 📱 2. Mobile-First Responsive Engineering (Tested 320px–430px)

The prototype is engineered specifically for mobile device demonstration:
- **Zero Horizontal Overflow:** Tested using Chrome Device Emulation across **320px, 360px, 375px, 390px, 414px, and 430px** with $0\text{px}$ overflow.
- **Smooth Hamburger Navigation:** Slide-down menu with blurred backdrop, auto-close on selection, and 48px comfortable tap targets.
- **Compact Mobile Filter Drawer:** In the marketplace, filter controls collapse cleanly behind an *"Adjust Filters"* toggle button so users on phones immediately see food listings.
- **Single-Column Food Cards on Mobile:** Clean vertical flow with high-resolution food imagery, clearly visible prices, and terracotta discount tags.
- **Mobile Counter Tool:** Restaurant pickup code verification form adapts to full-width inputs for easy typing on counter tablets or smartphones.

---

## 📁 3. Project Folder Structure

```
new mini project/
├── index.html        # Complete semantic HTML structure, all views & modal dialogs
├── style.css         # Modern design system (Natural green, soft off-white, cards, responsive)
├── script.js         # Complete frontend application logic, state store & localStorage engine
└── README.md         # Comprehensive project documentation & evaluation guide
```

> **Zero Dependencies:** No backend, database, Node modules, Firebase, or external APIs are required. Everything runs locally in any web browser and persists persistently via browser `localStorage`.

---

## 🚀 4. Instructions to Run the Application

You can run ZEWA locally using **any** of the following simple methods:

### Method A: Double-Click (Zero Setup)
1. Open the project folder on your computer.
2. Double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Safari, or Mozilla Firefox.

### Method B: VS Code Live Server (Recommended for Evaluation)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click `index.html` and choose **"Open with Live Server"**.
4. The application will launch at `http://127.0.0.1:5500`.

### Method C: Python One-Line Server
Open a terminal in the project directory and run:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` in your browser.

---

## 🔑 5. Demo Login Credentials

For quick evaluation and faculty demonstrations, ZEWA includes **1-Click Demo Buttons** at the top bar and inside the login modal, so you don't even have to type passwords.

### Customer Account
- **Role:** Customer / College Student
- **Email:** `customer@zewa.in`
- **Password:** `pass123`
- **Demo Persona:** Aarav Sharma (Bengaluru)
- **Features to Demo:** Browse marketplace, filter/search meals, reserve surplus mystery bags, select payment option, get unique pickup code (`ZEWA-XXXX`) with QR representation, view active pickups & history, cancel reservations, edit profile.

### Restaurant Partner Account
- **Role:** Restaurant Partner / Eatery Owner
- **Email:** `greenbistro@zewa.in`
- **Password:** `pass123`
- **Demo Persona:** Chef Priya Patel (The Green Bistro, Indiranagar)
- **Features to Demo:** Add surplus food listing with auto-calculated discount %, stock management (+/- portions), mark as sold out, manage reservations table, and verify customer pickup codes using the **Counter Verification Tool**.

---

## ✨ 6. Complete List of Implemented Features

### 🌟 Landing Page
- **Clean Nature-Inspired Design:** Deep forest green, olive, warm cream, soft beige, and terracotta accents.
- **Hero Section:** Value proposition *"Save Food. Save Money. Save Our Planet."*, interactive stat pills, and live featured food card.
- **Live Environmental Impact Ribbon:** Dynamic counters for Meals Rescued, Waste Prevented (kg), Carbon Avoided (kg CO₂e), and Customer Money Saved (₹).
- **Featured Surplus Picks:** Live high-discount meal bags rendered directly from the local store.
- **How ZEWA Works:** Interactive toggle between **Customer Journey** and **Restaurant Journey**.
- **Benefits Section:** Detailed comparison columns for conscious consumers vs. commercial food businesses.
- **Testimonials:** Verified feedback from students, chefs, and eco-conscious residents.

### 🍱 Explore Food Marketplace
- **Multi-Facet Filtering:**
  - **Live Search:** Instant matching against food title, description, category, and restaurant name.
  - **Category Chips:** All, Meals & Thalis, Bakery & Pastry, Healthy & Salads, Desserts & Sweets, Snacks, Fresh Produce.
  - **Dietary Filter:** Pure Vegetarian (🟢) vs. Non-Vegetarian (🔴).
  - **Price Range Slider:** Filter surplus prices from ₹50 up to ₹600.
  - **Distance Slider:** Filter radius from 1 km to 15 km.
  - **Sorting Options:** Highest Discount %, Price: Low to High, Nearest Proximity, Ending Soonest.
  - **Empty State:** Friendly reset button when zero items match filters.
- **Rich Food Cards:** Image, discount badge (`65% OFF`), diet badge, distance, pickup window (`19:30 – 21:30`), stock warning (`Only 2 bags left`), original vs. discounted prices, and instant action buttons.

### 🔍 Interactive Food Details & Live Quantity Calculator
- High-resolution food showcase with ingredient lists and freshness/expiry instructions.
- Restaurant address and pickup guidelines.
- **Interactive Quantity Selector (+ / -):** Real-time price recalculation that prevents exceeding remaining surplus stock.

### 💳 Simulated Checkout & Tamper-Proof Pickup Code Generation
- Step-by-step modal reviewing items, portions, and waste-reduction subsidy.
- Simulated payment options: **UPI / QR (GPay/PhonePe)**, **Card**, **Pay on Pickup Counter**, and **ZEWA Eco-Coins**.
- **Confirmation Screen:**
  - Animated green checkmark celebration.
  - Unique Pickup Code (e.g., `ZEWA-8492`).
  - Encrypted QR code visual graphic.
  - Unique Booking ID (e.g., `#ZW-2026-9041`).
  - Automatic deduction of food stock from marketplace.
  - Instant addition to Customer Orders and Restaurant Reservations.

### 👤 Customer Dashboard
- Overview metrics: Total Reservations, Active Pickups, Total Money Saved, Waste Diverted (kg).
- **Active Pickups Tab:** Large monospace pickup code display, collection countdown, restaurant location, and "Cancel Booking" option (which automatically restores stock).
- **Reservation History Tab:** Record of completed and cancelled orders with receipts and environmental badges.
- **Customer Profile:** Edit personal details (name, phone, email, neighborhood) and choose from profile avatars.

### 🏪 Restaurant Partner Dashboard
- Overview metrics: Active Food Listings, Pending Pickups, Completed Pickups, Recovered Revenue (₹), Food Rescued (kg).
- **Quick Pickup Code Verifier Tool:** Counter tool where the restaurant inputs the customer's pickup code (e.g. `ZEWA-8492`), validates it, and marks the meal as collected in real-time, incrementing revenue and updating sustainability statistics.
- **Manage Food Listings Table:** Live stock adjustment (`+` and `-` buttons), Edit listing modal, Mark as Sold Out, and Delete listing.
- **Add Surplus Listing Form:**
  - Title, category, description, dietary type.
  - **Auto-Calculated Discount:** Typing original price (`₹500`) and surplus price (`₹175`) automatically calculates and displays `65% OFF` and total customer savings live.
  - Curated food image presets selector (Bakery, Biryani, Pizza, Salads, Desserts, Breakfast) or custom image URL input.
  - Pickup start/end windows and safe consumption deadline.
  - Required Food Safety & Hygiene compliance declaration.
- **Incoming Customer Reservations Table:** Real-time customer list, quantities, pickup codes, and verification triggers.
- **Restaurant Profile:** Edit kitchen address, chef name, cuisine tags, and contact numbers.

### 🗺️ Geolocation Discovery / Interactive Visual Map
- Stylized vector SVG city map simulation (Indiranagar / Bengaluru) featuring roads, parks, Ulsoor Lake, metro lines, and user location radar.
- Clickable restaurant pins with active bag count badges.
- Clicking any pin displays a preview card on the sidebar with the restaurant's photo, address, rating, and direct surplus bags available for reservation.

### 🌱 Sustainability & Impact Tracker (SDG 12)
- Environmental impact formula: 1 meal ≈ 0.6 kg food waste diverted ≈ 1.5 kg CO₂e emissions avoided.
- Interactive personal footprint calculator: Adjust weekly rescued meals to view yearly kg saved, CO₂ avoided, money saved, and equivalent mature trees planted.
- Zero-waste restaurant partner leaderboard.

---

## 🔮 7. Future Backend Roadmap (What Backend/API Would Add)

For a production deployment after the college mini-project phase, the following features would be connected to a real server and database:

1. **Production Database & API:** Replace `localStorage` with PostgreSQL/MongoDB and REST/GraphQL APIs (Node.js/Express, Python/FastAPI, or Go) to sync inventory in real time across different devices.
2. **Real Authentication & Security:** JWT tokens, OAuth2 (Google Sign-In), password hashing (bcrypt/argon2), and role-based access control (RBAC).
3. **Payment Gateway Integration:** Razorpay / Stripe API for actual UPI, net banking, and card processing.
4. **Live GPS & Real Maps API:** Google Maps Platform / Mapbox SDK for real-time customer geofencing, route directions, and live distance calculations.
5. **Real-time WebSockets / Push Notifications:** Notify customers when their favorite nearby bakery lists surplus food, and send SMS/WhatsApp alerts when pickup windows open.
6. **Hardware QR Scanner:** Camera-based barcode/QR code scanning using device cameras at restaurant checkout counters.
7. **FSSAI Automated Compliance:** Verification APIs to automatically check food business licenses and cold-storage compliance certificates.
