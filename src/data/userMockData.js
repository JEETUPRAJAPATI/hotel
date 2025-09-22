// Mock data for user management
export const mockUsers = [
  {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@hotel.com",
    mobileNumber: "+1-555-0123",
    role: "Super Admin",
    status: "Active",
    createdAt: "2024-01-15T08:30:00Z",
    lastLogin: "2024-09-19T14:30:00Z",
    profileImage: null,
    department: "IT Administration",
    location: "New York, NY"
  },
  {
    id: 2,
    fullName: "Sarah Johnson",
    email: "sarah.johnson@hotel.com",
    mobileNumber: "+1-555-0456",
    role: "Admin",
    status: "Active",
    createdAt: "2024-02-20T09:15:00Z",
    lastLogin: "2024-09-19T13:45:00Z",
    profileImage: null,
    department: "Operations",
    location: "Miami, FL"
  },
  {
    id: 3,
    fullName: "Michael Brown",
    email: "michael.brown@hotel.com",
    mobileNumber: "+1-555-0789",
    role: "Manager",
    status: "Active",
    createdAt: "2024-03-10T10:20:00Z",
    lastLogin: "2024-09-19T12:20:00Z",
    profileImage: null,
    department: "Front Desk",
    location: "Denver, CO"
  },
  {
    id: 4,
    fullName: "Emma Davis",
    email: "emma.davis@hotel.com",
    mobileNumber: "+1-555-0321",
    role: "Staff",
    status: "Inactive",
    createdAt: "2024-04-05T11:30:00Z",
    lastLogin: "2024-09-10T16:15:00Z",
    profileImage: null,
    department: "Housekeeping",
    location: "Chicago, IL"
  },
  {
    id: 5,
    fullName: "Robert Wilson",
    email: "robert.wilson@luxury.com",
    mobileNumber: "+1-555-0567",
    role: "Owner",
    status: "Active",
    createdAt: "2024-05-12T12:45:00Z",
    lastLogin: "2024-09-19T11:30:00Z",
    profileImage: null,
    department: "Ownership",
    location: "Los Angeles, CA"
  },
  {
    id: 6,
    fullName: "Lisa Anderson",
    email: "lisa.anderson@hotel.com",
    mobileNumber: "+1-555-0890",
    role: "Staff",
    status: "Active",
    createdAt: "2024-06-18T13:15:00Z",
    lastLogin: "2024-09-19T10:45:00Z",
    profileImage: null,
    department: "Maintenance",
    location: "Phoenix, AZ"
  },
  {
    id: 7,
    fullName: "David Miller",
    email: "david.miller@hotel.com",
    mobileNumber: "+1-555-0234",
    role: "Manager",
    status: "Active",
    createdAt: "2024-07-22T14:20:00Z",
    lastLogin: "2024-09-19T09:30:00Z",
    profileImage: null,
    department: "Food & Beverage",
    location: "Boston, MA"
  },
  {
    id: 8,
    fullName: "Jennifer Taylor",
    email: "jennifer.taylor@hotel.com",
    mobileNumber: "+1-555-0678",
    role: "Staff",
    status: "Active",
    createdAt: "2024-08-05T15:30:00Z",
    lastLogin: "2024-09-19T08:15:00Z",
    profileImage: null,
    department: "Guest Services",
    location: "San Diego, CA"
  },
  {
    id: 9,
    fullName: "Thomas Garcia",
    email: "thomas.garcia@hotel.com",
    mobileNumber: "+1-555-0901",
    role: "Admin",
    status: "Inactive",
    createdAt: "2024-08-20T16:45:00Z",
    lastLogin: "2024-09-15T17:20:00Z",
    profileImage: null,
    department: "Security",
    location: "Seattle, WA"
  },
  {
    id: 10,
    fullName: "Maria Rodriguez",
    email: "maria.rodriguez@hotel.com",
    mobileNumber: "+1-555-0555",
    role: "Manager",
    status: "Active",
    createdAt: "2024-09-01T17:10:00Z",
    lastLogin: "2024-09-19T07:45:00Z",
    profileImage: null,
    department: "HR",
    location: "Nashville, TN"
  },
  {
    id: 11,
    fullName: "James Wilson",
    email: "james.wilson@guest.com",
    mobileNumber: "+1-555-1234",
    role: "User",
    status: "Active",
    createdAt: "2024-09-10T10:00:00Z",
    lastLogin: "2024-09-18T20:30:00Z",
    profileImage: null,
    department: "Guest",
    location: "Austin, TX"
  },
  {
    id: 12,
    fullName: "Amanda Chen",
    email: "amanda.chen@hotel.com",
    mobileNumber: "+1-555-2345",
    role: "Staff",
    status: "Active",
    createdAt: "2024-09-15T11:30:00Z",
    lastLogin: "2024-09-19T06:30:00Z",
    profileImage: null,
    department: "Concierge",
    location: "Las Vegas, NV"
  },
  {
    id: 13,
    fullName: "Kevin O'Brien",
    email: "kevin.obrien@guest.com",
    mobileNumber: "+1-555-3456",
    role: "User",
    status: "Inactive",
    createdAt: "2024-08-25T14:20:00Z",
    lastLogin: "2024-09-05T19:15:00Z",
    profileImage: null,
    department: "Guest",
    location: "Portland, OR"
  },
  {
    id: 14,
    fullName: "Rachel Green",
    email: "rachel.green@hotel.com",
    mobileNumber: "+1-555-4567",
    role: "Admin",
    status: "Active",
    createdAt: "2024-07-30T13:45:00Z",
    lastLogin: "2024-09-19T05:45:00Z",
    profileImage: null,
    department: "Finance",
    location: "Atlanta, GA"
  },
  {
    id: 15,
    fullName: "Daniel Kim",
    email: "daniel.kim@hotel.com",
    mobileNumber: "+1-555-5678",
    role: "Staff",
    status: "Active",
    createdAt: "2024-09-05T12:15:00Z",
    lastLogin: "2024-09-19T04:30:00Z",
    profileImage: null,
    department: "Valet",
    location: "San Francisco, CA"
  }
];

// Available roles for dropdown
export const availableRoles = [
  'Super Admin',
  'Admin', 
  'Manager',
  'Staff',
  'Owner',
  'User'
];

// Available statuses
export const availableStatuses = [
  'Active',
  'Inactive'
];

// Helper functions
export const getUniqueUserValues = (key) => {
  if (key === 'role') {
    return availableRoles;
  }
  if (key === 'status') {
    return availableStatuses;
  }
  if (key === 'department') {
    return [...new Set(mockUsers.map(user => user.department))];
  }
  if (key === 'location') {
    return [...new Set(mockUsers.map(user => user.location))];
  }
  return [];
};

export const filterUsers = (users, filters) => {
  return users.filter(user => {
    const matchesSearch = !filters.search || 
      user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.mobileNumber.includes(filters.search);
    
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });
};

export const getUserStats = (users) => {
  const total = users.length;
  const active = users.filter(user => user.status === 'Active').length;
  const inactive = users.filter(user => user.status === 'Inactive').length;
  
  const roleStats = availableRoles.reduce((acc, role) => {
    acc[role] = users.filter(user => user.role === role).length;
    return acc;
  }, {});

  return {
    total,
    active,
    inactive,
    roleStats
  };
};

export const sortUsers = (users, sortBy, sortOrder = 'asc') => {
  return [...users].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};