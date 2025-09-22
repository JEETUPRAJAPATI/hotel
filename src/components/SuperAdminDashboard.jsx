import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Building, 
  Crown, 
  Shield, 
  Activity, 
  TrendingUp,
  Settings,
  Database,
  AlertTriangle,
  BarChart3,
  PieChart,
  DollarSign
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts'
import AdminSidebar from './AdminSidebar'

const SuperAdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview')

  const statsData = [
    { title: 'Total Hotels', value: '147', icon: Building, change: '+12%', color: 'blue' },
    { title: 'Total Users', value: '2,847', icon: Users, change: '+18%', color: 'green' },
    { title: 'Revenue', value: '$847K', icon: DollarSign, change: '+23%', color: 'purple' },
    { title: 'System Health', value: '99.9%', icon: Activity, change: '+0.1%', color: 'emerald' },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 45000, hotels: 120 },
    { month: 'Feb', revenue: 52000, hotels: 125 },
    { month: 'Mar', revenue: 48000, hotels: 130 },
    { month: 'Apr', revenue: 61000, hotels: 135 },
    { month: 'May', revenue: 55000, hotels: 140 },
    { month: 'Jun', revenue: 67000, hotels: 147 },
  ]

  const userDistribution = [
    { name: 'Guests', value: 1847, color: '#3B82F6' },
    { name: 'Staff', value: 542, color: '#10B981' },
    { name: 'Managers', value: 234, color: '#F59E0B' },
    { name: 'Admins', value: 156, color: '#EF4444' },
    { name: 'Owners', value: 68, color: '#8B5CF6' },
  ]

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Server CPU usage high (85%)', time: '2 min ago' },
    { id: 2, type: 'info', message: 'Database backup completed', time: '1 hour ago' },
    { id: 3, type: 'success', message: 'New hotel "Sunset Resort" approved', time: '3 hours ago' },
    { id: 4, type: 'error', message: 'Payment gateway timeout reported', time: '5 hours ago' },
  ]

  const getStatColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      emerald: 'from-emerald-500 to-emerald-600',
    }
    return colors[color]
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️'
      case 'error': return '🔴'
      case 'success': return '✅'
      default: return 'ℹ️'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* We can create a SuperAdminSidebar later, for now use AdminSidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">Complete system control and monitoring</p>
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
                        ? 'border-purple-500 text-purple-600'
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
              {statsData.map((stat, index) => {
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
                    <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Distribution */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4">
                  {userDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8B5CF6" />
                <Bar dataKey="hotels" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {selectedTab === 'system' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Maintenance Mode</span>
                  <button className="bg-gray-200 rounded-full w-12 h-6 flex items-center">
                    <div className="bg-white w-5 h-5 rounded-full shadow-sm transform translate-x-0.5"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Auto Backup</span>
                  <button className="bg-purple-600 rounded-full w-12 h-6 flex items-center">
                    <div className="bg-white w-5 h-5 rounded-full shadow-sm transform translate-x-6"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Connection</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Last Backup</span>
                  <span className="text-gray-600">2 hours ago</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">SSL Certificate</h4>
                <p className="text-sm text-green-600">Valid</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Data Encryption</h4>
                <p className="text-sm text-blue-600">Active</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Threat Level</h4>
                <p className="text-sm text-orange-600">Low</p>
              </div>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard