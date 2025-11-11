import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Tag } from 'lucide-react';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const { addToCart } = useCart();

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
      const availableProducts = response.data.data.filter(
        p => p.status !== 'Expired' && p.status !== 'Out of Stock'
      );
      setProducts(availableProducts);
      setFilteredProducts(availableProducts);
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

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Browse Products</h1>
          <p className="text-gray-600 mt-1">Find your favorite groceries</p>
        </div>

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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span className="font-bold">{product.discount}% OFF</span>
                    </div>
                  )}

                  {product.status === 'Expiring' && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Expiring Soon
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 font-medium">{product.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  )}

                  <div className="flex items-center space-x-2 mb-3">
                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through text-sm">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-green-600">
                      ${product.finalPrice?.toFixed(2)}
                    </span>
                  </div>

                  {product.quantity < 20 && (
                    <p className="text-sm text-orange-600 mb-2">
                      Only {product.quantity} left in stock!
                    </p>
                  )}

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;