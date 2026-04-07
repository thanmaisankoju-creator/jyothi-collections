# 🛍️ Jyothi Collections — Full Stack Fashion Store

> **explore the fashion world**

A complete, production-ready fashion e-commerce website with React frontend, Node.js backend, PostgreSQL database, and cloud deployment — accessible by everyone on the internet.

---

## 📁 Project Structure

```
jyothi-collections/
│
├── frontend/                    ← React + Vite website
│   ├── public/
│   │   └── images/
│   │       └── logo.png         ← ⚠️  PUT YOUR LOGO HERE
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SplashPage.jsx   ← Logo intro with transitions
│   │   │   ├── StorePage.jsx    ← Main store
│   │   │   └── AdminPage.jsx    ← Full admin dashboard (/admin)
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Marquee.jsx
│   │   │   ├── ThemeBar.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductModal.jsx ← Sizes + emoji reviews
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── SearchOverlay.jsx
│   │   │   ├── AdminLock.jsx    ← Password screen
│   │   │   ├── AdminPanel.jsx   ← In-store admin panel
│   │   │   ├── OrderModal.jsx
│   │   │   ├── FeaturedBanner.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Newsletter.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Cursor.jsx
│   │   ├── utils/
│   │   │   ├── api.js           ← All API calls (axios)
│   │   │   └── store.js         ← Zustand state (cart, theme, admin, UI)
│   │   └── styles/
│   │       └── global.css       ← All 5 themes + base styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     ← Node.js + Express API
│   ├── prisma/
│   │   ├── schema.prisma        ← Database models
│   │   └── seed.js              ← Initial data
│   ├── src/
│   │   ├── server.js            ← Entry point
│   │   ├── config/
│   │   │   ├── db.js            ← Prisma client
│   │   │   └── cloudinary.js    ← Image uploads
│   │   ├── controllers/
│   │   │   ├── productController.js
│   │   │   ├── reviewController.js
│   │   │   ├── orderController.js
│   │   │   ├── adminController.js
│   │   │   └── paymentController.js
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── uploadRoutes.js
│   │   │   └── paymentRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js ← JWT + admin auth
│   │   │   └── errorMiddleware.js
│   │   └── utils/
│   │       └── emailService.js   ← Order confirmation emails
│   ├── .env                      ← ⚠️  Fill this in!
│   └── package.json
│
├── package.json                  ← Root scripts
└── README.md                     ← This file
```

---

## ⚡ Quick Start (Run Locally in VS Code)

### Step 1 — Install VS Code & Node.js
- VS Code: https://code.visualstudio.com
- Node.js (v18+): https://nodejs.org

### Step 2 — Add your logo
```
Copy your logo PNG to:
frontend/public/images/logo.png
```

### Step 3 — Install all packages
Open VS Code Terminal (`Ctrl+``):
```bash
# From the root jyothi-collections/ folder:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Step 4 — Setup database (PostgreSQL)

**Option A — Local PostgreSQL (free)**
1. Download: https://www.postgresql.org/download
2. Create database: `createdb jyothi_collections`
3. Edit `backend/.env`:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/jyothi_collections"
   ```

**Option B — Railway (free cloud database, easiest)**
1. Go to https://railway.app → New Project → PostgreSQL
2. Copy the `DATABASE_URL` from Railway
3. Paste it into `backend/.env`

### Step 5 — Push schema & seed data
```bash
cd backend
npx prisma db push          # Creates all tables
node prisma/seed.js         # Adds 8 sample products + admin user
```

### Step 6 — Run both servers
```bash
# From root folder, runs frontend + backend together:
npm run dev
```

Your store is now running at:
- 🌐 **Website:** http://localhost:5173
- 🔧 **API:**     http://localhost:5000/api/health
- 🛠️  **Admin:**  http://localhost:5173/admin

**Admin password:** `jyothi2025`

---




