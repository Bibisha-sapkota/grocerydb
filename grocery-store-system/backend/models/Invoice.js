const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  items: [{
    product: String,
    quantity: Number,
    price: Number,
    discount: Number,
    total: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  pdfPath: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Generated', 'Sent', 'Viewed'],
    default: 'Generated'
  }
}, {
  timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);