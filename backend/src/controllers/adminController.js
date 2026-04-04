// backend/src/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const bcrypt       = require('bcryptjs');
const prisma       = require('../config/db');
const { generateToken } = require('../middleware/authMiddleware');

// ── Admin login (returns JWT) ────────────────────────────
// POST /api/admin/login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Support simple password check (matches .env ADMIN_PASSWORD)
  if (!email && password) {
    if (password === process.env.ADMIN_PASSWORD) {
      return res.json({
        success : true,
        message : 'Admin access granted',
        token   : generateToken('admin'),
      });
    }
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password required');
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success : true,
    admin   : { id: admin.id, email: admin.email },
    token   : generateToken(admin.id),
  });
});

// ── Change password ──────────────────────────────────────
// POST /api/admin/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (currentPassword !== process.env.ADMIN_PASSWORD) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }
  if (!newPassword || newPassword.length < 4) {
    res.status(400);
    throw new Error('New password must be at least 4 characters');
  }

  // In production you'd update the DB; here we just confirm
  // To persist: update .env and restart server
  res.json({ success: true, message: 'Password updated. Please update your .env file.' });
});

// ── Dashboard stats ──────────────────────────────────────
// GET /api/admin/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, recentOrders, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take    : 5,
      orderBy : { createdAt: 'desc' },
      include : { items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'PAID' },
    }),
  ]);

  const categoryCounts = await prisma.product.groupBy({
    by    : ['category'],
    _count: { category: true },
  });

  res.json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      totalRevenue : totalRevenue._sum.totalAmount || 0,
      categoryCounts,
    },
    recentOrders,
  });
});

module.exports = { adminLogin, changePassword, getDashboard };
