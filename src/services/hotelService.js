import api from './api';

const hotelService = {
  // Get all hotels with filters and pagination
  getHotels: async (params = {}) => {
    try {
      const response = await api.get('/hotels', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single hotel by ID
  getHotel: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new hotel with file upload support
  createHotel: async (hotelData) => {
    try {
      const formData = new FormData();
      
      // Handle basic fields
      Object.keys(hotelData).forEach(key => {
        if (key === 'images' || key === 'logo' || key === 'banner') {
          // Skip file fields, handle them separately
          return;
        }
        
        const value = hotelData[key];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      // Handle image files
      if (hotelData.images && Array.isArray(hotelData.images)) {
        hotelData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('gallery', image);
          }
        });
      }

      // Handle logo
      if (hotelData.logo instanceof File) {
        formData.append('logo', hotelData.logo);
      }

      // Handle banner
      if (hotelData.banner instanceof File) {
        formData.append('banner', hotelData.banner);
      }

      // Handle image URLs (for cases where images are URLs or base64)
      if (hotelData.images && !hotelData.images.some(img => img instanceof File)) {
        formData.append('images', JSON.stringify(hotelData.images));
      }

      const response = await api.post('/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create hotel error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update hotel with file upload support
  updateHotel: async (id, hotelData) => {
    try {
      const formData = new FormData();
      
      // Handle basic fields
      Object.keys(hotelData).forEach(key => {
        if (key === 'images' || key === 'logo' || key === 'banner') {
          // Skip file fields, handle them separately
          return;
        }
        
        const value = hotelData[key];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      // Handle image files
      if (hotelData.images && Array.isArray(hotelData.images)) {
        const hasFiles = hotelData.images.some(img => img instanceof File);
        if (hasFiles) {
          hotelData.images.forEach((image) => {
            if (image instanceof File) {
              formData.append('gallery', image);
            }
          });
        } else {
          // Handle URLs or existing images
          formData.append('images', JSON.stringify(hotelData.images));
        }
      }

      // Handle logo
      if (hotelData.logo instanceof File) {
        formData.append('logo', hotelData.logo);
      }

      // Handle banner
      if (hotelData.banner instanceof File) {
        formData.append('banner', hotelData.banner);
      }

      const response = await api.put(`/hotels/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update hotel error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete hotel (hard delete with image cleanup)
  deleteHotel: async (id) => {
    try {
      const response = await api.delete(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload hotel images
  uploadHotelImage: async (hotelId, type, formData) => {
    try {
      const response = await api.post(`/hotels/${hotelId}/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Room management methods
  
  // Get rooms for a hotel
  getHotelRooms: async (hotelId, params = {}) => {
    try {
      const response = await api.get(`/hotels/${hotelId}/rooms`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new room
  createRoom: async (hotelId, roomData) => {
    try {
      const response = await api.post(`/hotels/${hotelId}/rooms`, roomData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update room
  updateRoom: async (hotelId, roomId, roomData) => {
    try {
      const response = await api.put(`/hotels/${hotelId}/rooms/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update room status
  updateRoomStatus: async (hotelId, roomId, status, guestInfo = null) => {
    try {
      const response = await api.patch(`/hotels/${hotelId}/rooms/${roomId}/status`, {
        status,
        guestInfo
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete room
  deleteRoom: async (hotelId, roomId) => {
    try {
      const response = await api.delete(`/hotels/${hotelId}/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk operations for rooms
  bulkUpdateRoomStatus: async (hotelId, roomIds, status) => {
    try {
      const promises = roomIds.map(roomId => 
        api.patch(`/hotels/${hotelId}/rooms/${roomId}/status`, { status })
      );
      const results = await Promise.all(promises);
      return results.map(res => res.data);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Helper methods for UI
  
  // Get hotel statistics
  getHotelStats: async () => {
    try {
      const response = await api.get('/hotels/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search hotels by name or location
  searchHotels: async (query) => {
    try {
      const response = await api.get('/hotels', {
        params: { search: query, limit: 10 }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get room categories
  getRoomCategories: () => {
    return ['Standard', 'Deluxe', 'Suite', 'Family', 'Presidential', 'Executive'];
  },

  // Get room status options
  getRoomStatuses: () => {
    return [
      { value: 'available', label: 'Available', color: 'green' },
      { value: 'occupied', label: 'Occupied', color: 'red' },
      { value: 'maintenance', label: 'Maintenance', color: 'orange' },
      { value: 'cleaning', label: 'Cleaning', color: 'blue' },
      { value: 'out_of_order', label: 'Out of Order', color: 'gray' }
    ];
  },

  // Get hotel status options
  getHotelStatuses: () => {
    return [
      { value: 'active', label: 'Active', color: 'green' },
      { value: 'inactive', label: 'Inactive', color: 'red' },
      { value: 'suspended', label: 'Suspended', color: 'orange' }
    ];
  },

  // Format currency
  formatCurrency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  },

  // Calculate occupancy percentage
  calculateOccupancy: (occupied, total) => {
    if (total === 0) return 0;
    return Math.round((occupied / total) * 100);
  },

  // Get status color
  getStatusColor: (status, type = 'room') => {
    const statusMaps = {
      room: {
        available: 'green',
        occupied: 'red', 
        maintenance: 'orange',
        cleaning: 'blue',
        out_of_order: 'gray'
      },
      hotel: {
        active: 'green',
        inactive: 'red',
        suspended: 'orange'
      }
    };
    
    return statusMaps[type]?.[status] || 'gray';
  }
};

export default hotelService;