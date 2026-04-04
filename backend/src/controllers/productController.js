// backend/src/controllers/productController.js
const asyncHandler = require('express-async-handler');
const prisma       = require('../config/db');

// ── GET all products ─────────────────────────────────────
// GET /api/products?category=Dresses&search=silk
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, badge } = req.query;

  const where = { inStock: true };

  if (category && category !== 'all') {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { name        : { contains: search, mode: 'insensitive' } },
      { description : { contains: search, mode: 'insensitive' } },
      { category    : { contains: search, mode: 'insensitive' } },
    ];
  }
  if (badge) {
    where.badge = badge;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      reviews: {
        select: { rating: true, emoji: true, name: true, text: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Add avgRating to each product
  const enriched = products.map(p => ({
    ...p,
    avgRating   : p.reviews.length
      ? parseFloat((p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length).toFixed(1))
      : null,
    reviewCount : p.reviews.length,
  }));

  res.json({ success: true, count: enriched.length, products: enriched });
});

// ── GET single product ───────────────────────────────────
// GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where  : { id: req.params.id },
    include: {
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// ── CREATE product (admin) ───────────────────────────────
// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, category, emoji, badge, sizes } = req.body;

  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error('Please provide name, description, price, and category');
  }

  // If image was uploaded via Cloudinary, req.file.path = URL
  const images = req.file ? [req.file.path] : [];

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price         : parseFloat(price),
      originalPrice : originalPrice ? parseFloat(originalPrice) : null,
      category,
      emoji         : emoji || '👗',
      badge         : badge || null,
      sizes         : sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim())) : ['S', 'M', 'L'],
      images,
    },
  });

  res.status(201).json({ success: true, product });
});

// ── UPDATE product (admin) ───────────────────────────────
// PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) { res.status(404); throw new Error('Product not found'); }

  const data = { ...req.body };
  if (data.price)         data.price         = parseFloat(data.price);
  if (data.originalPrice) data.originalPrice = parseFloat(data.originalPrice);
  if (data.sizes && !Array.isArray(data.sizes)) {
    data.sizes = data.sizes.split(',').map(s => s.trim());
  }
  if (req.file) {
    data.images = [...existing.images, req.file.path];
  }

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data,
  });

  res.json({ success: true, product });
});

// ── DELETE product (admin) ───────────────────────────────
// DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) { res.status(404); throw new Error('Product not found'); }

  await prisma.product.delete({ where: { id: req.params.id } });

  res.json({ success: true, message: 'Product deleted' });
});

// ── GET categories with count ────────────────────────────
// GET /api/products/categories
const getCategories = asyncHandler(async (req, res) => {
  const cats = await prisma.product.groupBy({
    by    : ['category'],
    _count: { category: true },
    where : { inStock: true },
  });

  const categories = cats.map(c => ({
    name  : c.category,
    count : c._count.category,
  }));

  res.json({ success: true, categories });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };
