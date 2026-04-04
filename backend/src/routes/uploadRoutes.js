// backend/src/routes/uploadRoutes.js
const express = require('express');
const router  = express.Router();
const asyncHandler    = require('express-async-handler');
const { protect }     = require('../middleware/authMiddleware');
const { uploadProduct, cloudinary } = require('../config/cloudinary');

// POST /api/upload/product-image
router.post(
  '/product-image',
  protect,
  uploadProduct.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }
    res.json({
      success : true,
      url     : req.file.path,
      publicId: req.file.filename,
    });
  })
);

// DELETE /api/upload/:publicId
router.delete(
  '/:publicId',
  protect,
  asyncHandler(async (req, res) => {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ success: true, message: 'Image deleted' });
  })
);

module.exports = router;
