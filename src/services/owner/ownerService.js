import api from '../api';

// Owner Dashboard Services
export const ownerDashboardService = {
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

// Owner Hotel Services
export const ownerHotelService = {
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

// Owner Restaurant Services
export const ownerRestaurantService = {
  // Get restaurants
  getRestaurants: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/restaurants?${queryParams}`);
  },

  // Get single restaurant
  getRestaurantById: (id) => {
    return api.get(`/owner/restaurants/${id}`);
  },

  // Create restaurant
  createRestaurant: (restaurantData) => {
    return api.post('/owner/restaurants', restaurantData);
  },

  // Update restaurant
  updateRestaurant: (id, restaurantData) => {
    return api.put(`/owner/restaurants/${id}`, restaurantData);
  },

  // Delete restaurant
  deleteRestaurant: (id) => {
    return api.delete(`/owner/restaurants/${id}`);
  },

  // Get restaurant menu
  getMenu: (id) => {
    return api.get(`/owner/restaurants/${id}/menu`);
  },

  // Update menu
  updateMenu: (id, menuData) => {
    return api.put(`/owner/restaurants/${id}/menu`, menuData);
  },

  // Get restaurant orders
  getOrders: (id, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/restaurants/${id}/orders?${queryParams}`);
  },

  // Get restaurant analytics
  getAnalytics: (id, period = 'month') => {
    return api.get(`/owner/restaurants/${id}/analytics?period=${period}`);
  }
};

// Owner Finance Services
export const ownerFinanceService = {
  // Get financial overview
  getOverview: (period = 'month') => {
    return api.get(`/owner/finance/overview?period=${period}`);
  },

  // Get revenue data
  getRevenue: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/finance/revenue?${queryParams}`);
  },

  // Get expenses
  getExpenses: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/finance/expenses?${queryParams}`);
  },

  // Create expense
  createExpense: (expenseData) => {
    return api.post('/owner/finance/expenses', expenseData);
  },

  // Update expense
  updateExpense: (id, expenseData) => {
    return api.put(`/owner/finance/expenses/${id}`, expenseData);
  },

  // Delete expense
  deleteExpense: (id) => {
    return api.delete(`/owner/finance/expenses/${id}`);
  },

  // Get profit & loss
  getProfitLoss: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/finance/profit-loss?${queryParams}`);
  },

  // Export financial data
  exportData: (type, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/finance/export/${type}?${queryParams}`, {
      responseType: 'blob'
    });
  }
};

// Owner Staff Services
export const ownerStaffService = {
  // Get staff members
  getStaff: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/staff?${queryParams}`);
  },

  // Get single staff member
  getStaffById: (id) => {
    return api.get(`/owner/staff/${id}`);
  },

  // Create staff member
  createStaff: (staffData) => {
    return api.post('/owner/staff', staffData);
  },

  // Update staff member
  updateStaff: (id, staffData) => {
    return api.put(`/owner/staff/${id}`, staffData);
  },

  // Delete staff member
  deleteStaff: (id) => {
    return api.delete(`/owner/staff/${id}`);
  },

  // Get staff attendance
  getAttendance: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/owner/staff/attendance?${queryParams}`);
  },

  // Mark attendance
  markAttendance: (attendanceData) => {
    return api.post('/owner/staff/attendance', attendanceData);
  },

  // Update attendance
  updateAttendance: (id, attendanceData) => {
    return api.put(`/owner/staff/attendance/${id}`, attendanceData);
  },

  // Get staff performance
  getPerformance: (id, period = 'month') => {
    return api.get(`/owner/staff/${id}/performance?period=${period}`);
  },

  // Bulk staff actions
  bulkActions: (action, ids) => {
    return api.post('/owner/staff/bulk', { action, ids });
  }
};

// Owner Reports Services
export const ownerReportsService = {
  // Get available reports
  getReports: () => {
    return api.get('/owner/reports');
  },

  // Generate report
  generateReport: (reportData) => {
    return api.post('/owner/reports/generate', reportData);
  },

  // Get report by ID
  getReportById: (id) => {
    return api.get(`/owner/reports/${id}`);
  },

  // Download report
  downloadReport: (id, format = 'pdf') => {
    return api.get(`/owner/reports/${id}/download?format=${format}`, {
      responseType: 'blob'
    });
  },

  // Delete report
  deleteReport: (id) => {
    return api.delete(`/owner/reports/${id}`);
  },

  // Get predefined report templates
  getTemplates: () => {
    return api.get('/owner/reports/templates');
  },

  // Schedule report
  scheduleReport: (scheduleData) => {
    return api.post('/owner/reports/schedule', scheduleData);
  },

  // Get scheduled reports
  getScheduledReports: () => {
    return api.get('/owner/reports/scheduled');
  }
};

// Owner Settings Services
export const ownerSettingsService = {
  // Get profile
  getProfile: () => {
    return api.get('/owner/settings/profile');
  },

  // Update profile
  updateProfile: (profileData) => {
    return api.put('/owner/settings/profile', profileData);
  },

  // Change password
  changePassword: (passwordData) => {
    return api.put('/owner/settings/password', passwordData);
  },

  // Get preferences
  getPreferences: () => {
    return api.get('/owner/settings/preferences');
  },

  // Update preferences
  updatePreferences: (preferencesData) => {
    return api.put('/owner/settings/preferences', preferencesData);
  },

  // Get notifications settings
  getNotifications: () => {
    return api.get('/owner/settings/notifications');
  },

  // Update notifications settings
  updateNotifications: (notificationData) => {
    return api.put('/owner/settings/notifications', notificationData);
  },

  // Get security settings
  getSecurity: () => {
    return api.get('/owner/settings/security');
  },

  // Update security settings
  updateSecurity: (securityData) => {
    return api.put('/owner/settings/security', securityData);
  },

  // Enable 2FA
  enable2FA: () => {
    return api.post('/owner/settings/security/2fa/enable');
  },

  // Disable 2FA
  disable2FA: () => {
    return api.post('/owner/settings/security/2fa/disable');
  },

  // Get account info
  getAccountInfo: () => {
    return api.get('/owner/settings/account');
  },

  // Deactivate account
  deactivateAccount: () => {
    return api.post('/owner/settings/account/deactivate');
  }
};

// Combined export
const ownerService = {
  dashboard: ownerDashboardService,
  hotels: ownerHotelService,
  restaurants: ownerRestaurantService,
  finance: ownerFinanceService,
  staff: ownerStaffService,
  reports: ownerReportsService,
  settings: ownerSettingsService
};

export default ownerService;