// backend/src/controllers/orderController.js
const asyncHandler = require('express-async-handler');
const prisma       = require('../config/db');
const { sendOrderEmail } = require('../utils/emailService');

// ── CREATE order ─────────────────────────────────────────
// POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, address, items } = req.body;

  if (!customerName || !phone || !address || !items?.length) {
    res.status(400);
    throw new Error('Please provide name, phone, address, and items');
  }

  // Calculate total from DB prices (never trust frontend prices)
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    const lineTotal = product.price * item.quantity;
    totalAmount += lineTotal;
    orderItems.push({
      productId : item.productId,
      size      : item.size,
      quantity  : item.quantity,
      price     : product.price,
    });
  }

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      address,
      totalAmount,
      items: { create: orderItems },
    },
    include: { items: { include: { product: true } } },
  });

  // Send confirmation email (non-blocking)
  sendOrderEmail(order).catch(err =>
    console.warn('Email send failed (non-critical):', err.message)
  );

  res.status(201).json({ success: true, order });
});

// ── GET all orders (admin) ───────────────────────────────
// GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};

  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, count: orders.length, orders });
});

// ── UPDATE order status (admin) ──────────────────────────
// PATCH /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data : { status },
  });

  res.json({ success: true, order });
});

module.exports = { createOrder, getOrders, updateOrderStatus };
