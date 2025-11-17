import api from './api'

// Get all restaurants with pagination and filters
export const getRestaurants = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add pagination params
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  // Add filter params
  if (params.search) queryParams.append('search', params.search);
  if (params.city) queryParams.append('city', params.city);
  if (params.status) queryParams.append('status', params.status);
  
  // Add sorting params
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  
  // Add hotel_id for super_admin
  if (params.hotel_id) queryParams.append('hotel_id', params.hotel_id);
  
  const queryString = queryParams.toString();
  const url = `/restaurants${queryString ? `?${queryString}` : ''}`;
  
  return await api.get(url);
}

// Get single restaurant by ID
export const getRestaurant = async (id) => {
  return await api.get(`/restaurants/${id}`);
}

// Create new restaurant
export const createRestaurant = async (restaurantData) => {
  return await api.post('/restaurants', restaurantData);
}

// Update existing restaurant
export const updateRestaurant = async (id, restaurantData) => {
  return await api.put(`/restaurants/${id}`, restaurantData);
}

// Activate restaurant
export const activateRestaurant = async (id) => {
  return await api.patch(`/restaurants/${id}/activate`);
}

// Deactivate restaurant
export const deactivateRestaurant = async (id) => {
  return await api.patch(`/restaurants/${id}/deactivate`);
}

// Delete restaurant (soft delete)
export const deleteRestaurant = async (id) => {
  return await api.delete(`/restaurants/${id}`);
}

// Bulk actions on restaurants
export const bulkRestaurantActions = async (action, restaurant_ids) => {
  return await api.post('/restaurants/bulk', {
    action,
    restaurant_ids
  });
}

// Utility function to get unique values for filters
export const getUniqueValues = (restaurants, field) => {
  if (!restaurants || !Array.isArray(restaurants)) return [];
  
  const values = restaurants
    .map(restaurant => restaurant[field])
    .filter(value => value && value.trim() !== '');
  
  return [...new Set(values)].sort();
}

// Utility function to format restaurant data for display
export const formatRestaurantData = (restaurant) => {
  if (!restaurant) return null;
  
  return {
    ...restaurant,
    displayStatus: restaurant.status === 'active' ? 'Active' : 'Inactive',
    displayHours: restaurant.is_24x7 
      ? '24/7' 
      : restaurant.open_time && restaurant.close_time 
        ? `${restaurant.open_time} - ${restaurant.close_time}` 
        : 'Not Set',
    cuisineTypesDisplay: Array.isArray(restaurant.cuisine_types) 
      ? restaurant.cuisine_types.join(', ') 
      : restaurant.cuisine_types || 'Not Specified',
    fullAddress: [
      restaurant.address,
      restaurant.city,
      restaurant.state,
      restaurant.country,
      restaurant.pincode
    ].filter(Boolean).join(', ')
  };
}

// Validate restaurant form data
export const validateRestaurantData = (data) => {
  const errors = {};
  
  // Required fields
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Restaurant name is required and must be at least 2 characters';
  }
  
  if (data.name && data.name.length > 150) {
    errors.name = 'Restaurant name must not exceed 150 characters';
  }
  
  // Code validation (optional but if provided, must be valid)
  if (data.code && !/^[A-Z0-9-]*$/.test(data.code)) {
    errors.code = 'Restaurant code can only contain uppercase letters, numbers, and hyphens';
  }
  
  // Email validation (optional but if provided, must be valid)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Phone validation (optional but if provided, must be valid)
  if (data.phone && !/^\d{6,15}$/.test(data.phone)) {
    errors.phone = 'Phone number must contain only digits and be 6-15 characters long';
  }
  
  // Time validation (required unless 24x7)
  if (!data.is_24x7) {
    if (!data.open_time) {
      errors.open_time = 'Opening time is required unless restaurant is 24x7';
    }
    if (!data.close_time) {
      errors.close_time = 'Closing time is required unless restaurant is 24x7';
    }
    
    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (data.open_time && !timeRegex.test(data.open_time)) {
      errors.open_time = 'Please enter a valid time in HH:MM format';
    }
    if (data.close_time && !timeRegex.test(data.close_time)) {
      errors.close_time = 'Please enter a valid time in HH:MM format';
    }
  }
  
  // Pincode validation (optional but if provided, must be valid)
  if (data.pincode && !/^\d{5,10}$/.test(data.pincode)) {
    errors.pincode = 'Pincode must contain only digits and be 5-10 characters long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export default {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  activateRestaurant,
  deactivateRestaurant,
  deleteRestaurant,
  bulkRestaurantActions,
  getUniqueValues,
  formatRestaurantData,
  validateRestaurantData
};