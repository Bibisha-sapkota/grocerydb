// const express = require('express');
// const router = express.Router();
// const {
//   register,
//   login,
//   getProfile,
//   updateProfile,
//   getAllCustomers,
//   toggleBlockUser
// } = require('../controllers/authController');
// const { protect, adminOnly } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

// // Public routes
// router.post('/register', register);
// router.post('/login', login);

// // Protected routes
// router.get('/profile', protect, getProfile);
// router.put('/profile', protect, upload.single('photo'), updateProfile);

// // Admin routes
// router.get('/customers', protect, adminOnly, getAllCustomers);
// router.put('/users/:id/block', protect, adminOnly, toggleBlockUser);

// module.exports = router;
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllCustomers,
  toggleBlockUser
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('photo'), updateProfile);

// Admin routes
router.get('/customers', protect, adminOnly, getAllCustomers);
router.put('/users/:id/block', protect, adminOnly, toggleBlockUser);

module.exports = router;