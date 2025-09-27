import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Building2, MapPin, Phone, Mail, Users, Bed, Star, TrendingUp,
  Calendar, DollarSign, Settings, ArrowLeft, Edit, Plus, Eye,
  CheckCircle, XCircle, AlertTriangle, Clock, UserCheck, Wrench,
  CreditCard, Wifi, Car, Waves, Dumbbell, Car as Parking,
  Coffee, Utensils, Shield, Baby, PawPrint, Cigarette,
  Globe, Facebook, Instagram, Twitter, Linkedin, Youtube,
  Home, ChevronRight, Image as ImageIcon, Trash2
} from 'lucide-react';
import hotelService from '../services/hotelService';

const HotelProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Load hotel data
  const loadHotel = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.getHotel(id);
      setHotel(response.data);
    } catch (err) {
      console.error('Load hotel error:', err);
      setError(err.message || 'Failed to load hotel details');
      toast.error('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadHotel();
    }
  }, [id]);

  // Handle hotel deletion
  const handleDeleteHotel = async () => {
    try {
      setDeleting(true);
      const loadingToast = toast.loading('Deleting hotel...');
      
      await hotelService.deleteHotel(id);
      
      toast.dismiss(loadingToast);
      toast.success('Hotel deleted successfully!');
      
      // Navigate back to hotels list
      setTimeout(() => {
        navigate('/manager/hotels');
      }, 1500);
      
    } catch (err) {
      console.error('Delete hotel error:', err);
      toast.error(err.message || 'Failed to delete hotel');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: Wifi,
      parking: Parking,
      pool: Waves,
      gym: Dumbbell,
      spa: Star,
      restaurant: Utensils,
      bar: Coffee,
      'business_center': Building2,
      'conference_rooms': Users,
      'airport_shuttle': Car,
      'pet_friendly': PawPrint,
      'laundry': Shield,
      'concierge': UserCheck,
      'air_conditioning': Star,
      'room_service': Utensils
    };
    const IconComponent = icons[amenity] || Star;
    return <IconComponent className="w-4 h-4" />;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };
    
    const badge = badges[status] || badges.active;
    const IconComponent = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <IconComponent className="w-3 h-3" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'details', label: 'Details', icon: Eye },
    { id: 'amenities', label: 'Amenities', icon: Star },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'financial', label: 'Financial', icon: CreditCard }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Hotel</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadHotel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Hotel Not Found</h3>
            <p className="text-gray-600 mb-4">The hotel you're looking for could not be found.</p>
            <button
              onClick={() => navigate('/manager/hotels')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Hotels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/manager/hotels')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
                {getStatusBadge(hotel.status)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {hotel.address?.street && `${hotel.address.street}, `}
                  {hotel.address?.city && `${hotel.address.city}, `}
                  {hotel.address?.state && `${hotel.address.state}, `}
                  {hotel.address?.country}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/manager/hotels/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Hotel
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Hero Section with Images */}
        {(hotel.banner || hotel.logo || (hotel.images && hotel.images.length > 0)) && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              {hotel.banner ? (
                <img
                  src={hotel.banner}
                  alt="Hotel Banner"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedImage(hotel.banner);
                    setShowImageModal(true);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-white" />
                </div>
              )}
              
              {hotel.logo && (
                <div className="absolute bottom-4 left-4">
                  <img
                    src={hotel.logo}
                    alt="Hotel Logo"
                    className="w-16 h-16 rounded-lg border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => {
                      setSelectedImage(hotel.logo);
                      setShowImageModal(true);
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Image Gallery */}
            {hotel.images && hotel.images.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Hotel Gallery ({hotel.images.length} images)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {hotel.images.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedImage(image.url || image);
                        setShowImageModal(true);
                      }}
                    >
                      <img
                        src={image.url || image}
                        alt={image.caption || `Hotel Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                  {hotel.images.length > 6 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 text-sm">
                      +{hotel.images.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Category</p>
                          <p className="text-lg font-semibold text-blue-900 capitalize">
                            {hotel.category || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm text-green-600 font-medium">Base Rate</p>
                          <p className="text-lg font-semibold text-green-900">
                            {formatCurrency(hotel.pricing?.baseRate, hotel.pricing?.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Amenities</p>
                          <p className="text-lg font-semibold text-purple-900">
                            {hotel.amenities?.length || 0} Available
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-sm text-orange-600 font-medium">Created</p>
                          <p className="text-lg font-semibold text-orange-900">
                            {formatDate(hotel.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {hotel.description && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.contact?.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{hotel.contact.phone}</span>
                        </div>
                      )}
                      {hotel.contact?.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{hotel.contact.email}</span>
                        </div>
                      )}
                      {hotel.contact?.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a
                            href={hotel.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {hotel.contact.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Location Details */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotel.address?.street && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Street Address</label>
                          <p className="text-gray-900">{hotel.address.street}</p>
                        </div>
                      )}
                      {hotel.address?.city && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">City</label>
                          <p className="text-gray-900">{hotel.address.city}</p>
                        </div>
                      )}
                      {hotel.address?.state && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">State/Province</label>
                          <p className="text-gray-900">{hotel.address.state}</p>
                        </div>
                      )}
                      {hotel.address?.country && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Country</label>
                          <p className="text-gray-900">{hotel.address.country}</p>
                        </div>
                      )}
                      {hotel.address?.zipCode && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">ZIP/Postal Code</label>
                          <p className="text-gray-900">{hotel.address.zipCode}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Media */}
                  {(hotel.socialMedia?.facebook || hotel.socialMedia?.instagram || hotel.socialMedia?.twitter || hotel.socialMedia?.linkedin || hotel.socialMedia?.youtube) && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                      <div className="flex flex-wrap gap-3">
                        {hotel.socialMedia.facebook && (
                          <a
                            href={hotel.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Facebook className="w-4 h-4" />
                            Facebook
                          </a>
                        )}
                        {hotel.socialMedia.instagram && (
                          <a
                            href={hotel.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                          >
                            <Instagram className="w-4 h-4" />
                            Instagram
                          </a>
                        )}
                        {hotel.socialMedia.twitter && (
                          <a
                            href={hotel.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                            Twitter
                          </a>
                        )}
                        {hotel.socialMedia.linkedin && (
                          <a
                            href={hotel.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                        {hotel.socialMedia.youtube && (
                          <a
                            href={hotel.socialMedia.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Youtube className="w-4 h-4" />
                            YouTube
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'amenities' && (
                <motion.div
                  key="amenities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Amenities */}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Hotel Amenities
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {hotel.amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                          >
                            {getAmenityIcon(amenity)}
                            <span className="text-gray-700 capitalize">
                              {amenity.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Facilities */}
                  {hotel.facilities && hotel.facilities.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Hotel Facilities
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {hotel.facilities.map((facility, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                          >
                            {getAmenityIcon(facility)}
                            <span className="text-gray-700 capitalize">
                              {facility.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'policies' && (
                <motion.div
                  key="policies"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Check-in/Check-out */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Check-in / Check-out
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Check-in Time</label>
                        <p className="text-gray-900 text-lg">
                          {hotel.policies?.checkIn || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Check-out Time</label>
                        <p className="text-gray-900 text-lg">
                          {hotel.policies?.checkOut || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Policies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pet Policy */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <PawPrint className="w-5 h-5" />
                        Pet Policy
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {hotel.policies?.pets?.allowed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-gray-700">
                            {hotel.policies?.pets?.allowed ? 'Pets Allowed' : 'No Pets Allowed'}
                          </span>
                        </div>
                        {hotel.policies?.pets?.allowed && hotel.policies?.pets?.fee > 0 && (
                          <p className="text-gray-600 text-sm">
                            Pet fee: {formatCurrency(hotel.policies.pets.fee, hotel.pricing?.currency)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Smoking Policy */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Cigarette className="w-5 h-5" />
                        Smoking Policy
                      </h4>
                      <div className="flex items-center gap-2">
                        {hotel.policies?.smoking ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-gray-700">
                          {hotel.policies?.smoking ? 'Smoking Allowed' : 'Non-Smoking Property'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Policies */}
                  {(hotel.policies?.cancellation || hotel.policies?.children || hotel.policies?.payment) && (
                    <div className="space-y-4">
                      {hotel.policies.cancellation && (
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Cancellation Policy</h4>
                          <p className="text-gray-700">{hotel.policies.cancellation}</p>
                        </div>
                      )}
                      
                      {hotel.policies.children && (
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Baby className="w-5 h-5" />
                            Children Policy
                          </h4>
                          <p className="text-gray-700">{hotel.policies.children}</p>
                        </div>
                      )}
                      
                      {hotel.policies.payment && (
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Payment Policy
                          </h4>
                          <p className="text-gray-700">{hotel.policies.payment}</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'financial' && (
                <motion.div
                  key="financial"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Pricing Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Pricing Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Base Rate</label>
                        <p className="text-gray-900 text-lg font-semibold">
                          {formatCurrency(hotel.pricing?.baseRate, hotel.pricing?.currency)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tax Rate</label>
                        <p className="text-gray-900 text-lg font-semibold">
                          {hotel.pricing?.taxRate || 0}%
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Service Charge</label>
                        <p className="text-gray-900 text-lg font-semibold">
                          {hotel.pricing?.serviceCharge || 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  {(hotel.bankDetails?.accountName || hotel.bankDetails?.accountNumber || hotel.bankDetails?.bankName) && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Bank Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hotel.bankDetails.accountName && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Account Name</label>
                            <p className="text-gray-900">{hotel.bankDetails.accountName}</p>
                          </div>
                        )}
                        {hotel.bankDetails.accountNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Account Number</label>
                            <p className="text-gray-900 font-mono">
                              ****{hotel.bankDetails.accountNumber.slice(-4)}
                            </p>
                          </div>
                        )}
                        {hotel.bankDetails.bankName && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Bank Name</label>
                            <p className="text-gray-900">{hotel.bankDetails.bankName}</p>
                          </div>
                        )}
                        {hotel.bankDetails.ifscCode && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                            <p className="text-gray-900 font-mono">{hotel.bankDetails.ifscCode}</p>
                          </div>
                        )}
                        {hotel.bankDetails.swiftCode && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">SWIFT Code</label>
                            <p className="text-gray-900 font-mono">{hotel.bankDetails.swiftCode}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Legal Information */}
                  {(hotel.legalInformation?.businessLicense || hotel.legalInformation?.taxNumber || hotel.legalInformation?.gstNumber) && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Legal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hotel.legalInformation.businessLicense && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Business License</label>
                            <p className="text-gray-900 font-mono">{hotel.legalInformation.businessLicense}</p>
                          </div>
                        )}
                        {hotel.legalInformation.taxNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Tax Number</label>
                            <p className="text-gray-900 font-mono">{hotel.legalInformation.taxNumber}</p>
                          </div>
                        )}
                        {hotel.legalInformation.gstNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">GST Number</label>
                            <p className="text-gray-900 font-mono">{hotel.legalInformation.gstNumber}</p>
                          </div>
                        )}
                        {hotel.legalInformation.panNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">PAN Number</label>
                            <p className="text-gray-900 font-mono">{hotel.legalInformation.panNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Hotel</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{hotel.name}"? This action cannot be undone and will permanently remove all hotel data and images.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHotel}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Hotel
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl max-h-full"
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Hotel Image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HotelProfile;