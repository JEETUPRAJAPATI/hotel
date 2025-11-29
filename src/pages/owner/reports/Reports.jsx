import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Home,
  Utensils,
  CreditCard,
  FileText,
  Clock,
  Star,
  Eye,
  RefreshCw,
  Building,
  PieChart,
  Activity
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OwnerReports = () => {
  const [activeTab, setActiveTab] = useState('room-sales');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedHotel, setSelectedHotel] = useState('all');

  const mockData = {
    totalRevenue: 2845670,
    totalBookings: 1247,
    occupancyRate: 78.5,
    adr: 4250,
    revpar: 3336,
    posRevenue: 856340,
    totalGuests: 2891,
    repeatGuests: 423
  };
  
  const tabs = [
    { id: 'room-sales', label: 'Room Sales', icon: Home },
    { id: 'restaurant-sales', label: 'Restaurant Sales', icon: Utensils },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'audit', label: 'Audit', icon: FileText }
  ];

  const hotels = [
    { id: 'all', name: 'All Hotels' },
    { id: 'hotel1', name: 'Grand Plaza Hotel' },
    { id: 'hotel2', name: 'Ocean View Resort' },
    { id: 'hotel3', name: 'City Center Inn' }
  ];

  const handleApplyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Reports updated successfully');
    }, 1000);
  };

  const handleResetFilters = () => {
    setDateRange({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    });
    setSelectedHotel('all');
    toast.success('Filters reset');
  };

  const exportReport = (format) => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
    // Implement export logic here
  };

  // Room Sales Report Component
  const RoomSalesReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{mockData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Room Nights Sold</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.totalBookings}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8.2% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Home className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.occupancyRate}%</p>
              <p className="text-sm text-red-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 rotate-180" />
                -2.1% from last month
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <PieChart className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ADR (Avg Daily Rate)</p>
              <p className="text-2xl font-bold text-gray-900">₹{mockData.adr}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5.8% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => exportReport('pdf')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );

  // Restaurant Sales Report Component
  const RestaurantSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">F&B Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{mockData.posRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +15.3% from last month
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Utensils className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,847</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +22.1% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹463</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +7.2% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">4.7/5</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Excellent rating
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => exportReport('pdf')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );

  // Reservations Report Component
  const ReservationsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">2,341</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18.4% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed Bookings</p>
              <p className="text-2xl font-bold text-gray-900">2,089</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                89.2% confirmation rate
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancellations</p>
              <p className="text-2xl font-bold text-gray-900">252</p>
              <p className="text-sm text-red-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 rotate-180" />
                10.8% cancellation rate
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">No-Shows</p>
              <p className="text-2xl font-bold text-gray-900">43</p>
              <p className="text-sm text-yellow-600 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                2.1% no-show rate
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => exportReport('pdf')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );

  // Finance Report Component
  const FinanceReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{mockData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +14.2% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Operating Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹1,24,570</p>
              <p className="text-sm text-red-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 rotate-180" />
                +3.4% from last month
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">34.7%</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +2.1% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tax Collections</p>
              <p className="text-2xl font-bold text-gray-900">₹45,320</p>
              <p className="text-sm text-yellow-600 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Monthly GST
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => exportReport('pdf')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );

  // Guest Report Component
  const GuestReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.totalGuests.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +16.8% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Repeat Guests</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.repeatGuests}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Star className="w-3 h-3" />
                14.6% loyalty rate
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Stay</p>
              <p className="text-2xl font-bold text-gray-900">2.4 days</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                +0.3 days vs last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Guest Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">4.6/5</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Excellent rating
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => exportReport('pdf')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );

  // Audit Report Component
  const AuditReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Activities</p>
              <p className="text-2xl font-bold text-gray-900">15,247</p>
              <p className="text-sm text-blue-600 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                All operations logged
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Logins</p>
              <p className="text-2xl font-bold text-gray-900">1,847</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Active sessions
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Changes</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
              <p className="text-sm text-yellow-600 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Modifications tracked
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Events</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-red-600 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Alerts generated
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Eye className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => exportReport('pdf')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'room-sales': return <RoomSalesReport />;
      case 'restaurant-sales': return <RestaurantSalesReport />;
      case 'reservations': return <ReservationsReport />;
      case 'finance': return <FinanceReport />;
      case 'guests': return <GuestReport />;
      case 'audit': return <AuditReport />;
      default: return <RoomSalesReport />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="text-gray-600">View analytics and performance across hotels & restaurants</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <LoadingSpinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
            Refresh Data
          </button>
        </div>
      </div>

      {/* Filter Bar - Sticky */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {/* Date Range */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Hotel Selector */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Hotel</label>
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerReports;