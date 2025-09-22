import React, { createContext, useContext, useReducer, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext()

// Export AuthContext for direct usage
export { AuthContext }

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null,
      }
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload || null,
      }
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user
  const loadUser = async () => {
    try {
      if (!state.token) {
        dispatch({ type: 'AUTH_ERROR' })
        return
      }
      const res = await authService.getCurrentUser()
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.data,
      })
    } catch (error) {
      localStorage.removeItem('token')
      dispatch({ type: 'AUTH_ERROR' })
    }
  }

  // Register User
  const register = async (formData) => {
    try {
      const res = await authService.register(formData)
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data.data,
      })
      loadUser()
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: error.response?.data?.message || 'Registration failed',
      })
      throw error
    }
  }

  // Login User
  const login = async (formData) => {
    console.log('AuthContext login called with:', formData)
    try {
      console.log('Calling authService.login...')
      const res = await authService.login(formData)
      console.log('AuthService response:', res)
      
      // Store token first
      localStorage.setItem('token', res.data.data.token)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data.data,
      })
      
      // Don't call loadUser immediately, let the component handle redirect
    } catch (error) {
      console.error('AuthContext login error:', error)
      dispatch({
        type: 'LOGIN_FAIL',
        payload: error.response?.data?.message || 'Login failed',
      })
      throw error
    }
  }

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  // Clear Errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      console.log('Token found, loading user...')
      loadUser()
    } else {
      console.log('No token found, setting auth error')
      dispatch({ type: 'AUTH_ERROR' })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}