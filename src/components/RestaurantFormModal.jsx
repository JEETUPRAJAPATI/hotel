import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { createRestaurant, updateRestaurant, validateRestaurantData } from '../services/restaurantManagementService';
import ImageUpload from './ImageUpload';
import ImageUploadSimple from './ImageUploadSimple';

const RestaurantFormModal = ({ isOpen, onClose, onSuccess, restaurant = null, title }) => {
  const isEditing = !!restaurant;
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    cuisine_types: [],
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    open_time: '',
    close_time: '',
    is_24x7: false,
    status: 'active',
    featured_image: '',
    gallery_images: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cuisineInput, setCuisineInput] = useState('');

  // Debug effect to track formData changes
  useEffect(() => {
    console.log('RestaurantForm: formData changed', {
      featured_image: formData.featured_image,
      gallery_images: formData.gallery_images
    });
  }, [formData.featured_image, formData.gallery_images]);

  // Popular cuisine types for suggestions
  const popularCuisines = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'American',
    'Continental', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Arabic',
    'Multi-Cuisine', 'Fast Food', 'Vegetarian', 'Vegan', 'Seafood', 'BBQ'
  ];

  // Initialize form data when restaurant prop changes
  useEffect(() => {
    if (restaurant && isEditing) {
      setFormData({
        name: restaurant.name || '',
        code: restaurant.code || '',
        cuisine_types: restaurant.cuisine_types || [],
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        address: restaurant.address || '',
        city: restaurant.city || '',
        state: restaurant.state || '',
        country: restaurant.country || '',
        pincode: restaurant.pincode || '',
        open_time: restaurant.open_time || '',
        close_time: restaurant.close_time || '',
        is_24x7: restaurant.is_24x7 || false,
        status: restaurant.status || 'active',
        featured_image: restaurant.featured_image || '',
        gallery_images: restaurant.gallery_images || []
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        code: '',
        cuisine_types: [],
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        open_time: '',
        close_time: '',
        is_24x7: false,
        status: 'active',
        featured_image: '',
        gallery_images: []
      });
    }
    setErrors({});
  }, [restaurant, isEditing, isOpen]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'code') {
      // Auto-convert to uppercase for code
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle cuisine type management
  const addCuisineType = (cuisine) => {
    const trimmedCuisine = cuisine.trim();
    if (trimmedCuisine && !formData.cuisine_types.includes(trimmedCuisine)) {
      setFormData(prev => ({
        ...prev,
        cuisine_types: [...prev.cuisine_types, trimmedCuisine]
      }));
      setCuisineInput('');
    }
  };

  const removeCuisineType = (cuisine) => {
    setFormData(prev => ({
      ...prev,
      cuisine_types: prev.cuisine_types.filter(type => type !== cuisine)
    }));
  };

  const handleCuisineInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCuisineType(cuisineInput);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateRestaurantData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      
      const response = isEditing 
        ? await updateRestaurant(restaurant._id, formData)
        : await createRestaurant(formData);

      if (response.data.success) {
        toast.success(response.data.message);
        onSuccess(); // Refresh the list
        onClose(); // Close modal
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
        `Failed to ${isEditing ? 'update' : 'create'} restaurant`;
      toast.error(errorMessage);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                Basic Information
              </h3>
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter restaurant name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Restaurant Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="AUTO-GENERATED"
                pattern="[A-Z0-9-]*"
              />
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Uppercase letters, numbers, and hyphens only
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1234567890"
                pattern="[0-9]{6,15}"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="restaurant@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Cuisine Types */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Types
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cuisineInput}
                    onChange={(e) => setCuisineInput(e.target.value)}
                    onKeyPress={handleCuisineInputKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type cuisine type and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => addCuisineType(cuisineInput)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {/* Popular cuisine suggestions */}
                <div className="flex flex-wrap gap-2">
                  {popularCuisines
                    .filter(cuisine => !formData.cuisine_types.includes(cuisine))
                    .slice(0, 10)
                    .map(cuisine => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => addCuisineType(cuisine)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      + {cuisine}
                    </button>
                  ))}
                </div>
                
                {/* Selected cuisines */}
                {formData.cuisine_types.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.cuisine_types.map(cuisine => (
                      <span
                        key={cuisine}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {cuisine}
                        <button
                          type="button"
                          onClick={() => removeCuisineType(cuisine)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2 mt-6">
                Location Information
              </h3>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full address"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter state"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter country"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode/ZIP
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pincode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123456"
                pattern="[0-9]{5,10}"
              />
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>

            {/* Operating Hours */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2 mt-6">
                Operating Hours
              </h3>
            </div>

            {/* 24x7 Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_24x7"
                  checked={formData.is_24x7}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Restaurant operates 24/7
                </span>
              </label>
            </div>

            {/* Opening Time */}
            {!formData.is_24x7 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Time *
                  </label>
                  <input
                    type="time"
                    name="open_time"
                    value={formData.open_time}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.open_time ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.open_time && <p className="mt-1 text-sm text-red-600">{errors.open_time}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closing Time *
                  </label>
                  <input
                    type="time"
                    name="close_time"
                    value={formData.close_time}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.close_time ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.close_time && <p className="mt-1 text-sm text-red-600">{errors.close_time}</p>}
                </div>
              </>
            )}

            {/* Images Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2 mt-6">
                Images
              </h3>
            </div>

            {/* Featured Image */}
            <div className="md:col-span-2">
              <ImageUploadSimple
                value={formData.featured_image}
                onChange={(image) => {
                  console.log('RestaurantForm: featured image changed to', image);
                  setFormData(prev => ({ ...prev, featured_image: image }));
                }}
                multiple={false}
                maxImages={1}
                label="Featured Image"
                className="mb-6"
              />
            </div>

            {/* Gallery Images */}
            <div className="md:col-span-2">
              <ImageUploadSimple
                value={formData.gallery_images}
                onChange={(images) => {
                  console.log('RestaurantForm: gallery images changed to', images);
                  setFormData(prev => ({ ...prev, gallery_images: images }));
                }}
                multiple={true}
                maxImages={10}
                label="Gallery Images"
                className="mb-6"
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2 mt-6">
                Settings
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEditing ? 'Update Restaurant' : 'Create Restaurant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFormModal;