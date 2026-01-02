import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Building,
  Utensils,
  Calendar,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  Download,
  Filter,
  Search,
  Eye,
  X,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: 'last-30-days',
    hotel: 'all',
    restaurant: 'all',
    role: 'all',
    status: 'all'
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: TrendingUp },
    { id: 'hotels', label: 'Hotel Reports', icon: Building },
    { id: 'restaurants', label: 'Restaurant Reports', icon: Utensils },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'users', label: 'Users & Staff', icon: Users },
    { id: 'audit', label: 'Audit & Activity', icon: Activity }
  ];

  // Mock Data
  const mockOverviewData = {
    totalHotels: 45,
    totalRestaurants: 67,
    totalReservations: 2543,
    totalRevenue: 156890000,
    activeUsers: 342,
    trends: {
      hotels: 12.5,
      restaurants: 8.3,
      reservations: 15.7,
      revenue: 22.4,
      users: 5.2
    }
  };

  const mockHotelReports = [
    { id: 1, hotelName: 'Grand Plaza Hotel', ownerName: 'Rajesh Kumar', totalRooms: 120, reservations: 450, roomRevenue: 5600000, restaurantRevenue: 1200000, totalRevenue: 6800000, status: 'Active' },
    { id: 2, hotelName: 'Ocean View Resort', ownerName: 'Priya Sharma', totalRooms: 85, reservations: 320, roomRevenue: 4200000, restaurantRevenue: 980000, totalRevenue: 5180000, status: 'Active' },
    { id: 3, hotelName: 'Mountain Peak Inn', ownerName: 'Amit Patel', totalRooms: 65, reservations: 280, roomRevenue: 3500000, restaurantRevenue: 750000, totalRevenue: 4250000, status: 'Active' },
    { id: 4, hotelName: 'City Center Hotel', ownerName: 'Neha Gupta', totalRooms: 95, reservations: 390, roomRevenue: 4800000, restaurantRevenue: 1100000, totalRevenue: 5900000, status: 'Active' },
    { id: 5, hotelName: 'Lakeside Paradise', ownerName: 'Vikram Singh', totalRooms: 75, reservations: 310, roomRevenue: 3900000, restaurantRevenue: 850000, totalRevenue: 4750000, status: 'Inactive' }
  ];

  const mockRestaurantReports = [
    { id: 1, restaurantName: 'Spice Garden', hotelName: 'Grand Plaza Hotel', ordersCount: 1250, foodRevenue: 980000, taxCollected: 176400, netRevenue: 1156400 },
    { id: 2, restaurantName: 'Ocean Breeze Cafe', hotelName: 'Ocean View Resort', ordersCount: 890, foodRevenue: 750000, taxCollected: 135000, netRevenue: 885000 },
    { id: 3, restaurantName: 'Mountain View Bistro', hotelName: 'Mountain Peak Inn', ordersCount: 720, foodRevenue: 620000, taxCollected: 111600, netRevenue: 731600 },
    { id: 4, restaurantName: 'Urban Kitchen', hotelName: 'City Center Hotel', ordersCount: 1120, foodRevenue: 890000, taxCollected: 160200, netRevenue: 1050200 },
    { id: 5, restaurantName: 'Lakeview Diner', hotelName: 'Lakeside Paradise', ordersCount: 680, foodRevenue: 580000, taxCollected: 104400, netRevenue: 684400 }
  ];

  const mockReservationReports = [
    { id: 1, hotelName: 'Grand Plaza Hotel', booked: 120, checkedIn: 95, checkedOut: 80, cancelled: 15, occupancy: 79.2, adr: 4500, revpar: 3564 },
    { id: 2, hotelName: 'Ocean View Resort', booked: 85, checkedIn: 70, checkedOut: 65, cancelled: 10, occupancy: 82.4, adr: 5200, revpar: 4285 },
    { id: 3, hotelName: 'Mountain Peak Inn', booked: 65, checkedIn: 55, checkedOut: 50, cancelled: 8, occupancy: 84.6, adr: 3800, revpar: 3215 },
    { id: 4, hotelName: 'City Center Hotel', booked: 95, checkedIn: 80, checkedOut: 75, cancelled: 12, occupancy: 84.2, adr: 4800, revpar: 4042 },
    { id: 5, hotelName: 'Lakeside Paradise', booked: 75, checkedIn: 60, checkedOut: 58, cancelled: 9, occupancy: 80.0, adr: 4200, revpar: 3360 }
  ];

  const mockFinanceReports = [
    { id: 1, date: '2026-01-15', entity: 'Grand Plaza Hotel', type: 'Room', invoiceNo: 'INV-2026-001', paymentMethod: 'Card', amount: 85000, status: 'Paid' },
    { id: 2, date: '2026-01-14', entity: 'Spice Garden', type: 'POS', invoiceNo: 'INV-2026-002', paymentMethod: 'Cash', amount: 12500, status: 'Paid' },
    { id: 3, date: '2026-01-14', entity: 'Ocean View Resort', type: 'Room', invoiceNo: 'INV-2026-003', paymentMethod: 'UPI', amount: 95000, status: 'Pending' },
    { id: 4, date: '2026-01-13', entity: 'Urban Kitchen', type: 'POS', invoiceNo: 'INV-2026-004', paymentMethod: 'Card', amount: 18500, status: 'Paid' },
    { id: 5, date: '2026-01-13', entity: 'City Center Hotel', type: 'Room', invoiceNo: 'INV-2026-005', paymentMethod: 'Card', amount: 72000, status: 'Paid' }
  ];

  const mockUserReports = [
    { id: 1, userName: 'Rajesh Kumar', role: 'Owner', assignedHotel: 'Grand Plaza Hotel', assignedRestaurant: '-', lastLogin: '2026-01-01 09:30', status: 'Active' },
    { id: 2, userName: 'Amit Verma', role: 'Manager', assignedHotel: 'Ocean View Resort', assignedRestaurant: '-', lastLogin: '2026-01-01 08:15', status: 'Active' },
    { id: 3, userName: 'Priya Sharma', role: 'Staff', assignedHotel: 'Grand Plaza Hotel', assignedRestaurant: 'Spice Garden', lastLogin: '2025-12-30 14:20', status: 'Active' },
    { id: 4, userName: 'Vikram Singh', role: 'Owner', assignedHotel: 'Mountain Peak Inn', assignedRestaurant: '-', lastLogin: '2025-12-28 16:45', status: 'Inactive' },
    { id: 5, userName: 'Neha Gupta', role: 'Manager', assignedHotel: 'City Center Hotel', assignedRestaurant: '-', lastLogin: '2026-01-01 07:00', status: 'Active' }
  ];

  const mockAuditReports = [
    { id: 1, date: '2026-01-01 10:25', user: 'Admin User', action: 'Login', module: 'System', description: 'Successful login from 192.168.1.1' },
    { id: 2, date: '2026-01-01 10:30', user: 'Amit Verma', action: 'Update', module: 'Reservations', description: 'Changed reservation #1234 status to Checked-In' },
    { id: 3, date: '2026-01-01 10:35', user: 'Rajesh Kumar', action: 'Create', module: 'Hotels', description: 'Added new room category "Executive Suite"' },
    { id: 4, date: '2026-01-01 10:40', user: 'Priya Sharma', action: 'Delete', module: 'Menu', description: 'Removed item "Old Burger" from menu' },
    { id: 5, date: '2026-01-01 10:45', user: 'Admin User', action: 'Export', module: 'Reports', description: 'Exported Hotel-Wise Report as PDF' }
  ];

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle Export
  const handleExport = (reportName, format) => {
    toast.loading(`Generating ${format} export...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${reportName} exported as ${format} successfully!`);
    }, 1500);
  };

  // Handle View Details
  const handleViewDetails = (item) => {
    setSelectedDetail(item);
    setShowDetailModal(true);
  };

  // Apply Filters
  const handleApplyFilters = () => {
    toast.success('Filters applied successfully');
    setShowFilterBar(false);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedFilters({
      dateRange: 'last-30-days',
      hotel: 'all',
      restaurant: 'all',
      role: 'all',
      status: 'all'
    });
    toast.success('Filters reset');
  };

  // Render Platform Overview
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Building className="h-8 w-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+{mockOverviewData.trends.hotels}%</span>
          </div>
          <h3 className="text-2xl font-bold">{mockOverviewData.totalHotels}</h3>
          <p className="text-sm opacity-90">Total Hotels</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Utensils className="h-8 w-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+{mockOverviewData.trends.restaurants}%</span>
          </div>
          <h3 className="text-2xl font-bold">{mockOverviewData.totalRestaurants}</h3>
          <p className="text-sm opacity-90">Total Restaurants</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+{mockOverviewData.trends.reservations}%</span>
          </div>
          <h3 className="text-2xl font-bold">{mockOverviewData.totalReservations.toLocaleString()}</h3>
          <p className="text-sm opacity-90">Total Reservations</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+{mockOverviewData.trends.revenue}%</span>
          </div>
          <h3 className="text-2xl font-bold">{formatCurrency(mockOverviewData.totalRevenue).slice(0, -3)}</h3>
          <p className="text-sm opacity-90">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded">+{mockOverviewData.trends.users}%</span>
          </div>
          <h3 className="text-2xl font-bold">{mockOverviewData.activeUsers}</h3>
          <p className="text-sm opacity-90">Active Users</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Room Revenue</span>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(98500000)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Restaurant Revenue</span>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(58390000)}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Owners</span>
              <span className="text-sm font-semibold text-gray-900">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Managers</span>
              <span className="text-sm font-semibold text-gray-900">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Staff</span>
              <span className="text-sm font-semibold text-gray-900">208</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Hotel Reports
  const renderHotels = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{mockHotelReports.length} hotels found</p>
        <button
          onClick={() => handleExport('Hotel-Wise Report', 'Excel')}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hotel Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Rooms</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Reservations</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Room Revenue</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Restaurant Revenue</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Revenue</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockHotelReports.map((hotel) => (
              <tr key={hotel.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{hotel.hotelName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{hotel.ownerName}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{hotel.totalRooms}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{hotel.reservations}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(hotel.roomRevenue)}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(hotel.restaurantRevenue)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(hotel.totalRevenue)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${hotel.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {hotel.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleViewDetails(hotel)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Restaurant Reports
  const renderRestaurants = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{mockRestaurantReports.length} restaurants found</p>
        <button
          onClick={() => handleExport('Restaurant-Wise Report', 'Excel')}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Restaurant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hotel</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Orders</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Food Revenue</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Tax Collected</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Net Revenue</th>
            </tr>
          </thead>
          <tbody>
            {mockRestaurantReports.map((restaurant) => (
              <tr key={restaurant.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{restaurant.restaurantName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{restaurant.hotelName}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{restaurant.ordersCount}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(restaurant.foodRevenue)}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(restaurant.taxCollected)}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(restaurant.netRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Reservation Reports
  const renderReservations = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{mockReservationReports.length} hotels analyzed</p>
        <button
          onClick={() => handleExport('Reservation Report', 'PDF')}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hotel</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Booked</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Checked-In</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Checked-Out</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Cancelled</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Occupancy %</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">ADR</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">RevPAR</th>
            </tr>
          </thead>
          <tbody>
            {mockReservationReports.map((report) => (
              <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{report.hotelName}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900">{report.booked}</td>
                <td className="px-4 py-3 text-sm text-center text-blue-600">{report.checkedIn}</td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{report.checkedOut}</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{report.cancelled}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    {report.occupancy}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(report.adr)}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(report.revpar)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Finance Reports
  const renderFinance = () => (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Collections</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(145600000)}</h3>
          <p className="text-xs text-green-600 mt-1">+18.5% from last month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
          <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(5240000)}</h3>
          <p className="text-xs text-gray-500 mt-1">8 invoices pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Refunds Processed</p>
          <h3 className="text-2xl font-bold text-red-600">{formatCurrency(1850000)}</h3>
          <p className="text-xs text-gray-500 mt-1">23 refund requests</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tax Summary</p>
          <h3 className="text-2xl font-bold text-purple-600">{formatCurrency(26208000)}</h3>
          <p className="text-xs text-gray-500 mt-1">GST + Service Tax</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Ledger</h3>
          <button
            onClick={() => handleExport('Finance Ledger', 'Excel')}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Entity</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice No</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Payment Method</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockFinanceReports.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.entity}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${transaction.type === 'Room' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction.invoiceNo}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{transaction.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(transaction.amount)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${transaction.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render User Reports
  const renderUsers = () => (
    <div className="space-y-6">
      {/* User Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Owners</p>
          <h3 className="text-2xl font-bold text-gray-900">45</h3>
          <p className="text-xs text-green-600 mt-1">3 new this month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Managers</p>
          <h3 className="text-2xl font-bold text-gray-900">89</h3>
          <p className="text-xs text-green-600 mt-1">7 new this month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Staff</p>
          <h3 className="text-2xl font-bold text-gray-900">208</h3>
          <p className="text-xs text-green-600 mt-1">12 new this month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <h3 className="text-2xl font-bold text-green-600">342</h3>
          <p className="text-xs text-gray-500 mt-1">91.2% activity rate</p>
        </div>
      </div>

      {/* User Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">User & Staff Details</h3>
          <button
            onClick={() => handleExport('User Report', 'CSV')}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Users
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User Name</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned Hotel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Restaurant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUserReports.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.userName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Owner' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.assignedHotel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.assignedRestaurant}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Audit Reports
  const renderAudit = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Logs</h3>
          <p className="text-sm text-gray-600">Track all system activities and admin actions</p>
        </div>
        <button
          onClick={() => handleExport('Audit Log', 'PDF')}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Module</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditReports.map((log) => (
              <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{log.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.user}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    log.action === 'Login' ? 'bg-blue-100 text-blue-700' :
                    log.action === 'Update' ? 'bg-yellow-100 text-yellow-700' :
                    log.action === 'Create' ? 'bg-green-100 text-green-700' :
                    log.action === 'Delete' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-700">{log.module}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'hotels': return renderHotels();
      case 'restaurants': return renderRestaurants();
      case 'reservations': return renderReservations();
      case 'finance': return renderFinance();
      case 'users': return renderUsers();
      case 'audit': return renderAudit();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 lg:gap-3 mb-1">
              <FileText className="h-6 w-6 lg:h-7 lg:w-7 text-primary-600 flex-shrink-0" />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Platform Reports</h1>
            </div>
            <p className="text-xs lg:text-sm text-gray-600">
              Comprehensive analytics for all hotels, restaurants, and platform activities
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                showFilterBar ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilterBar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={selectedFilters.dateRange}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-90-days">Last 90 Days</option>
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hotel</label>
                <select
                  value={selectedFilters.hotel}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, hotel: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Hotels</option>
                  <option value="grand-plaza">Grand Plaza Hotel</option>
                  <option value="ocean-view">Ocean View Resort</option>
                  <option value="mountain-peak">Mountain Peak Inn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Restaurant</label>
                <select
                  value={selectedFilters.restaurant}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, restaurant: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Restaurants</option>
                  <option value="spice-garden">Spice Garden</option>
                  <option value="ocean-breeze">Ocean Breeze Cafe</option>
                  <option value="mountain-view">Mountain View Bistro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={selectedFilters.role}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedFilters.status}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content - Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
        {/* Left Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          {/* Mobile Tabs */}
          <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Report Categories
              </h3>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Content */}
            <div className="p-4 lg:p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Hotel Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hotel Name</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDetail.hotelName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Owner Name</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDetail.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDetail.totalRooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reservations</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDetail.reservations}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Room Revenue</p>
                  <p className="text-base font-semibold text-green-600">{formatCurrency(selectedDetail.roomRevenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Restaurant Revenue</p>
                  <p className="text-base font-semibold text-orange-600">{formatCurrency(selectedDetail.restaurantRevenue)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(selectedDetail.totalRevenue)}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('Hotel Detail Report', 'PDF')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reports;
