// backend/src/routes/adminRoutes.js
const express = require('express');
const router  = express.Router();
const { adminLogin, changePassword, getDashboard } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login',            adminLogin);
router.post('/change-password',  protect, changePassword);
router.get('/dashboard',         protect, getDashboard);

module.exports = router;
