import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import AdminLayout from './components/AdminLayout'
import RestaurantLayout from './components/RestaurantLayout'
import ManagerLayout from './components/ManagerLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'
import HotelManagement from './pages/HotelManagement'
import HotelEdit from './pages/HotelEdit'
import UserManagement from './pages/UserManagement'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import HotelList from './pages/HotelList'
import HotelProfile from './pages/HotelProfile'
import AddHotel from './pages/AddHotel'

// Restaurant Components
import RestaurantDashboard from './pages/RestaurantDashboard'
import MenuManagement from './pages/MenuManagement'
import OrdersManagement from './pages/OrdersManagement'
import KitchenDisplay from './pages/KitchenDisplay'
import POSSystem from './pages/POSSystem'

// Agent Components
import AgentManagement from './pages/AgentManagement'
import AgentCreateEdit from './pages/AgentCreateEdit'
import AgentDetails from './pages/AgentDetails'

// Admin Role & Permissions
import RolesPermissionsManagement from './pages/admin/RolesPermissionsManagement'
import Settings from './pages/admin/Settings'
import DatabaseManagement from './pages/admin/DatabaseManagement'
import AdminFinance from './pages/admin/Finance'
import AdminReports from './pages/admin/Reports'

// Staff Components
import StaffManagement from './pages/manager/StaffManagement'
import DepartmentManagement from './pages/DepartmentManagement'
import AttendanceManagement from './pages/AttendanceManagement'

// Manager Components
import Reports from './pages/manager/Reports'
import Finance from './pages/manager/Finance'
import ManagerHousekeeping from './pages/manager/Housekeeping'

// Manager Reservations Components
import ManagerReservations from './pages/manager/reservations/Reservations'
import CreateManagerReservation from './pages/manager/reservations/CreateReservation'
import EditManagerReservation from './pages/manager/reservations/EditReservation'

// Manager Front Office
import ManagerFrontOffice from './pages/manager/FrontOffice'

// Restaurant Management Components
import RestaurantManagement from './pages/RestaurantManagement'

// Owner Components
import { 
  OwnerLayout, 
  OwnerDashboard as OwnerDashboardPage, 
  HotelsList, 
  CreateHotel,
  HotelDetails,
  RestaurantsList,
  FinanceOverview,
  StaffList,
  ReportsList,
  OwnerSettings
} from './pages/owner'
import CreateRestaurant from './pages/owner/restaurants/CreateRestaurant'
import EditRestaurant from './pages/owner/restaurants/EditRestaurant'
import ViewRestaurant from './pages/owner/restaurants/ViewRestaurant'
import Agents from './pages/owner/Agents'
import CreateAgent from './pages/owner/agents/CreateAgent'
import EditAgent from './pages/owner/agents/EditAgent'
import Reservations from './pages/owner/reservations/Reservations'
import CreateReservation from './pages/owner/reservations/CreateReservation'
import EditReservation from './pages/owner/reservations/EditReservation'
import FrontOffice from './pages/owner/FrontOffice'
import OwnerHousekeeping from './pages/owner/Housekeeping'

// Admin Reservations
import AdminReservations from './pages/admin/reservations/Reservations'

// Admin Agents
import AdminAgentsManagement from './pages/admin/agents/AgentsManagement'

// Owner Staff Management Components
import OwnerStaffList from './pages/owner/staff/OwnerStaffList'
import CreateStaff from './pages/owner/staff/CreateStaff'
import StaffAttendance from './pages/owner/staff/StaffAttendance'

// Owner Reports Components
import OwnerReports from './pages/owner/reports/Reports'

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
      return <Navigate to="/owner/dashboard" replace />
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

// Owner Dashboard Wrapper
const OwnerDashboardWrapper = () => (
  <OwnerLayout>
    <OwnerDashboardPage />
  </OwnerLayout>
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
          
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
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
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

          {/* Admin Roles & Permissions */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <RolesPermissionsManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Settings */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Database Management */}
          <Route
            path="/admin/database"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <DatabaseManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Finance Management */}
          <Route
            path="/admin/finance"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <AdminFinance />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Reports Module */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <AdminReports />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Restaurant Management */}
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <RestaurantManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Reservations Management */}
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <AdminReservations />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Agents Management */}
          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminLayout>
                  <AdminAgentsManagement />
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
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager', 'owner']}>
                <ManagerLayout>
                  <RestaurantManagement />
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
                  <AgentManagement />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/agents/add"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <AgentCreateEdit />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/agents/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <AgentCreateEdit />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/agents/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <AgentDetails />
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
                  <StaffManagement />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/departments"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <DepartmentManagement />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/attendance"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <AttendanceManagement />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Manager Reservations Routes */}
          <Route
            path="/manager/reservations"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <ManagerReservations />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/reservations/create"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <CreateManagerReservation />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/reservations/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <EditManagerReservation />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Manager Front Office Route */}
          <Route
            path="/manager/front-office"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <ManagerFrontOffice />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Manager Reports, Finance, and Housekeeping Routes */}
          <Route
            path="/manager/reports"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <Reports />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/finance"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <Finance />
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager/housekeeping"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'manager']}>
                <ManagerLayout>
                  <ManagerHousekeeping />
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
          
          {/* Owner Routes */}
          <Route
            path="/owner"
            element={<Navigate to="/owner/dashboard" replace />}
          />
          
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerDashboardWrapper />
              </ProtectedRoute>
            }
          />
          
          {/* Owner Hotel Management */}
          <Route
            path="/owner/hotels"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <HotelsList />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Owner Restaurant Management */}
          <Route
            path="/owner/restaurants"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <RestaurantsList />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/restaurants/create"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <CreateRestaurant />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/restaurants/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <ViewRestaurant />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/restaurants/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <EditRestaurant />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Other Owner Routes */}
          <Route
            path="/owner/agents"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <Agents />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/agents/create"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <CreateAgent />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/agents/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <EditAgent />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/reservations"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <Reservations />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/reservations/create"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <CreateReservation />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/reservations/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <EditReservation />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/front-office"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <FrontOffice />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/housekeeping"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerHousekeeping />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/reports"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerReports />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/settings"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerSettings />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/hotels/create"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <CreateHotel />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/hotels/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <HotelDetails />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Owner Finance */}
          <Route
            path="/owner/finance"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <FinanceOverview />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Owner Staff Management */}
          <Route
            path="/owner/staff"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerStaffList />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/staff/create"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <CreateStaff />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/staff/attendance"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <StaffAttendance />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Owner Reports */}
          <Route
            path="/owner/reports"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerReports />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Owner Settings */}
          <Route
            path="/owner/settings"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerSettings />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/settings/profile"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerSettings />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/settings/security"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerSettings />
                </OwnerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/owner/settings/notifications"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                <OwnerLayout>
                  <OwnerSettings />
                </OwnerLayout>
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
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  )
}

export default App