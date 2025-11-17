import api from '../api';

// Owner Dashboard Services
const ownerDashboardService = {
  // Get dashboard statistics
  getStats: () => {
    return api.get('/owner/dashboard/stats');
  },

  // Get recent activities
  getRecentActivities: (limit = 10) => {
    return api.get(`/owner/dashboard/activities?limit=${limit}`);
  },

  // Get revenue chart data
  getRevenueChart: (period = 'month') => {
    return api.get(`/owner/dashboard/revenue-chart?period=${period}`);
  },

  // Get occupancy chart data
  getOccupancyChart: (period = 'month') => {
    return api.get(`/owner/dashboard/occupancy-chart?period=${period}`);
  }
};

export default ownerDashboardService;