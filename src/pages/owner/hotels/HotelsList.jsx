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
  Building,
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
  Bed,
  Wifi,
  Car
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const HotelsList = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    location: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, hotel: null });

  // Mock data for development
  const mockHotels = [
    {
      _id: '1',
      name: 'Grand Palace Hotel',
      description: 'Luxury hotel in the heart of the city',
      address: '123 Main Street, Downtown',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'USA',
      phone: '+1 555-0123',
      email: 'info@grandpalace.com',
      website: 'www.grandpalace.com',
      star_rating: 5,
      total_rooms: 250,
      available_rooms: 45,
      status: 'Active',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Parking'],
      created_at: '2024-01-15',
      images: []
    },
    {
      _id: '2',
      name: 'Ocean View Resort',
      description: 'Beachfront resort with stunning ocean views',
      address: '456 Beach Road, Coastal Area',
      city: 'Miami',
      state: 'FL',
      zip_code: '33101',
      country: 'USA',
      phone: '+1 555-0124',
      email: 'reservations@oceanview.com',
      website: 'www.oceanviewresort.com',
      star_rating: 4,
      total_rooms: 180,
      available_rooms: 32,
      status: 'Active',
      amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Gym'],
      created_at: '2024-01-10',
      images: []
    },
    {
      _id: '3',
      name: 'Mountain Lodge',
      description: 'Cozy lodge nestled in the mountains',
      address: '789 Mountain Trail, Alpine Valley',
      city: 'Aspen',
      state: 'CO',
      zip_code: '81611',
      country: 'USA',
      phone: '+1 555-0125',
      email: 'stay@mountainlodge.com',
      website: 'www.mountainlodge.com',
      star_rating: 4,
      total_rooms: 85,
      available_rooms: 12,
      status: 'Maintenance',
      amenities: ['WiFi', 'Fireplace', 'Hiking Trails', 'Restaurant'],
      created_at: '2024-01-05',
      images: []
    }
  ];

  useEffect(() => {
    loadHotels();
  }, [filters]);

  const loadHotels = async () => {
    try {
      setLoading(true);
      // For demo purposes, use mock data
      setTimeout(() => {
        let filteredHotels = mockHotels;
        
        if (filters.search) {
          filteredHotels = filteredHotels.filter(hotel =>
            hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            hotel.city.toLowerCase().includes(filters.search.toLowerCase()) ||
            hotel.address.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        if (filters.status) {
          filteredHotels = filteredHotels.filter(hotel => 
            hotel.status.toLowerCase() === filters.status.toLowerCase()
          );
        }

        setHotels(filteredHotels);
        setPagination({
          page: 1,
          totalPages: 1,
          total: filteredHotels.length,
          limit: 10
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading hotels:', error);
      toast.error('Failed to load hotels');
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

  const handleSelectAll = () => {
    if (selectedHotels.length === hotels.length) {
      setSelectedHotels([]);
    } else {
      setSelectedHotels(hotels.map(hotel => hotel._id));
    }
  };

  const handleSelectHotel = (hotelId) => {
    if (selectedHotels.includes(hotelId)) {
      setSelectedHotels(selectedHotels.filter(id => id !== hotelId));
    } else {
      setSelectedHotels([...selectedHotels, hotelId]);
    }
  };

  const handleDeleteHotel = async (hotel) => {
    if (window.confirm(`Are you sure you want to delete ${hotel.name}?`)) {
      try {
        // await hotelService.deleteHotel(hotel._id);
        toast.success('Hotel deleted successfully');
        loadHotels();
      } catch (error) {
        console.error('Error deleting hotel:', error);
        toast.error('Failed to delete hotel');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800' },
      'Inactive': { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800' },
      'Maintenance': { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-800' }
    };

    const config = statusConfig[status] || statusConfig['Inactive'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Hotel Management</h1>
            <p className="text-gray-600">Manage your hotel properties and amenities</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/owner/hotels/create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Hotel
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
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Hotels</h3>
              <p className="text-2xl font-semibold text-gray-900">{hotels.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Hotels</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {hotels.filter(hotel => hotel.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Bed className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Rooms</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {hotels.reduce((sum, hotel) => sum + hotel.total_rooms, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Available Rooms</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {hotels.reduce((sum, hotel) => sum + hotel.available_rooms, 0)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search hotels..."
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Locations</option>
              <option value="New York">New York</option>
              <option value="Miami">Miami</option>
              <option value="Aspen">Aspen</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

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

        {/* Bulk Actions */}
        {selectedHotels.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedHotels.length} hotel(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {}}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Hotels Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedHotels.length === hotels.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating & Amenities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rooms
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
              {hotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedHotels.includes(hotel._id)}
                      onChange={() => handleSelectHotel(hotel._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                        <div className="text-sm text-gray-500">{hotel.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {hotel.city}, {hotel.state}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {hotel.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {hotel.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStarRating(hotel.star_rating)}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {hotel.total_rooms} Total
                    </div>
                    <div className="text-sm text-gray-500">
                      {hotel.available_rooms} Available
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(hotel.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/hotels/${hotel._id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/hotels/${hotel._id}/edit`)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Hotel"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteHotel(hotel)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Hotel"
                      >
                        <Trash2 className="w-4 h-4" />
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
              {pagination.total} hotels
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

export default HotelsList;