// const Notification = require('../models/Notification');

// // Get User Notifications
// exports.getMyNotifications = async (req, res) => {
//   try {
//     const { isRead } = req.query;
//     let query = { user: req.user._id };

//     if (isRead !== undefined) {
//       query.isRead = isRead === 'true';
//     }

//     const notifications = await Notification.find(query)
//       .populate('relatedProduct', 'name image')
//       .populate('relatedOrder', 'orderNumber')
//       .sort({ createdAt: -1 })
//       .limit(50);

//     const unreadCount = await Notification.countDocuments({
//       user: req.user._id,
//       isRead: false
//     });

//     res.json({
//       success: true,
//       count: notifications.length,
//       unreadCount,
//       data: notifications
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Mark as Read
// exports.markAsRead = async (req, res) => {
//   try {
//     const notification = await Notification.findById(req.params.id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     if (notification.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }

//     notification.isRead = true;
//     await notification.save();

//     res.json({
//       success: true,
//       message: 'Notification marked as read',
//       data: notification
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Mark All as Read
// exports.markAllAsRead = async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { user: req.user._id, isRead: false },
//       { isRead: true }
//     );

//     res.json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Delete Notification
// exports.deleteNotification = async (req, res) => {
//   try {
//     const notification = await Notification.findById(req.params.id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     if (notification.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }

//     await notification.deleteOne();

//     res.json({
//       success: true,
//       message: 'Notification deleted'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const Notification = require('../models/Notification');

// Get User Notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const { isRead } = req.query;
    let query = { user: req.user._id };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('relatedProduct', 'name image')
      .populate('relatedOrder', 'orderNumber')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark All as Read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};