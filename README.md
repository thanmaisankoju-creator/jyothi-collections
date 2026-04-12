#  Jyothi Collections — Full Stack E-Commerce Website

> A modern, fully functional fashion e-commerce web application built with React, Node.js, PostgreSQL, and cloud services.

 **Live Website:** [jyothi-collections.vercel.app](https://jyothi-collections.vercel.app)

---

##  Project Overview

Jyothi Collections is a full-stack e-commerce platform for a fashion store. It allows customers to browse products, add items to cart, and place orders. The store owner can manage products, upload images, and track customer orders through a secure admin panel.

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Image Storage | Cloudinary |
| Authentication | JWT (JSON Web Tokens) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | GitHub |

---

##  Features

### Customer Side
-  Animated splash screen with logo transition
-  Browse products by category (Dresses, Tops, Bottoms, Outerwear, Accessories)
-  Search products by name
-  Add to cart with size selection
-  Place orders with name, phone, and address
-  Leave product reviews and ratings

### Admin Side
-  Secure password-protected admin panel
-  Add new products with real image uploads
-  Delete products
-  View all customer orders with full details
-  Update order status (Pending → Confirmed → Shipped → Delivered → Cancelled)

---

##  Project Structure

```
jyothi-collections/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── AdminPanel.jsx         # Admin dashboard
│   │   │   ├── ProductGrid.jsx        # Product listing
│   │   │   ├── CartDrawer.jsx         # Shopping cart
│   │   │   ├── OrderModal.jsx         # Order placement
│   │   │   ├── ProductModal.jsx       # Product details
│   │   │   ├── Navbar.jsx             # Navigation
│   │   │   ├── Hero.jsx               # Hero banner
│   │   │   └── Testimonials.jsx       # Customer reviews
│   │   └── utils/
│   │       ├── api.js                 # API calls
│   │       └── store.js               # State management
│   └── .env                   # VITE_API_URL
│
├── backend/                   # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth & error handling
│   │   ├── config/            # DB & Cloudinary config
│   │   └── server.js          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Sample data
│   └── .env                   # Environment variables
```

---

##  API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Add new product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/orders` | Get all orders | Admin |
| POST | `/api/orders` | Place new order | Public |
| PATCH | `/api/orders/:id/status` | Update order status | Admin |
| POST | `/api/admin/login` | Admin login | Public |
| GET | `/api/health` | Health check | Public |

---

##  Database Schema

### Product
- `id`, `name`, `category`, `price`, `originalPrice`
- `emoji`, `badge`, `description`, `sizes`
- `imageUrl` (stored on Cloudinary)

### Order
- `id`, `customerName`, `phone`, `address`
- `totalAmount`, `status`, `paymentStatus`
- `items` (linked products with size, quantity, price)

### Admin
- `id`, `email`, `password` (bcrypt hashed)

---

##  Cloud Services Used

| Service | Purpose | Plan |
|---------|---------|------|
| Supabase | PostgreSQL database hosting | Free |
| Cloudinary | Product image storage & optimization | Free |
| Vercel | Frontend deployment with auto-deploy | Free |
| Render | Backend API hosting | Free |
| GitHub | Source code version control | Free |

**Total Monthly Cost: ₹0** 🎉

---

##  Local Setup

### Prerequisites
- Node.js v18+
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/thanmaisankoju-creator/jyothi-collections.git
cd jyothi-collections

# 2. Setup backend
cd backend
npm install
# Add your DATABASE_URL and other vars to .env
npx prisma db push
node prisma/seed.js

# 3. Setup frontend
cd ../frontend
npm install

# 4. Run both together
cd ..
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

##  Environment Variables

### Backend `.env`
```env
DATABASE_URL=your_supabase_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
ADMIN_PASSWORD=jyothi2025
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend `.env`
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

##  Future Enhancements

-  Razorpay payment gateway integration
-  Gmail SMTP order confirmation emails
-  Custom domain (e.g. jyothicollections.com)
-  Mobile app version
-  Sales analytics dashboard

---

##  Developer

**Thanmai Sankoju**
- GitHub: [@thanmaisankoju-creator](https://github.com/thanmaisankoju-creator)

---

##  License

This project is built for educational and personal business purposes.
