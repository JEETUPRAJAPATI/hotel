import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Building, Utensils, TrendingUp, TrendingDown,
  Download, Eye, FileText, Calendar, Filter, CreditCard,
  Receipt, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const mockHotelRevenue = [
  { id: 1, name: 'Grand Plaza Hotel', owner: 'John Doe', totalRooms: 120, roomRevenue: 4500000, occupancy: 78, totalRevenue: 5200000, status: 'Active' },
  { id: 2, name: 'Luxury Resort & Spa', owner: 'Jane Smith', totalRooms: 200, roomRevenue: 8900000, occupancy: 85, totalRevenue: 10500000, status: 'Active' },
  { id: 3, name: 'Business Inn', owner: 'Mike Johnson', totalRooms: 80, roomRevenue: 2100000, occupancy: 65, totalRevenue: 2800000, status: 'Active' },
  { id: 4, name: 'Seaside Paradise', owner: 'Sarah Williams', totalRooms: 150, roomRevenue: 6700000, occupancy: 92, totalRevenue: 7900000, status: 'Active' },
];

const mockRestaurantRevenue = [
  { id: 1, name: 'Grand Dining', hotel: 'Grand Plaza Hotel', ordersCount: 1250, foodRevenue: 850000, taxCollected: 153000, netAmount: 697000 },
  { id: 2, name: 'Spa Cuisine', hotel: 'Luxury Resort & Spa', ordersCount: 2100, foodRevenue: 1800000, taxCollected: 324000, netAmount: 1476000 },
  { id: 3, name: 'Quick Bites', hotel: 'Business Inn', ordersCount: 680, foodRevenue: 320000, taxCollected: 57600, netAmount: 262400 },
  { id: 4, name: 'Seafood Delight', hotel: 'Seaside Paradise', ordersCount: 1890, foodRevenue: 1450000, taxCollected: 261000, netAmount: 1189000 },
];

const mockTransactions = [
  { id: 'TXN001', date: '2026-01-01', entity: 'Grand Plaza Hotel', type: 'Room', invoiceNo: 'INV-2026-001', paymentMethod: 'Credit Card', amount: 45000, status: 'Paid' },
  { id: 'TXN002', date: '2026-01-01', entity: 'Spa Cuisine', type: 'POS', invoiceNo: 'INV-2026-002', paymentMethod: 'UPI', amount: 12500, status: 'Paid' },
  { id: 'TXN003', date: '2025-12-31', entity: 'Seaside Paradise', type: 'Room', invoiceNo: 'INV-2025-998', paymentMethod: 'Cash', amount: 78000, status: 'Paid' },
  { id: 'TXN004', date: '2025-12-31', entity: 'Business Inn', type: 'Add-on', invoiceNo: 'INV-2025-999', paymentMethod: 'Debit Card', amount: 5600, status: 'Pending' },
  { id: 'TXN005', date: '2025-12-30', entity: 'Quick Bites', type: 'POS', invoiceNo: 'INV-2025-997', paymentMethod: 'Credit Card', amount: 8900, status: 'Failed' },
];

const mockRefunds = [
  { id: 'REF001', date: '2026-01-01', entity: 'Grand Plaza Hotel', type: 'Reservation', amount: 25000, reason: 'Customer cancellation', status: 'Approved' },
  { id: 'REF002', date: '2025-12-30', entity: 'Spa Cuisine', type: 'Order', amount: 3500, reason: 'Order quality issue', status: 'Pending' },
  { id: 'REF003', date: '2025-12-29', entity: 'Seaside Paradise', type: 'Reservation', amount: 45000, reason: 'Medical emergency', status: 'Approved' },
];

const Finance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [selectedHotel, setSelectedHotel] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [transactionStatus, setTransactionStatus] = useState('all');
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [selectedEntityData, setSelectedEntityData] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Finance Dashboard', icon: BarChart3 },
    { id: 'hotels', label: 'Hotel Revenue', icon: Building },
    { id: 'restaurants', label: 'Restaurant Revenue', icon: Utensils },
    { id: 'transactions', label: 'Transactions Ledger', icon: Receipt },
    { id: 'tax', label: 'Tax & GST Summary', icon: FileText },
    { id: 'payout', label: 'Payout & Settlement', icon: Wallet },
    { id: 'refunds', label: 'Refunds & Adjustments', icon: CreditCard },
    { id: 'reports', label: 'Reports & Export', icon: Download },
  ];

  const handleExport = (type, format) => {
    // Simulate download with progress
    toast.loading(`Preparing ${format} file...`, { duration: 1000 });
    setTimeout(() => {
      toast.success(`${type} exported successfully as ${format}!`);
      // In production, this would trigger actual file download
      const filename = `${type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      console.log(`Downloading: ${filename}`);
    }, 1000);
  };

  const handleViewBreakdown = (entity, type = 'hotel') => {
    if (type === 'hotel') {
      const hotelData = mockHotelRevenue.find(h => h.name === entity || h.id === entity);
      if (hotelData) {
        setSelectedEntityData({
          ...hotelData,
          type: 'hotel',
          breakdown: {
            roomRevenue: hotelData.roomRevenue,
            restaurantRevenue: hotelData.totalRevenue - hotelData.roomRevenue,
            additionalServices: 350000,
            totalRevenue: hotelData.totalRevenue
          },
          monthlyData: [
            { month: 'Sep', revenue: 4100000 },
            { month: 'Oct', revenue: 4800000 },
            { month: 'Nov', revenue: 5000000 },
            { month: 'Dec', revenue: hotelData.totalRevenue }
          ]
        });
      }
    } else if (type === 'restaurant') {
      const restaurantData = mockRestaurantRevenue.find(r => r.name === entity || r.id === entity);
      if (restaurantData) {
        setSelectedEntityData({
          ...restaurantData,
          type: 'restaurant',
          breakdown: {
            foodRevenue: restaurantData.foodRevenue,
            beverageRevenue: restaurantData.foodRevenue * 0.3,
            taxCollected: restaurantData.taxCollected,
            netAmount: restaurantData.netAmount
          },
          monthlyData: [
            { month: 'Sep', revenue: restaurantData.foodRevenue * 0.75 },
            { month: 'Oct', revenue: restaurantData.foodRevenue * 0.85 },
            { month: 'Nov', revenue: restaurantData.foodRevenue * 0.95 },
            { month: 'Dec', revenue: restaurantData.foodRevenue }
          ]
        });
      }
    }
    setShowBreakdownModal(true);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  };

  const handleMarkAsSettled = (entity) => {
    toast.success(`Settlement marked for ${entity} - Payment will be processed within 24 hours`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              12.5%
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Platform Revenue</p>
          <p className="text-2xl font-bold">₹26.4 Cr</p>
          <p className="text-xs opacity-75 mt-2">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Building className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              8.2%
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Hotel Revenue</p>
          <p className="text-2xl font-bold">₹22.1 Cr</p>
          <p className="text-xs opacity-75 mt-2">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              15.7%
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Restaurant Revenue</p>
          <p className="text-2xl font-bold">₹4.3 Cr</p>
          <p className="text-xs opacity-75 mt-2">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              3.1%
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Pending Payments</p>
          <p className="text-2xl font-bold">₹1.2 Cr</p>
          <p className="text-xs opacity-75 mt-2">To be collected</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">Refund Amount</p>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹73,500</p>
          <p className="text-xs text-red-600 mt-2 flex items-center">
            <ArrowDownRight className="w-3 h-3 mr-1" />
            5 refunds this month
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">GST Collected</p>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹4.75 Cr</p>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            18% of total revenue
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">Service Charge</p>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹2.64 Cr</p>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            10% of revenue
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockTransactions.slice(0, 5).map((txn) => (
            <div key={txn.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  txn.status === 'Paid' ? 'bg-green-100' :
                  txn.status === 'Pending' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Receipt className={`w-4 h-4 ${
                    txn.status === 'Paid' ? 'text-green-600' :
                    txn.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{txn.entity}</p>
                  <p className="text-xs text-gray-500">{txn.invoiceNo} • {txn.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(txn.amount)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  txn.status === 'Paid' ? 'bg-green-100 text-green-700' :
                  txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Hotel Revenue
  const renderHotels = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hotel Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Rooms</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Room Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Occupancy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockHotelRevenue.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{hotel.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{hotel.owner}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{hotel.totalRooms}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(hotel.roomRevenue)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${hotel.occupancy}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{hotel.occupancy}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(hotel.totalRevenue)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {hotel.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewBreakdown(hotel.id, 'hotel')}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Breakdown"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExport(`${hotel.name} Report`, 'PDF')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Export Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {formatCurrency(mockHotelRevenue.reduce((sum, h) => sum + h.roomRevenue, 0))}
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {formatCurrency(mockHotelRevenue.reduce((sum, h) => sum + h.totalRevenue, 0))}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Restaurant Revenue
  const renderRestaurants = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Restaurant Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hotel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Orders Count</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Food Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tax Collected</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Net Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockRestaurantRevenue.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{restaurant.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{restaurant.hotel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{restaurant.ordersCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(restaurant.foodRevenue)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(restaurant.taxCollected)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(restaurant.netAmount)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewBreakdown(restaurant.id, 'restaurant')}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Ledger"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExport(`${restaurant.name} Report`, 'Excel')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Export"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan="2" className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {mockRestaurantRevenue.reduce((sum, r) => sum + r.ordersCount, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {formatCurrency(mockRestaurantRevenue.reduce((sum, r) => sum + r.foodRevenue, 0))}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {formatCurrency(mockRestaurantRevenue.reduce((sum, r) => sum + r.taxCollected, 0))}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {formatCurrency(mockRestaurantRevenue.reduce((sum, r) => sum + r.netAmount, 0))}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Transactions
  const renderTransactions = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>

          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Hotels</option>
            {mockHotelRevenue.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Restaurants</option>
            {mockRestaurantRevenue.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="room">Room</option>
            <option value="pos">POS</option>
            <option value="addon">Add-on</option>
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>

          <select
            value={transactionStatus}
            onChange={(e) => setTransactionStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Invoice No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{txn.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{txn.entity}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      txn.type === 'Room' ? 'bg-blue-100 text-blue-700' :
                      txn.type === 'POS' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{txn.invoiceNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{txn.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(txn.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      txn.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleViewTransaction(txn)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
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
    </div>
  );

  // Render Tax Summary
  const renderTax = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-2">GST Collected (Hotels)</p>
          <p className="text-2xl font-bold text-gray-900">₹3.97 Cr</p>
          <p className="text-xs text-green-600 mt-1">18% GST</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-2">GST Collected (Restaurants)</p>
          <p className="text-2xl font-bold text-gray-900">₹77.4 L</p>
          <p className="text-xs text-green-600 mt-1">18% GST</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-2">Service Charge</p>
          <p className="text-2xl font-bold text-gray-900">₹2.64 Cr</p>
          <p className="text-xs text-blue-600 mt-1">10% of revenue</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-2">Total Tax Collected</p>
          <p className="text-2xl font-bold text-gray-900">₹4.75 Cr</p>
          <p className="text-xs text-gray-600 mt-1">This month</p>
        </div>
      </div>

      {/* Tax Breakdown Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Tax Slab Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tax Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Base Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tax Collected</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">GST - Hotels</td>
                <td className="px-4 py-3 text-sm text-gray-600">18%</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹22.1 Cr</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹3.97 Cr</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">₹26.07 Cr</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">GST - Restaurants</td>
                <td className="px-4 py-3 text-sm text-gray-600">18%</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹4.3 Cr</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹77.4 L</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">₹5.07 Cr</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Service Charge</td>
                <td className="px-4 py-3 text-sm text-gray-600">10%</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹26.4 Cr</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹2.64 Cr</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">₹29.04 Cr</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Payout
  const renderPayout = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Hotel Owner Payables</p>
          <p className="text-2xl font-bold text-blue-600">₹18.5 Cr</p>
          <p className="text-xs text-gray-600 mt-1">4 hotels pending</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Restaurant Owner Payables</p>
          <p className="text-2xl font-bold text-orange-600">₹3.6 Cr</p>
          <p className="text-xs text-gray-600 mt-1">4 restaurants pending</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Commission Earned</p>
          <p className="text-2xl font-bold text-green-600">₹4.3 Cr</p>
          <p className="text-xs text-gray-600 mt-1">Platform revenue</p>
        </div>
      </div>

      {/* Hotel Payouts */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Hotel Owner Settlements</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockHotelRevenue.map((hotel) => {
            const commission = hotel.totalRevenue * 0.15;
            const netPayable = hotel.totalRevenue - commission;
            return (
              <div key={hotel.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{hotel.name}</p>
                    <p className="text-sm text-gray-600">Owner: {hotel.owner}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-gray-600">Revenue: <span className="font-medium">{formatCurrency(hotel.totalRevenue)}</span></span>
                      <span className="text-red-600">Commission (15%): <span className="font-medium">{formatCurrency(commission)}</span></span>
                      <span className="text-green-600">Net Payable: <span className="font-medium">{formatCurrency(netPayable)}</span></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkAsSettled(hotel.name)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Mark as Settled
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restaurant Payouts */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Restaurant Owner Settlements</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockRestaurantRevenue.map((restaurant) => {
            const commission = restaurant.netAmount * 0.10;
            const netPayable = restaurant.netAmount - commission;
            return (
              <div key={restaurant.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{restaurant.name}</p>
                    <p className="text-sm text-gray-600">Hotel: {restaurant.hotel}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-gray-600">Net Amount: <span className="font-medium">{formatCurrency(restaurant.netAmount)}</span></span>
                      <span className="text-red-600">Commission (10%): <span className="font-medium">{formatCurrency(commission)}</span></span>
                      <span className="text-green-600">Net Payable: <span className="font-medium">{formatCurrency(netPayable)}</span></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkAsSettled(restaurant.name)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Mark as Settled
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render Refunds
  const renderRefunds = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{refund.entity}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                      {refund.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">{formatCurrency(refund.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      refund.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {refund.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedTransaction(refund);
                        setShowTransactionDetail(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-sm font-bold text-gray-900">Total Refunds</td>
                <td className="px-4 py-3 text-sm font-bold text-red-600">
                  {formatCurrency(mockRefunds.reduce((sum, r) => sum + r.amount, 0))}
                </td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Reports
  const renderReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Finance Summary Report</h3>
              <p className="text-sm text-gray-600">Complete platform financial overview</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('Finance Summary', 'CSV')}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('Finance Summary', 'Excel')}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport('Finance Summary', 'PDF')}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Building className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hotel-wise Revenue Report</h3>
              <p className="text-sm text-gray-600">Detailed hotel revenue breakdown</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('Hotel Revenue', 'CSV')}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('Hotel Revenue', 'Excel')}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport('Hotel Revenue', 'PDF')}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Utensils className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Restaurant-wise Revenue Report</h3>
              <p className="text-sm text-gray-600">Complete restaurant financial data</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('Restaurant Revenue', 'CSV')}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('Restaurant Revenue', 'Excel')}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport('Restaurant Revenue', 'PDF')}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Receipt className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Transaction Ledger Report</h3>
              <p className="text-sm text-gray-600">Complete transaction history</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('Transaction Ledger', 'CSV')}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('Transaction Ledger', 'Excel')}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export Excel
            </button>
            <button
              onClick={() => handleExport('Transaction Ledger', 'PDF')}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'hotels':
        return renderHotels();
      case 'restaurants':
        return renderRestaurants();
      case 'transactions':
        return renderTransactions();
      case 'tax':
        return renderTax();
      case 'payout':
        return renderPayout();
      case 'refunds':
        return renderRefunds();
      case 'reports':
        return renderReports();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 lg:gap-3 mb-1">
              <DollarSign className="h-6 w-6 lg:h-7 lg:w-7 text-primary-600 flex-shrink-0" />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Finance Management</h1>
            </div>
            <p className="text-xs lg:text-sm text-gray-600">
              Complete financial overview of all hotels, restaurants, and transactions
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleExport('Complete Finance Report', 'PDF')}
              className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export All</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content - Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
        {/* Left Sidebar Navigation - Hidden on mobile, shown as tabs */}
        <div className="lg:w-64 flex-shrink-0">
          {/* Mobile Tabs - Horizontal Scroll */}
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
                Finance Menu
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
            {/* Section Header - Hidden on mobile (already shown in tabs) */}
            <div className="hidden lg:block border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
              {tabs.map((tab) => {
                if (tab.id === activeTab) {
                  const Icon = tab.icon;
                  return (
                    <div key={tab.id} className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{tab.label}</h2>
                        <p className="text-sm text-gray-500">
                          {tab.id === 'dashboard' && 'Financial overview and key metrics'}
                          {tab.id === 'hotels' && 'Hotel revenue breakdown and performance'}
                          {tab.id === 'restaurants' && 'Restaurant revenue and order statistics'}
                          {tab.id === 'transactions' && 'Complete transaction history and ledger'}
                          {tab.id === 'tax' && 'GST and tax collection summary'}
                          {tab.id === 'payout' && 'Owner payables and commission details'}
                          {tab.id === 'refunds' && 'Refund requests and adjustments'}
                          {tab.id === 'reports' && 'Export financial reports in various formats'}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

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

      {/* Breakdown Modal */}
      {showBreakdownModal && selectedEntityData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {selectedEntityData.type === 'hotel' ? (
                      <Building className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Utensils className="w-5 h-5 text-orange-600" />
                    )}
                    {selectedEntityData.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedEntityData.type === 'hotel' 
                      ? `Owner: ${selectedEntityData.owner}`
                      : `Hotel: ${selectedEntityData.hotel}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowBreakdownModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedEntityData.type === 'hotel' ? (
                  <>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Room Revenue</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(selectedEntityData.breakdown.roomRevenue)}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Restaurant Revenue</p>
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(selectedEntityData.breakdown.restaurantRevenue)}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Additional Services</p>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(selectedEntityData.breakdown.additionalServices)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedEntityData.breakdown.totalRevenue)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Food Revenue</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedEntityData.breakdown.foodRevenue)}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Beverage Revenue</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(selectedEntityData.breakdown.beverageRevenue)}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Tax Collected</p>
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(selectedEntityData.breakdown.taxCollected)}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Net Amount</p>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(selectedEntityData.breakdown.netAmount)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Key Metrics */}
              {selectedEntityData.type === 'hotel' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Rooms</p>
                      <p className="text-xl font-bold text-gray-900">{selectedEntityData.totalRooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Occupancy Rate</p>
                      <p className="text-xl font-bold text-green-600">{selectedEntityData.occupancy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                        {selectedEntityData.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedEntityData.type === 'restaurant' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-xl font-bold text-gray-900">{selectedEntityData.ordersCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Math.round(selectedEntityData.foodRevenue / selectedEntityData.ordersCount))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tax Rate</p>
                      <p className="text-xl font-bold text-orange-600">18%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Monthly Trend */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h4>
                <div className="space-y-3">
                  {selectedEntityData.monthlyData.map((month, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-12">{month.month}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full flex items-center justify-end px-2"
                          style={{
                            width: `${(month.revenue / selectedEntityData.monthlyData[selectedEntityData.monthlyData.length - 1].revenue) * 100}%`
                          }}
                        >
                          <span className="text-xs font-semibold text-white">
                            {formatCurrency(month.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleString('en-IN')}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport(`${selectedEntityData.name} Detailed Report`, 'PDF')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExport(`${selectedEntityData.name} Detailed Report`, 'Excel')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </button>
                <button
                  onClick={() => setShowBreakdownModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {showTransactionDetail && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    Transaction Details
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTransaction.invoiceNo || selectedTransaction.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowTransactionDetail(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    selectedTransaction.status === 'Paid' || selectedTransaction.status === 'Completed' || selectedTransaction.status === 'Approved'
                      ? 'bg-green-100 text-green-700' :
                    selectedTransaction.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                    {selectedTransaction.status}
                  </span>
                </div>

                {/* Transaction Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTransaction.date}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  <div className="p-3 flex justify-between">
                    <span className="text-sm text-gray-600">Entity</span>
                    <span className="text-sm font-medium text-gray-900">{selectedTransaction.entity}</span>
                  </div>
                  {selectedTransaction.type && (
                    <div className="p-3 flex justify-between">
                      <span className="text-sm text-gray-600">Type</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.type}</span>
                    </div>
                  )}
                  {selectedTransaction.paymentMethod && (
                    <div className="p-3 flex justify-between">
                      <span className="text-sm text-gray-600">Payment Method</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.paymentMethod}</span>
                    </div>
                  )}
                  {selectedTransaction.reason && (
                    <div className="p-3">
                      <span className="text-sm text-gray-600 block mb-1">Reason</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.reason}</span>
                    </div>
                  )}
                  <div className="p-3 flex justify-between">
                    <span className="text-sm text-gray-600">Invoice/Reference</span>
                    <span className="text-sm font-mono font-medium text-gray-900">
                      {selectedTransaction.invoiceNo || selectedTransaction.id}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Transaction Note</p>
                      <p className="text-sm text-gray-600">
                        This transaction has been {selectedTransaction.status.toLowerCase()}. 
                        {selectedTransaction.status === 'Paid' && ' Payment received and verified.'}
                        {selectedTransaction.status === 'Pending' && ' Awaiting payment confirmation.'}
                        {selectedTransaction.status === 'Failed' && ' Payment could not be processed.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  handleExport(`Transaction_${selectedTransaction.invoiceNo || selectedTransaction.id}`, 'PDF');
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button
                onClick={() => setShowTransactionDetail(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Finance;
