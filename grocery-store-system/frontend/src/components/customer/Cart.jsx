import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: user?.address || '',
    paymentMethod: 'COD',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const tax = getCartTotal() * 0.13;
  const total = getCartTotal() + tax;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod,
        notes: checkoutData.notes
      };

      await orderAPI.create(orderData);
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/my-orders');
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product._id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image ? (
                    <img
                      src={`http://localhost:5000${item.product.image}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">{item.product.category}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {item.product.discount > 0 && (
                      <span className="text-gray-500 line-through text-sm">
                        ${item.product.price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-green-600">
                      ${item.product.finalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.quantity}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ${(item.product.finalPrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (13%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Address *
                    </label>
                    <textarea
                      value={checkoutData.shippingAddress}
                      onChange={(e) => setCheckoutData({...checkoutData, shippingAddress: e.target.value})}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={checkoutData.paymentMethod}
                      onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="COD">Cash on Delivery</option>
                      <option value="Online">Online Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={checkoutData.notes}
                      onChange={(e) => setCheckoutData({...checkoutData, notes: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Any special instructions?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
                  >
                    Back
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;