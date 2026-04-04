// backend/src/routes/productRoutes.js
const express = require('express');
const router  = express.Router();
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, getCategories,
} = require('../controllers/productController');
const { protect }       = require('../middleware/authMiddleware');
const { uploadProduct } = require('../config/cloudinary');

// Public
router.get('/',            getProducts);
router.get('/categories',  getCategories);
router.get('/:id',         getProduct);

// Admin only
router.post('/',           protect, uploadProduct.single('image'), createProduct);
router.put('/:id',         protect, uploadProduct.single('image'), updateProduct);
router.delete('/:id',      protect, deleteProduct);

module.exports = router;
