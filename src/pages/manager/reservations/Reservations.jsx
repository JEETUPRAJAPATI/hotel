import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus,
  Search, 
  Filter,
  Download,
  X,
  MoreVertical,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Users,
  Building,
  Phone,
  Mail,
  DollarSign,
  CalendarDays,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  LogOut,
  FileText,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ViewReservationDrawer from '../../../components/ViewReservationDrawer';
import toast from 'react-hot-toast';

const ManagerReservations = () => {
  const navigate = useNavigate();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'check_in_date', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const itemsPerPage = 10;

  // Mock reservations data for Manager's hotel
  const mockReservations = [
    {
      id: 1,
      reservation_number: 'RES-2024-001',
      guest_name: 'John Smith',
      guest_email: 'john@example.com',
      guest_phone: '+91 98765 43210',
      guest_id_type: 'passport',
      guest_id_number: 'P1234567',
      check_in_date: '2024-03-15',
      check_out_date: '2024-03-18',
      num_adults: 2,
      num_children: 1,
      room_type: 'Deluxe Room',
      room_number: '101',
      rate_plan: 'Standard',
      base_rate: 5000,
      taxes: 900,
      total_amount: 5900,
      deposit_amount: 1770,
      payment_status: 'paid',
      payment_method: 'card',
      status: 'confirmed',
      source: 'direct',
      special_requests: 'Late check-in requested',
      notes: 'VIP guest',
      created_at: '2024-02-15T10:30:00Z',
      updated_at: '2024-02-20T14:15:00Z'
    },
    {
      id: 2,
      reservation_number: 'RES-2024-002',
      guest_name: 'Sarah Johnson',
      guest_email: 'sarah@example.com',
      guest_phone: '+91 87654 32109',
      guest_id_type: 'driving_license',
      guest_id_number: 'DL123456',
      check_in_date: '2024-03-20',
      check_out_date: '2024-03-22',
      num_adults: 1,
      num_children: 0,
      room_type: 'Suite',
      room_number: '201',
      rate_plan: 'Premium',
      base_rate: 8000,
      taxes: 1440,
      total_amount: 9440,
      deposit_amount: 2832,
      payment_status: 'partial',
      payment_method: 'card',
      status: 'checked_in',
      source: 'booking.com',
      special_requests: 'Extra pillows',
      notes: '',
      created_at: '2024-03-01T14:20:00Z',
      updated_at: '2024-03-20T11:00:00Z'
    },
    {
      id: 3,
      reservation_number: 'RES-2024-003',
      guest_name: 'Michael Chen',
      guest_email: 'michael@example.com',
      guest_phone: '+91 76543 21098',
      guest_id_type: 'passport',
      guest_id_number: 'P9876543',
      check_in_date: '2024-03-25',
      check_out_date: '2024-03-28',
      num_adults: 2,
      num_children: 2,
      room_type: 'Family Room',
      room_number: '305',
      rate_plan: 'Standard',
      base_rate: 6500,
      taxes: 1170,
      total_amount: 7670,
      deposit_amount: 0,
      payment_status: 'pending',
      payment_method: 'cash',
      status: 'confirmed',
      source: 'phone',
      special_requests: 'Crib for baby',
      notes: 'Requested connecting room',
      created_at: '2024-03-10T09:45:00Z',
      updated_at: '2024-03-10T09:45:00Z'
    },
    {
      id: 4,
      reservation_number: 'RES-2024-004',
      guest_name: 'Emily Davis',
      guest_email: 'emily@example.com',
      guest_phone: '+91 65432 10987',
      guest_id_type: 'aadhar',
      guest_id_number: '1234 5678 9012',
      check_in_date: '2024-03-18',
      check_out_date: '2024-03-21',
      num_adults: 2,
      num_children: 0,
      room_type: 'Standard Room',
      room_number: '103',
      rate_plan: 'Standard',
      base_rate: 4000,
      taxes: 720,
      total_amount: 4720,
      deposit_amount: 4720,
      payment_status: 'paid',
      payment_method: 'upi',
      status: 'checked_out',
      source: 'makemytrip',
      special_requests: 'Airport transfer',
      notes: 'Early checkout',
      created_at: '2024-03-05T16:30:00Z',
      updated_at: '2024-03-21T09:00:00Z'
    },
    {
      id: 5,
      reservation_number: 'RES-2024-005',
      guest_name: 'Robert Brown',
      guest_email: 'robert@example.com',
      guest_phone: '+91 54321 09876',
      guest_id_type: 'passport',
      guest_id_number: 'P5555555',
      check_in_date: '2024-03-30',
      check_out_date: '2024-04-02',
      num_adults: 1,
      num_children: 0,
      room_type: 'Deluxe Room',
      room_number: '',
      rate_plan: 'Standard',
      base_rate: 5000,
      taxes: 900,
      total_amount: 5900,
      deposit_amount: 0,
      payment_status: 'pending',
      payment_method: '',
      status: 'cancelled',
      source: 'agent',
      special_requests: 'Airport pickup',
      notes: 'Cancelled due to emergency',
      created_at: '2024-02-25T08:30:00Z',
      updated_at: '2024-03-26T10:15:00Z'
    }
  ];

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      // Mock API call - Manager sees only their hotel's reservations
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReservations(mockReservations);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      totalReservations: reservations.length,
      checkingInToday: reservations.filter(r => {
        const checkInDate = new Date(r.check_in_date);
        checkInDate.setHours(0, 0, 0, 0);
        return r.status === 'confirmed' && checkInDate.getTime() === today.getTime();
      }).length,
      checkingOutToday: reservations.filter(r => {
        const checkOutDate = new Date(r.check_out_date);
        checkOutDate.setHours(0, 0, 0, 0);
        return r.status === 'checked_in' && checkOutDate.getTime() === today.getTime();
      }).length,
      currentlyCheckedIn: reservations.filter(r => r.status === 'checked_in').length,
      upcomingArrivals: reservations.filter(r => {
        const checkInDate = new Date(r.check_in_date);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 7);
        return r.status === 'confirmed' && checkInDate > today && checkInDate <= tomorrow;
      }).length
    };
  };

  const handleSelectReservation = (id) => {
    setSelectedReservations(prev =>
      prev.includes(id)
        ? prev.filter(resId => resId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReservations(filteredAndSortedReservations.map(res => res.id));
    } else {
      setSelectedReservations([]);
    }
  };

  const handleView = (reservation) => {
    setSelectedReservation(reservation);
    setViewDrawerOpen(true);
  };

  const handleEdit = (reservation) => {
    navigate(`/manager/reservations/edit/${reservation.id}`);
  };

  const handleCheckIn = async (reservation) => {
    if (reservation.status !== 'confirmed') {
      toast.error('Only confirmed reservations can be checked in');
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev =>
        prev.map(r =>
          r.id === reservation.id
            ? { ...r, status: 'checked_in', updated_at: new Date().toISOString() }
            : r
        )
      );
      
      toast.success(`Guest ${reservation.guest_name} checked in successfully`);
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in guest');
    }
  };

  const handleCheckOut = async (reservation) => {
    if (reservation.status !== 'checked_in') {
      toast.error('Only checked-in guests can be checked out');
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev =>
        prev.map(r =>
          r.id === reservation.id
            ? { ...r, status: 'checked_out', updated_at: new Date().toISOString() }
            : r
        )
      );
      
      toast.success(`Guest ${reservation.guest_name} checked out successfully`);
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error('Failed to check out guest');
    }
  };

  const handleCancel = async (reservation) => {
    if (!['confirmed', 'checked_in'].includes(reservation.status)) {
      toast.error('Cannot cancel this reservation');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel reservation ${reservation.reservation_number}?`
    );

    if (!confirmed) return;

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev =>
        prev.map(r =>
          r.id === reservation.id
            ? { ...r, status: 'cancelled', updated_at: new Date().toISOString() }
            : r
        )
      );
      
      toast.success('Reservation cancelled successfully');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Failed to cancel reservation');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReservations.length === 0) {
      toast.error('Please select reservations first');
      return;
    }

    try {
      setBulkActionLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (action) {
        case 'cancel':
          setReservations(prev =>
            prev.map(r =>
              selectedReservations.includes(r.id)
                ? { ...r, status: 'cancelled', updated_at: new Date().toISOString() }
                : r
            )
          );
          toast.success(`${selectedReservations.length} reservations cancelled`);
          break;
        case 'export':
          toast.success('Exporting selected reservations...');
          break;
        default:
          break;
      }

      setSelectedReservations([]);
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      const exportData = filteredAndSortedReservations.map(reservation => ({
        'Reservation Number': reservation.reservation_number,
        'Guest Name': reservation.guest_name,
        'Email': reservation.guest_email,
        'Phone': reservation.guest_phone,
        'Check-in': formatDate(reservation.check_in_date),
        'Check-out': formatDate(reservation.check_out_date),
        'Room Type': reservation.room_type,
        'Room Number': reservation.room_number || 'Not Assigned',
        'Adults': reservation.num_adults,
        'Children': reservation.num_children,
        'Total Amount': `₹${reservation.total_amount}`,
        'Payment Status': reservation.payment_status,
        'Status': reservation.status,
        'Source': reservation.source,
        'Created Date': new Date(reservation.created_at).toLocaleDateString()
      }));

      if (format === 'csv') {
        const csv = [Object.keys(exportData[0]).join(',')];
        exportData.forEach(row => {
          csv.push(Object.values(row).map(v => `"${v}"`).join(','));
        });
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manager-reservations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (format === 'excel') {
        toast.info('Excel export feature coming soon');
      } else if (format === 'pdf') {
        toast.info('PDF export feature coming soon');
      }

      toast.success(`Reservations exported as ${format.toUpperCase()} successfully`);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export reservations');
    } finally {
      setExportLoading(false);
    }
  };

  // Filter and sort reservations
  const filteredAndSortedReservations = reservations
    .filter(reservation => {
      const matchesSearch = 
        reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.guest_phone.includes(searchTerm) ||
        (reservation.room_number && reservation.room_number.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || reservation.payment_status === paymentStatusFilter;
      const matchesRoomType = roomTypeFilter === 'all' || reservation.room_type.toLowerCase().includes(roomTypeFilter.toLowerCase());

      let matchesDate = true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIn = new Date(reservation.check_in_date);
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(reservation.check_out_date);
      checkOut.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'today_checkin':
          matchesDate = checkIn.getTime() === today.getTime();
          break;
        case 'today_checkout':
          matchesDate = checkOut.getTime() === today.getTime();
          break;
        case 'this_week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = checkIn >= weekStart && checkIn <= weekEnd;
          break;
        case 'this_month':
          matchesDate = checkIn.getMonth() === today.getMonth() && checkIn.getFullYear() === today.getFullYear();
          break;
        case 'next_month':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          matchesDate = checkIn.getMonth() === nextMonth.getMonth() && checkIn.getFullYear() === nextMonth.getFullYear();
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesRoomType && matchesDate;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredAndSortedReservations.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'checked_in': return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'checked_out': return <LogOut className="w-4 h-4 text-purple-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'no_show': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'checked_in': return 'bg-green-50 text-green-700 border-green-200';
      case 'checked_out': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      case 'no_show': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700';
      case 'partial': return 'bg-yellow-50 text-yellow-700';
      case 'pending': return 'bg-red-50 text-red-700';
      case 'refunded': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const summary = calculateSummary();

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
            <h1 className="text-2xl font-bold text-gray-900">Reservations dadsada</h1>
            <p className="text-sm text-gray-600 mt-1">Manage all hotel reservations and bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadReservations()}
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
              onClick={() => navigate('/manager/reservations/create')}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-ins Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.checkingInToday}</p>
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
              <p className="text-sm font-medium text-gray-600">Check-outs Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.checkingOutToday}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.currentlyCheckedIn}</p>
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
              <p className="text-sm font-medium text-gray-600">Upcoming Arrivals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.upcomingArrivals}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
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
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalReservations}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Building className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </motion.div>
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
            {(statusFilter !== 'all' || dateFilter !== 'all' || roomTypeFilter !== 'all' || paymentStatusFilter !== 'all') && (
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
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Dates</option>
                    <option value="today_checkin">Today Check-in</option>
                    <option value="today_checkout">Today Check-out</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="next_month">Next Month</option>
                  </select>
                </div>

                {/* Room Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    value={roomTypeFilter}
                    onChange={(e) => { setRoomTypeFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Room Types</option>
                    <option value="standard">Standard Room</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family Room</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => { setPaymentStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Payment Status</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partially Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(statusFilter !== 'all' || dateFilter !== 'all' || roomTypeFilter !== 'all' || paymentStatusFilter !== 'all') && (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setDateFilter('all');
                      setRoomTypeFilter('all');
                      setPaymentStatusFilter('all');
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
                placeholder="Search by guest name, email, phone, or reservation number..."
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

        {selectedReservations.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-600">
              {selectedReservations.length} selected
            </span>
            <button
              onClick={() => handleBulkAction('cancel')}
              disabled={bulkActionLoading}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Cancel Selected
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              disabled={bulkActionLoading}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              Export Selected
            </button>
          </div>
        )}
      </div>

      {/* Reservations Table - Scrollable */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedReservations.length === filteredAndSortedReservations.length && filteredAndSortedReservations.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('reservation_number')}
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
                    Guest Details
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('check_in_date')}
                >
                  <div className="flex items-center gap-2">
                    Check-in / Check-out
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Room Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Source
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total_amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">No reservations found</p>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedReservations.map((reservation, index) => (
                  <motion.tr
                    key={reservation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReservations.includes(reservation.id)}
                        onChange={() => handleSelectReservation(reservation.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.reservation_number}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(reservation.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 font-semibold text-sm">
                            {reservation.guest_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.guest_name}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              {reservation.guest_email}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              {reservation.guest_phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <CalendarDays className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{formatDate(reservation.check_in_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <CalendarDays className="w-4 h-4 text-red-600" />
                          <span className="font-medium">{formatDate(reservation.check_out_date)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {calculateNights(reservation.check_in_date, reservation.check_out_date)} night(s)
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.room_type}
                        </div>
                        <div className="text-sm text-gray-600">
                          {reservation.room_number ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                              Room {reservation.room_number}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Not assigned</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{reservation.num_adults} A</span>
                        {reservation.num_children > 0 && (
                          <span className="text-gray-500">+ {reservation.num_children} C</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {reservation.source}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        ₹{reservation.total_amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(reservation.payment_status)}`}>
                        {reservation.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        {reservation.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(reservation)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleCheckIn(reservation)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Check In"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        {reservation.status === 'checked_in' && (
                          <button
                            onClick={() => handleCheckOut(reservation)}
                            className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Check Out"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        )}
                        {['confirmed', 'checked_in'].includes(reservation.status) && (
                          <button
                            onClick={() => handleCancel(reservation)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedReservations.length)} of {filteredAndSortedReservations.length} reservations
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
                <h3 className="text-lg font-semibold text-gray-900">Export Reservations</h3>
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

                <button
                  onClick={() => handleExport('pdf')}
                  disabled={exportLoading}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">PDF Format</div>
                    <div className="text-sm text-gray-500">Printable document format</div>
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

      {/* View Reservation Drawer */}
      <ViewReservationDrawer
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        reservation={selectedReservation}
      />
    </div>
  );
};

export default ManagerReservations;
