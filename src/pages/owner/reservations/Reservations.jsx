import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus,
  Search, 
  Filter,
  Download,
  Upload,
  X,
  MoreVertical,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Check,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CreditCard,
  CalendarDays,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  LogOut,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ViewReservationDrawer from '../../../components/ViewReservationDrawer';
import toast from 'react-hot-toast';

const Reservations = () => {
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
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const itemsPerPage = 10;

  // Mock reservations data
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
      guest_id_number: 'DL123456789',
      check_in_date: '2024-03-20',
      check_out_date: '2024-03-22',
      num_adults: 1,
      num_children: 0,
      room_type: 'Executive Suite',
      room_number: '205',
      rate_plan: 'Corporate',
      base_rate: 8000,
      taxes: 1440,
      total_amount: 9440,
      deposit_amount: 2832,
      payment_status: 'partial',
      payment_method: 'cash',
      status: 'checked_in',
      source: 'online',
      special_requests: 'Extra towels',
      notes: 'Business traveler',
      created_at: '2024-02-18T09:15:00Z',
      updated_at: '2024-03-20T15:30:00Z'
    },
    {
      id: 3,
      reservation_number: 'RES-2024-003',
      guest_name: 'Michael Chen',
      guest_email: 'michael@example.com',
      guest_phone: '+91 76543 21098',
      guest_id_type: 'aadhaar',
      guest_id_number: '1234 5678 9012',
      check_in_date: '2024-03-25',
      check_out_date: '2024-03-27',
      num_adults: 2,
      num_children: 2,
      room_type: 'Family Suite',
      room_number: '301',
      rate_plan: 'Weekend',
      base_rate: 12000,
      taxes: 2160,
      total_amount: 14160,
      deposit_amount: 4248,
      payment_status: 'pending',
      payment_method: 'card',
      status: 'confirmed',
      source: 'phone',
      special_requests: 'Baby cot required',
      notes: 'Family vacation',
      created_at: '2024-02-22T16:45:00Z',
      updated_at: '2024-02-22T16:45:00Z'
    },
    {
      id: 4,
      reservation_number: 'RES-2024-004',
      guest_name: 'Emily Davis',
      guest_email: 'emily@example.com',
      guest_phone: '+91 65432 10987',
      guest_id_type: 'passport',
      guest_id_number: 'P7654321',
      check_in_date: '2024-03-10',
      check_out_date: '2024-03-12',
      num_adults: 1,
      num_children: 0,
      room_type: 'Standard Room',
      room_number: '102',
      rate_plan: 'Government',
      base_rate: 3500,
      taxes: 630,
      total_amount: 4130,
      deposit_amount: 1239,
      payment_status: 'paid',
      payment_method: 'upi',
      status: 'checked_out',
      source: 'walk_in',
      special_requests: 'Ground floor room',
      notes: 'Government employee',
      created_at: '2024-03-09T12:00:00Z',
      updated_at: '2024-03-12T11:00:00Z'
    },
    {
      id: 5,
      reservation_number: 'RES-2024-005',
      guest_name: 'Robert Wilson',
      guest_email: 'robert@example.com',
      guest_phone: '+91 54321 09876',
      guest_id_type: 'pan',
      guest_id_number: 'ABCDE1234F',
      check_in_date: '2024-03-28',
      check_out_date: '2024-03-30',
      num_adults: 3,
      num_children: 0,
      room_type: 'Presidential Suite',
      room_number: '501',
      rate_plan: 'VIP',
      base_rate: 25000,
      taxes: 4500,
      total_amount: 29500,
      deposit_amount: 8850,
      payment_status: 'paid',
      payment_method: 'card',
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
      // Mock API call
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

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDateFilter = (dateRange) => {
    setDateFilter(dateRange);
    setCurrentPage(1);
  };

  const handleRoomTypeFilter = (roomType) => {
    setRoomTypeFilter(roomType);
    setCurrentPage(1);
  };

  const handlePaymentStatusFilter = (paymentStatus) => {
    setPaymentStatusFilter(paymentStatus);
    setCurrentPage(1);
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      totalReservations: reservations.length,
      confirmedToday: reservations.filter(r => 
        r.status === 'confirmed' && 
        new Date(r.check_in_date).toDateString() === today.toDateString()
      ).length,
      checkingInToday: reservations.filter(r => 
        r.status === 'confirmed' && 
        new Date(r.check_in_date).toDateString() === today.toDateString()
      ).length,
      checkingOutToday: reservations.filter(r => 
        r.status === 'checked_in' && 
        new Date(r.check_out_date).toDateString() === today.toDateString()
      ).length,
      currentlyCheckedIn: reservations.filter(r => r.status === 'checked_in').length,
      totalRevenue: reservations
        .filter(r => ['confirmed', 'checked_in', 'checked_out'].includes(r.status))
        .reduce((sum, r) => sum + r.total_amount, 0),
      pendingPayments: reservations
        .filter(r => r.payment_status === 'pending')
        .reduce((sum, r) => sum + r.total_amount, 0),
      roomOccupancy: Math.round((reservations.filter(r => r.status === 'checked_in').length / 50) * 100) // Assuming 50 total rooms
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

  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation);
    setViewDrawerOpen(true);
  };

  const handleEditReservation = (id) => {
    navigate(`/owner/reservations/edit/${id}`);
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setReservations(prev => prev.filter(res => res.id !== id));
        toast.success('Reservation deleted successfully');
      } catch (error) {
        console.error('Error deleting reservation:', error);
        toast.error('Failed to delete reservation');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setReservations(prev =>
        prev.map(res =>
          res.id === id ? { ...res, status: newStatus, updated_at: new Date().toISOString() } : res
        )
      );
      toast.success(`Reservation ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast.error('Failed to update reservation status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReservations.length === 0) {
      toast.error('Please select reservations first');
      return;
    }

    if (!window.confirm(`Are you sure you want to ${action} ${selectedReservations.length} reservation(s)?`)) {
      return;
    }

    try {
      setBulkActionLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'delete') {
        setReservations(prev => prev.filter(res => !selectedReservations.includes(res.id)));
      } else {
        setReservations(prev =>
          prev.map(res =>
            selectedReservations.includes(res.id)
              ? { ...res, status: action, updated_at: new Date().toISOString() }
              : res
          )
        );
      }
      
      setSelectedReservations([]);
      toast.success(`Bulk ${action} completed successfully`);
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to perform bulk ${action}`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock data for export
      const exportData = filteredAndSortedReservations.map(reservation => ({
        'Reservation Number': reservation.reservation_number,
        'Guest Name': reservation.guest_name,
        'Email': reservation.guest_email,
        'Phone': reservation.guest_phone,
        'Check-in': reservation.check_in_date,
        'Check-out': reservation.check_out_date,
        'Room Type': reservation.room_type,
        'Room Number': reservation.room_number,
        'Total Amount': reservation.total_amount,
        'Payment Status': reservation.payment_status,
        'Reservation Status': reservation.status,
        'Created Date': new Date(reservation.created_at).toLocaleDateString()
      }));
      
      if (format === 'csv') {
        const csv = [Object.keys(exportData[0]).join(',')];
        exportData.forEach(row => {
          csv.push(Object.values(row).join(','));
        });
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(jsonBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservations-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
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

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      setImportLoading(true);
      // Mock import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock imported data
      const importedReservations = [
        {
          id: Date.now(),
          reservation_number: 'IMP-2024-001',
          guest_name: 'Imported Guest',
          guest_email: 'imported@example.com',
          guest_phone: '+91 99999 88888',
          check_in_date: '2024-04-01',
          check_out_date: '2024-04-03',
          room_type: 'Standard Room',
          room_number: '999',
          total_amount: 6000,
          payment_status: 'pending',
          status: 'confirmed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setReservations(prev => [...prev, ...importedReservations]);
      setImportFile(null);
      setShowImportModal(false);
      toast.success(`${importedReservations.length} reservations imported successfully`);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import reservations');
    } finally {
      setImportLoading(false);
    }
  };

  // Filter and sort reservations
  const filteredAndSortedReservations = reservations
    .filter(reservation => {
      const matchesSearch = 
        reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.reservation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.room_number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      
      const matchesPaymentStatus = paymentStatusFilter === 'all' || reservation.payment_status === paymentStatusFilter;
      
      const matchesRoomType = roomTypeFilter === 'all' || reservation.room_type.toLowerCase().includes(roomTypeFilter.toLowerCase());
      
      let matchesDate = true;
      const today = new Date();
      const checkIn = new Date(reservation.check_in_date);
      const checkOut = new Date(reservation.check_out_date);
      
      switch (dateFilter) {
        case 'today_checkin':
          matchesDate = checkIn.toDateString() === today.toDateString();
          break;
        case 'today_checkout':
          matchesDate = checkOut.toDateString() === today.toDateString();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage hotel reservations and bookings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <button
            onClick={() => navigate('/owner/reservations/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Reservation
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {(() => {
          const summary = calculateSummary();
          return (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Reservations</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">{summary.totalReservations}</p>
                  </div>
                  <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Currently Occupied</p>
                    <p className="text-xl md:text-2xl font-bold text-orange-900">{summary.currentlyCheckedIn}</p>
                  </div>
                  <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg flex-shrink-0 ml-2">
                    <Building className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Revenue</p>
                    <p className="text-lg md:text-2xl font-bold text-green-900">₹{summary.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-1.5 md:p-2 bg-green-100 rounded-lg flex-shrink-0 ml-2">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Pending Payments</p>
                    <p className="text-lg md:text-2xl font-bold text-red-900">₹{summary.pendingPayments.toLocaleString()}</p>
                  </div>
                  <div className="p-1.5 md:p-2 bg-red-100 rounded-lg flex-shrink-0 ml-2">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reservation Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => handleDateFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today_checkin">Check-in Today</option>
                <option value="today_checkout">Check-out Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="next_month">Next Month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <select
                value={roomTypeFilter}
                onChange={(e) => handleRoomTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Room Types</option>
                <option value="standard">Standard Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Executive Suite</option>
                <option value="family">Family Suite</option>
                <option value="presidential">Presidential Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => handlePaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Payment Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partially Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedReservations.length} of {reservations.length} reservations
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
                setRoomTypeFilter('all');
                setPaymentStatusFilter('all');
                setCurrentPage(1);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium self-start sm:self-auto"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <button
            onClick={loadReservations}
            className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedReservations.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
            <span className="text-sm text-blue-700 font-medium">
              {selectedReservations.length} selected
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleBulkAction('confirmed')}
                disabled={bulkActionLoading}
                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Confirm Selected"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkAction('cancelled')}
                disabled={bulkActionLoading}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Cancel Selected"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReservations.length === filteredAndSortedReservations.length && filteredAndSortedReservations.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('reservation_number')}
                >
                  <div className="flex items-center gap-1">
                    Reservation
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('guest_name')}
                >
                  <div className="flex items-center gap-1">
                    Guest
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('check_in_date')}
                >
                  <div className="flex items-center gap-1">
                    Dates
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total_amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {paginatedReservations.map((reservation) => (
                <motion.tr
                  key={reservation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <input
                      type="checkbox"
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={() => handleSelectReservation(reservation.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">
                        {reservation.reservation_number}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(reservation.created_at)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">
                        {reservation.guest_name}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{reservation.guest_email}</span>
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {reservation.guest_phone}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(reservation.check_in_date)} - {formatDate(reservation.check_out_date)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {calculateNights(reservation.check_in_date, reservation.check_out_date)} night(s)
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {reservation.num_adults} adults, {reservation.num_children} children
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">
                        {reservation.room_type}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        Room {reservation.room_number}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">
                        ₹{reservation.total_amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Base: ₹{reservation.base_rate.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Tax: ₹{reservation.taxes.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(reservation.payment_status)}`}>
                        {reservation.payment_status.charAt(0).toUpperCase() + reservation.payment_status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {reservation.payment_method}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewReservation(reservation)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleEditReservation(reservation.id)}
                        className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Reservation"
                      >
                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      
                      {/* Status Action Buttons */}
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'checked_in')}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Check In"
                        >
                          <UserCheck className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      )}
                      
                      {reservation.status === 'checked_in' && (
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'checked_out')}
                          className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Check Out"
                        >
                          <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      )}
                      
                      {['confirmed', 'checked_in'].includes(reservation.status) && (
                        <button
                          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteReservation(reservation.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 md:px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedReservations.length)} of{' '}
              {filteredAndSortedReservations.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  return page <= totalPages ? (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm border rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedReservations.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first reservation to get started'}
            </p>
            <button
              onClick={() => navigate('/owner/reservations/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New Reservation
            </button>
          </div>
        )}
      </div>

      {/* View Reservation Drawer */}
      {viewDrawerOpen && selectedReservation && (
        <ViewReservationDrawer
          reservation={selectedReservation}
          isOpen={viewDrawerOpen}
          onClose={() => {
            setViewDrawerOpen(false);
            setSelectedReservation(null);
          }}
        />
      )}

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowExportModal(false)} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Export Reservations</h3>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Choose the format to export {filteredAndSortedReservations.length} reservations
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleExport('csv')}
                      disabled={exportLoading}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50"
                    >
                      <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">CSV Format</span>
                      <span className="text-xs text-gray-500">Excel compatible</span>
                    </button>
                    
                    <button
                      onClick={() => handleExport('json')}
                      disabled={exportLoading}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-8 h-8 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">JSON Format</span>
                      <span className="text-xs text-gray-500">Developer friendly</span>
                    </button>
                  </div>
                  
                  {exportLoading && (
                    <div className="flex items-center justify-center py-4">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm text-gray-600">Preparing export...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowImportModal(false)} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Import Reservations</h3>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="mb-4">
                        <label className="cursor-pointer">
                          <span className="text-base font-medium text-blue-600 hover:text-blue-500">
                            Choose a file to upload
                          </span>
                          <input
                            type="file"
                            accept=".csv,.json,.xlsx"
                            onChange={(e) => setImportFile(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supports CSV, JSON, and Excel files up to 10MB
                      </p>
                    </div>
                  </div>
                  
                  {importFile && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{importFile.name}</span>
                      </div>
                      <button
                        onClick={() => setImportFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-sm text-yellow-800">
                      <strong>Note:</strong> Make sure your file contains the following columns:
                      guest_name, guest_email, check_in_date, check_out_date, room_type, total_amount
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowImportModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={!importFile || importLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {importLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Importing...
                        </>
                      ) : (
                        'Import Reservations'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reservations;