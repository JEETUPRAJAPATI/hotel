import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, User, Bell, ChevronLeft, 
  ChevronRight, X, Menu, Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CommonSidebar from '../../components/sidebar/CommonSidebar';

const OwnerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const notifications = [
    { id: 1, title: 'Property Performance', message: 'Grand Hotel showing 95% occupancy', time: '1 hour ago', type: 'success' },
    { id: 2, title: 'Revenue Alert', message: 'Monthly targets achieved across 3 properties', time: '3 hours ago', type: 'finance' },
    { id: 3, title: 'Staff Update', message: 'New manager appointed at Resort Villa', time: '5 hours ago', type: 'staff' }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Using CommonSidebar */}
      <div className="hidden lg:block">
        <CommonSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-800">Owner Portal</h1>
                    <p className="text-xs text-gray-500">Multi-Property Management</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <CommonSidebar isCollapsed={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area - Adjust margin based on sidebar state */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Desktop Sidebar Toggle */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">Owner Dashboard</h2>
                <p className="text-sm text-gray-600">Multi-Hotel & Restaurant Performance Overview</p>
              </div>
            </div>

            {/* Right Side - Stats and Profile */}
            <div className="flex items-center space-x-6">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Hotels</p>
                  <p className="text-lg font-bold text-blue-600">3</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Restaurants</p>
                  <p className="text-lg font-bold text-green-600">5</p>
                </div>
              </div>

              {/* Notification Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                            <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4">
                        <button className="w-full text-center text-xs text-blue-600 hover:text-blue-800">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{user?.name || 'Hotel Owner'}</p>
                  <p className="text-xs text-gray-500">Owner</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;