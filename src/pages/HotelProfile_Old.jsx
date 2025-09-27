import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, MapPin, Phone, Mail, Users, Bed, Star, TrendingUp,
  Calendar, DollarSign, Settings, ArrowLeft, Edit, Plus, Eye,
  CheckCircle, XCircle, AlertTriangle, Clock, UserCheck, Wrench
} from 'lucide-react';
import hotelService from '../services/hotelService';
import RoomManagement from '../components/RoomManagement';

const HotelProfile = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRoomManagement, setShowRoomManagement] = useState(false);

  // Load hotel data
  const loadHotel = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getHotel(id);
      setHotel(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadHotel();
    }
  }, [id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-200 h-64 rounded-xl mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Hotel</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadHotel}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hotel Not Found</h3>
          <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Rooms</p>
              <p className="text-2xl font-bold text-blue-900">{hotel.stats?.totalRooms || 0}</p>
            </div>
            <Bed className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Available</p>
              <p className="text-2xl font-bold text-green-900">{hotel.stats?.availableRooms || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Occupied</p>
              <p className="text-2xl font-bold text-red-900">{hotel.stats?.occupiedRooms || 0}</p>
            </div>
            <UserCheck className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Occupancy</p>
              <p className="text-2xl font-bold text-orange-900">{hotel.stats?.occupancyRate || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Room Categories */}
      {hotel.stats?.roomCategories && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(hotel.stats.roomCategories).map(([category, stats]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Available:</span>
                    <span className="font-medium text-green-900">{stats.available}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Occupied:</span>
                    <span className="font-medium text-red-900">{stats.occupied}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Reservations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Reservations</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <p>No current reservations to display</p>
        </div>
      </div>
    </div>
  );

  const RoomsTab = () => (
    <div className="space-y-6">
      {/* Room Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Room Management</h3>
          <p className="text-gray-600">Manage rooms and their status</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRoomManagement(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Manage Rooms
          </button>
          <button 
            onClick={() => setShowRoomManagement(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>
        </div>
      </div>

      {/* Rooms List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">All Rooms</h4>
            <span className="text-sm text-gray-600">{hotel.rooms?.length || 0} rooms total</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hotel.rooms?.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{room.roomNumber}</p>
                      {room.name && <p className="text-sm text-gray-600">{room.name}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{room.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      ₹{room.pricePerNight?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      room.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {room.currentGuest?.name ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">{room.currentGuest.name}</p>
                        <p className="text-xs text-gray-600">
                          Until {new Date(room.currentGuest.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AgentsTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Agents Management</h3>
        <p className="text-gray-600 mb-6">View and manage agents linked to this hotel</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Link Agent
        </button>
      </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Revenue Overview</h4>
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-8 h-8 mx-auto mb-2" />
            <p>Revenue data coming soon</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Booking Trends</h4>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p>Booking analytics coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'rooms':
        return <RoomsTab />;
      case 'agents':
        return <AgentsTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
          <p className="text-gray-600">{hotel.address.city}, {hotel.address.country}</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Edit className="w-4 h-4" />
          Edit Hotel
        </button>
      </div>

      {/* Hotel Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hotel Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{hotel.address.street}, {hotel.address.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{hotel.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{hotel.contact.email}</span>
              </div>
              {hotel.rating?.average > 0 && (
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-gray-700">
                    {hotel.rating.average.toFixed(1)} stars ({hotel.rating.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Policies & Status */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Policies & Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Check-in Time:</span>
                <span className="text-gray-900">{hotel.policies?.checkIn || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Check-out Time:</span>
                <span className="text-gray-900">{hotel.policies?.checkOut || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hotel.status === 'active' ? 'bg-green-100 text-green-800' :
                  hotel.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {hotel.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {hotel.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-700">{hotel.description}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Room Management Modal */}
      <AnimatePresence>
        {showRoomManagement && (
          <RoomManagement 
            hotelId={id}
            onClose={() => {
              setShowRoomManagement(false);
              loadHotel(); // Refresh hotel data after room changes
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelProfile;