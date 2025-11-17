import api from '../api';

// Manager Dashboard Services
export const managerDashboardService = {
  // Get dashboard statistics
  getStats: () => api.get('/manager/dashboard/stats'),
};

// Manager Staff Services
export const managerStaffService = {
  // Get all staff with pagination and filters
  getStaff: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/staff?${queryString}`);
  },
  
  // Get staff by ID
  getStaffById: (staffId) => api.get(`/manager/staff/${staffId}`),
  
  // Update staff information
  updateStaff: (staffId, staffData) => api.put(`/manager/staff/${staffId}`, staffData),
};

// Manager Attendance Services
export const managerAttendanceService = {
  // Get attendance records with filters
  getAttendance: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/attendance?${queryString}`);
  },
  
  // Mark attendance for staff
  markAttendance: (attendanceData) => api.post('/manager/attendance', attendanceData),
  
  // Update attendance record
  updateAttendance: (attendanceId, attendanceData) => {
    return api.put(`/manager/attendance/${attendanceId}`, attendanceData);
  },
  
  // Get attendance summary for a specific period
  getAttendanceSummary: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/attendance/summary?${queryString}`);
  },
};

// Manager Restaurant Services
export const managerRestaurantService = {
  // Get all restaurants with pagination and filters
  getRestaurants: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/restaurants?${queryString}`);
  },
  
  // Create new restaurant
  createRestaurant: (restaurantData) => {
    return api.post('/manager/restaurants', restaurantData);
  },
  
  // Update restaurant
  updateRestaurant: (restaurantId, restaurantData) => {
    return api.put(`/manager/restaurants/${restaurantId}`, restaurantData);
  },
  
  // Delete restaurant
  deleteRestaurant: (restaurantId) => {
    return api.delete(`/manager/restaurants/${restaurantId}`);
  },
  
  // Get restaurant by ID
  getRestaurantById: (restaurantId) => {
    return api.get(`/manager/restaurants/${restaurantId}`);
  },
  
  // Toggle restaurant status
  toggleRestaurantStatus: (restaurantId) => {
    return api.patch(`/manager/restaurants/${restaurantId}/toggle-status`);
  },
  
  // Bulk operations
  bulkDeleteRestaurants: (restaurantIds) => {
    return api.post('/manager/restaurants/bulk-delete', { ids: restaurantIds });
  },
  
  bulkUpdateStatus: (restaurantIds, status) => {
    return api.post('/manager/restaurants/bulk-status', { ids: restaurantIds, status });
  },
};

// Manager Department Services
export const managerDepartmentService = {
  // Get all departments
  getDepartments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/departments?${queryString}`);
  },
  
  // Create new department
  createDepartment: (departmentData) => {
    return api.post('/manager/departments', departmentData);
  },
  
  // Update department
  updateDepartment: (departmentId, departmentData) => {
    return api.put(`/manager/departments/${departmentId}`, departmentData);
  },
  
  // Delete department
  deleteDepartment: (departmentId) => {
    return api.delete(`/manager/departments/${departmentId}`);
  },
};

// Manager Reports Services
export const managerReportsService = {
  // Get staff performance report
  getStaffPerformanceReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/reports/staff-performance?${queryString}`);
  },
  
  // Get attendance report
  getAttendanceReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/reports/attendance?${queryString}`);
  },
  
  // Get restaurant performance report
  getRestaurantReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/reports/restaurants?${queryString}`);
  },
  
  // Export reports
  exportReport: (reportType, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/manager/reports/export/${reportType}?${queryString}`, {
      responseType: 'blob',
    });
  },
};

// Export all manager services
export default {
  dashboard: managerDashboardService,
  staff: managerStaffService,
  attendance: managerAttendanceService,
  restaurants: managerRestaurantService,
  departments: managerDepartmentService,
  reports: managerReportsService,
};