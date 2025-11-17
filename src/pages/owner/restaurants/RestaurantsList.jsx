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
  ChefHat,
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
  Mail
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const RestaurantsList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    hotel: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, restaurant: null });

  // Mock data for development
  const mockRestaurants = [
    {
      _id: '1',
      name: 'Ocean Breeze Restaurant',
      description: 'Fine dining with ocean views',
      hotel_name: 'Grand Palace Hotel',
      cuisine_type: 'Mediterranean',
      seating_capacity: 80,
      phone: '5551234567',
      email: 'oceanbreeze@hotel.com',
      status: 'Active',
      rating: 4.7,
      average_price: 2500,
      location: 'Ground Floor, Main Building',
      operating_hours: '6:00 PM - 11:00 PM'
    },
    {
      _id: '2',
      name: 'Rooftop Café',
      description: 'Casual dining with city views',
      hotel_name: 'Ocean View Resort',
      cuisine_type: 'International',
      seating_capacity: 45,
      phone: '5551234568',
      email: 'rooftop@resort.com',
      status: 'Active',
      rating: 4.4,
      average_price: 1800,
      location: 'Rooftop Level',
      operating_hours: '7:00 AM - 10:00 PM'
    },
    {
      _id: '3',
      name: 'Pool Bar & Grill',
      description: 'Poolside casual dining',
      hotel_name: 'Mountain Lodge',
      cuisine_type: 'American',
      seating_capacity: 30,
      phone: '5551234569',
      email: 'poolbar@lodge.com',
      status: 'Maintenance',
      rating: 4.1,
      average_price: 1200,
      location: 'Pool Area',
      operating_hours: '11:00 AM - 8:00 PM'
    }
  ];

  useEffect(() => {
    loadRestaurants();
  }, [filters]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      // For demo purposes, use mock data
      setTimeout(() => {
        let filteredRestaurants = mockRestaurants;
        
        if (filters.search) {
          filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            restaurant.cuisine_type.toLowerCase().includes(filters.search.toLowerCase()) ||
            restaurant.hotel_name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        if (filters.status) {
          filteredRestaurants = filteredRestaurants.filter(restaurant => 
            restaurant.status.toLowerCase() === filters.status.toLowerCase()
          );
        }

        setRestaurants(filteredRestaurants);
        setPagination({
          page: 1,
          totalPages: 1,
          total: filteredRestaurants.length,
          limit: 10
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
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
    if (selectedRestaurants.length === restaurants.length) {
      setSelectedRestaurants([]);
    } else {
      setSelectedRestaurants(restaurants.map(restaurant => restaurant._id));
    }
  };

  const handleSelectRestaurant = (restaurantId) => {
    if (selectedRestaurants.includes(restaurantId)) {
      setSelectedRestaurants(selectedRestaurants.filter(id => id !== restaurantId));
    } else {
      setSelectedRestaurants([...selectedRestaurants, restaurantId]);
    }
  };

  const handleDeleteRestaurant = async (restaurant) => {
    if (window.confirm(`Are you sure you want to delete ${restaurant.name}?`)) {
      try {
        // await restaurantService.deleteRestaurant(restaurant._id);
        toast.success('Restaurant deleted successfully');
        loadRestaurants();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        toast.error('Failed to delete restaurant');
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
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
            <p className="text-gray-600">Oversee your restaurant operations</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/owner/restaurants/create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Restaurant
            </motion.button>
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
              placeholder="Search restaurants..."
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
        {selectedRestaurants.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedRestaurants.length} restaurant(s) selected
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

      {/* Restaurants Table */}
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
                    checked={selectedRestaurants.length === restaurants.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity & Pricing
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
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRestaurants.includes(restaurant._id)}
                      onChange={() => handleSelectRestaurant(restaurant._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <ChefHat className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        <div className="text-sm text-gray-500">{restaurant.cuisine_type} Cuisine</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{restaurant.hotel_name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {restaurant.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {restaurant.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {restaurant.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{restaurant.seating_capacity} seats</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      Avg: ₹{restaurant.average_price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(restaurant.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/restaurants/${restaurant._id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/restaurants/${restaurant._id}/edit`)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Restaurant"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteRestaurant(restaurant)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Restaurant"
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
              {pagination.total} restaurants
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

export default RestaurantsList;