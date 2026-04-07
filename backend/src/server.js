// backend/src/server.js
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const productRoutes  = require('./routes/productRoutes');
const reviewRoutes   = require('./routes/reviewRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const uploadRoutes   = require('./routes/uploadRoutes');
const paymentRoutes  = require('./routes/paymentRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── SECURITY ────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ── RATE LIMITING ───────────────────────────────
const limiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 200,
  message  : 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// ── CORS ────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://jyothi-collections.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// ── BODY PARSING ────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── LOGGING ─────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── STATIC FILES ────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── HEALTH CHECK ────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status  : 'OK',
    message : 'Jyothi Collections API is running',
    version : '1.0.0',
    time    : new Date().toISOString(),
  });
});

// ── ROUTES ──────────────────────────────────────
app.use('/api/products',  productRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/upload',    uploadRoutes);
app.use('/api/payments',  paymentRoutes);

// ── 404 & ERROR HANDLER ─────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── START ───────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' 🛍️  Jyothi Collections API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(` 🚀  Running on  : http://localhost:${PORT}`);
  console.log(` 🌍  Environment : ${process.env.NODE_ENV}`);
  console.log(` ❤️   Health     : http://localhost:${PORT}/api/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});