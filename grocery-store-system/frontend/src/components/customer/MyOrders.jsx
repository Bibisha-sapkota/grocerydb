import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { orderAPI } from '../../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancel(orderId);
        loadOrders();
        alert('Order cancelled successfully!');
      } catch (error) {
        alert('Error cancelling order: ' + (error.response?.data?.message || 'Something went wrong'));
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Processing': return <Package className="w-5 h-5 text-blue-600" />;
      case 'Completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await orderAPI.getOne(orderId);
      setSelectedOrder(response.data.data);
      setShowDetails(true);
    } catch (error) {
      alert('Error loading order details');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.orderStatus)}
                    <div>
                      <h3 className="font-semibold text-gray-800">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                    <span className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <button
                      onClick={() => viewOrderDetails(order._id)}
                      className="text-green-600 hover:text-green-700 flex items-center space-x-1"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="font-semibold text-gray-800">{order.items.length} products</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-gray-800 text-lg">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {order.orderStatus === 'Pending' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-3xl w-full my-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-semibold text-gray-800">{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full inline-block ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-800">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                    <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              ${(item.finalPrice * item.quantity).toFixed(2)}
                            </p>
                            {item.discount > 0 && (
                              <p className="text-xs text-green-600">{item.discount}% off</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (13%)</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span className="text-green-600">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Order Notes</h3>
                      <p className="text-gray-600">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;