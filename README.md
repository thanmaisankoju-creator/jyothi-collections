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

## 🌍 Deploy — Make It Accessible to Everyone

### Backend → Railway (free, auto-deploys)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/jyothi-collections.git
   git push -u origin main
   ```

2. Go to https://railway.app → New Project → Deploy from GitHub
3. Select your repo → choose the `backend` folder as root
4. Add environment variables (copy from `backend/.env`):
   - `DATABASE_URL` — from Railway PostgreSQL
   - `JWT_SECRET`   — any random string
   - `ADMIN_PASSWORD` — `jyothi2025`
   - `NODE_ENV`     — `production`
5. Railway gives you a URL like: `https://jyothi-backend.up.railway.app`

### Frontend → Vercel (free, auto-deploys)

1. Go to https://vercel.com → New Project → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Add environment variables:
   - `VITE_API_URL` → `https://jyothi-backend.up.railway.app/api`
4. Click Deploy → Vercel gives you: `https://jyothi-collections.vercel.app`
5. Share this URL — **everyone can access your store!**

### Custom Domain (optional)
- Buy `jyothicollections.com` from GoDaddy or Namecheap (~₹800/year)
- In Vercel → Settings → Domains → Add your domain
- Follow DNS instructions — takes ~10 minutes to go live

---

## 🔑 API Endpoints Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Server health check | Public |
| GET | `/api/products` | List all products | Public |
| GET | `/api/products?category=Dresses` | Filter by category | Public |
| GET | `/api/products?search=silk` | Search products | Public |
| GET | `/api/products/:id` | Single product | Public |
| POST | `/api/products` | Add product | 🔒 Admin |
| PUT | `/api/products/:id` | Update product | 🔒 Admin |
| DELETE | `/api/products/:id` | Delete product | 🔒 Admin |
| POST | `/api/reviews` | Post a review | Public |
| GET | `/api/reviews/:productId` | Get reviews | Public |
| POST | `/api/orders` | Place order | Public |
| GET | `/api/orders` | All orders | 🔒 Admin |
| PATCH | `/api/orders/:id/status` | Update status | 🔒 Admin |
| POST | `/api/admin/login` | Admin login | Public |
| GET | `/api/admin/dashboard` | Dashboard stats | 🔒 Admin |
| POST | `/api/payments/create-order` | Razorpay order | Public |
| POST | `/api/payments/verify` | Verify payment | Public |

---

## 🎨 Features Summary

| Feature | Status |
|---------|--------|
| Cinematic logo splash page | ✅ |
| Click-anywhere to enter | ✅ |
| 5 colour themes | ✅ |
| Product catalog with filters | ✅ |
| Product detail modal | ✅ |
| Emoji reviews (😍😊😐😕😞) | ✅ |
| Shopping cart | ✅ |
| Order placement | ✅ |
| Admin password lock | ✅ |
| Admin panel (add/delete products) | ✅ |
| Full admin dashboard (`/admin`) | ✅ |
| Search overlay | ✅ |
| Custom cursor | ✅ |
| Product image upload (Cloudinary) | ✅ |
| Razorpay payments | ✅ |
| Order confirmation emails | ✅ |
| PostgreSQL database | ✅ |
| JWT authentication | ✅ |
| REST API | ✅ |

---

## 🔒 Admin Credentials
- **In-store lock:** Click 🔒 icon → password: `jyothi2025`
- **Full dashboard:** Go to `/admin` → same password
- **Change in:** `backend/.env` → `ADMIN_PASSWORD=newpassword`

---

## 📞 Services & Free Tiers

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Railway | Backend hosting + PostgreSQL | $5/mo free credit |
| Vercel | Frontend hosting | Unlimited free |
| Cloudinary | Image storage | 25GB free |
| Razorpay | Payments | Free (2% fee per transaction) |
| Gmail SMTP | Order emails | Free |

---

*Jyothi Collections · © 2025 · Made with care in India 🇮🇳*
