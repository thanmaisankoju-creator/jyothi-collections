// backend/src/middleware/authMiddleware.js
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const prisma   = require('../config/db');

// ── Protect routes with JWT ──────────────────────────────
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorised — no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await prisma.admin.findUnique({
      where : { id: decoded.id },
      select: { id: true, email: true },
    });
    if (!req.admin) throw new Error('Admin not found');
    next();
  } catch (err) {
    res.status(401);
    next(new Error('Not authorised — invalid token'));
  }
};

// ── Simple password check for quick admin access ─────────
const checkAdminPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password required' });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }
  next();
};

// ── Generate JWT ─────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

module.exports = { protect, checkAdminPassword, generateToken };
