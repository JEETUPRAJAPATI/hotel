import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Save, 
  ArrowLeft, 
  Upload, 
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  DollarSign,
  Star,
  Utensils,
  Coffee,
  Wine,
  Sandwich
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditRestaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hotel_id: '',
    cuisine_type: '',
    seating_capacity: '',
    phone: '',
    email: '',
    location: '',
    operating_hours: {
      open: '09:00',
      close: '22:00'
    },
    average_price: '',
    menu_categories: [],
    features: [],
    status: 'Active'
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock data - replace with actual API call
  const mockRestaurantData = {
    '1': {
      name: 'Ocean Breeze Restaurant',
      description: 'Fine dining with ocean views and Mediterranean cuisine',
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
      menu_categories: ['Appetizers', 'Main Course', 'Desserts', 'Wine List'],
      features: ['outdoor_seating', 'bar', 'live_music', 'private_dining', 'wifi'],
      status: 'Active',
      images: []
    },
    '2': {
      name: 'Rooftop Café',
      description: 'Casual dining with city views',
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
      menu_categories: ['Breakfast', 'Beverages', 'Snacks', 'Desserts'],
      features: ['outdoor_seating', 'wifi', 'takeaway', 'delivery'],
      status: 'Active',
      images: []
    },
    '3': {
      name: 'Pool Bar & Grill',
      description: 'Poolside casual dining',
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
      menu_categories: ['Appetizers', 'Burgers', 'Beverages', 'Salads'],
      features: ['outdoor_seating', 'bar', 'takeaway', 'wifi'],
      status: 'Maintenance',
      images: []
    }
  };

  // Mock hotels data for the dropdown
  const mockHotels = [
    { _id: 'hotel1', name: 'Grand Palace Hotel' },
    { _id: 'hotel2', name: 'Ocean View Resort' },
    { _id: 'hotel3', name: 'Mountain Lodge' },
    { _id: 'hotel4', name: 'City Center Hotel' },
    { _id: 'hotel5', name: 'Beachside Villa' }
  ];

  const cuisineTypes = [
    'American', 'Mediterranean', 'Asian', 'Italian', 'French', 
    'Indian', 'Mexican', 'Japanese', 'Chinese', 'Thai', 
    'International', 'Fusion', 'Continental', 'Local'
  ];

  const featureOptions = [
    { id: 'outdoor_seating', label: 'Outdoor Seating', icon: Utensils },
    { id: 'bar', label: 'Bar & Lounge', icon: Wine },
    { id: 'live_music', label: 'Live Music', icon: Star },
    { id: 'private_dining', label: 'Private Dining', icon: Users },
    { id: 'buffet', label: 'Buffet Service', icon: Sandwich },
    { id: 'room_service', label: 'Room Service', icon: Coffee },
    { id: 'delivery', label: 'Delivery Available', icon: Utensils },
    { id: 'takeaway', label: 'Takeaway', icon: Sandwich },
    { id: 'wifi', label: 'Free WiFi', icon: Star },
    { id: 'parking', label: 'Valet Parking', icon: MapPin }
  ];

  const menuCategoryOptions = [
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 
    'Soups', 'Salads', 'Pasta', 'Seafood', 'Vegetarian', 
    'Kids Menu', 'Specials', 'Wine List', 'Breakfast', 'Burgers', 'Snacks'
  ];

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
        setFormData({
          ...restaurantData,
          seating_capacity: restaurantData.seating_capacity.toString(),
          average_price: restaurantData.average_price.toString()
        });
        setExistingImages(restaurantData.images || []);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleMenuCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      menu_categories: prev.menu_categories.includes(category)
        ? prev.menu_categories.filter(cat => cat !== category)
        : [...prev.menu_categories, category]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }
    if (!formData.hotel_id) {
      newErrors.hotel_id = 'Hotel selection is required';
    }
    if (!formData.cuisine_type) {
      newErrors.cuisine_type = 'Cuisine type is required';
    }
    if (!formData.seating_capacity || formData.seating_capacity < 1) {
      newErrors.seating_capacity = 'Valid seating capacity is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.average_price || formData.average_price < 0) {
      newErrors.average_price = 'Valid average price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSaving(true);

      const restaurantData = {
        ...formData,
        seating_capacity: parseInt(formData.seating_capacity),
        average_price: parseFloat(formData.average_price),
        images: images,
        existing_images: existingImages
      };

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Restaurant updated successfully!');
      navigate('/owner/restaurants');
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Failed to update restaurant');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Restaurant</h1>
            <p className="text-gray-600">Update restaurant information</p>
          </div>
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
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Restaurants
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ChefHat className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Restaurant</h1>
              <p className="text-gray-600">Update restaurant information</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter restaurant name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Hotel *
                </label>
                <select
                  name="hotel_id"
                  value={formData.hotel_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.hotel_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a hotel</option>
                  {mockHotels.map(hotel => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
                {errors.hotel_id && <p className="text-red-500 text-sm mt-1">{errors.hotel_id}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe your restaurant..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type *
                </label>
                <select
                  name="cuisine_type"
                  value={formData.cuisine_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.cuisine_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select cuisine type</option>
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
                {errors.cuisine_type && <p className="text-red-500 text-sm mt-1">{errors.cuisine_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.seating_capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Number of seats"
                />
                {errors.seating_capacity && <p className="text-red-500 text-sm mt-1">{errors.seating_capacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Phone number"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Email address"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Ground Floor, Main Building"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Operating Hours & Pricing</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    name="operating_hours.open"
                    value={formData.operating_hours.open}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    name="operating_hours.close"
                    value={formData.operating_hours.close}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Price (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="average_price"
                    value={formData.average_price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.average_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Average price per person"
                  />
                </div>
                {errors.average_price && <p className="text-red-500 text-sm mt-1">{errors.average_price}</p>}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {featureOptions.map(feature => {
                  const Icon = feature.icon;
                  const isSelected = formData.features.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-xs font-medium">{feature.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Categories */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {menuCategoryOptions.map(category => {
                  const isSelected = formData.menu_categories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleMenuCategoryToggle(category)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Images</h2>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Current ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600">Click to upload new images</span>
                  <span className="text-sm text-gray-400">PNG, JPG up to 5MB</span>
                </label>
              </div>
              
              {/* New Images Preview */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Images</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/owner/restaurants')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Update Restaurant
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-lg shadow-sm">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/owner/restaurants')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Restaurant
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant;