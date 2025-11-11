import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hotel-backend-e4cv.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Staff API functions
export const staffAPI = {
  // Get all staff
  getStaff: (params = {}) => api.get('/staff', { params }),

  // Get single staff
  getStaffById: (id) => api.get(`/staff/${id}`),

  // Create staff
  createStaff: (formData) => {
    return api.post('/staff', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update staff
  updateStaff: (id, formData) => {
    return api.put(`/staff/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete staff
  deleteStaff: (id) => api.delete(`/staff/${id}`),

  // Bulk delete staff
  bulkDeleteStaff: (ids) => api.delete('/staff/bulk', { data: { ids } }),

  // Export staff
  exportStaff: (params = {}) => {
    return api.get('/staff/export', {
      params,
      responseType: 'blob',
    });
  },
};

// Department API functions
export const departmentAPI = {
  // Get all departments
  getDepartments: (params = {}) => api.get('/departments', { params }),

  // Get single department
  getDepartmentById: (id) => api.get(`/departments/${id}`),

  // Create department
  createDepartment: (data) => api.post('/departments', data),

  // Update department
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),

  // Delete department
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};

// Attendance API functions
export const attendanceAPI = {
  // Get attendance records
  getAttendance: (params = {}) => api.get('/attendance', { params }),

  // Get daily attendance sheet
  getDailyAttendance: (params = {}) => api.get('/attendance/daily', { params }),

  // Mark attendance
  markAttendance: (data) => api.post('/attendance', data),

  // Bulk mark attendance
  bulkMarkAttendance: (data) => api.post('/attendance/bulk', data),

  // Update attendance
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),

  // Delete attendance
  deleteAttendance: (id) => api.delete(`/attendance/${id}`),
};

// Permission API functions
export const permissionAPI = {
  // Get staff permissions
  getPermissions: (staffId) => api.get(`/permissions/${staffId}`),

  // Update staff permissions
  updatePermissions: (staffId, data) => api.post(`/permissions/${staffId}`, data),

  // Get default permissions
  getDefaultPermissions: (designation) => api.get(`/permissions/defaults/${designation}`),

  // Copy permissions
  copyPermissions: (data) => api.post('/permissions/copy', data),

  // Delete permissions
  deletePermissions: (staffId) => api.delete(`/permissions/${staffId}`),
};

export default api;