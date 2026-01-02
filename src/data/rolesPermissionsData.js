// Dummy data for roles and permissions
export const SIDEBAR_PERMISSIONS = [
  { id: 'dashboard', name: 'Dashboard', description: 'Access to dashboard' },
  { id: 'hotel_management', name: 'Hotel Management', description: 'Manage hotels' },
  { id: 'restaurant_management', name: 'Restaurant Management', description: 'Manage restaurants' },
  { id: 'reservations', name: 'Reservations', description: 'Manage reservations' },
  { id: 'front_office', name: 'Front Office', description: 'Front desk operations' },
  { id: 'housekeeping', name: 'Housekeeping', description: 'Housekeeping management' },
  { id: 'finance', name: 'Finance & Accounts', description: 'Financial operations' },
  { id: 'reports', name: 'Reports', description: 'View and generate reports' },
  { id: 'staff_management', name: 'Staff Management', description: 'Manage staff' },
  { id: 'agent_management', name: 'Agent Management', description: 'Manage agents' },
  { id: 'settings', name: 'Settings', description: 'System settings' },
];

export const PERMISSION_TYPES = ['view', 'create', 'edit', 'delete', 'export'];

export const DEFAULT_ROLES = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    status: 'active',
    isSystem: true,
    sidebarCount: 11,
    userCount: 3,
    permissions: SIDEBAR_PERMISSIONS.reduce((acc, perm) => {
      acc[perm.id] = PERMISSION_TYPES.reduce((p, type) => ({ ...p, [type]: true }), {});
      return acc;
    }, {}),
    createdAt: '2024-01-15',
    createdBy: 'System'
  },
  {
    id: '2',
    name: 'Restaurant Owner',
    description: 'Full access to restaurant operations',
    status: 'active',
    isSystem: true,
    sidebarCount: 6,
    userCount: 8,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      restaurant_management: { view: true, create: true, edit: true, delete: true, export: true },
      reservations: { view: true, create: true, edit: true, delete: false, export: true },
      staff_management: { view: true, create: true, edit: true, delete: true, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
      settings: { view: true, create: false, edit: true, delete: false, export: false },
    },
    createdAt: '2024-01-20',
    createdBy: 'Admin'
  },
  {
    id: '3',
    name: 'Hotel Owner',
    description: 'Full access to hotel operations',
    status: 'active',
    isSystem: true,
    sidebarCount: 9,
    userCount: 5,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      hotel_management: { view: true, create: true, edit: true, delete: true, export: true },
      reservations: { view: true, create: true, edit: true, delete: true, export: true },
      front_office: { view: true, create: true, edit: true, delete: false, export: true },
      housekeeping: { view: true, create: true, edit: true, delete: false, export: true },
      finance: { view: true, create: false, edit: false, delete: false, export: true },
      staff_management: { view: true, create: true, edit: true, delete: true, export: true },
      agent_management: { view: true, create: true, edit: true, delete: true, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
    },
    createdAt: '2024-02-01',
    createdBy: 'Admin'
  },
  {
    id: '4',
    name: 'Manager',
    description: 'Property operations management',
    status: 'active',
    isSystem: true,
    sidebarCount: 7,
    userCount: 12,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      reservations: { view: true, create: true, edit: true, delete: false, export: true },
      front_office: { view: true, create: true, edit: true, delete: false, export: true },
      housekeeping: { view: true, create: true, edit: true, delete: false, export: true },
      staff_management: { view: true, create: true, edit: true, delete: false, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
      settings: { view: true, create: false, edit: false, delete: false, export: false },
    },
    createdAt: '2024-02-10',
    createdBy: 'Admin'
  },
  {
    id: '5',
    name: 'Staff',
    description: 'Basic operational access',
    status: 'active',
    isSystem: true,
    sidebarCount: 3,
    userCount: 25,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      front_office: { view: true, create: true, edit: false, delete: false, export: false },
      housekeeping: { view: true, create: false, edit: false, delete: false, export: false },
    },
    createdAt: '2024-02-15',
    createdBy: 'Admin'
  },
  {
    id: '6',
    name: 'Front Desk Agent',
    description: 'Front desk operations only',
    status: 'active',
    isSystem: false,
    sidebarCount: 4,
    userCount: 8,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      reservations: { view: true, create: true, edit: true, delete: false, export: true },
      front_office: { view: true, create: true, edit: true, delete: false, export: true },
      agent_management: { view: true, create: false, edit: false, delete: false, export: false },
    },
    createdAt: '2024-03-01',
    createdBy: 'Manager'
  },
  {
    id: '7',
    name: 'Accountant',
    description: 'Financial reporting and management',
    status: 'active',
    isSystem: false,
    sidebarCount: 3,
    userCount: 4,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      finance: { view: true, create: true, edit: true, delete: false, export: true },
      reports: { view: true, create: true, edit: false, delete: false, export: true },
    },
    createdAt: '2024-03-10',
    createdBy: 'Admin'
  },
  {
    id: '8',
    name: 'Housekeeping Supervisor',
    description: 'Housekeeping team management',
    status: 'active',
    isSystem: false,
    sidebarCount: 4,
    userCount: 6,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      housekeeping: { view: true, create: true, edit: true, delete: true, export: true },
      staff_management: { view: true, create: false, edit: false, delete: false, export: false },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
    },
    createdAt: '2024-03-15',
    createdBy: 'Manager'
  },
  {
    id: '9',
    name: 'Guest Services',
    description: 'Guest relations and services',
    status: 'inactive',
    isSystem: false,
    sidebarCount: 3,
    userCount: 0,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      reservations: { view: true, create: false, edit: false, delete: false, export: false },
      front_office: { view: true, create: false, edit: false, delete: false, export: false },
    },
    createdAt: '2024-04-01',
    createdBy: 'Manager'
  },
  {
    id: '10',
    name: 'Restaurant Manager',
    description: 'Restaurant operations management',
    status: 'active',
    isSystem: false,
    sidebarCount: 5,
    userCount: 7,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      restaurant_management: { view: true, create: true, edit: true, delete: false, export: true },
      staff_management: { view: true, create: true, edit: true, delete: false, export: true },
      finance: { view: true, create: false, edit: false, delete: false, export: true },
      reports: { view: true, create: false, edit: false, delete: false, export: true },
    },
    createdAt: '2024-04-10',
    createdBy: 'Admin'
  }
];

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer', 'James', 'Mary', 'Christopher', 'Patricia', 'Daniel', 'Linda', 'Matthew', 'Barbara', 'Anthony', 'Elizabeth', 'Mark', 'Susan', 'Donald', 'Jessica', 'Steven', 'Karen', 'Paul', 'Nancy', 'Andrew', 'Betty'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen'];

export const DUMMY_USERS = Array.from({ length: 30 }, (_, i) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const roleId = DEFAULT_ROLES[Math.floor(Math.random() * DEFAULT_ROLES.length)].id;
  const role = DEFAULT_ROLES.find(r => r.id === roleId);
  
  return {
    id: `user-${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hotel.com`,
    roleId: roleId,
    roleName: role.name,
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    department: ['Operations', 'Management', 'Finance', 'Front Desk', 'Housekeeping', 'Restaurant'][Math.floor(Math.random() * 6)],
    phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
  };
});
