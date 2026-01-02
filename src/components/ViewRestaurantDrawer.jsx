import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Users,
  DollarSign,
  Star,
  ChefHat,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2
} from 'lucide-react';

const ViewRestaurantDrawer = ({ restaurant, isOpen, onClose, onEdit, onDelete, onStatusToggle }) => {
  if (!restaurant) return null;

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle className="h-4 w-4" />
        Inactive
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ChefHat className="h-8 w-8" />
                    <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                  </div>
                  <div className="flex items-center gap-4 text-blue-100">
                    {restaurant.hotel_name && (
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span className="text-sm">{restaurant.hotel_name}</span>
                      </div>
                    )}
                    {restaurant.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{restaurant.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Restaurant Image */}
              {restaurant.image && (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Status & Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {getStatusBadge(restaurant.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onStatusToggle(restaurant)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      restaurant.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {restaurant.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => onEdit(restaurant)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(restaurant)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {restaurant.description && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-gray-900">{restaurant.description}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Seating Capacity</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{restaurant.seating_capacity} seats</span>
                    </div>
                  </div>
                  {restaurant.average_price && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Price</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">₹{restaurant.average_price}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Operating Hours
                </h3>
                {restaurant.is_24x7 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Open 24/7</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Opens at:</span>
                      <span className="font-medium text-gray-900">{restaurant.open_time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Closes at:</span>
                      <span className="font-medium text-gray-900">{restaurant.close_time}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cuisine Types */}
              {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuisine Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.cuisine_types.map((cuisine, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {restaurant.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${restaurant.phone}`} className="text-blue-600 hover:underline">
                        {restaurant.phone}
                      </a>
                    </div>
                  )}
                  {restaurant.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${restaurant.email}`} className="text-blue-600 hover:underline">
                        {restaurant.email}
                      </a>
                    </div>
                  )}
                  {restaurant.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-gray-900">{restaurant.address}</p>
                        <p className="text-gray-600 text-sm">
                          {[restaurant.city, restaurant.state, restaurant.country, restaurant.pincode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Manager Information */}
              {restaurant.manager_name && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{restaurant.manager_name}</span>
                    </div>
                    {restaurant.manager_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${restaurant.manager_phone}`} className="text-blue-600 hover:underline">
                          {restaurant.manager_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    {restaurant.has_bar ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-900">Bar Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">No Bar</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {restaurant.has_outdoor_seating ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-900">Outdoor Seating</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">No Outdoor Seating</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {restaurant.has_private_dining ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-900">Private Dining</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">No Private Dining</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {restaurant.amenities && restaurant.amenities.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {new Date(restaurant.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Last Updated: {new Date(restaurant.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => onEdit(restaurant)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Restaurant
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewRestaurantDrawer;
