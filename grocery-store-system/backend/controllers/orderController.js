// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const Notification = require('../models/Notification');
// const User = require('../models/User');

// // Create Order (Customer)
// exports.createOrder = async (req, res) => {
//   try {
//     const { items, shippingAddress, paymentMethod, notes } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No items in order'
//       });
//     }

//     // Calculate totals and verify stock
//     let subtotal = 0;
//     const orderItems = [];

//     for (let item of items) {
//       const product = await Product.findById(item.product);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product ${item.product} not found`
//         });
//       }

//       if (product.quantity < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for ${product.name}`
//         });
//       }

//       if (product.status === 'Expired' || product.status === 'Out of Stock') {
//         return res.status(400).json({
//           success: false,
//           message: `${product.name} is not available`
//         });
//       }

//       const itemTotal = product.finalPrice * item.quantity;
//       subtotal += itemTotal;

//       orderItems.push({
//         product: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         price: product.price,
//         discount: product.discount,
//         finalPrice: product.finalPrice
//       });

//       // Reduce stock
//       product.quantity -= item.quantity;
//       await product.save();
//     }

//     const tax = subtotal * 0.13; // 13% tax
//     const total = subtotal + tax;

//     const order = await Order.create({
//       customer: req.user._id,
//       items: orderItems,
//       subtotal,
//       tax,
//       total,
//       shippingAddress,
//       paymentMethod,
//       notes
//     });

//     // Create notification for admin
//     const admins = await User.find({ role: 'admin' });
//     for (let admin of admins) {
//       await Notification.create({
//         user: admin._id,
//         type: 'Order',
//         title: 'New Order Received',
//         message: `Order ${order.orderNumber} placed by ${req.user.name}`,
//         relatedOrder: order._id,
//         priority: 'High'
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       data: order
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get All Orders (Admin)
// exports.getAllOrders = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let query = {};

//     if (status) {
//       query.orderStatus = status;
//     }

//     const orders = await Order.find(query)
//       .populate('customer', 'name email phone')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: orders.length,
//       data: orders
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Customer Orders
// exports.getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ customer: req.user._id })
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: orders.length,
//       data: orders
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Single Order
// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name email phone address')
//       .populate('items.product');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Check authorization
//     if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to view this order'
//       });
//     }

//     res.json({
//       success: true,
//       data: order
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Update Order Status (Admin)
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderStatus, paymentStatus } = req.body;

//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     if (orderStatus) {
//       order.orderStatus = orderStatus;
//     }

//     if (paymentStatus) {
//       order.paymentStatus = paymentStatus;
//     }

//     await order.save();

//     // Notify customer
//     await Notification.create({
//       user: order.customer,
//       type: 'Order',
//       title: 'Order Status Updated',
//       message: `Your order ${order.orderNumber} is now ${orderStatus}`,
//       relatedOrder: order._id,
//       priority: 'Medium'
//     });

//     res.json({
//       success: true,
//       message: 'Order updated successfully',
//       data: order
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Cancel Order
// exports.cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Check authorization
//     if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }

//     if (order.orderStatus === 'Completed' || order.orderStatus === 'Cancelled') {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot cancel this order'
//       });
//     }

//     // Restore stock
//     for (let item of order.items) {
//       const product = await Product.findById(item.product);
//       if (product) {
//         product.quantity += item.quantity;
//         await product.save();
//       }
//     }

//     order.orderStatus = 'Cancelled';
//     await order.save();

//     res.json({
//       success: true,
//       message: 'Order cancelled successfully',
//       data: order
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create Order (Customer)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Calculate totals and verify stock
    let subtotal = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      if (product.status === 'Expired' || product.status === 'Out of Stock') {
        return res.status(400).json({
          success: false,
          message: `${product.name} is not available`
        });
      }

      const itemTotal = product.finalPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        discount: product.discount,
        finalPrice: product.finalPrice
      });

      // Reduce stock
      product.quantity -= item.quantity;
      await product.save();
    }

    const tax = subtotal * 0.13; // 13% tax
    const total = subtotal + tax;

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      notes
    });

    // Create notification for admin
    const admins = await User.find({ role: 'admin' });
    for (let admin of admins) {
      await Notification.create({
        user: admin._id,
        type: 'Order',
        title: 'New Order Received',
        message: `Order ${order.orderNumber} placed by ${req.user.name}`,
        relatedOrder: order._id,
        priority: 'High'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Customer Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // Notify customer
    await Notification.create({
      user: order.customer,
      type: 'Order',
      title: 'Order Status Updated',
      message: `Your order ${order.orderNumber} is now ${orderStatus}`,
      relatedOrder: order._id,
      priority: 'Medium'
    });

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (order.orderStatus === 'Completed' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order'
      });
    }

    // Restore stock
    for (let item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};