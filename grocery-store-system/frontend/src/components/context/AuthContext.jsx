import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../../services/api';

// Create context
const AuthContext = createContext();

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Load user profile if token exists
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch user profile
  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data);
    } catch (err) {
      console.error('Error loading user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: authToken, ...userData } = response.data.data;

      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      const { token: authToken, ...userData } = response.data.data;

      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
