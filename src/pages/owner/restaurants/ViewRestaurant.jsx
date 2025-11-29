import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChefHat,
  Utensils,
  Coffee,
  Wine,
  Sandwich
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const ViewRestaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false });

  // Mock data - replace with actual API call
  const mockRestaurantData = {
    '1': {
      _id: '1',
      name: 'Ocean Breeze Restaurant',
      description: 'Fine dining restaurant specializing in Mediterranean cuisine with stunning ocean views. Our chef-curated menu features fresh seafood, premium steaks, and an extensive wine collection.',
      hotel_name: 'Grand Palace Hotel',
      hotel_id: 'hotel1',
      cuisine_type: 'Mediterranean',
      seating_capacity: 80,
      phone: '5551234567',
      email: 'oceanbreeze@hotel.com',
      location: 'Ground Floor, Main Building',
      operating_hours: {
        open: '18:00',
        close: '23:00'
      },
      average_price: 2500,
      rating: 4.7,
      total_reviews: 156,
      menu_categories: ['Appetizers', 'Main Course', 'Desserts', 'Wine List'],
      features: ['outdoor_seating', 'bar', 'live_music', 'private_dining', 'wifi'],
      status: 'Active',
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
      ],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-11-15T08:45:00Z'
    },
    '2': {
      _id: '2',
      name: 'Rooftop Café',
      description: 'Casual dining experience with panoramic city views. Perfect for breakfast, lunch, or evening coffee with friends.',
      hotel_name: 'Ocean View Resort',
      hotel_id: 'hotel2',
      cuisine_type: 'International',
      seating_capacity: 45,
      phone: '5551234568',
      email: 'rooftop@resort.com',
      location: 'Rooftop Level',
      operating_hours: {
        open: '07:00',
        close: '22:00'
      },
      average_price: 1800,
      rating: 4.4,
      total_reviews: 89,
      menu_categories: ['Breakfast', 'Beverages', 'Snacks', 'Desserts'],
      features: ['outdoor_seating', 'wifi', 'takeaway', 'delivery'],
      status: 'Active',
      images: [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
        'https://images.unsplash.com/photo-1559329007-40df8ac17d15?w=400'
      ],
      created_at: '2024-02-20T14:15:00Z',
      updated_at: '2024-11-10T16:20:00Z'
    },
    '3': {
      _id: '3',
      name: 'Pool Bar & Grill',
      description: 'Poolside casual dining with American favorites. Enjoy burgers, salads, and refreshing drinks by the pool.',
      hotel_name: 'Mountain Lodge',
      hotel_id: 'hotel3',
      cuisine_type: 'American',
      seating_capacity: 30,
      phone: '5551234569',
      email: 'poolbar@lodge.com',
      location: 'Pool Area',
      operating_hours: {
        open: '11:00',
        close: '20:00'
      },
      average_price: 1200,
      rating: 4.1,
      total_reviews: 67,
      menu_categories: ['Appetizers', 'Burgers', 'Beverages', 'Salads'],
      features: ['outdoor_seating', 'bar', 'takeaway', 'wifi'],
      status: 'Maintenance',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
      ],
      created_at: '2024-03-10T09:45:00Z',
      updated_at: '2024-11-18T12:30:00Z'
    }
  };

  const featureLabels = {
    'outdoor_seating': 'Outdoor Seating',
    'bar': 'Bar & Lounge',
    'live_music': 'Live Music',
    'private_dining': 'Private Dining',
    'buffet': 'Buffet Service',
    'room_service': 'Room Service',
    'delivery': 'Delivery Available',
    'takeaway': 'Takeaway',
    'wifi': 'Free WiFi',
    'parking': 'Valet Parking'
  };

  const featureIcons = {
    'outdoor_seating': Utensils,
    'bar': Wine,
    'live_music': Star,
    'private_dining': Users,
    'buffet': Sandwich,
    'room_service': Coffee,
    'delivery': Utensils,
    'takeaway': Sandwich,
    'wifi': Star,
    'parking': MapPin
  };

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const restaurantData = mockRestaurantData[id];
      if (restaurantData) {
        setRestaurant(restaurantData);
      } else {
        toast.error('Restaurant not found');
        navigate('/owner/restaurants');
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
      toast.error('Failed to load restaurant data');
      navigate('/owner/restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Restaurant deleted successfully');
      navigate('/owner/restaurants');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error('Failed to delete restaurant');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'Inactive': { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      'Maintenance': { icon: AlertTriangle, bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' }
    };

    const config = statusConfig[status] || statusConfig['Inactive'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
          <p className="text-gray-600 mb-4">The restaurant you're looking for doesn't exist.</p>
          <Link to="/owner/restaurants" className="text-orange-600 hover:text-orange-700">
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/owner/restaurants')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-600">{restaurant.hotel_name}</p>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            {getStatusBadge(restaurant.status)}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{restaurant.rating}</span>
              <span className="text-gray-500">({restaurant.total_reviews} reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link
            to={`/owner/restaurants/${restaurant._id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/owner/restaurants')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Restaurants
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-100 rounded-xl">
                <ChefHat className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                <p className="text-lg text-gray-600">{restaurant.hotel_name}</p>
                <div className="flex items-center gap-4 mt-2">
                  {getStatusBadge(restaurant.status)}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{restaurant.rating}</span>
                    <span className="text-gray-500">({restaurant.total_reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                to={`/owner/restaurants/${restaurant._id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={() => setDeleteModal({ open: true })}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {restaurant.images && restaurant.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurant.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`${restaurant.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
            </motion.div>

            {/* Menu Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {restaurant.menu_categories.map((category, index) => (
                  <div
                    key={index}
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center"
                  >
                    <span className="text-sm font-medium text-orange-700">{category}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {restaurant.features.map((featureId, index) => {
                  const Icon = featureIcons[featureId] || Utensils;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Icon className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {featureLabels[featureId] || featureId}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{restaurant.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{restaurant.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{restaurant.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Operating Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Operating Hours</h2>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-700 font-medium">
                    {formatTime(restaurant.operating_hours.open)} - {formatTime(restaurant.operating_hours.close)}
                  </div>
                  <div className="text-sm text-gray-500">Daily</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Capacity</span>
                  </div>
                  <span className="font-medium">{restaurant.seating_capacity} seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Avg. Price</span>
                  </div>
                  <span className="font-medium">₹{restaurant.average_price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Cuisine</span>
                  </div>
                  <span className="font-medium">{restaurant.cuisine_type}</span>
                </div>
              </div>
            </motion.div>

            {/* System Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 text-gray-700">{formatDate(restaurant.created_at)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="ml-2 text-gray-700">{formatDate(restaurant.updated_at)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Restaurant ID:</span>
                  <span className="ml-2 text-gray-700 font-mono">{restaurant._id}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        onConfirm={handleDelete}
        title="Delete Restaurant"
        message={`Are you sure you want to delete "${restaurant.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ViewRestaurant;