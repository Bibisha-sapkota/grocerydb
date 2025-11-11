import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import Login from './components/common/Login';
import Register from './components/common/Register';
import Navbar from './components/common/Navbar';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import CustomerManagement from './components/admin/CustomerManagement';
import InvoiceManagement from './components/admin/InvoiceManagement';

// Customer Components
import ProductList from './components/customer/ProductList';
import Cart from './components/customer/Cart';
import MyOrders from './components/customer/MyOrders';
import MyInvoices from './components/customer/MyInvoices';
import Profile from './components/customer/Profile';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to={isAdmin ? "/admin/dashboard" : "/"} /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to={isAdmin ? "/admin/dashboard" : "/"} /> : <Register />
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute adminOnly><ProductManagement /></ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute adminOnly><OrderManagement /></ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute adminOnly><CustomerManagement /></ProtectedRoute>
        } />
        <Route path="/admin/invoices" element={
          <ProtectedRoute adminOnly><InvoiceManagement /></ProtectedRoute>
        } />

        {/* Customer Routes */}
        <Route path="/" element={
          <ProtectedRoute><ProductList /></ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute><Cart /></ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute><MyOrders /></ProtectedRoute>
        } />
        <Route path="/my-invoices" element={
          <ProtectedRoute><MyInvoices /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="*" element={
          <Navigate to={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/") : "/login"} />
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;