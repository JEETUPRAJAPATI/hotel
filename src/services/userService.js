import api from './api'

// Get all users (admin+)
export const getAllUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return await api.get(`/users?${queryString}`)
}

// Get user by ID
export const getUserById = async (id) => {
  return await api.get(`/users/${id}`)
}

// Update user profile
export const updateUserProfile = async (userData) => {
  return await api.put('/users/profile', userData)
}

// Update user by ID (admin+)
export const updateUser = async (id, userData) => {
  return await api.put(`/users/${id}`, userData)
}

// Update user role (super admin)
export const updateUserRole = async (id, role) => {
  return await api.put(`/users/${id}/role`, { role })
}

// Update user permissions (admin+)
export const updateUserPermissions = async (id, permissions) => {
  return await api.put(`/users/${id}/permissions`, { permissions })
}

// Get users by role
export const getUsersByRole = async (role) => {
  return await api.get(`/users/role/${role}`)
}

// Assign user to hotel
export const assignUserToHotel = async (userId, hotelId, role) => {
  return await api.post(`/users/${userId}/hotels/${hotelId}`, { role })
}

// Remove user from hotel
export const removeUserFromHotel = async (userId, hotelId) => {
  return await api.delete(`/users/${userId}/hotels/${hotelId}`)
}

// Delete user (super admin)
export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`)
}

// Get dashboard data
export const getDashboardData = async () => {
  return await api.get('/users/dashboard')
}

export default {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUser,
  updateUserRole,
  updateUserPermissions,
  getUsersByRole,
  assignUserToHotel,
  removeUserFromHotel,
  deleteUser,
  getDashboardData,
}