import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar,
  MoreVertical,
  MapPin,
  Star,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Bed,
  CreditCard,
  User,
  CalendarCheck,
  AlertCircle,
  Home
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    hotel: '',
    checkin_date: '',
    checkout_date: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedReservations, setSelectedReservations] = useState([]);

  // Mock data for development
  const mockReservations = [
    {
      _id: '1',
      booking_id: 'BK001',
      guest_name: 'John Smith',
      guest_email: 'john.smith@email.com',
      guest_phone: '+1 555-0123',
      hotel_name: 'Grand Palace Hotel',
      room_number: '205',
      room_type: 'Deluxe Suite',
      checkin_date: '2024-01-20',
      checkout_date: '2024-01-23',
      nights: 3,
      guests: 2,
      total_amount: 45000,
      paid_amount: 45000,
      payment_status: 'Paid',
      status: 'Confirmed',
      created_at: '2024-01-15',
      agent_name: 'Sarah Williams',
      special_requests: 'Late check-in requested'
    },
    {
      _id: '2',
      booking_id: 'BK002',
      guest_name: 'Emily Johnson',
      guest_email: 'emily.johnson@email.com',
      guest_phone: '+1 555-0124',
      hotel_name: 'Ocean View Resort',
      room_number: '312',
      room_type: 'Ocean View Room',
      checkin_date: '2024-01-22',
      checkout_date: '2024-01-25',
      nights: 3,
      guests: 1,
      total_amount: 28500,
      paid_amount: 14250,
      payment_status: 'Partial',
      status: 'Confirmed',
      created_at: '2024-01-16',
      agent_name: 'Mike Rodriguez',
      special_requests: null
    },
    {
      _id: '3',
      booking_id: 'BK003',
      guest_name: 'David Wilson',
      guest_email: 'david.wilson@email.com',
      guest_phone: '+1 555-0125',
      hotel_name: 'Mountain Lodge',
      room_number: '108',
      room_type: 'Standard Room',
      checkin_date: '2024-01-25',
      checkout_date: '2024-01-27',
      nights: 2,
      guests: 2,
      total_amount: 18000,
      paid_amount: 0,
      payment_status: 'Pending',
      status: 'Pending',
      created_at: '2024-01-17',
      agent_name: 'John Anderson',
      special_requests: 'Ground floor room'
    }
  ];

  useEffect(() => {
    loadReservations();
  }, [filters]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      // For demo purposes, use mock data
      setTimeout(() => {
        let filteredReservations = mockReservations;
        
        if (filters.search) {
          filteredReservations = filteredReservations.filter(reservation =>
            reservation.guest_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            reservation.booking_id.toLowerCase().includes(filters.search.toLowerCase()) ||
            reservation.guest_email.toLowerCase().includes(filters.search.toLowerCase()) ||
            reservation.hotel_name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        if (filters.status) {
          filteredReservations = filteredReservations.filter(reservation => 
            reservation.status.toLowerCase() === filters.status.toLowerCase()
          );
        }

        if (filters.hotel) {
          filteredReservations = filteredReservations.filter(reservation => 
            reservation.hotel_name.toLowerCase().includes(filters.hotel.toLowerCase())
          );
        }

        setReservations(filteredReservations);
        setPagination({
          page: 1,
          totalPages: 1,
          total: filteredReservations.length,
          limit: 10
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast.error('Failed to load reservations');
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Confirmed': { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800' },
      'Pending': { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Cancelled': { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800' },
      'Checked-in': { icon: Home, bg: 'bg-blue-100', text: 'text-blue-800' },
      'Checked-out': { icon: CheckCircle, bg: 'bg-gray-100', text: 'text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusConfig = {
      'Paid': { bg: 'bg-green-100', text: 'text-green-800' },
      'Partial': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Pending': { bg: 'bg-red-100', text: 'text-red-800' },
      'Refunded': { bg: 'bg-gray-100', text: 'text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Reservation Management</h1>
            <p className="text-gray-600">Monitor and manage all hotel bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/owner/reservations/create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Reservation
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Reservations</h3>
              <p className="text-2xl font-semibold text-gray-900">{reservations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {reservations.filter(r => r.status === 'Confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {reservations.filter(r => r.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{reservations.reduce((sum, r) => sum + r.total_amount, 0).toLocaleString()}
              </p>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reservations..."
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Checked-in">Checked-in</option>
              <option value="Checked-out">Checked-out</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Hotel Filter */}
          <div className="relative">
            <select
              value={filters.hotel}
              onChange={(e) => handleFilterChange('hotel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Hotels</option>
              <option value="grand-palace">Grand Palace Hotel</option>
              <option value="ocean-view">Ocean View Resort</option>
              <option value="mountain-lodge">Mountain Lodge</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Check-in Date */}
          <input
            type="date"
            value={filters.checkin_date}
            onChange={(e) => handleFilterChange('checkin_date', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Check-in Date"
          />

          {/* Items per page */}
          <div className="relative">
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Reservations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel & Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stay Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{reservation.booking_id}</div>
                        <div className="text-sm text-gray-500">Agent: {reservation.agent_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.guest_name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {reservation.guest_email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {reservation.guest_phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.hotel_name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Bed className="w-4 h-4 text-gray-400" />
                      Room {reservation.room_number} • {reservation.room_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(reservation.checkin_date).toLocaleDateString()} - {new Date(reservation.checkout_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      {reservation.nights} nights • {reservation.guests} guests
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{reservation.total_amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Paid: ₹{reservation.paid_amount.toLocaleString()}</div>
                    {getPaymentBadge(reservation.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(reservation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/reservations/${reservation._id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/reservations/${reservation._id}/edit`)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Reservation"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {}}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Cancel Reservation"
                      >
                        <XCircle className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} reservations
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleFilterChange('page', page)}
                  className={`px-3 py-1 rounded text-sm ${
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Reservations;