import api from './api'

// Register user
export const register = async (userData) => {
  return await api.post('/auth/register', userData)
}

// Login user
export const login = async (userData) => {
  return await api.post('/auth/login', userData)
}

// Get current user
export const getCurrentUser = async () => {
  return await api.get('/auth/me')
}