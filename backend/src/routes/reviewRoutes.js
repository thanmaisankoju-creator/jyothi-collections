// backend/src/routes/reviewRoutes.js
const express = require('express');
const router  = express.Router();
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',            createReview);      // Public — anyone can post
router.get('/:productId',   getReviews);        // Public
router.delete('/:id',       protect, deleteReview); // Admin only

module.exports = router;
