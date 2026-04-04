// backend/src/controllers/paymentController.js
const asyncHandler = require('express-async-handler');
const Razorpay     = require('razorpay');
const crypto       = require('crypto');
const prisma       = require('../config/db');

const razorpay = new Razorpay({
  key_id    : process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Create Razorpay order ────────────────────────────────
// POST /api/payments/create-order
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) { res.status(404); throw new Error('Order not found'); }

  const razorpayOrder = await razorpay.orders.create({
    amount  : Math.round(order.totalAmount * 100), // paise
    currency: 'INR',
    receipt : orderId,
    notes   : { customerName: order.customerName, phone: order.phone },
  });

  res.json({
    success      : true,
    razorpayOrder,
    key          : process.env.RAZORPAY_KEY_ID,
    amount       : order.totalAmount,
    customerName : order.customerName,
    phone        : order.phone,
  });
});

// ── Verify Razorpay payment signature ────────────────────
// POST /api/payments/verify
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body      = razorpay_order_id + '|' + razorpay_payment_id;
  const expected  = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expected !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed — invalid signature');
  }

  // Mark order as paid
  await prisma.order.update({
    where: { id: orderId },
    data : {
      paymentId    : razorpay_payment_id,
      paymentStatus: 'PAID',
      status       : 'CONFIRMED',
    },
  });

  res.json({ success: true, message: 'Payment verified and order confirmed' });
});

module.exports = { createPaymentOrder, verifyPayment };
