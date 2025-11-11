const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getExpiringProducts
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public/Customer routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.get('/admin/low-stock', protect, adminOnly, getLowStockProducts);
router.get('/admin/expiring', protect, adminOnly, getExpiringProducts);

module.exports = router;