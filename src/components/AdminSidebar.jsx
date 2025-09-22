import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Building2,
  Bed,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  UserCog,
  ClipboardList,
  Package,
  TrendingUp,
  MessageSquare,
  Bell,
  Shield,
  Database,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Camera,
  FileText,
  CheckSquare,
  AlertTriangle,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

const AdminSidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMobileOpen = () => setIsMobileOpen(!isMobileOpen)
  const closeMobile = () => setIsMobileOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleSubmenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId)
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      color: 'blue'
    },
    {
      id: 'hotels',
      title: 'Hotel Management',
      icon: Building2,
      color: 'green',
      submenu: [
        { title: 'All Hotels', path: '/admin/hotels', icon: Building2 },
        { title: 'Add New Hotel', path: '/admin/hotels/add', icon: Building2 },
        { title: 'Hotel Settings', path: '/admin/hotels/settings', icon: Settings },
        { title: 'Amenities', path: '/admin/hotels/amenities', icon: Wifi },
        { title: 'Locations', path: '/admin/hotels/locations', icon: MapPin }
      ]
    },
    {
      id: 'rooms',
      title: 'Room Management',
      icon: Bed,
      color: 'purple',
      submenu: [
        { title: 'All Rooms', path: '/admin/rooms', icon: Bed },
        { title: 'Add Room', path: '/admin/rooms/add', icon: Bed },
        { title: 'Room Types', path: '/admin/rooms/types', icon: Bed },
        { title: 'Room Status', path: '/admin/rooms/status', icon: CheckSquare },
        { title: 'Maintenance', path: '/admin/rooms/maintenance', icon: AlertTriangle }
      ]
    },
    {
      id: 'bookings',
      title: 'Booking Management',
      icon: Calendar,
      color: 'orange',
      submenu: [
        { title: 'All Bookings', path: '/admin/bookings', icon: Calendar },
        { title: 'New Booking', path: '/admin/bookings/add', icon: Calendar },
        { title: 'Check-in/Out', path: '/admin/bookings/checkin', icon: Clock },
        { title: 'Cancellations', path: '/admin/bookings/cancelled', icon: X },
        { title: 'Booking Calendar', path: '/admin/bookings/calendar', icon: Calendar }
      ]
    },
    {
      id: 'guests',
      title: 'Guest Management',
      icon: Users,
      color: 'teal',
      submenu: [
        { title: 'All Guests', path: '/admin/guests', icon: Users },
        { title: 'Guest Profiles', path: '/admin/guests/profiles', icon: UserCog },
        { title: 'Guest Reviews', path: '/admin/guests/reviews', icon: Star },
        { title: 'Loyalty Program', path: '/admin/guests/loyalty', icon: Star },
        { title: 'Guest Communications', path: '/admin/guests/communications', icon: MessageSquare }
      ]
    },
    {
      id: 'staff',
      title: 'Staff Management',
      icon: UserCog,
      color: 'indigo',
      submenu: [
        { title: 'All Staff', path: '/admin/staff', icon: Users },
        { title: 'Add Staff', path: '/admin/staff/add', icon: UserCog },
        { title: 'Staff Roles', path: '/admin/staff/roles', icon: Shield },
        { title: 'Schedules', path: '/admin/staff/schedules', icon: Calendar },
        { title: 'Payroll', path: '/admin/staff/payroll', icon: DollarSign },
        { title: 'Performance', path: '/admin/staff/performance', icon: TrendingUp }
      ]
    },
    {
      id: 'finance',
      title: 'Finance & Reports',
      icon: DollarSign,
      color: 'green',
      submenu: [
        { title: 'Revenue Reports', path: '/admin/finance/revenue', icon: DollarSign },
        { title: 'Expenses', path: '/admin/finance/expenses', icon: CreditCard },
        { title: 'Financial Analytics', path: '/admin/finance/analytics', icon: BarChart3 },
        { title: 'Invoices', path: '/admin/finance/invoices', icon: FileText },
        { title: 'Tax Reports', path: '/admin/finance/tax', icon: FileText },
        { title: 'Budget Planning', path: '/admin/finance/budget', icon: PieChart }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: BarChart3,
      color: 'pink',
      submenu: [
        { title: 'Overview Analytics', path: '/admin/analytics', icon: BarChart3 },
        { title: 'Occupancy Reports', path: '/admin/analytics/occupancy', icon: PieChart },
        { title: 'Revenue Analytics', path: '/admin/analytics/revenue', icon: LineChart },
        { title: 'Performance Metrics', path: '/admin/analytics/performance', icon: Activity },
        { title: 'Custom Reports', path: '/admin/analytics/custom', icon: FileText },
        { title: 'Data Export', path: '/admin/analytics/export', icon: Database }
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      icon: ClipboardList,
      color: 'yellow',
      submenu: [
        { title: 'Daily Operations', path: '/admin/operations/daily', icon: ClipboardList },
        { title: 'Housekeeping', path: '/admin/operations/housekeeping', icon: Home },
        { title: 'Maintenance', path: '/admin/operations/maintenance', icon: Settings },
        { title: 'Security', path: '/admin/operations/security', icon: Shield },
        { title: 'Lost & Found', path: '/admin/operations/lost-found', icon: Package }
      ]
    },
    {
      id: 'services',
      title: 'Services & Amenities',
      icon: UtensilsCrossed,
      color: 'red',
      submenu: [
        { title: 'Restaurant Management', path: '/admin/services/restaurant', icon: UtensilsCrossed },
        { title: 'Spa & Wellness', path: '/admin/services/spa', icon: Waves },
        { title: 'Gym & Fitness', path: '/admin/services/gym', icon: Dumbbell },
        { title: 'Events & Conferences', path: '/admin/services/events', icon: Calendar },
        { title: 'Transport Services', path: '/admin/services/transport', icon: Car },
        { title: 'Concierge Services', path: '/admin/services/concierge', icon: Bell }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory & Stock',
      icon: Package,
      color: 'gray',
      submenu: [
        { title: 'Inventory Overview', path: '/admin/inventory', icon: Package },
        { title: 'Stock Management', path: '/admin/inventory/stock', icon: Package },
        { title: 'Purchase Orders', path: '/admin/inventory/orders', icon: ClipboardList },
        { title: 'Suppliers', path: '/admin/inventory/suppliers', icon: Users },
        { title: 'Asset Management', path: '/admin/inventory/assets', icon: Database }
      ]
    },
    {
      id: 'communications',
      title: 'Communications',
      icon: MessageSquare,
      color: 'blue',
      submenu: [
        { title: 'Messages & Notifications', path: '/admin/communications/messages', icon: MessageSquare },
        { title: 'Email Marketing', path: '/admin/communications/email', icon: Mail },
        { title: 'SMS Notifications', path: '/admin/communications/sms', icon: Phone },
        { title: 'Guest Feedback', path: '/admin/communications/feedback', icon: Star },
        { title: 'Reviews Management', path: '/admin/communications/reviews', icon: MessageSquare }
      ]
    },
    {
      id: 'settings',
      title: 'Settings & Configuration',
      icon: Settings,
      color: 'gray',
      submenu: [
        { title: 'General Settings', path: '/admin/settings/general', icon: Settings },
        { title: 'User Management', path: '/admin/settings/users', icon: Users },
        { title: 'Security Settings', path: '/admin/settings/security', icon: Shield },
        { title: 'Backup & Restore', path: '/admin/settings/backup', icon: Database },
        { title: 'System Logs', path: '/admin/settings/logs', icon: FileText },
        { title: 'API Configuration', path: '/admin/settings/api', icon: Settings }
      ]
    }
  ]

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700',
      green: isActive ? 'bg-green-50 text-green-700 border-r-2 border-green-700' : 'text-gray-600 hover:bg-green-50 hover:text-green-700',
      purple: isActive ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
      orange: isActive ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-700' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700',
      teal: isActive ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-700' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700',
      indigo: isActive ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
      pink: isActive ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-700' : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700',
      yellow: isActive ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-700' : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-700',
      red: isActive ? 'bg-red-50 text-red-700 border-r-2 border-red-700' : 'text-gray-600 hover:bg-red-50 hover:text-red-700',
      gray: isActive ? 'bg-gray-50 text-gray-700 border-r-2 border-gray-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700',
    }
    return colors[color] || colors.gray
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileOpen}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl border-r border-gray-200 z-40 flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HMS Admin</h1>
                <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              onClick={closeMobile}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedMenu === item.id
            const isMenuActive = hasSubmenu 
              ? item.submenu.some(sub => isActive(sub.path))
              : isActive(item.path)

            return (
              <div key={item.id}>
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${getColorClasses(item.color, isMenuActive)}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${getColorClasses(item.color, isMenuActive)}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}

                {/* Submenu */}
                <AnimatePresence>
                  {hasSubmenu && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-4 mt-2 space-y-1"
                    >
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={closeMobile}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive(subItem.path)
                                ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* Help & Support */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <Link
            to="/admin/help"
            onClick={closeMobile}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors mb-2"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar