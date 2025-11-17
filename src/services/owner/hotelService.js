import api from '../api';

// Owner Hotel Services
const ownerHotelService = {
  // Get owner's hotels with pagination and filters
  getHotels: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/hotels?${queryParams}`);
  },

  // Get single hotel by ID
  getHotelById: (id) => {
    return api.get(`/owner/hotels/${id}`);
  },

  // Create new hotel
  createHotel: (hotelData) => {
    return api.post('/owner/hotels', hotelData);
  },

  // Update hotel
  updateHotel: (id, hotelData) => {
    return api.put(`/owner/hotels/${id}`, hotelData);
  },

  // Delete hotel
  deleteHotel: (id) => {
    return api.delete(`/owner/hotels/${id}`);
  },

  // Bulk actions on hotels
  bulkActions: (action, ids) => {
    return api.post('/owner/hotels/bulk', { action, ids });
  },

  // Update hotel pricing
  updatePricing: (id, pricingData) => {
    return api.put(`/owner/hotels/${id}/pricing`, pricingData);
  },

  // Get hotel analytics
  getHotelAnalytics: (id, period = 'month') => {
    return api.get(`/owner/hotels/${id}/analytics?period=${period}`);
  }
};

export default ownerHotelService;