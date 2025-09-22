import React from 'react';
import { X, MapPin, Phone, Mail, Star, Calendar, Users, DollarSign } from 'lucide-react';

const HotelViewModal = ({ hotel, isOpen, onClose }) => {
  if (!isOpen || !hotel) return null;

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Hotel Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Hotel Header Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-yellow-500 text-xl">
                  {getRatingStars(hotel.rating)}
                </div>
                <span className="text-gray-600">({hotel.rating}/5)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{hotel.address.street}, {hotel.address.city}, {hotel.address.state} {hotel.address.zip}</span>
              </div>
              <div className="text-gray-600">{hotel.address.country}</div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-right">
                <span className={getStatusBadge(hotel.status)}>
                  {hotel.status}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Hotel ID</div>
                <div className="text-xl font-semibold text-gray-900">#{hotel.id}</div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Rooms</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{hotel.rooms}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Price Range</span>
              </div>
              <div className="text-lg font-bold text-green-900">{hotel.priceRange}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Rating</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{hotel.rating}/5</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-purple-600 font-medium">Created</span>
              </div>
              <div className="text-sm font-bold text-purple-900">
                {new Date(hotel.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              {/* Owner Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Owner Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xl font-medium text-gray-900">{hotel.owner}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{hotel.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{hotel.contact.email}</span>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Full Address</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-1 text-gray-900">
                    <div>{hotel.address.street}</div>
                    <div>{hotel.address.city}, {hotel.address.state} {hotel.address.zip}</div>
                    <div>{hotel.address.country}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Amenities */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Created Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(hotel.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(hotel.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Rooms:</span>
                    <span className="font-medium text-gray-900">{hotel.rooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Star Rating:</span>
                    <span className="font-medium text-gray-900">{hotel.rating} Star{hotel.rating > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amenities:</span>
                    <span className="font-medium text-gray-900">{hotel.amenities.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.location.href = `/admin/hotels/edit/${hotel.id}`}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            Edit Hotel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelViewModal;