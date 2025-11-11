const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Bakery', 'Frozen', 'Personal Care', 'Household', 'Others']
  },
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  finalPrice: {
    type: Number
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Expiring', 'Expired', 'Out of Stock'],
    default: 'Active'
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

// Calculate final price before saving
productSchema.pre('save', function(next) {
  this.finalPrice = this.price - (this.price * this.discount / 100);
  
  // Update status based on quantity
  if (this.quantity === 0) {
    this.status = 'Out of Stock';
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);