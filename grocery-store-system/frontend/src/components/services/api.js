import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllCustomers: () => api.get('/auth/customers'),
  toggleBlockUser: (id) => api.put(`/auth/users/${id}/block`)
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/admin/low-stock'),
  getExpiring: () => api.get('/products/admin/expiring')
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id) => api.put(`/orders/${id}/cancel`)
};

// Invoice APIs
export const invoiceAPI = {
  generate: (orderId) => api.post(`/invoices/generate/${orderId}`),
  getAll: () => api.get('/invoices'),
  getMyInvoices: () => api.get('/invoices/my-invoices'),
  getOne: (id) => api.get(`/invoices/${id}`),
  download: (id) => api.get(`/invoices/${id}/download`, { responseType: 'blob' })
};

// Notification APIs
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export default api;
