import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  User,
  DollarSign,
  Image as ImageIcon,
  Camera,
  Globe,
  Building,
  Tag
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    average_cost_min: '',
    average_cost_max: '',
    tags: [],
    operating_type: 'All',
    status: 'Active',
    // Location
    address: '',
    country: 'India',
    state: '',
    city: '',
    zip_code: '',
    // Contact Person
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    contact_role: 'Manager'
  });
  
  const [images, setImages] = useState({
    logo: null,
    cover: null,
    gallery: []
  });
  
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Fine Dining',
    'Cafe',
    'Bar',
    'Multi-Cuisine',
    'Bakery',
    'Veg Only'
  ];

  const cuisineTags = [
    'Chinese', 'Indian', 'South Indian', 'Continental', 'Italian', 'Mexican',
    'Thai', 'Japanese', 'Mediterranean', 'American', 'French', 'Korean',
    'Vietnamese', 'Lebanese', 'Greek', 'Spanish', 'Turkish'
  ];

  const operatingTypes = [
    { value: 'Dine-In', label: 'Dine-In' },
    { value: 'Takeaway', label: 'Takeaway' },
    { value: 'Room Service', label: 'Room Service' },
    { value: 'All', label: 'All' }
  ];

  const contactRoles = [
    'Manager',
    'Owner',
    'Supervisor'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageUpload = (type, files) => {
    if (type === 'gallery') {
      const newImages = Array.from(files).slice(0, 10 - images.gallery.length);
      setImages(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages]
      }));
    } else {
      setImages(prev => ({
        ...prev,
        [type]: files[0]
      }));
    }
  };

  const removeImage = (type, index = null) => {
    if (type === 'gallery' && index !== null) {
      setImages(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index)
      }));
    } else {
      setImages(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Restaurant Information
    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.average_cost_min || formData.average_cost_min < 0) {
      newErrors.average_cost_min = 'Valid minimum price is required';
    }
    if (!formData.average_cost_max || formData.average_cost_max < 0) {
      newErrors.average_cost_max = 'Valid maximum price is required';
    }
    if (formData.average_cost_min && formData.average_cost_max && 
        parseFloat(formData.average_cost_min) > parseFloat(formData.average_cost_max)) {
      newErrors.average_cost_max = 'Maximum price should be greater than minimum price';
    }

    // Location
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Contact Person
    if (!formData.contact_name.trim()) {
      newErrors.contact_name = 'Contact name is required';
    }
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Contact phone is required';
    }
    if (!formData.contact_email.trim() || !/^\S+@\S+\.\S+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Valid contact email is required';
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
        average_cost_min: parseFloat(formData.average_cost_min),
        average_cost_max: parseFloat(formData.average_cost_max),
        images: images
      };

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Restaurant created successfully!');
      navigate('/owner/restaurants');
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error('Failed to create restaurant');
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Add New Restaurant</h1>
            <p className="text-gray-600">Create a new restaurant with all details</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Restaurant Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ChefHat className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Restaurant Information</h2>
              </div>

              <div className="space-y-6">
                {/* Restaurant Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter restaurant name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Average Cost for Two */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Cost for Two *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="average_cost_min"
                          value={formData.average_cost_min}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.average_cost_min ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Min price"
                        />
                      </div>
                      {errors.average_cost_min && <p className="text-red-500 text-sm mt-1">{errors.average_cost_min}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="average_cost_max"
                          value={formData.average_cost_max}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.average_cost_max ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Max price"
                        />
                      </div>
                      {errors.average_cost_max && <p className="text-red-500 text-sm mt-1">{errors.average_cost_max}</p>}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Describe your restaurant, amenities, and unique features..."
                  />
                </div>

                {/* Tags (Cuisine Types) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cuisine Tags
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {cuisineTags.map(tag => {
                      const isSelected = formData.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                              : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Operating Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Operating Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {operatingTypes.map(type => (
                      <label
                        key={type.value}
                        className={`relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.operating_type === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="operating_type"
                          value={type.value}
                          checked={formData.operating_type === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 2: Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.country ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter country"
                      />
                    </div>
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter state"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter city"
                      />
                    </div>
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter zip code"
                    />
                  </div>
                </div>

                {/* Google Map Preview Placeholder */}
                <div className="h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Map preview will appear here</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 3: Contact Person */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contact Person</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="contact_name"
                        value={formData.contact_name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.contact_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter contact person name"
                      />
                    </div>
                    {errors.contact_name && <p className="text-red-500 text-sm mt-1">{errors.contact_name}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      name="contact_role"
                      value={formData.contact_role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {contactRoles.map(role => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.contact_phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.contact_email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-8">
            {/* Section 4: Restaurant Images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Restaurant Images</h2>
              </div>

              <div className="space-y-8">
                {/* Restaurant Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Restaurant Logo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('logo', e.target.files)}
                      className="hidden"
                      id="logo-upload"
                    />
                    {images.logo ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <img
                          src={URL.createObjectURL(images.logo)}
                          alt="Logo preview"
                          className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('logo')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="logo-upload"
                        className="flex flex-col items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 text-center">Upload Logo<br/>Square format</span>
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Max 5MB. Square format recommended.</p>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cover Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('cover', e.target.files)}
                      className="hidden"
                      id="cover-upload"
                    />
                    {images.cover ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(images.cover)}
                          alt="Cover preview"
                          className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('cover')}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="cover-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 text-center">Upload Cover Image<br/>Recommended 1200×400</span>
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Max 5MB. Wide format (3:1 ratio) recommended for best display.</p>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gallery Images (Optional)
                  </label>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload('gallery', e.target.files)}
                        className="hidden"
                        id="gallery-upload"
                        disabled={images.gallery.length >= 10}
                      />
                      {images.gallery.length < 10 && (
                        <label
                          htmlFor="gallery-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
                        >
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 text-center">
                            Add Gallery Images<br/>
                            {images.gallery.length}/10 images
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Gallery Preview */}
                    {images.gallery.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {images.gallery.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage('gallery', index)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, WebP accepted. Max 5MB each. Upload up to 10 images.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-lg shadow-sm">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/owner/restaurants')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Restaurant
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurant;