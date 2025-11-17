import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  ChefHat,
  ClipboardList,
  BarChart3,
  Settings
} from 'lucide-react';

const OwnerSidebar = ({ isCollapsed = false }) => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/owner/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/owner/dashboard'
    },
    {
      name: 'Hotel Management',
      href: '/owner/hotels',
      icon: Building2,
      current: location.pathname.startsWith('/owner/hotels')
    },
    {
      name: 'Restaurant Management',
      href: '/owner/restaurants',
      icon: ChefHat,
      current: location.pathname.startsWith('/owner/restaurants')
    },
    {
      name: 'Agent Management',
      href: '/owner/agents',
      icon: Users,
      current: location.pathname.startsWith('/owner/agents')
    },
    {
      name: 'Reservations',
      href: '/owner/reservations',
      icon: Calendar,
      current: location.pathname.startsWith('/owner/reservations')
    },
    {
      name: 'Front Office',
      href: '/owner/front-office',
      icon: Building2,
      current: location.pathname.startsWith('/owner/front-office')
    },
    {
      name: 'Housekeeping',
      href: '/owner/housekeeping',
      icon: Users,
      current: location.pathname.startsWith('/owner/housekeeping')
    },
    {
      name: 'Finance & Accounts',
      href: '/owner/finance',
      icon: BarChart3,
      current: location.pathname.startsWith('/owner/finance')
    },
    {
      name: 'Reports',
      href: '/owner/reports',
      icon: ClipboardList,
      current: location.pathname.startsWith('/owner/reports')
    },
    {
      name: 'Staff Management',
      href: '/owner/staff',
      icon: Users,
      current: location.pathname.startsWith('/owner/staff')
    },
    {
      name: 'Settings',
      href: '/owner/settings',
      icon: Settings,
      current: location.pathname.startsWith('/owner/settings')
    }
  ];

  return (
    <div className={`bg-blue-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } z-40`}>
      {/* Logo */}
      <div className="p-4 border-b border-blue-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">Owner Portal</h1>
              <p className="text-xs text-blue-400">Multi-Property Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors
                  ${
                    item.current
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-300 hover:bg-blue-700 hover:text-white'
                  }
                `}
                title={isCollapsed ? item.name : ''}
              >
                <IconComponent
                  className={`${
                    isCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'
                  } flex-shrink-0`}
                  aria-hidden="true"
                />
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="mt-8 pt-4 border-t border-blue-800">
            <div className="px-2">
              <div className="bg-blue-800 rounded-lg p-3">
                <h4 className="text-xs font-medium text-blue-300 mb-2">Today's Stats</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-400">Staff Present:</span>
                    <span className="text-white">24</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-400">Total Staff:</span>
                    <span className="text-white">30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default OwnerSidebar;