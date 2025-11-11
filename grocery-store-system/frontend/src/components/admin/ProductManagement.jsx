import React, { useState, useEffect } from 'react'; 
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { productAPI } from '../../services/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    category: 'Fruits',
    brand: '',
    price: '',
    discount: 0,
    quantity: '',
    expiryDate: '',
    description: '',
    lowStockThreshold: 10
  });
  const [imageFile, setImageFile] = useState(null);

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Bakery', 'Frozen', 'Personal Care', 'Household', 'Others'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, filterCategory, products]);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      Object.keys(currentProduct).forEach(key => {
        formData.append(key, currentProduct[key]);
      });
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editMode) {
        await productAPI.update(currentProduct._id, formData);
      } else {
        await productAPI.create(formData);
      }

      loadProducts();
      closeModal();
      alert(`Product ${editMode ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      ...product,
      expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        loadProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentProduct({
      name: '',
      category: 'Fruits',
      brand: '',
      price: '',
      discount: 0,
      quantity: '',
      expiryDate: '',
      description: '',
      lowStockThreshold: 10
    });
    setImageFile(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expiring': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header & Add Button */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your inventory</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gray-200 relative">
                  {product.image ? (
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category} • {product.brand}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through">${product.price}</span>
                    )}
                    <span className="text-2xl font-bold text-green-600">
                      ${product.finalPrice?.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-600">Stock: <span className="font-semibold">{product.quantity}</span></span>
                    <span className="text-gray-600">
                      Expires: {new Date(product.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-1 transition"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center space-x-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full my-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editMode ? 'Edit Product' : 'Add New Product'}
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Form fields here... (same as original) */}
                  {/* Submit & Cancel buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                      {editMode ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
