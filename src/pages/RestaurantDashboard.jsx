import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingCart, Clock, Users, TrendingUp, AlertCircle,
  Coffee, UtensilsCrossed, Package, CalendarDays, Eye, Plus
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-red-50 text-red-600 border-red-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-2 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change} from yesterday
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl border-2 ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </motion.div>
  );
};

const OrderCard = ({ order, onViewOrder }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'prepared': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
          <p className="text-sm text-gray-600">{order.customer_name}</p>
          <p className="text-sm text-gray-500">{order.order_type}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold text-green-600">${order.total_amount}</span>
        <button
          onClick={() => onViewOrder(order)}
          className="text-blue-600 hover:text-blue-800 p-1 rounded"
          title="View Order"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className={`p-3 rounded-xl text-white ${color} w-fit mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
};

const RestaurantDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayStats: {
      revenue: 1250.75,
      orders: 45,
      pendingOrders: 8,
      averageOrderValue: 27.80
    },
    recentOrders: [
      { id: 'ORD001', customer_name: 'Alice Cooper', order_type: 'dine_in', status: 'pending', total_amount: 45.50 },
      { id: 'ORD002', customer_name: 'Bob Smith', order_type: 'takeaway', status: 'in_progress', total_amount: 23.75 },
      { id: 'ORD003', customer_name: 'Carol Johnson', order_type: 'delivery', status: 'prepared', total_amount: 67.25 },
      { id: 'ORD004', customer_name: 'David Brown', order_type: 'dine_in', status: 'completed', total_amount: 89.00 }
    ],
    popularItems: [
      { name: 'Margherita Pizza', orders: 12, revenue: 179.88 },
      { name: 'Chicken Wings', orders: 8, revenue: 119.92 },
      { name: 'Caesar Salad', orders: 6, revenue: 77.94 }
    ],
    lowStockAlerts: [
      { item: 'Mozzarella Cheese', current: 2, minimum: 5 },
      { item: 'Chicken Breast', current: 3, minimum: 10 }
    ]
  });

  const quickActions = [
    {
      title: 'Add Menu Item',
      description: 'Create new dishes for your menu',
      icon: Plus,
      color: 'bg-blue-600',
      onClick: () => window.location.href = '/restaurant/menu'
    },
    {
      title: 'View Orders',
      description: 'Check all pending and active orders',
      icon: ShoppingCart,
      color: 'bg-green-600',
      onClick: () => window.location.href = '/restaurant/orders'
    },
    {
      title: 'Kitchen Display',
      description: 'Monitor KOT and kitchen status',
      icon: UtensilsCrossed,
      color: 'bg-orange-600',
      onClick: () => window.location.href = '/restaurant/kot'
    },
    {
      title: 'Generate Bill',
      description: 'Create bills and process payments',
      icon: DollarSign,
      color: 'bg-purple-600',
      onClick: () => window.location.href = '/restaurant/pos'
    }
  ];

  const handleViewOrder = (order) => {
    console.log('Viewing order:', order);
    // Will implement order view modal later
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening in your restaurant today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Revenue"
            value={`$${dashboardData.todayStats.revenue.toFixed(2)}`}
            change="+12.5%"
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={dashboardData.todayStats.orders}
            change="+8.2%"
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="Pending Orders"
            value={dashboardData.todayStats.pendingOrders}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Avg Order Value"
            value={`$${dashboardData.todayStats.averageOrderValue.toFixed(2)}`}
            change="+5.1%"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button 
                onClick={() => window.location.href = '/restaurant/orders'}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} onViewOrder={handleViewOrder} />
              ))}
            </div>
          </div>

          {/* Popular Items & Alerts */}
          <div className="space-y-6">
            {/* Popular Items */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items Today</h3>
              <div className="space-y-3">
                {dashboardData.popularItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.orders} orders</p>
                    </div>
                    <p className="font-semibold text-green-600">${item.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alerts */}
            {dashboardData.lowStockAlerts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
                </div>
                <div className="space-y-3">
                  {dashboardData.lowStockAlerts.map((alert, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-red-900">{alert.item}</p>
                        <p className="text-sm text-red-700">Current: {alert.current} | Minimum: {alert.minimum}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Reorder
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};export default RestaurantDashboard;