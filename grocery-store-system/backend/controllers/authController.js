// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d'
//   });
// };

// // Register User
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || 'customer'
//     });

//     if (user) {
//       res.status(201).json({
//         success: true,
//         message: 'User registered successfully',
//         data: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           token: generateToken(user._id)
//         }
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Login User
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Check if user is blocked
//     if (user.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         message: 'Your account has been blocked. Contact admin.'
//       });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Current User Profile
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Update Profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const { name, email, phone, address } = req.body;

//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = name || user.name;
//       user.email = email || user.email;
//       user.phone = phone || user.phone;
//       user.address = address || user.address;

//       if (req.file) {
//         user.photo = '/uploads/' + req.file.filename;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         success: true,
//         message: 'Profile updated successfully',
//         data: {
//           _id: updatedUser._id,
//           name: updatedUser.name,
//           email: updatedUser.email,
//           phone: updatedUser.phone,
//           address: updatedUser.address,
//           photo: updatedUser.photo,
//           role: updatedUser.role
//         }
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get All Customers (Admin Only)
// exports.getAllCustomers = async (req, res) => {
//   try {
//     const customers = await User.find({ role: 'customer' })
//       .select('-password')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: customers.length,
//       data: customers
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Block/Unblock User (Admin Only)
// exports.toggleBlockUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     user.isBlocked = !user.isBlocked;
//     await user.save();

//     res.json({
//       success: true,
//       message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Contact admin.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Current User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.address = address || user.address;

      if (req.file) {
        user.photo = '/uploads/' + req.file.filename;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          photo: updatedUser.photo,
          role: updatedUser.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Customers (Admin Only)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Block/Unblock User (Admin Only)
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};