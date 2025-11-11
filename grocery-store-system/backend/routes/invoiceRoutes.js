const express = require('express');
const router = express.Router();
const {
  generateInvoice,
  getAllInvoices,
  getMyInvoices,
  getInvoice,
  downloadInvoice
} = require('../controllers/invoiceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer routes
router.get('/my-invoices', protect, getMyInvoices);
router.get('/:id', protect, getInvoice);
router.get('/:id/download', protect, downloadInvoice);

// Admin routes
router.post('/generate/:orderId', protect, adminOnly, generateInvoice);
router.get('/', protect, adminOnly, getAllInvoices);

module.exports = router;