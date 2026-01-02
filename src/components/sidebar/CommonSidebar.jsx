import React, { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import GenericSidebar from '../GenericSidebar';
import { getRoleConfig } from './roleConfig';
import { useAuth } from '../../context/AuthContext';

/**
 * CommonSidebar - Universal sidebar component for all roles
 * Renders appropriate menu sections based on user role
 * Reuses section components across different roles
 * 
 * @param {boolean} isCollapsed - Whether sidebar is collapsed (controlled externally)
 * @param {function} onToggleCollapse - Callback when collapse button is clicked
 * @param {function} onNavItemClick - Callback when navigation item is clicked (for mobile close)
 */
const CommonSidebar = ({ isCollapsed: externalIsCollapsed, onToggleCollapse, onNavItemClick }) => {
  const { user } = useAuth();
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  
  // Toggle handler
  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalIsCollapsed(!internalIsCollapsed);
    }
  };
  
  // Get role from user context (fallback to 'staff' if not found)
  const userRole = user?.role?.toLowerCase() || 'staff';
  
  // Get configuration for the current role
  const config = useMemo(() => getRoleConfig(userRole), [userRole]);
  
  // Build navigation array from sections
  const navigation = useMemo(() => {
    return config.sections.map(section => ({
      name: section.name,
      href: `${config.baseRoute}${section.path}`,
      icon: section.icon
    }));
  }, [config]);

  // Optional: Add role-specific stats section
  const statsSection = useMemo(() => {
    // Only show stats for certain roles
    if (!['admin', 'owner', 'manager'].includes(userRole)) {
      return null;
    }

    return (
      <div className={`${config.theme.primaryColor} rounded-lg p-3`}>
        <h4 className={`text-xs font-medium ${config.theme.mutedTextColor} mb-2`}>
          Today's Stats
        </h4>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={config.theme.mutedTextColor}>Staff Present:</span>
            <span className={config.theme.textColor}>24</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className={config.theme.mutedTextColor}>Total Staff:</span>
            <span className={config.theme.textColor}>30</span>
          </div>
        </div>
      </div>
    );
  }, [userRole, config]);

  return (
    <GenericSidebar
      navigation={navigation}
      logoIcon={Building2}
      title={config.title}
      subtitle={config.subtitle}
      bgColor={config.theme.bgColor}
      borderColor={config.theme.borderColor}
      primaryColor={config.theme.primaryColor}
      hoverColor={config.theme.hoverColor}
      textColor={config.theme.textColor}
      mutedTextColor={config.theme.mutedTextColor}
      isCollapsed={isCollapsed}
      onToggleCollapse={handleToggle}
      statsSection={statsSection}
      onNavItemClick={onNavItemClick}
    />
  );
};

export default CommonSidebar;
