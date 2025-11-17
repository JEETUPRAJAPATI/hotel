import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const OwnerNavbar = ({ toggleSidebar, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === '/owner/dashboard') return 'Owner Dashboard';
    if (path.startsWith('/owner/hotels')) return 'Hotel Management';
    if (path.startsWith('/owner/restaurants')) return 'Restaurant Management';
    if (path.startsWith('/owner/finance')) return 'Finance & Accounts';
    if (path.startsWith('/owner/staff')) return 'Staff Management';
    if (path.startsWith('/owner/reports')) return 'Reports';
    if (path.startsWith('/owner/settings')) return 'Settings';
    return 'Owner Dashboard';
  };

  const getCurrentPageDescription = () => {
    const path = location.pathname;
    if (path === '/owner/dashboard') return 'Multi-Hotel & Restaurant Performance Overview';
    if (path.startsWith('/owner/hotels')) return 'Manage your hotel properties and bookings';
    if (path.startsWith('/owner/restaurants')) return 'Oversee your restaurant operations';
    if (path.startsWith('/owner/finance')) return 'Track revenue, expenses, and financial performance';
    if (path.startsWith('/owner/staff')) return 'Manage your team and staff operations';
    if (path.startsWith('/owner/reports')) return 'Generate reports and view analytics';
    if (path.startsWith('/owner/settings')) return 'Manage your account and preferences';
    return 'Manage your hotels and restaurants';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <FiMenu className="h-6 w-6" />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">{getCurrentPageTitle()}</h1>
            <p className="text-sm text-gray-500">{getCurrentPageDescription()}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md">
              <span className="text-sm font-medium">3 Hotels</span>
            </div>
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md">
              <span className="text-sm font-medium">5 Restaurants</span>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
            <FiBell className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-2 text-sm rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user.name || 'Hotel Owner'}</p>
                  <p className="text-xs text-gray-500">Owner</p>
                </div>
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'Hotel Owner'}</p>
                    <p className="text-sm text-gray-500">{user.email || 'owner@hotel.com'}</p>
                  </div>
                  
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FiUser className="mr-3 h-4 w-4" />
                    Profile Settings
                  </button>
                  
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FiSettings className="mr-3 h-4 w-4" />
                    Account Settings
                  </button>
                  
                  <div className="border-t border-gray-100">
                    <button 
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <FiLogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OwnerNavbar;