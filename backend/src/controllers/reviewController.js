// backend/src/controllers/reviewController.js
const asyncHandler = require('express-async-handler');
const prisma       = require('../config/db');

// ── POST a review ────────────────────────────────────────
// POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { productId, name, emoji, rating, text } = req.body;

  if (!productId || !name || !emoji || !rating || !text) {
    res.status(400);
    throw new Error('All review fields are required');
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const review = await prisma.review.create({
    data: {
      productId,
      name,
      emoji,
      rating : parseInt(rating),
      text,
    },
  });

  res.status(201).json({ success: true, review });
});

// ── GET reviews for a product ────────────────────────────
// GET /api/reviews/:productId
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where  : { productId: req.params.productId },
    orderBy: { createdAt: 'desc' },
  });

  const avgRating = reviews.length
    ? parseFloat((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1))
    : null;

  res.json({ success: true, reviews, avgRating, count: reviews.length });
});

// ── DELETE review (admin) ────────────────────────────────
// DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { createReview, getReviews, deleteReview };
