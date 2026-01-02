// Predefined system roles
export const systemRoles = [
  { id: 'super-admin', name: 'Super Admin', isSystemRole: true },
  { id: 'restaurant-owner', name: 'Restaurant Owner', isSystemRole: true },
  { id: 'hotel-owner', name: 'Hotel Owner', isSystemRole: true },
  { id: 'manager', name: 'Manager', isSystemRole: true },
  { id: 'staff', name: 'Staff', isSystemRole: true },
];

// All available sidebar permissions
export const sidebarPermissions = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'hotel-management', name: 'Hotel Management' },
  { id: 'restaurant-management', name: 'Restaurant Management' },
  { id: 'reservations', name: 'Reservations' },
  { id: 'front-office', name: 'Front Office' },
  { id: 'housekeeping', name: 'Housekeeping' },
  { id: 'finance-accounts', name: 'Finance & Accounts' },
  { id: 'reports', name: 'Reports' },
  { id: 'staff-management', name: 'Staff Management' },
  { id: 'agent-management', name: 'Agent Management' },
  { id: 'settings', name: 'Settings' },
];

// Mock roles data
export const mockRoles = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    isSystemRole: true,
    status: 'Active',
    permissionCount: 11,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true, export: true },
      'hotel-management': { view: true, create: true, edit: true, delete: true, export: true },
      'restaurant-management': { view: true, create: true, edit: true, delete: true, export: true },
      reservations: { view: true, create: true, edit: true, delete: true, export: true },
      'front-office': { view: true, create: true, edit: true, delete: true, export: true },
      housekeeping: { view: true, create: true, edit: true, delete: true, export: true },
      'finance-accounts': { view: true, create: true, edit: true, delete: true, export: true },
      reports: { view: true, create: true, edit: true, delete: true, export: true },
      'staff-management': { view: true, create: true, edit: true, delete: true, export: true },
      'agent-management': { view: true, create: true, edit: true, delete: true, export: true },
      settings: { view: true, create: true, edit: true, delete: true, export: true },
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Restaurant Owner',
    description: 'Full access to restaurant operations',
    isSystemRole: true,
    status: 'Active',
    permissionCount: 7,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      'restaurant-management': { view: true, create: true, edit: true, delete: true, export: true },
      reservations: { view: true, create: true, edit: true, delete: false, export: true },
      'front-office': { view: true, create: false, edit: false, delete: false, export: false },
      'finance-accounts': { view: true, create: false, edit: false, delete: false, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
      'staff-management': { view: true, create: true, edit: true, delete: true, export: true },
    },
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z',
  },
  {
    id: '3',
    name: 'Hotel Owner',
    description: 'Full access to hotel operations',
    isSystemRole: true,
    status: 'Active',
    permissionCount: 9,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      'hotel-management': { view: true, create: true, edit: true, delete: true, export: true },
      reservations: { view: true, create: true, edit: true, delete: true, export: true },
      'front-office': { view: true, create: true, edit: true, delete: false, export: true },
      housekeeping: { view: true, create: true, edit: true, delete: false, export: true },
      'finance-accounts': { view: true, create: false, edit: false, delete: false, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
      'staff-management': { view: true, create: true, edit: true, delete: true, export: true },
      'agent-management': { view: true, create: true, edit: true, delete: true, export: true },
    },
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z',
  },
  {
    id: '4',
    name: 'Manager',
    description: 'Operational management with limited access',
    isSystemRole: true,
    status: 'Active',
    permissionCount: 8,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      'hotel-management': { view: true, create: false, edit: true, delete: false, export: true },
      'restaurant-management': { view: true, create: false, edit: true, delete: false, export: true },
      reservations: { view: true, create: true, edit: true, delete: false, export: true },
      'front-office': { view: true, create: true, edit: true, delete: false, export: true },
      housekeeping: { view: true, create: true, edit: true, delete: false, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
      'staff-management': { view: true, create: false, edit: true, delete: false, export: true },
    },
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z',
  },
  {
    id: '5',
    name: 'Staff',
    description: 'Basic operational access',
    isSystemRole: true,
    status: 'Active',
    permissionCount: 4,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      reservations: { view: true, create: true, edit: false, delete: false, export: false },
      'front-office': { view: true, create: false, edit: false, delete: false, export: false },
      housekeeping: { view: true, create: false, edit: false, delete: false, export: false },
    },
    createdAt: '2024-01-15T10:50:00Z',
    updatedAt: '2024-01-15T10:50:00Z',
  },
  {
    id: '6',
    name: 'Accountant',
    description: 'Finance and accounting access',
    isSystemRole: false,
    status: 'Active',
    permissionCount: 3,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      'finance-accounts': { view: true, create: true, edit: true, delete: false, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
    },
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-02-10T14:20:00Z',
  },
  {
    id: '7',
    name: 'Receptionist',
    description: 'Front desk operations',
    isSystemRole: false,
    status: 'Active',
    permissionCount: 3,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      reservations: { view: true, create: true, edit: true, delete: false, export: true },
      'front-office': { view: true, create: true, edit: true, delete: false, export: false },
    },
    createdAt: '2024-02-15T09:15:00Z',
    updatedAt: '2024-02-15T09:15:00Z',
  },
  {
    id: '8',
    name: 'Housekeeping Supervisor',
    description: 'Housekeeping management',
    isSystemRole: false,
    status: 'Active',
    permissionCount: 2,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      housekeeping: { view: true, create: true, edit: true, delete: true, export: true },
    },
    createdAt: '2024-03-01T11:30:00Z',
    updatedAt: '2024-03-01T11:30:00Z',
  },
  {
    id: '9',
    name: 'Sales Agent',
    description: 'Agent management and bookings',
    isSystemRole: false,
    status: 'Inactive',
    permissionCount: 3,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      reservations: { view: true, create: true, edit: false, delete: false, export: false },
      'agent-management': { view: true, create: true, edit: true, delete: false, export: true },
    },
    createdAt: '2024-03-10T16:45:00Z',
    updatedAt: '2024-03-10T16:45:00Z',
  },
  {
    id: '10',
    name: 'Guest Services',
    description: 'Guest relations and services',
    isSystemRole: false,
    status: 'Active',
    permissionCount: 2,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      'front-office': { view: true, create: true, edit: false, delete: false, export: false },
    },
    createdAt: '2024-04-05T13:00:00Z',
    updatedAt: '2024-04-05T13:00:00Z',
  },
];

// Mock users for role assignment
export const mockUsersForRoles = [
  { id: '1', name: 'John Doe', email: 'john@example.com', roleId: '1', roleName: 'Super Admin', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', roleId: '3', roleName: 'Hotel Owner', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', roleId: '2', roleName: 'Restaurant Owner', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', roleId: '4', roleName: 'Manager', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com', roleId: '5', roleName: 'Staff', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Tom+Brown' },
  { id: '6', name: 'Emily Davis', email: 'emily@example.com', roleId: '6', roleName: 'Accountant', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis' },
  { id: '7', name: 'David Wilson', email: 'david@example.com', roleId: '7', roleName: 'Receptionist', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=David+Wilson' },
  { id: '8', name: 'Lisa Anderson', email: 'lisa@example.com', roleId: '8', roleName: 'Housekeeping Supervisor', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson' },
  { id: '9', name: 'Chris Martinez', email: 'chris@example.com', roleId: '9', roleName: 'Sales Agent', status: 'Inactive', avatar: 'https://ui-avatars.com/api/?name=Chris+Martinez' },
  { id: '10', name: 'Amanda Taylor', email: 'amanda@example.com', roleId: '10', roleName: 'Guest Services', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Amanda+Taylor' },
  { id: '11', name: 'Robert Lee', email: 'robert@example.com', roleId: '5', roleName: 'Staff', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Robert+Lee' },
  { id: '12', name: 'Jennifer White', email: 'jennifer@example.com', roleId: '7', roleName: 'Receptionist', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Jennifer+White' },
  { id: '13', name: 'Michael Harris', email: 'michael@example.com', roleId: '4', roleName: 'Manager', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Michael+Harris' },
  { id: '14', name: 'Jessica Clark', email: 'jessica@example.com', roleId: '5', roleName: 'Staff', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Jessica+Clark' },
  { id: '15', name: 'Daniel Lewis', email: 'daniel@example.com', roleId: '6', roleName: 'Accountant', status: 'Inactive', avatar: 'https://ui-avatars.com/api/?name=Daniel+Lewis' },
];

// Helper functions
export const getRoleStats = (roles) => {
  return {
    total: roles.length,
    active: roles.filter(r => r.status === 'Active').length,
    inactive: roles.filter(r => r.status === 'Inactive').length,
    systemRoles: roles.filter(r => r.isSystemRole).length,
  };
};

export const filterRoles = (roles, filters) => {
  return roles.filter(role => {
    const matchesSearch = !filters.search || 
      role.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      role.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || role.status === filters.status;

    return matchesSearch && matchesStatus;
  });
};

export const sortRoles = (roles, sortBy, sortOrder) => {
  const sorted = [...roles].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'permissionCount') {
      comparison = a.permissionCount - b.permissionCount;
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

export const filterUsersForRoles = (users, filters) => {
  return users.filter(user => {
    const matchesSearch = !filters.search || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRole = !filters.roleId || user.roleId === filters.roleId;
    const matchesStatus = !filters.status || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });
};

export const getUserRoleStats = (users) => {
  return {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    inactive: users.filter(u => u.status === 'Inactive').length,
  };
};
