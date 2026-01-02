import {
  DashboardSection,
  HotelManagementSection,
  RestaurantManagementSection,
  AgentManagementSection,
  ReservationsSection,
  FrontOfficeSection,
  HousekeepingSection,
  FinanceSection,
  ReportsSection,
  StaffManagementSection,
  UserManagementSection,
  SettingsSection,
  DatabaseSection,
  SecuritySection,
  MenuManagementSection,
  OrdersSection,
  KitchenDisplaySection,
  POSSection,
  AttendanceSection,
  DepartmentSection
} from './sections';

/**
 * Role-based sidebar configuration
 * Each role defines which sections they can access
 * Sections are reusable across roles
 */
export const roleConfig = {
  admin: {
    title: 'Admin Portal',
    subtitle: 'System Administration',
    baseRoute: '/admin',
    sections: [
      DashboardSection,
      UserManagementSection,
      HotelManagementSection,
      AgentManagementSection,
      RestaurantManagementSection,
      ReservationsSection,
      FrontOfficeSection,
      HousekeepingSection,
      FinanceSection,
      ReportsSection,
      SettingsSection,
      DatabaseSection,
      SecuritySection
    ],
    theme: {
      bgColor: 'bg-gray-900',
      borderColor: 'border-gray-800',
      primaryColor: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700',
      textColor: 'text-white',
      mutedTextColor: 'text-gray-400'
    }
  },
  owner: {
    title: 'Owner Portal',
    subtitle: 'Multi-Property Management',
    baseRoute: '/owner',
    sections: [
      DashboardSection,
      HotelManagementSection,
      RestaurantManagementSection,
      AgentManagementSection,
      ReservationsSection,
      FrontOfficeSection,
      HousekeepingSection,
      FinanceSection,
      ReportsSection,
      StaffManagementSection,
      SettingsSection
    ],
    theme: {
      bgColor: 'bg-blue-900',
      borderColor: 'border-blue-800',
      primaryColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      textColor: 'text-white',
      mutedTextColor: 'text-blue-400'
    }
  },
  manager: {
    title: 'Manager Portal',
    subtitle: 'Property Operations',
    baseRoute: '/manager',
    sections: [
      DashboardSection,
      ReservationsSection,
      FrontOfficeSection,
      HousekeepingSection,
      StaffManagementSection,
      AttendanceSection,
      DepartmentSection,
      ReportsSection,
      SettingsSection
    ],
    theme: {
      bgColor: 'bg-green-900',
      borderColor: 'border-green-800',
      primaryColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      textColor: 'text-white',
      mutedTextColor: 'text-green-400'
    }
  },
  'restaurant-owner': {
    title: 'Restaurant Owner',
    subtitle: 'Restaurant Management',
    baseRoute: '/restaurant-owner',
    sections: [
      DashboardSection,
      RestaurantManagementSection,
      MenuManagementSection,
      OrdersSection,
      POSSection,
      KitchenDisplaySection,
      StaffManagementSection,
      ReportsSection,
      SettingsSection
    ],
    theme: {
      bgColor: 'bg-orange-900',
      borderColor: 'border-orange-800',
      primaryColor: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      textColor: 'text-white',
      mutedTextColor: 'text-orange-400'
    }
  },
  staff: {
    title: 'Staff Portal',
    subtitle: 'Daily Operations',
    baseRoute: '/staff',
    sections: [
      DashboardSection,
      AttendanceSection,
      ReportsSection,
      SettingsSection
    ],
    theme: {
      bgColor: 'bg-purple-900',
      borderColor: 'border-purple-800',
      primaryColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      textColor: 'text-white',
      mutedTextColor: 'text-purple-400'
    }
  }
};

/**
 * Get sidebar configuration for a specific role
 * @param {string} role - User role (admin, owner, manager, restaurant-owner, staff)
 * @returns {object} Role configuration with sections and theme
 */
export const getRoleConfig = (role) => {
  return roleConfig[role] || roleConfig.staff;
};
