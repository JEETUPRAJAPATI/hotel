import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Bed,
  Users,
  ChefHat,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  PieChart,
  BarChart3
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', icon: 'text-blue-600' },
    green: { border: 'border-green-500', bg: 'bg-green-50', icon: 'text-green-600' },
    orange: { border: 'border-orange-500', bg: 'bg-orange-50', icon: 'text-orange-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', icon: 'text-purple-600' }
  };
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border-l-4 ${colors.border} p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p className="text-xs text-green-600 font-medium">
              {change}
            </p>
          )}
        </div>
        <div className={`p-2.5 lg:p-3 rounded-lg ${colors.bg} flex-shrink-0`}>
          <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalHotels: 3,
    totalRestaurants: 5,
    totalRooms: 156,
    occupancyRate: 78,
    todayOrders: 142,
    totalRevenue: 45230,
    monthlyRevenue: 1234567,
    activeReservations: 89
  });
  
  const [showCredentials, setShowCredentials] = useState(false);

  const [alerts] = useState([
    { id: 1, type: 'warning', message: 'Room 204 - Grand Hotel needs maintenance', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New reservation from MMT for 3 rooms', time: '4 hours ago' },
    { id: 3, type: 'error', message: 'Payment pending for Restaurant Villa order #1234', time: '6 hours ago' },
    { id: 4, type: 'success', message: '5 new check-ins completed at City Center Hotel', time: '8 hours ago' }
  ]);

  const [recentOrders] = useState([
    { id: 1, restaurant: 'Main Restaurant', amount: 1250, status: 'completed', time: '10 mins ago' },
    { id: 2, restaurant: 'Café Corner', amount: 450, status: 'pending', time: '15 mins ago' },
    { id: 3, restaurant: 'Rooftop Dining', amount: 2100, status: 'completed', time: '25 mins ago' },
    { id: 4, restaurant: 'Main Restaurant', amount: 875, status: 'preparing', time: '30 mins ago' }
  ]);

  const [hotelPerformance] = useState([
    { name: 'Grand Hotel', occupancy: 85, revenue: 15230, rooms: 60 },
    { name: 'City Center Hotel', occupancy: 72, revenue: 12450, rooms: 45 },
    { name: 'Seaside Resort', occupancy: 90, revenue: 17550, rooms: 51 }
  ]);

  const [restaurantPerformance] = useState([
    { name: 'Main Restaurant', orders: 45, revenue: 8500, status: 'excellent' },
    { name: 'Café Corner', orders: 32, revenue: 3200, status: 'good' },
    { name: 'Rooftop Dining', orders: 28, revenue: 12800, status: 'excellent' },
    { name: 'Pool Bar', orders: 18, revenue: 2100, status: 'average' },
    { name: 'Lobby Café', orders: 19, revenue: 1850, status: 'good' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-6">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="pt-6 mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Multi-Hotel & Restaurant Performance Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Hotels"
            value={stats.totalHotels}
            change="+1 this quarter from last quarter"
            icon={Building2}
            color="blue"
          />
          <StatCard
            title="Total Restaurants"
            value={stats.totalRestaurants}
            change="+2 this month from last month"
            icon={ChefHat}
            color="green"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            change="+5% from last month from last month"
            icon={Bed}
            color="orange"
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            change="+12% from yesterday from last month"
            icon={DollarSign}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hotel Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Hotel Performance</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-4">
              {hotelPerformance.map((hotel, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/30">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{hotel.name}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{hotel.rooms} rooms</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm lg:text-base">₹{hotel.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{hotel.occupancy}% occupied</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Restaurant Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Restaurant Performance</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <ChefHat className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-4">
              {restaurantPerformance.map((restaurant, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-green-50/30">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{restaurant.name}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{restaurant.orders} orders today</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm lg:text-base">₹{restaurant.revenue.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                        restaurant.status === 'excellent' ? 'bg-green-100 text-green-700' :
                        restaurant.status === 'good' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {restaurant.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts & Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                }`}>
                  <p className="text-sm font-medium text-gray-900 leading-snug">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Restaurant Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Restaurant Orders</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <ChefHat className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Restaurant</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 text-sm font-medium">{order.restaurant}</td>
                    <td className="py-3 px-4 font-semibold text-green-600 text-sm">₹{order.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-sm border border-blue-200 p-5 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Demo Credentials</h3>
            <button 
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showCredentials ? 'Hide' : 'Show'} Credentials
            </button>
          </div>
          {showCredentials && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-blue-600 mb-2">Admin</h4>
                <p><strong>Email:</strong> admin@hotel.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-green-600 mb-2">Manager</h4>
                <p><strong>Email:</strong> manager@hotel.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-purple-600 mb-2">Staff</h4>
                <p><strong>Email:</strong> staff@hotel.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-indigo-600 mb-2">Hotel Owner</h4>
                <p><strong>Email:</strong> owner@hotel.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <h4 className="font-semibold text-orange-600 mb-2">Restaurant Owner</h4>
                <p><strong>Email:</strong> restaurant@hotel.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Add Hotel</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
              <ChefHat className="h-5 w-5" />
              <span className="text-sm font-semibold">Add Restaurant</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
              <Users className="h-5 w-5" />
              <span className="text-sm font-semibold">Add Staff</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
              <PieChart className="h-5 w-5" />
              <span className="text-sm font-semibold">View Reports</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;