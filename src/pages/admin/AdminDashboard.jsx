import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import {
  Hotel, Users, Bed, DollarSign, TrendingUp, Calendar,
  UserPlus, Building, Star, Activity, Settings, Bell
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/AdminLayout'

const StatCard = ({ title, value, change, icon: Icon, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-600 border-primary-200",
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  }

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
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl border-2 ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </motion.div>
  )
}

const ChartCard = ({ title, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </motion.div>
)

const AdminDashboard = () => {
  const { user } = useAuth()

  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  // Mock data - in real app, this would come from API
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalHotels: 150,
      totalRooms: 12000,
      totalReservations: 8500,
      totalRevenue: 1500000,
      occupancyRate: 75,
      averageRating: 4.8
    },
    revenueData: [
      { month: 'Jan', revenue: 120000, bookings: 580 },
      { month: 'Feb', revenue: 135000, bookings: 640 },
      { month: 'Mar', revenue: 145000, bookings: 720 },
      { month: 'Apr', revenue: 160000, bookings: 800 },
      { month: 'May', revenue: 175000, bookings: 850 },
      { month: 'Jun', revenue: 190000, bookings: 920 }
    ],
    occupancyData: [
      { name: 'Direct', value: 40, color: '#3B82F6' },
      { name: 'OTAs', value: 35, color: '#10B981' },
      { name: 'Corporate', value: 15, color: '#F59E0B' },
      { name: 'Other', value: 10, color: '#EF4444' }
    ],
    roomTypeData: [
      { type: 'Single', available: 2800, occupied: 2100 },
      { type: 'Double', available: 4200, occupied: 3150 },
      { type: 'Suite', available: 1800, occupied: 1350 },
      { type: 'Deluxe', available: 3200, occupied: 2400 }
    ],
    recentActivities: [
      { id: 1, type: 'booking', message: 'New booking for Grand Suite', time: '2 min ago', user: 'John Doe' },
      { id: 2, type: 'checkin', message: 'Guest checked in Room 205', time: '15 min ago', user: 'Jane Smith' },
      { id: 3, type: 'staff', message: 'New staff member added', time: '1 hour ago', user: 'Admin' },
      { id: 4, type: 'maintenance', message: 'Room 310 maintenance completed', time: '2 hours ago', user: 'Mike Wilson' }
    ]
  })

  const getRoleBasedGreeting = () => {
    switch (user?.role) {
      case 'super_admin':
        return 'Super Admin Dashboard'
      case 'admin':
        return 'Hotel Admin Dashboard'
      case 'manager':
        return 'Manager Dashboard'
      case 'owner':
        return 'Owner Dashboard'
      default:
        return 'Dashboard'
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getRoleBasedGreeting()}
              </h1>
              <p className="text-gray-600">
                Overview of system performance and key metrics
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Hotels"
            value="150"
            change="+12%"
            icon={Hotel}
            color="primary"
          />
          <StatCard
            title="Total Rooms"
            value="12,000"
            change="+8%"
            icon={Bed}
            color="green"
          />
          <StatCard
            title="Total Reservations"
            value="8,500"
            change="+15%"
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value="$1.5M"
            change="+18%"
            icon={DollarSign}
            color="orange"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Occupancy Rate"
            value="75%"
            change="+5%"
            icon={Activity}
            color="purple"
          />
          <StatCard
            title="Total Staff"
            value="5,000"
            change="+3%"
            icon={Users}
            color="green"
          />
          <StatCard
            title="Average Rating"
            value="4.8"
            change="+0.2"
            icon={Star}
            color="orange"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <ChartCard title="Revenue & Bookings Overview">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Bookings'
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Bookings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Booking Channels */}
          <ChartCard title="Booking Channels">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.occupancyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {dashboardData.occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Room Types Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ChartCard title="Room Occupancy by Type" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.roomTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="available" fill="#E5E7EB" name="Available" />
                <Bar dataKey="occupied" fill="#3B82F6" name="Occupied" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recent Activities */}
          <ChartCard title="Recent Activities">
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'checkin' ? 'bg-green-100 text-green-600' :
                    activity.type === 'staff' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'booking' && <Calendar className="w-4 h-4" />}
                    {activity.type === 'checkin' && <UserPlus className="w-4 h-4" />}
                    {activity.type === 'staff' && <Users className="w-4 h-4" />}
                    {activity.type === 'maintenance' && <Settings className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Quick Actions */}
        <ChartCard title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: Hotel, label: 'Add Hotel', color: 'bg-blue-500' },
              { icon: Bed, label: 'Add Room', color: 'bg-green-500' },
              { icon: Users, label: 'Add Staff', color: 'bg-purple-500' },
              { icon: Calendar, label: 'View Bookings', color: 'bg-orange-500' },
              { icon: DollarSign, label: 'Reports', color: 'bg-red-500' },
              { icon: Settings, label: 'Settings', color: 'bg-gray-500' }
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`p-3 rounded-xl text-white ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </ChartCard>
        </div>
    </AdminLayout>
  )
}

export default AdminDashboard