import React from 'react';
import { X, MapPin, Clock, Phone, Mail, Calendar, User, Tag, Info } from 'lucide-react';
import { formatRestaurantData } from '../services/restaurantManagementService';

const RestaurantViewModal = ({ isOpen, onClose, restaurant }) => {
  if (!isOpen || !restaurant) return null;

  const formattedRestaurant = formatRestaurantData(restaurant);

  const InfoRow = ({ icon: Icon, label, value, valueClass = '' }) => {
    if (!value || value === '-' || value === 'Not Specified') return null;
    
    return (
      <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
        <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-500">{label}</div>
          <div className={`text-sm font-medium text-gray-900 ${valueClass}`}>
            {value}
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      status === 'active'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {formattedRestaurant.name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge status={formattedRestaurant.status} />
                {formattedRestaurant.code && (
                  <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                    {formattedRestaurant.code}
                  </span>
                )}
                {formattedRestaurant.is_24x7 && (
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    24/7 Open
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Image Gallery */}
          {(formattedRestaurant.featured_image || (formattedRestaurant.gallery_images && formattedRestaurant.gallery_images.length > 0)) && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                Images
              </h3>
              
              {/* Featured Image */}
              {formattedRestaurant.featured_image && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Featured Image</h4>
                  <div className="aspect-video max-w-md rounded-lg overflow-hidden border">
                    <img
                      src={formattedRestaurant.featured_image}
                      alt={`${formattedRestaurant.name} - Featured`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center bg-gray-100 text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery Images */}
              {formattedRestaurant.gallery_images && formattedRestaurant.gallery_images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Gallery ({formattedRestaurant.gallery_images.length} images)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formattedRestaurant.gallery_images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={image}
                          alt={`${formattedRestaurant.name} - Gallery ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            // Create a modal for enlarged view
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[60]';
                            modal.innerHTML = `
                              <div class="relative max-w-full max-h-full">
                                <img src="${image}" alt="${formattedRestaurant.name}" class="max-w-full max-h-full rounded-lg" />
                                <button class="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              </div>
                            `;
                            modal.addEventListener('click', (e) => {
                              if (e.target === modal || e.target.closest('button')) {
                                document.body.removeChild(modal);
                              }
                            });
                            document.body.appendChild(modal);
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full hidden items-center justify-center bg-gray-100 text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Basic Information */}
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                Basic Information
              </h3>
              
              <InfoRow
                icon={Tag}
                label="Restaurant Name"
                value={formattedRestaurant.name}
              />
              
              <InfoRow
                icon={Info}
                label="Restaurant Code"
                value={formattedRestaurant.code || 'Not Set'}
                valueClass="font-mono"
              />
              
              <InfoRow
                icon={Tag}
                label="Cuisine Types"
                value={formattedRestaurant.cuisineTypesDisplay}
              />
              
              <InfoRow
                icon={Clock}
                label="Operating Hours"
                value={formattedRestaurant.displayHours}
                valueClass={formattedRestaurant.is_24x7 ? 'text-purple-600 font-semibold' : ''}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                Contact Information
              </h3>
              
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={formattedRestaurant.phone || 'Not Provided'}
              />
              
              <InfoRow
                icon={Mail}
                label="Email Address"
                value={formattedRestaurant.email || 'Not Provided'}
              />
              
              <InfoRow
                icon={MapPin}
                label="Full Address"
                value={formattedRestaurant.fullAddress || 'Not Provided'}
              />
            </div>

            {/* Location Details */}
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                Location Details
              </h3>
              
              <InfoRow
                icon={MapPin}
                label="Street Address"
                value={formattedRestaurant.address || 'Not Provided'}
              />
              
              <InfoRow
                icon={MapPin}
                label="City"
                value={formattedRestaurant.city || 'Not Provided'}
              />
              
              <InfoRow
                icon={MapPin}
                label="State/Province"
                value={formattedRestaurant.state || 'Not Provided'}
              />
              
              <InfoRow
                icon={MapPin}
                label="Country"
                value={formattedRestaurant.country || 'Not Provided'}
              />
              
              <InfoRow
                icon={MapPin}
                label="Pincode/ZIP"
                value={formattedRestaurant.pincode || 'Not Provided'}
                valueClass="font-mono"
              />
            </div>

            {/* System Information */}
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                System Information
              </h3>
              
              <InfoRow
                icon={Info}
                label="Status"
                value={<StatusBadge status={formattedRestaurant.status} />}
              />
              
              <InfoRow
                icon={User}
                label="Hotel"
                value={formattedRestaurant.hotel_id?.name || 'N/A'}
              />
              
              <InfoRow
                icon={Calendar}
                label="Created At"
                value={formatDate(formattedRestaurant.createdAt)}
              />
              
              <InfoRow
                icon={Calendar}
                label="Last Updated"
                value={formatDate(formattedRestaurant.updatedAt)}
              />
            </div>
          </div>

          {/* Operating Hours Breakdown */}
          {!formattedRestaurant.is_24x7 && formattedRestaurant.open_time && formattedRestaurant.close_time && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Operating Schedule</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Opens at:</span>
                  <div className="text-blue-800 font-mono text-lg">
                    {formattedRestaurant.open_time}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Closes at:</span>
                  <div className="text-blue-800 font-mono text-lg">
                    {formattedRestaurant.close_time}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cuisine Types Display */}
          {formattedRestaurant.cuisine_types && formattedRestaurant.cuisine_types.length > 0 && (
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-3">Cuisine Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {formattedRestaurant.cuisine_types.map((cuisine, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {formattedRestaurant.is_24x7 ? '24/7' : 'Regular'}
              </div>
              <div className="text-sm text-gray-600">Hours Type</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {formattedRestaurant.cuisine_types?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Cuisine Types</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${
                formattedRestaurant.status === 'active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formattedRestaurant.status === 'active' ? 'LIVE' : 'CLOSED'}
              </div>
              <div className="text-sm text-gray-600">Current Status</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formattedRestaurant.code ? 'YES' : 'NO'}
              </div>
              <div className="text-sm text-gray-600">Has Code</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantViewModal;