import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Package, Users, ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { productAPI, orderAPI, authAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    expiringCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [products, customers, orders, lowStock, expiring] = await Promise.all([
        productAPI.getAll(),
        authAPI.getAllCustomers(),
        orderAPI.getAll(),
        productAPI.getLowStock(),
        productAPI.getExpiring()
      ]);

      const revenue = orders.data.data
        .filter(order => order.orderStatus === 'Completed')
        .reduce((sum, order) => sum + order.total, 0);

      setStats({
        totalProducts: products.data.count,
        totalCustomers: customers.data.count,
        totalOrders: orders.data.count,
        totalRevenue: revenue,
        lowStockCount: lowStock.data.count,
        expiringCount: expiring.data.count
      });

      setRecentOrders(orders.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 }
  ];

  const categoryData = [
    { name: 'Fruits', value: 30 },
    { name: 'Vegetables', value: 25 },
    { name: 'Dairy', value: 20 },
    { name: 'Beverages', value: 15 },
    { name: 'Others', value: 10 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Updated StatCard to remove ESLint warning
  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {trend && (
            <p className="text-green-600 text-sm mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-full`}>
          {icon && React.createElement(icon, { className: 'w-8 h-8 text-white' })}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your store overview.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="bg-blue-500"
            trend="+12% from last month"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            color="bg-green-500"
            trend="+8% from last month"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="bg-purple-500"
            trend="+15% from last month"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="bg-yellow-500"
            trend="+23% from last month"
          />
        </div>

        {/* Alerts */}
        {(stats.lowStockCount > 0 || stats.expiringCount > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.lowStockCount > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
                  <div>
                    <p className="font-semibold text-orange-800">Low Stock Alert</p>
                    <p className="text-sm text-orange-700">{stats.lowStockCount} products are running low</p>
                  </div>
                </div>
              </div>
            )}
            {stats.expiringCount > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                  <div>
                    <p className="font-semibold text-red-800">Expiry Alert</p>
                    <p className="text-sm text-red-700">{stats.expiringCount} products expiring soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Products by Category */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.customer?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
