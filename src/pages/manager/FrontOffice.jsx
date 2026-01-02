import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  UserCheck,
  LogOut,
  Users,
  DoorOpen,
  Hotel,
  Plus,
  Search,
  Filter,
  Download,
  X,
  Eye,
  Upload,
  ClipboardCheck,
  Trash2,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Mail,
  Phone,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Home,
  Bed
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ManagerFrontOffice = () => {
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('check-ins'); // check-ins, in-house, check-outs
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'check_in_date', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showUploadIdModal, setShowUploadIdModal] = useState(false);
  const [showPostChargeModal, setShowPostChargeModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [summary, setSummary] = useState({
    todayCheckIns: 0,
    todayCheckOuts: 0,
    inHouseGuests: 0,
    pendingPayments: 0,
    vacantRooms: 0
  });

  // Mock check-in data
  const mockCheckIns = [
    {
      id: 1,
      reservation_id: 'RES-2024-001',
      guest_name: 'John Smith',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      room_type: 'Deluxe Room',
      room_number: '101',
      check_in_date: '2024-03-15',
      check_in_time: '14:00',
      num_adults: 2,
      num_children: 1,
      id_verified: false,
      status: 'pending',
      total_amount: 15000,
      paid_amount: 5000
    },
    {
      id: 2,
      reservation_id: 'RES-2024-004',
      guest_name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+91 98765 43213',
      room_type: 'Suite',
      room_number: '201',
      check_in_date: '2024-03-15',
      check_in_time: '15:00',
      num_adults: 2,
      num_children: 0,
      id_verified: true,
      status: 'pending',
      total_amount: 25000,
      paid_amount: 10000
    },
    {
      id: 3,
      reservation_id: 'RES-2024-007',
      guest_name: 'Robert Wilson',
      email: 'robert@example.com',
      phone: '+91 98765 43216',
      room_type: 'Standard Room',
      room_number: '105',
      check_in_date: '2024-03-15',
      check_in_time: '16:00',
      num_adults: 1,
      num_children: 0,
      id_verified: true,
      status: 'checked_in',
      total_amount: 8000,
      paid_amount: 8000
    }
  ];

  // Mock in-house guests data
  const mockInHouse = [
    {
      id: 1,
      reservation_id: 'RES-2024-001',
      guest_name: 'John Smith',
      room_number: '101',
      num_adults: 2,
      num_children: 1,
      check_in_date: '2024-03-13',
      check_out_date: '2024-03-16',
      total_amount: 15000,
      paid_amount: 5000,
      balance: 10000,
      folio_charges: 2000
    },
    {
      id: 2,
      reservation_id: 'RES-2024-003',
      guest_name: 'Sarah Johnson',
      room_number: '203',
      num_adults: 2,
      num_children: 2,
      check_in_date: '2024-03-14',
      check_out_date: '2024-03-17',
      total_amount: 20000,
      paid_amount: 20000,
      balance: 0,
      folio_charges: 1500
    },
    {
      id: 3,
      reservation_id: 'RES-2024-005',
      guest_name: 'Michael Chen',
      room_number: '305',
      num_adults: 2,
      num_children: 0,
      check_in_date: '2024-03-12',
      check_out_date: '2024-03-16',
      total_amount: 18000,
      paid_amount: 9000,
      balance: 9000,
      folio_charges: 3000
    }
  ];

  // Mock check-out data
  const mockCheckOuts = [
    {
      id: 1,
      reservation_id: 'RES-2024-002',
      guest_name: 'David Brown',
      room_number: '102',
      check_out_date: '2024-03-15',
      check_out_time: '11:00',
      total_amount: 12000,
      paid_amount: 12000,
      balance: 0,
      status: 'ready'
    },
    {
      id: 2,
      reservation_id: 'RES-2024-006',
      guest_name: 'Lisa Anderson',
      room_number: '204',
      check_out_date: '2024-03-15',
      check_out_time: '11:00',
      total_amount: 16000,
      paid_amount: 8000,
      balance: 8000,
      status: 'pending_payment'
    }
  ];

  const [checkIns, setCheckIns] = useState([]);
  const [inHouseGuests, setInHouseGuests] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCheckIns(mockCheckIns);
      setInHouseGuests(mockInHouse);
      setCheckOuts(mockCheckOuts);

      // Calculate summary
      const todayCheckIns = mockCheckIns.filter(c => c.status === 'pending').length;
      const todayCheckOuts = mockCheckOuts.length;
      const inHouseCount = mockInHouse.length;
      const pendingPayments = mockInHouse.filter(g => g.balance > 0).length + mockCheckOuts.filter(c => c.balance > 0).length;
      const vacantRooms = 25; // Mock value

      setSummary({
        todayCheckIns,
        todayCheckOuts,
        inHouseGuests: inHouseCount,
        pendingPayments,
        vacantRooms
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load front office data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (data) => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map(item => item.id));
    }
  };

  const handleCheckIn = async (guest) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCheckIns(prev =>
        prev.map(c =>
          c.id === guest.id ? { ...c, status: 'checked_in' } : c
        )
      );

      toast.success(`${guest.guest_name} checked in successfully to Room ${guest.room_number}`);
      loadData();
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in guest');
    }
  };

  const handleCheckOut = async (guest) => {
    if (guest.balance > 0) {
      toast.error('Please settle pending payment before checkout');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCheckOuts(prev =>
        prev.map(c =>
          c.id === guest.id ? { ...c, status: 'checked_out' } : c
        )
      );

      toast.success(`${guest.guest_name} checked out successfully from Room ${guest.room_number}`);
      loadData();
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error('Failed to check out guest');
    }
  };

  const handleUploadId = (guest) => {
    setSelectedGuest(guest);
    setShowUploadIdModal(true);
  };

  const handlePostCharge = (guest) => {
    setSelectedGuest(guest);
    setShowPostChargeModal(true);
  };

  const handleRequestHousekeeping = async (guest) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Housekeeping request sent for Room ${guest.room_number}`);
    } catch (error) {
      console.error('Error requesting housekeeping:', error);
      toast.error('Failed to send housekeeping request');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first');
      return;
    }

    try {
      setBulkActionLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`Bulk ${action} completed for ${selectedItems.length} items`);
      setSelectedItems([]);
      loadData();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`Front office data exported as ${format.toUpperCase()} successfully!`);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const handleWalkInRegistration = async (formData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Walk-in guest registered successfully!');
      setShowWalkInModal(false);
      loadData();
    } catch (error) {
      console.error('Error registering walk-in:', error);
      toast.error('Failed to register walk-in guest');
    }
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'check-ins':
        return checkIns;
      case 'in-house':
        return inHouseGuests;
      case 'check-outs':
        return checkOuts;
      default:
        return [];
    }
  };

  // Filter and sort data
  const filteredAndSortedData = getCurrentData()
    .filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        item.guest_name.toLowerCase().includes(searchLower) ||
        (item.phone && item.phone.includes(searchTerm)) ||
        (item.room_number && item.room_number.includes(searchTerm)) ||
        item.reservation_id.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesRoom = roomFilter === 'all' || item.room_number === roomFilter;

      return matchesSearch && matchesStatus && matchesRoom;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Page Header - Fixed */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Front Office</h1>
            <p className="text-sm text-gray-600 mt-1">Manage guest check-ins, check-outs, and in-house operations</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowWalkInModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Walk-in Guest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today Check-ins</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.todayCheckIns}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today Check-outs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.todayCheckOuts}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <LogOut className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In-House Guests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.inHouseGuests}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.pendingPayments}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vacant Rooms</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.vacantRooms}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <DoorOpen className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-1 flex gap-1">
          <button
            onClick={() => { setActiveTab('check-ins'); setCurrentPage(1); setSelectedItems([]); }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'check-ins'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>Check-ins</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                {checkIns.filter(c => c.status === 'pending').length}
              </span>
            </div>
          </button>
          <button
            onClick={() => { setActiveTab('in-house'); setCurrentPage(1); setSelectedItems([]); }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'in-house'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              <span>In-House</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                {inHouseGuests.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => { setActiveTab('check-outs'); setCurrentPage(1); setSelectedItems([]); }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'check-outs'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Check-outs</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                {checkOuts.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Filters - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              {(statusFilter !== 'all' || roomFilter !== 'all') && (
                <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                  Active
                </span>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200 overflow-hidden"
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                      <option value="this_week">This Week</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      {activeTab === 'check-ins' && (
                        <>
                          <option value="pending">Pending</option>
                          <option value="checked_in">Checked In</option>
                        </>
                      )}
                      {activeTab === 'check-outs' && (
                        <>
                          <option value="ready">Ready</option>
                          <option value="pending_payment">Pending Payment</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <select
                      value={roomFilter}
                      onChange={(e) => { setRoomFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Rooms</option>
                      <option value="101">Room 101</option>
                      <option value="102">Room 102</option>
                      <option value="201">Room 201</option>
                      <option value="203">Room 203</option>
                    </select>
                  </div>
                </div>

                {(statusFilter !== 'all' || roomFilter !== 'all') && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setRoomFilter('all');
                        setCurrentPage(1);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search and Bulk Actions - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by guest name, phone, or room number..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedItems.length} selected
              </span>
              {activeTab === 'check-ins' && (
                <button
                  onClick={() => handleBulkAction('check-in')}
                  disabled={bulkActionLoading}
                  className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  Bulk Check-in
                </button>
              )}
              {activeTab === 'check-outs' && (
                <button
                  onClick={() => handleBulkAction('check-out')}
                  disabled={bulkActionLoading}
                  className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  Bulk Check-out
                </button>
              )}
              {activeTab === 'check-ins' && (
                <button
                  onClick={() => handleBulkAction('assign-room')}
                  disabled={bulkActionLoading}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  Bulk Assign Room
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Data Table - Scrollable */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                      onChange={() => handleSelectAll(filteredAndSortedData)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('reservation_id')}
                  >
                    <div className="flex items-center gap-2">
                      Reservation ID
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('guest_name')}
                  >
                    <div className="flex items-center gap-2">
                      Guest Name
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>

                  {activeTab === 'check-ins' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Room Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Check-in Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        ID Verified
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </>
                  )}

                  {activeTab === 'in-house' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Room No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Check-in Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Expected Check-out
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Balance
                      </th>
                    </>
                  )}

                  {activeTab === 'check-outs' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Room No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Total Bill
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Paid Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Balance
                      </th>
                    </>
                  )}

                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Hotel className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium">No data found</p>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">{item.reservation_id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 font-semibold text-sm">
                              {item.guest_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.guest_name}</div>
                            {item.email && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Mail className="w-3 h-3" />
                                {item.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {activeTab === 'check-ins' && (
                        <>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">{item.room_type}</div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                                Room {item.room_number}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{new Date(item.check_in_date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{item.check_in_time}</div>
                          </td>
                          <td className="px-4 py-4">
                            {item.id_verified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'checked_in'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                              {item.status === 'checked_in' ? 'Checked In' : 'Pending'}
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab === 'in-house' && (
                        <>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm font-medium">
                              <Bed className="w-3 h-3 mr-1" />
                              {item.room_number}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{item.num_adults} A</span>
                              {item.num_children > 0 && (
                                <span className="text-gray-500">+ {item.num_children} C</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{new Date(item.check_in_date).toLocaleDateString()}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{new Date(item.check_out_date).toLocaleDateString()}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className={`text-sm font-semibold ${item.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ₹{item.balance.toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </>
                      )}

                      {activeTab === 'check-outs' && (
                        <>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm font-medium">
                              <Bed className="w-3 h-3 mr-1" />
                              {item.room_number}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              ₹{item.total_amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                              <DollarSign className="w-4 h-4" />
                              ₹{item.paid_amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-red-600" />
                              <span className={`text-sm font-semibold ${item.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ₹{item.balance.toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </>
                      )}

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/manager/reservations/${item.id}`)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {activeTab === 'check-ins' && item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleCheckIn(item)}
                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Check In"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              {!item.id_verified && (
                                <button
                                  onClick={() => handleUploadId(item)}
                                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Upload ID"
                                >
                                  <Upload className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}

                          {activeTab === 'in-house' && (
                            <>
                              <button
                                onClick={() => handlePostCharge(item)}
                                className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="Post Charge"
                              >
                                <CreditCard className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRequestHousekeeping(item)}
                                className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                title="Request Housekeeping"
                              >
                                <ClipboardCheck className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {activeTab === 'check-outs' && (
                            <button
                              onClick={() => handleCheckOut(item)}
                              className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Complete Check-out"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} items
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Export Front Office Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={exportLoading}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">CSV Format</div>
                    <div className="text-sm text-gray-500">Compatible with Excel and Google Sheets</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('excel')}
                  disabled={exportLoading}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Excel Format</div>
                    <div className="text-sm text-gray-500">Native Microsoft Excel format</div>
                  </div>
                </button>
              </div>

              {exportLoading && (
                <div className="mt-4 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-sm text-gray-600">Exporting...</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Walk-in Guest Modal */}
      <AnimatePresence>
        {showWalkInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowWalkInModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Walk-in Guest Registration</h3>
                <button
                  onClick={() => setShowWalkInModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter guest name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+91"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="guest@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Deluxe Room</option>
                      <option>Suite</option>
                      <option>Standard Room</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Nights *</label>
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowWalkInModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleWalkInRegistration({});
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Register & Check-in
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagerFrontOffice;
