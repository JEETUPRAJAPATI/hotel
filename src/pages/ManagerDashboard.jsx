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

const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-md p-6 border-l-4"
    style={{ borderColor: color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : color === "orange" ? "#F59E0B" : "#EF4444" }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color === "blue" ? "bg-blue-100" : color === "green" ? "bg-green-100" : color === "orange" ? "bg-orange-100" : "bg-red-100"}`}>
        <Icon className={`h-6 w-6 ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : color === "orange" ? "text-orange-600" : "text-red-600"}`} />
      </div>
    </div>
  </motion.div>
);

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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Multi-Hotel & Restaurant Performance Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <StatCard
            title="Total Hotels"
            value={stats.totalHotels}
            change="+1 this quarter"
            icon={Building2}
            color="blue"
          />
          <StatCard
            title="Total Restaurants"
            value={stats.totalRestaurants}
            change="+2 this month"
            icon={ChefHat}
            color="green"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            change="+5% from last month"
            icon={Bed}
            color="orange"
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            change="+12% from yesterday"
            icon={DollarSign}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Hotel Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Hotel Performance</h3>
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-3 lg:space-y-4">
              {hotelPerformance.map((hotel, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3 lg:pl-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm lg:text-base">{hotel.name}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">{hotel.rooms} rooms</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 text-sm lg:text-base">₹{hotel.revenue.toLocaleString()}</p>
                      <p className="text-xs lg:text-sm text-gray-600">{hotel.occupancy}% occupied</p>
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
            className="bg-white rounded-lg shadow-md p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Restaurant Performance</h3>
              <ChefHat className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-3 lg:space-y-4">
              {restaurantPerformance.map((restaurant, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-3 lg:pl-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm lg:text-base">{restaurant.name}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">{restaurant.orders} orders today</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 text-sm lg:text-base">₹{restaurant.revenue.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        restaurant.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        restaurant.status === 'good' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
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
            className="bg-white rounded-lg shadow-md p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                }`}>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-6 lg:mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Recent Restaurant Orders</h3>
            <ChefHat className="h-5 w-5 text-green-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-xs lg:text-sm">Restaurant</th>
                  <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-xs lg:text-sm">Amount</th>
                  <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-xs lg:text-sm">Status</th>
                  <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-gray-600 text-xs lg:text-sm hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-2 lg:py-3 px-2 lg:px-4 text-gray-900 text-xs lg:text-sm">{order.restaurant}</td>
                    <td className="py-2 lg:py-3 px-2 lg:px-4 font-semibold text-green-600 text-xs lg:text-sm">₹{order.amount}</td>
                    <td className="py-2 lg:py-3 px-2 lg:px-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 lg:py-3 px-2 lg:px-4 text-gray-600 text-xs lg:text-sm hidden sm:table-cell">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4 lg:p-6"
        >
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <button className="flex flex-col sm:flex-row items-center justify-center p-3 lg:p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition duration-200">
              <Building2 className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
              <span className="text-xs lg:text-sm font-medium">Add Hotel</span>
            </button>
            <button className="flex flex-col sm:flex-row items-center justify-center p-3 lg:p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition duration-200">
              <ChefHat className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
              <span className="text-xs lg:text-sm font-medium">Add Restaurant</span>
            </button>
            <button className="flex flex-col sm:flex-row items-center justify-center p-3 lg:p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition duration-200">
              <Users className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
              <span className="text-xs lg:text-sm font-medium">Add Staff</span>
            </button>
            <button className="flex flex-col sm:flex-row items-center justify-center p-3 lg:p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition duration-200">
              <PieChart className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
              <span className="text-xs lg:text-sm font-medium">View Reports</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;