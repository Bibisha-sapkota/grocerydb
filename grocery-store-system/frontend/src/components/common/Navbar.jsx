import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ShoppingCart, Bell, User, LogOut, Package, FileText, LayoutDashboard, Users, Menu, X } from 'lucide-react';
import { notificationAPI } from '../../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getAll({ isRead: false });
      setNotifications(response.data.data.slice(0, 5));
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">GroceryStore</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-green-600 flex items-center space-x-1">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/admin/products" className="text-gray-700 hover:text-green-600 flex items-center space-x-1">
                  <Package className="w-5 h-5" />
                  <span>Products</span>
                </Link>
                <Link to="/admin/orders" className="text-gray-700 hover:text-green-600 flex items-center space-x-1">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                <Link to="/admin/customers" className="text-gray-700 hover:text-green-600 flex items-center space-x-1">
                  <Users className="w-5 h-5" />
                  <span>Customers</span>
                </Link>
                <Link to="/admin/invoices" className="text-gray-700 hover:text-green-600 flex items-center space-x-1">
                  <FileText className="w-5 h-5" />
                  <span>Invoices</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">
                  Products
                </Link>
                <Link to="/my-orders" className="text-gray-700 hover:text-green-600 font-medium">
                  My Orders
                </Link>
                <Link to="/my-invoices" className="text-gray-700 hover:text-green-600 font-medium">
                  Invoices
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
                  <ShoppingCart className="w-6 h-6" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            )}

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-700 hover:text-green-600"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-3 text-gray-500 text-sm">No new notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => markAsRead(notif._id)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      >
                        <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
              >
                <User className="w-6 h-6" />
                <span className="font-medium">{user?.name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAdmin ? (
              <div className="space-y-2">
                <Link to="/admin/dashboard" className="block py-2 text-gray-700 hover:text-green-600">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="block py-2 text-gray-700 hover:text-green-600">
                  Products
                </Link>
                <Link to="/admin/orders" className="block py-2 text-gray-700 hover:text-green-600">
                  Orders
                </Link>
                <Link to="/admin/customers" className="block py-2 text-gray-700 hover:text-green-600">
                  Customers
                </Link>
                <Link to="/admin/invoices" className="block py-2 text-gray-700 hover:text-green-600">
                  Invoices
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/" className="block py-2 text-gray-700 hover:text-green-600">
                  Products
                </Link>
                <Link to="/my-orders" className="block py-2 text-gray-700 hover:text-green-600">
                  My Orders
                </Link>
                <Link to="/my-invoices" className="block py-2 text-gray-700 hover:text-green-600">
                  Invoices
                </Link>
                <Link to="/cart" className="block py-2 text-gray-700 hover:text-green-600">
                  Cart ({getCartCount()})
                </Link>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link to="/profile" className="block py-2 text-gray-700 hover:text-green-600">
                Profile
              </Link>
              <button onClick={handleLogout} className="w-full text-left py-2 text-red-600">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;