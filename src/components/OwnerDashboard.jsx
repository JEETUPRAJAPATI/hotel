import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  Users,
  Calendar,
  Settings,
  Star,
  MapPin,
  Phone,
  Mail,
  Wifi,
  Car,
  Coffee
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, Pie } from 'recharts'

const OwnerDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview')

  const hotelStats = [
    { title: 'Total Revenue', value: '$124,500', icon: DollarSign, change: '+15%', color: 'green' },
    { title: 'Occupancy Rate', value: '87%', icon: Building, change: '+5%', color: 'blue' },
    { title: 'Guest Rating', value: '4.8', icon: Star, change: '+0.2', color: 'yellow' },
    { title: 'Staff Count', value: '24', icon: Users, change: '+2', color: 'purple' },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 45000, bookings: 120 },
    { month: 'Feb', revenue: 52000, bookings: 135 },
    { month: 'Mar', revenue: 48000, bookings: 125 },
    { month: 'Apr', revenue: 61000, bookings: 155 },
    { month: 'May', revenue: 55000, bookings: 140 },
    { month: 'Jun', revenue: 67000, bookings: 170 },
  ]

  const roomTypeRevenue = [
    { name: 'Standard', value: 35000, percentage: 35, color: '#3B82F6' },
    { name: 'Deluxe', value: 28000, percentage: 28, color: '#10B981' },
    { name: 'Suite', value: 25000, percentage: 25, color: '#F59E0B' },
    { name: 'Presidential', value: 12000, percentage: 12, color: '#EF4444' },
  ]

  const hotelDetails = {
    name: 'Grand Paradise Hotel',
    address: '123 Ocean Drive, Miami Beach, FL 33139',
    phone: '+1 (305) 555-0123',
    email: 'info@grandparadise.com',
    rating: 4.8,
    totalRooms: 150,
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Beach Access'],
    description: 'Luxury beachfront hotel with stunning ocean views and world-class amenities.'
  }

  const recentBookings = [
    { id: 1, guest: 'John Smith', room: 'Deluxe Ocean View', checkin: '2024-01-15', checkout: '2024-01-18', amount: '$450' },
    { id: 2, guest: 'Sarah Johnson', room: 'Presidential Suite', checkin: '2024-01-16', checkout: '2024-01-20', amount: '$1200' },
    { id: 3, guest: 'Mike Chen', room: 'Standard Room', checkin: '2024-01-17', checkout: '2024-01-19', amount: '$280' },
    { id: 4, guest: 'Emily Davis', room: 'Suite', checkin: '2024-01-18', checkout: '2024-01-22', amount: '$680' },
  ]

  const getStatColor = (color) => {
    const colors = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
    }
    return colors[color]
  }

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Free WiFi': <Wifi className="w-4 h-4" />,
      'Parking': <Car className="w-4 h-4" />,
      'Restaurant': <Coffee className="w-4 h-4" />,
    }
    return icons[amenity] || <Star className="w-4 h-4" />
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'property', label: 'Property Details', icon: Building },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600">Property management and analytics</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotelStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getStatColor(stat.color)} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Room Type Revenue */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Room Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={roomTypeRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roomTypeRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4">
                  {roomTypeRevenue.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {booking.guest.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.guest}</p>
                          <p className="text-sm text-gray-500">{booking.room}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{booking.amount}</p>
                        <p className="text-sm text-gray-500">{booking.checkin} - {booking.checkout}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'property' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Hotel Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotelDetails.name}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-900">{hotelDetails.rating}</span>
                    <span className="text-gray-500">({hotelDetails.totalRooms} rooms)</span>
                  </div>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Edit Details
                </button>
              </div>

              <p className="text-gray-600 mb-6">{hotelDetails.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{hotelDetails.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{hotelDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{hotelDetails.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {hotelDetails.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Room Types & Pricing</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Manage Rooms
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roomTypeRevenue.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{room.name} Room</h4>
                    <p className="text-2xl font-bold text-gray-900 mb-1">${room.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Booking Management</h3>
                <div className="flex gap-3">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Export Data
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    New Booking
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#F59E0B" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {selectedTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* General Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Online Booking</p>
                    <p className="text-sm text-gray-500">Allow guests to book rooms online</p>
                  </div>
                  <button className="bg-yellow-600 rounded-full w-12 h-6 flex items-center">
                    <div className="bg-white w-5 h-5 rounded-full shadow-sm transform translate-x-6"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive booking notifications via email</p>
                  </div>
                  <button className="bg-yellow-600 rounded-full w-12 h-6 flex items-center">
                    <div className="bg-white w-5 h-5 rounded-full shadow-sm transform translate-x-6"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto Confirmation</p>
                    <p className="text-sm text-gray-500">Automatically confirm bookings</p>
                  </div>
                  <button className="bg-gray-200 rounded-full w-12 h-6 flex items-center">
                    <div className="bg-white w-5 h-5 rounded-full shadow-sm transform translate-x-0.5"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Policies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>24 hours before check-in</option>
                    <option>48 hours before check-in</option>
                    <option>72 hours before check-in</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                  <input type="time" defaultValue="15:00" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard