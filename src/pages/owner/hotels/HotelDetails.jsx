import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiGlobe,
  FiStar,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiCamera
} from 'react-icons/fi';
import ownerService from '../../../services/owner/ownerService';
import LoadingSpinner from '../../../components/LoadingSpinner';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHotel();
    }
  }, [id]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await ownerService.hotels.getHotelById(id);
      setHotel(response.data.data);
    } catch (error) {
      console.error('Error fetching hotel:', error);
      // Mock data for demonstration
      setHotel({
        _id: id,
        name: 'Grand Plaza Hotel',
        description: 'A luxury hotel in the heart of the city with modern amenities and exceptional service.',
        address: '123 Broadway Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
        phone: '+1-234-567-8900',
        email: 'info@grandplaza.com',
        website: 'https://grandplaza.com',
        starRating: 5,
        totalRooms: 120,
        pricing: {
          basePrice: 250,
          currency: 'USD'
        },
        amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service'],
        policies: {
          checkIn: '15:00',
          checkOut: '11:00',
          cancellation: 'Free cancellation up to 24 hours before check-in',
          petPolicy: true,
          smokingPolicy: false
        },
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        status: 'active',
        createdAt: '2025-01-15T10:00:00Z'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Hotel not found</h2>
        <p className="text-gray-600 mt-2">The hotel you're looking for doesn't exist.</p>
        <Link
          to="/owner/hotels"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/owner/hotels')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
            <p className="text-gray-600">Hotel details and information</p>
          </div>
        </div>
        <Link
          to={`/owner/hotels/${hotel._id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiEdit className="mr-2 h-4 w-4" />
          Edit Hotel
        </Link>
      </div>

      {/* Hotel Images */}
      {hotel.images && hotel.images.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {hotel.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`${hotel.name} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <FiCamera className="h-6 w-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                <p className="text-gray-900">{hotel.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-4 w-4 ${
                        i < hotel.starRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{hotel.starRating} star{hotel.starRating !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{hotel.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
                <p className="text-gray-900 flex items-center">
                  <FiUsers className="mr-1 h-4 w-4 text-gray-400" />
                  {hotel.totalRooms} rooms
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                <p className="text-gray-900 flex items-center">
                  <FiDollarSign className="mr-1 h-4 w-4 text-gray-400" />
                  {hotel.pricing.currency} {hotel.pricing.basePrice}/night
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900 flex items-start">
                  <FiMapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
                  {hotel.address}, {hotel.city}, {hotel.state} {hotel.zipCode}, {hotel.country}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotel.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Policies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                <p className="text-gray-900 flex items-center">
                  <FiCalendar className="mr-1 h-4 w-4 text-gray-400" />
                  {hotel.policies.checkIn}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                <p className="text-gray-900 flex items-center">
                  <FiCalendar className="mr-1 h-4 w-4 text-gray-400" />
                  {hotel.policies.checkOut}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
                <p className="text-gray-900">{hotel.policies.cancellation}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet Policy</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hotel.policies.petPolicy 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hotel.policies.petPolicy ? 'Pet Friendly' : 'No Pets Allowed'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Policy</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hotel.policies.smokingPolicy 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {hotel.policies.smokingPolicy ? 'Smoking Allowed' : 'Non-Smoking'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FiPhone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${hotel.phone}`} className="text-blue-600 hover:text-blue-700">
                  {hotel.phone}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <FiMail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${hotel.email}`} className="text-blue-600 hover:text-blue-700">
                  {hotel.email}
                </a>
              </div>
              
              {hotel.website && (
                <div className="flex items-center space-x-3">
                  <FiGlobe className="h-4 w-4 text-gray-400" />
                  <a 
                    href={hotel.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Status</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hotel.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {hotel.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <p className="text-gray-900">{new Date(hotel.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-2">
              <Link
                to={`/owner/hotels/${hotel._id}/edit`}
                className="w-full flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiEdit className="mr-2 h-4 w-4" />
                Edit Hotel
              </Link>
              
              <button className="w-full flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <FiDollarSign className="mr-2 h-4 w-4" />
                Update Pricing
              </button>
              
              <button className="w-full flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <FiUsers className="mr-2 h-4 w-4" />
                View Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;