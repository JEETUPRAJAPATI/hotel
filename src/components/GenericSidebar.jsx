import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GenericSidebar = ({
  navigation = [],
  logoIcon: LogoIcon,
  title,
  subtitle,
  bgColor = 'bg-gray-900',
  borderColor = 'border-gray-800',
  primaryColor = 'bg-blue-600',
  hoverColor = 'hover:bg-gray-700',
  textColor = 'text-white',
  mutedTextColor = 'text-gray-400',
  linkTextColor = 'text-gray-300',
  linkHoverTextColor = 'hover:text-white',
  isCollapsed = false,
  onToggleCollapse,
  bottomSection,
  statsSection,
  onNavItemClick
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`h-screen ${bgColor} ${textColor} flex flex-col ${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 border-r ${borderColor}`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {LogoIcon && <LogoIcon className={`h-8 w-8 ${isCollapsed ? 'mx-auto' : ''} text-blue-400`} />}
            {!isCollapsed && (
              <div>
                <h1 className={`text-lg font-bold ${textColor}`}>{title}</h1>
                <p className={`text-xs ${mutedTextColor}`}>{subtitle}</p>
              </div>
            )}
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isCollapsed ? 'mx-auto mt-2' : ''}`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onNavItemClick}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? `${primaryColor} ${textColor}`
                    : `${linkTextColor} ${hoverColor} ${linkHoverTextColor}`
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Stats Section */}
      {statsSection && !isCollapsed && (
        <div className="px-4 pb-4">
          {statsSection}
        </div>
      )}

      {/* User Profile & Logout Section */}
      <div className="border-t border-gray-700">
        {!isCollapsed ? (
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/5 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center space-y-2">
            {/* User Icon */}
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section (if provided) */}
      {bottomSection && !isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          {bottomSection}
        </div>
      )}
    </div>
  );
};

export default GenericSidebar;