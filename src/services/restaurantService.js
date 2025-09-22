import axios from 'axios';

const API_URL = 'http://localhost:5001/api/restaurant';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Create axios instance with auth headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Dashboard API
export const dashboardAPI = {
  getDashboardData: () => apiClient.get('/dashboard'),
};

// Menu API
export const menuAPI = {
  getCategories: () => apiClient.get('/menu/categories'),
  getItems: (params = {}) => apiClient.get('/menu/items', { params }),
  createItem: (data) => apiClient.post('/menu/items', data),
  updateItem: (id, data) => apiClient.put(`/menu/items/${id}`, data),
  deleteItem: (id) => apiClient.delete(`/menu/items/${id}`),
};

// Orders API
export const ordersAPI = {
  getOrders: (params = {}) => apiClient.get('/orders', { params }),
  createOrder: (data) => apiClient.post('/orders', data),
  updateOrderStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }),
};

// KOT API
export const kotAPI = {
  getKOTTickets: (params = {}) => apiClient.get('/kot', { params }),
  updateKOTStatus: (id, status) => apiClient.put(`/kot/${id}/status`, { status }),
};

// Tables API
export const tablesAPI = {
  getTables: () => apiClient.get('/tables'),
};

// Vendors API (placeholder for future implementation)
export const vendorsAPI = {
  getVendors: () => apiClient.get('/vendors'),
  createVendor: (data) => apiClient.post('/vendors', data),
  updateVendor: (id, data) => apiClient.put(`/vendors/${id}`, data),
  deleteVendor: (id) => apiClient.delete(`/vendors/${id}`),
};

// Expenses API (placeholder for future implementation)
export const expensesAPI = {
  getExpenses: (params = {}) => apiClient.get('/expenses', { params }),
  createExpense: (data) => apiClient.post('/expenses', data),
  updateExpense: (id, data) => apiClient.put(`/expenses/${id}`, data),
  deleteExpense: (id) => apiClient.delete(`/expenses/${id}`),
};

// Reports API (placeholder for future implementation)
export const reportsAPI = {
  getSalesReport: (params = {}) => apiClient.get('/reports/sales', { params }),
  getInventoryReport: () => apiClient.get('/reports/inventory'),
  getPopularItemsReport: (params = {}) => apiClient.get('/reports/popular-items', { params }),
};

export default {
  dashboardAPI,
  menuAPI,
  ordersAPI,
  kotAPI,
  tablesAPI,
  vendorsAPI,
  expensesAPI,
  reportsAPI,
};