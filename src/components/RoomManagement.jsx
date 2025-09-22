import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bed, Plus, Edit, Trash2, Eye, Filter, Search, MoreVertical,
  CheckCircle, XCircle, AlertTriangle, Clock, Users, DollarSign,
  Home, Settings, Save, X
} from 'lucide-react';
import hotelService from '../services/hotelService';

const RoomManagement = ({ hotelId, onClose }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Form state for adding/editing rooms
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    name: '',
    category: 'Standard',
    floor: 1,
    pricePerNight: '',
    maxOccupancy: { adults: 2, children: 1 },
    bedConfiguration: { bedType: 'double', numberOfBeds: 1 },
    roomSize: '',
    amenities: [],
    status: 'available'
  });

  // Load rooms
  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getHotelRooms(hotelId, {
        category: categoryFilter,
        status: statusFilter,
        limit: 50
      });
      setRooms(response.data.rooms || []);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) {
      loadRooms();
    }
  }, [hotelId, categoryFilter, statusFilter]);

  // Filter rooms based on search
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = !searchQuery || 
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handle room form changes
  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setRoomForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setRoomForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle room submission
  const handleSubmitRoom = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await hotelService.updateRoom(hotelId, editingRoom._id, roomForm);
      } else {
        await hotelService.createRoom(hotelId, roomForm);
      }
      setShowAddModal(false);
      setEditingRoom(null);
      setRoomForm({
        roomNumber: '',
        name: '',
        category: 'Standard',
        floor: 1,
        pricePerNight: '',
        maxOccupancy: { adults: 2, children: 1 },
        bedConfiguration: { bedType: 'double', numberOfBeds: 1 },
        roomSize: '',
        amenities: [],
        status: 'available'
      });
      loadRooms();
    } catch (err) {
      setError(err.message || 'Failed to save room');
    }
  };

  // Handle room deletion
  const handleDeleteRoom = async () => {
    try {
      await hotelService.deleteRoom(hotelId, selectedRoom._id);
      setShowDeleteModal(false);
      setSelectedRoom(null);
      loadRooms();
    } catch (err) {
      setError(err.message || 'Failed to delete room');
    }
  };

  // Handle status update
  const handleStatusUpdate = async (roomId, newStatus) => {
    try {
      await hotelService.updateRoomStatus(hotelId, roomId, newStatus);
      loadRooms();
    } catch (err) {
      setError(err.message || 'Failed to update room status');
    }
  };

  // Bulk status update
  const handleBulkStatusUpdate = async (status) => {
    try {
      await hotelService.bulkUpdateRoomStatus(hotelId, selectedRooms, status);
      setSelectedRooms([]);
      loadRooms();
    } catch (err) {
      setError(err.message || 'Failed to update rooms');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      available: 'bg-green-100 text-green-800 border-green-200',
      occupied: 'bg-red-100 text-red-800 border-red-200',
      maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
      cleaning: 'bg-blue-100 text-blue-800 border-blue-200',
      out_of_order: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Available amenities
  const availableAmenities = [
    'wifi', 'tv', 'ac', 'minibar', 'balcony', 'sea_view', 'city_view',
    'garden_view', 'bathtub', 'shower', 'hairdryer', 'safe', 'telephone',
    'room_service', 'workspace', 'sofa', 'kitchenette'
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Room Management</h2>
              <p className="text-gray-600">Manage rooms and their status</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by room number or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {hotelService.getRoomCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {hotelService.getRoomStatuses().map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedRooms.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-600">{selectedRooms.length} rooms selected</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('available')}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  Mark Available
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('maintenance')}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200 transition-colors"
                >
                  Mark Maintenance
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('cleaning')}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
                >
                  Mark Cleaning
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || categoryFilter || statusFilter 
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by adding your first room.'
                }
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  {/* Room Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{room.roomNumber}</h4>
                      {room.name && <p className="text-sm text-gray-600">{room.name}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRooms(prev => [...prev, room._id]);
                          } else {
                            setSelectedRooms(prev => prev.filter(id => id !== room._id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{room.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">{hotelService.formatCurrency(room.pricePerNight)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Occupancy:</span>
                      <span className="font-medium">{room.maxOccupancy.adults}A/{room.maxOccupancy.children}C</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(room.status)}`}>
                      {room.status}
                    </span>
                  </div>

                  {/* Current Guest */}
                  {room.currentGuest?.name && (
                    <div className="mb-4 p-2 bg-yellow-50 rounded-lg">
                      <p className="text-xs font-medium text-yellow-800">{room.currentGuest.name}</p>
                      <p className="text-xs text-yellow-700">
                        Until {new Date(room.currentGuest.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <select
                      value={room.status}
                      onChange={(e) => handleStatusUpdate(room._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    >
                      {hotelService.getRoomStatuses().map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingRoom(room);
                          setRoomForm({
                            roomNumber: room.roomNumber,
                            name: room.name || '',
                            category: room.category,
                            floor: room.floor || 1,
                            pricePerNight: room.pricePerNight,
                            maxOccupancy: room.maxOccupancy,
                            bedConfiguration: room.bedConfiguration,
                            roomSize: room.roomSize || '',
                            amenities: room.amenities || [],
                            status: room.status
                          });
                          setShowAddModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Add/Edit Room Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmitRoom} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingRoom(null);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number*</label>
                    <input
                      type="text"
                      required
                      value={roomForm.roomNumber}
                      onChange={(e) => handleFormChange('roomNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 101, A101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                    <input
                      type="text"
                      value={roomForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Deluxe Room"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select
                      required
                      value={roomForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {hotelService.getRoomCategories().map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                    <input
                      type="number"
                      min="0"
                      value={roomForm.floor}
                      onChange={(e) => handleFormChange('floor', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night*</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={roomForm.pricePerNight}
                      onChange={(e) => handleFormChange('pricePerNight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Size (sq ft)</label>
                    <input
                      type="number"
                      min="0"
                      value={roomForm.roomSize}
                      onChange={(e) => handleFormChange('roomSize', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={roomForm.maxOccupancy.adults}
                      onChange={(e) => handleFormChange('maxOccupancy.adults', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Children</label>
                    <input
                      type="number"
                      min="0"
                      value={roomForm.maxOccupancy.children}
                      onChange={(e) => handleFormChange('maxOccupancy.children', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
                    <select
                      value={roomForm.bedConfiguration.bedType}
                      onChange={(e) => handleFormChange('bedConfiguration.bedType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="queen">Queen</option>
                      <option value="king">King</option>
                      <option value="twin">Twin</option>
                      <option value="sofa">Sofa Bed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Beds</label>
                    <input
                      type="number"
                      min="1"
                      value={roomForm.bedConfiguration.numberOfBeds}
                      onChange={(e) => handleFormChange('bedConfiguration.numberOfBeds', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableAmenities.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={roomForm.amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFormChange('amenities', [...roomForm.amenities, amenity]);
                            } else {
                              handleFormChange('amenities', roomForm.amenities.filter(a => a !== amenity));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{amenity.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingRoom(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {editingRoom ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Room</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete room <strong>{selectedRoom?.roomNumber}</strong>?
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedRoom(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRoom}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Room
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomManagement;