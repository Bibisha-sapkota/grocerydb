// const Product = require('../models/Product');
// const Notification = require('../models/Notification');

// // Get All Products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const { category, search, status } = req.query;
//     let query = {};

//     if (category) {
//       query.category = category;
//     }

//     if (search) {
//       query.name = { $regex: search, $options: 'i' };
//     }

//     if (status) {
//       query.status = status;
//     }

//     const products = await Product.find(query).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: products.length,
//       data: products
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Single Product
// exports.getProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Create Product (Admin Only)
// exports.createProduct = async (req, res) => {
//   try {
//     const productData = {
//       ...req.body,
//       image: req.file ? '/uploads/' + req.file.filename : ''
//     };

//     const product = await Product.create(productData);

//     res.status(201).json({
//       success: true,
//       message: 'Product created successfully',
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Update Product (Admin Only)
// exports.updateProduct = async (req, res) => {
//   try {
//     let product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     const updateData = { ...req.body };
    
//     if (req.file) {
//       updateData.image = '/uploads/' + req.file.filename;
//     }

//     product = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.json({
//       success: true,
//       message: 'Product updated successfully',
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Delete Product (Admin Only)
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     await product.deleteOne();

//     res.json({
//       success: true,
//       message: 'Product deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Low Stock Products (Admin Only)
// exports.getLowStockProducts = async (req, res) => {
//   try {
//     const products = await Product.find({
//       $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
//     });

//     res.json({
//       success: true,
//       count: products.length,
//       data: products
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // Get Expiring Products (Admin Only)
// exports.getExpiringProducts = async (req, res) => {
//   try {
//     const sevenDaysFromNow = new Date();
//     sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

//     const products = await Product.find({
//       expiryDate: {
//         $gte: new Date(),
//         $lte: sevenDaysFromNow
//       },
//       status: { $ne: 'Expired' }
//     });

//     res.json({
//       success: true,
//       count: products.length,
//       data: products
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const Product = require('../models/Product');
const Notification = require('../models/Notification');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create Product (Admin Only)
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file ? '/uploads/' + req.file.filename : ''
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Low Stock Products (Admin Only)
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Expiring Products (Admin Only)
exports.getExpiringProducts = async (req, res) => {
  try {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const products = await Product.find({
      expiryDate: {
        $gte: new Date(),
        $lte: sevenDaysFromNow
      },
      status: { $ne: 'Expired' }
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};