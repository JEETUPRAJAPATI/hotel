import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Building2,
  ChefHat,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedReport, setSelectedReport] = useState('all');
  const [reportData, setReportData] = useState({
    revenue: {
      total: 2456789,
      change: '+12.5%',
      chartData: [
        { month: 'Jan', value: 185000 },
        { month: 'Feb', value: 195000 },
        { month: 'Mar', value: 210000 },
        { month: 'Apr', value: 225000 },
        { month: 'May', value: 240000 },
        { month: 'Jun', value: 265000 }
      ]
    },
    occupancy: {
      current: 78.5,
      average: 75.2,
      peak: 95.0,
      chartData: [
        { day: 'Mon', rate: 85 },
        { day: 'Tue', rate: 72 },
        { day: 'Wed', rate: 68 },
        { day: 'Thu', rate: 75 },
        { day: 'Fri', rate: 89 },
        { day: 'Sat', rate: 95 },
        { day: 'Sun', rate: 82 }
      ]
    },
    bookings: {
      total: 1247,
      confirmed: 1156,
      pending: 67,
      cancelled: 24
    }
  });

  const reportTypes = [
    { id: 'all', name: 'All Reports', icon: FileText },
    { id: 'revenue', name: 'Revenue Reports', icon: DollarSign },
    { id: 'occupancy', name: 'Occupancy Reports', icon: Building2 },
    { id: 'guest', name: 'Guest Reports', icon: Users },
    { id: 'restaurant', name: 'Restaurant Reports', icon: ChefHat }
  ];

  const quickReports = [
    {
      id: 'daily_summary',
      title: 'Daily Operations Summary',
      description: 'Overview of today\'s activities',
      status: 'ready',
      lastGenerated: '2 hours ago',
      icon: Calendar
    },
    {
      id: 'revenue_analysis',
      title: 'Revenue Analysis',
      description: 'Detailed financial breakdown',
      status: 'generating',
      lastGenerated: '1 day ago',
      icon: DollarSign
    },
    {
      id: 'occupancy_trends',
      title: 'Occupancy Trends',
      description: 'Room booking patterns',
      status: 'ready',
      lastGenerated: '3 hours ago',
      icon: TrendingUp
    },
    {
      id: 'guest_satisfaction',
      title: 'Guest Satisfaction',
      description: 'Customer feedback analysis',
      status: 'ready',
      lastGenerated: '5 hours ago',
      icon: Users
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'generating': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return CheckCircle;
      case 'generating': return Clock;
      case 'error': return AlertTriangle;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and view comprehensive business reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{reportData.revenue.total.toLocaleString()}</p>
              <p className="text-xs text-green-600">{reportData.revenue.change} from last month</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.occupancy.current}%</p>
              <p className="text-xs text-green-600">+3.2% from last week</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.bookings.total}</p>
              <p className="text-xs text-green-600">+8.1% from last month</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Guest Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">4.8/5.0</p>
              <p className="text-xs text-green-600">+0.3 from last month</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center">
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <button className="text-blue-600 hover:text-blue-700">
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between bg-gray-50 rounded-lg p-4">
            {reportData.revenue.chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 rounded-t-md mb-2 w-8"
                  style={{ height: `${(item.value / 300000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Occupancy Rates</h3>
            <button className="text-green-600 hover:text-green-700">
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between bg-gray-50 rounded-lg p-4">
            {reportData.occupancy.chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-green-500 rounded-t-md mb-2 w-8"
                  style={{ height: `${(item.rate / 100) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Reports</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickReports.map((report) => {
            const Icon = report.icon;
            const StatusIcon = getStatusIcon(report.status);
            
            return (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    {report.status}
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">{report.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                <p className="text-xs text-gray-500 mb-3">Last generated: {report.lastGenerated}</p>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Booking Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Status Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-green-600">
                {Math.round((reportData.bookings.confirmed / reportData.bookings.total) * 100)}%
              </span>
            </div>
            <h4 className="font-medium text-gray-900">Confirmed</h4>
            <p className="text-sm text-gray-600">{reportData.bookings.confirmed} bookings</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-yellow-600">
                {Math.round((reportData.bookings.pending / reportData.bookings.total) * 100)}%
              </span>
            </div>
            <h4 className="font-medium text-gray-900">Pending</h4>
            <p className="text-sm text-gray-600">{reportData.bookings.pending} bookings</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-red-600">
                {Math.round((reportData.bookings.cancelled / reportData.bookings.total) * 100)}%
              </span>
            </div>
            <h4 className="font-medium text-gray-900">Cancelled</h4>
            <p className="text-sm text-gray-600">{reportData.bookings.cancelled} bookings</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;