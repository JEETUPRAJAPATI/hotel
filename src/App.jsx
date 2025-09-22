import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import AdminLayout from './components/AdminLayout'
import RestaurantLayout from './components/RestaurantLayout'
import ManagerLayout from './components/ManagerLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import HotelManagement from './pages/HotelManagement'
import HotelEdit from './pages/HotelEdit'
import UserManagement from './pages/UserManagement'
import ManagerDashboard from './pages/ManagerDashboard'
import HotelList from './pages/HotelList'
import HotelProfile from './pages/HotelProfile'
import AddHotel from './pages/AddHotel'

// Restaurant Components
import RestaurantDashboard from './pages/RestaurantDashboard'
import MenuManagement from './pages/MenuManagement'
import OrdersManagement from './pages/OrdersManagement'
import KitchenDisplay from './pages/KitchenDisplay'
import POSSystem from './pages/POSSystem'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = "/login" }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Role-based dashboard redirector
const Dashboard = () => {
  const { user } = useAuth()
  
  switch (user?.role) {
    case 'super_admin':
      return <Navigate to="/super-admin" replace />
    case 'admin':
      return <Navigate to="/admin" replace />
    case 'manager':
      return <Navigate to="/manager/dashboard" replace />
    case 'staff':
      return <Navigate to="/staff" replace />
    case 'owner':
      return <Navigate to="/owner" replace />
    case 'restaurant_owner':
      return <Navigate to="/restaurant/dashboard" replace />
    default:
      return <Navigate to="/" replace />
  }
}

// Placeholder components for different role dashboards
const SuperAdminDashboard = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-purple-100">Complete system control and oversight</p>
      </div>
      <AdminDashboard />
    </div>
  </div>
)

const ManagerDashboardWrapper = () => (
  <div className="min-h-screen bg-gray-50">
    <ManagerLayout>
      <ManagerDashboard />
    </ManagerLayout>
  </div>
)

const StaffDashboard = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-2xl mx-auto p-8">
      <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Staff Dashboard</h2>
      <p className="text-gray-600 mb-8">Your daily tasks and guest service tools</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-2">Guest Check-in</h3>
          <p className="text-gray-600 text-sm">Process guest arrivals and departures</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-2">Room Status</h3>
          <p className="text-gray-600 text-sm">Update room cleaning and maintenance</p>
        </div>
      </div>
    </div>
  </div>
)

const OwnerDashboard = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-2xl mx-auto p-8">
      <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Owner Dashboard</h2>
      <p className="text-gray-600 mb-8">Manage your property, pricing, and revenue</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-2">Revenue Analytics</h3>
          <p className="text-gray-600 text-sm">Track your property performance</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-2">Pricing Control</h3>
          <p className="text-gray-600 text-sm">Manage room rates and packages</p>
        </div>
      </div>
    </div>
  </div>
)

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
      <button
        onClick={() => window.history.back()}
        className="btn-primary"
      >
        Go Back
      </button>
    </div>
  </div>
)

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  </div>
)

function App() {
  const { loading } = useAuth()
  const location = useLocation()

  // Don't show header on admin routes
  const hideHeader = location.pathname.startsWith('/admin') || 
                    location.pathname.startsWith('/super-admin') ||
                    location.pathname.startsWith('/manager') ||
                    location.pathname.startsWith('/staff') ||
                    location.pathname.startsWith('/owner') ||
                    location.pathname.startsWith('/restaurant')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="App">
      {!hideHeader && <Header />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Role-specific Dashboards */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Hotel Management Routes */}
          <Route
            path="/admin/hotels"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <HotelManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/hotels/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <HotelEdit />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Admin User Management Routes */}
          <Route
            path="/admin/settings/users"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerDashboardWrapper />
              </ProtectedRoute>
            }
          />
          
          {/* Manager Dashboard Sub-routes */}
          <Route
            path="/manager/occupancy"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">Occupancy Rate Dashboard</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/orders-summary"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">Orders Summary</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/revenue"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">Revenue Snapshot</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/alerts"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">Alerts & Notifications</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Hotel Management Routes */}
          <Route
            path="/manager/hotels"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <HotelList />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/hotels/add"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <AddHotel />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/hotels/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <HotelProfile />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Restaurant Management Routes */}
          <Route
            path="/manager/restaurants"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">Restaurant List</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/kot"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">KOT (Kitchen Orders)</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/pos"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">POS System</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Agent Management Routes */}
          <Route
            path="/manager/agents"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">Agent Management</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Staff Management Routes */}
          <Route
            path="/manager/staff"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <div className="p-6"><h1 className="text-2xl font-bold">Staff Management</h1><p className="text-gray-600 mt-2">Coming Soon...</p></div>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Legacy route redirect */}
          <Route
            path="/manager"
            element={<Navigate to="/manager/dashboard" replace />}
          />
          
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager', 'staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Restaurant Management Routes */}
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <RestaurantDashboard />
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/menu"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <MenuManagement />
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/orders"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <OrdersManagement />
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/kot"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <KitchenDisplay />
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/pos"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <POSSystem />
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/vendors"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendors Management</h2>
                      <p className="text-gray-600">Coming Soon...</p>
                    </div>
                  </div>
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/expenses"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Expenses Management</h2>
                      <p className="text-gray-600">Coming Soon...</p>
                    </div>
                  </div>
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/reports"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
                      <p className="text-gray-600">Coming Soon...</p>
                    </div>
                  </div>
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/settings"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <RestaurantLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Settings</h2>
                      <p className="text-gray-600">Coming Soon...</p>
                    </div>
                  </div>
                </RestaurantLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/restaurant/settings"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'restaurant_owner']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Settings</h2>
                    <p className="text-gray-600">Coming Soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App