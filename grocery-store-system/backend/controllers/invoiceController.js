// const Invoice = require('../models/Invoice');
// const Order = require('../models/Order');
// const { generateInvoicePDF } = require('../utils/pdfGenerator');

// // Generate Invoice (Admin)
// exports.generateInvoice = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.orderId)
//       .populate('customer', 'name email phone address')
//       .populate('items.product');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Check if invoice already exists
//     let invoice = await Invoice.findOne({ order: order._id });

//     if (invoice) {
//       return res.json({
//         success: true,
//         message: 'Invoice already exists',
//         data: invoice
//       });
//     }

//     // Prepare invoice items
//     const invoiceItems = order.items.map(item => ({
//       product: item.name,
//       quantity: item.quantity,
//       price: item.price,
//       discount: item.discount,
//       total: item.finalPrice * item.quantity
//     }));

//     // Create invoice
//     invoice = await Invoice.create({
//       order: order._id,
//       customer: order.customer._id,
//       items: invoiceItems,
//       subtotal: order.subtotal,
//       tax: order.tax,
//       totalAmount: order.total
//     });

//     // Generate PDF
//     const pdfPath = await generateInvoicePDF(invoice, order);
//     invoice.pdfPath = pdfPath;
//     await invoice.save();

//     res.status(201).json({
//       success: true,
//       message: 'Invoice generated successfully',
//       data: invoice
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get All Invoices (Admin)
// exports.getAllInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find()
//       .populate('customer', 'name email')
//       .populate('order', 'orderNumber')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: invoices.length,
//       data: invoices
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Customer Invoices
// exports.getMyInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ customer: req.user._id })
//       .populate('order', 'orderNumber orderStatus')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: invoices.length,
//       data: invoices
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Single Invoice
// exports.getInvoice = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id)
//       .populate('customer', 'name email phone address')
//       .populate('order', 'orderNumber paymentMethod paymentStatus');

//     if (!invoice) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invoice not found'
//       });
//     }

//     // Check authorization
//     if (req.user.role !== 'admin' && invoice.customer._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }

//     // Update status to viewed
//     if (invoice.status === 'Generated') {
//       invoice.status = 'Viewed';
//       await invoice.save();
//     }

//     res.json({
//       success: true,
//       data: invoice
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Download Invoice PDF
// exports.downloadInvoice = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id);

//     if (!invoice) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invoice not found'
//       });
//     }

//     // Check authorization
//     if (req.user.role !== 'admin' && invoice.customer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }

//     if (!invoice.pdfPath) {
//       return res.status(404).json({
//         success: false,
//         message: 'PDF not generated yet'
//       });
//     }

//     res.download(invoice.pdfPath);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

// Generate Invoice (Admin)
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customer', 'name email phone address')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if invoice already exists
    let invoice = await Invoice.findOne({ order: order._id });

    if (invoice) {
      return res.json({
        success: true,
        message: 'Invoice already exists',
        data: invoice
      });
    }

    // Prepare invoice items
    const invoiceItems = order.items.map(item => ({
      product: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
      total: item.finalPrice * item.quantity
    }));

    // Create invoice
    invoice = await Invoice.create({
      order: order._id,
      customer: order.customer._id,
      items: invoiceItems,
      subtotal: order.subtotal,
      tax: order.tax,
      totalAmount: order.total
    });

    // Generate PDF
    const pdfPath = await generateInvoicePDF(invoice, order);
    invoice.pdfPath = pdfPath;
    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice generated successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Invoices (Admin)
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer', 'name email')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Customer Invoices
exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ customer: req.user._id })
      .populate('order', 'orderNumber orderStatus')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Invoice
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('order', 'orderNumber paymentMethod paymentStatus');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && invoice.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update status to viewed
    if (invoice.status === 'Generated') {
      invoice.status = 'Viewed';
      await invoice.save();
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Download Invoice PDF
exports.downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && invoice.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!invoice.pdfPath) {
      return res.status(404).json({
        success: false,
        message: 'PDF not generated yet'
      });
    }

    res.download(invoice.pdfPath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};