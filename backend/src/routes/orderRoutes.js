// backend/src/routes/orderRoutes.js
const express = require('express');
const router  = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',               createOrder);             // Public — place order
router.get('/',                protect, getOrders);      // Admin only
router.patch('/:id/status',    protect, updateOrderStatus); // Admin only

module.exports = router;
