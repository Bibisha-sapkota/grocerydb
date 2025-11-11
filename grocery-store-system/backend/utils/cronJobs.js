const cron = require('node-cron');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Check expiry dates and apply discounts
const checkProductExpiry = async () => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Find expiring products (within 7 days)
    const expiringProducts = await Product.find({
      expiryDate: {
        $gte: now,
        $lte: sevenDaysFromNow
      },
      status: { $ne: 'Expired' }
    });

    // Apply discount and update status
    for (let product of expiringProducts) {
      if (product.status !== 'Expiring') {
        product.status = 'Expiring';
        if (product.discount < 20) {
          product.discount = 20; // Apply 20% discount
        }
        await product.save();

        // Notify admins
        const admins = await User.find({ role: 'admin' });
        for (let admin of admins) {
          await Notification.create({
            user: admin._id,
            type: 'Expiry',
            title: 'Product Expiring Soon',
            message: `${product.name} will expire on ${product.expiryDate.toLocaleDateString()}`,
            relatedProduct: product._id,
            priority: 'High'
          });
        }
      }
    }

    // Mark expired products
    const expiredProducts = await Product.find({
      expiryDate: { $lt: now },
      status: { $ne: 'Expired' }
    });

    for (let product of expiredProducts) {
      product.status = 'Expired';
      await product.save();

      // Notify admins
      const admins = await User.find({ role: 'admin' });
      for (let admin of admins) {
        await Notification.create({
          user: admin._id,
          type: 'Expiry',
          title: 'Product Expired',
          message: `${product.name} has expired and is now unavailable`,
          relatedProduct: product._id,
          priority: 'High'
        });
      }
    }

    console.log(`✅ Expiry check completed: ${expiringProducts.length} expiring, ${expiredProducts.length} expired`);
  } catch (error) {
    console.error('❌ Error in expiry check:', error);
  }
};

// Check low stock
const checkLowStock = async () => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
      quantity: { $gt: 0 }
    });

    const admins = await User.find({ role: 'admin' });

    for (let product of lowStockProducts) {
      for (let admin of admins) {
        // Check if notification already exists for this product
        const existingNotif = await Notification.findOne({
          user: admin._id,
          relatedProduct: product._id,
          type: 'Low Stock',
          isRead: false
        });

        if (!existingNotif) {
          await Notification.create({
            user: admin._id,
            type: 'Low Stock',
            title: 'Low Stock Alert',
            message: `${product.name} stock is low (${product.quantity} left)`,
            relatedProduct: product._id,
            priority: 'Medium'
          });
        }
      }
    }

    console.log(`✅ Low stock check completed: ${lowStockProducts.length} products`);
  } catch (error) {
    console.error('❌ Error in low stock check:', error);
  }
};

// Start cron jobs
exports.startCronJobs = () => {
  // Run expiry check daily at midnight
  cron.schedule('0 0 * * *', checkProductExpiry);
  
  // Run low stock check twice daily (8 AM and 8 PM)
  cron.schedule('0 8,20 * * *', checkLowStock);

  // Run expiry check immediately on startup
  checkProductExpiry();
  checkLowStock();

  console.log('✅ Cron jobs started');
};