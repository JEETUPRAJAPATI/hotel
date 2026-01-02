import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Download, FileText, FileSpreadsheet, 
  X, Users, Edit, UserCheck, UserX, ChevronUp, ChevronDown, Eye, Trash2 
} from 'lucide-react';
import Pagination from '../Pagination';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import { mockUsersForRoles, mockRoles, filterUsersForRoles, getUserRoleStats } from '../../data/roleMockData';

const UserAssignment = () => {
  const [users, setUsers] = useState(mockUsersForRoles);
  const [filters, setFilters] = useState({
    search: '',
    roleId: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = filterUsersForRoles(users, filters);
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (sortBy === 'roleName') {
        comparison = a.roleName.localeCompare(b.roleName);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [users, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Stats
  const stats = getUserRoleStats(filteredUsers);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      roleId: '',
      status: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleChangeRole = (userId, newRoleId) => {
    const newRole = mockRoles.find(r => r.id === newRoleId);
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, roleId: newRoleId, roleName: newRole?.name || user.roleName }
        : user
    ));
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkActivate = () => {
    setUsers(prev => prev.map(user => 
      selectedUsers.includes(user.id) 
        ? { ...user, status: 'Active' }
        : user
    ));
    setSelectedUsers([]);
  };

  const handleBulkDeactivate = () => {
    setUsers(prev => prev.map(user => 
      selectedUsers.includes(user.id) 
        ? { ...user, status: 'Inactive' }
        : user
    ));
    setSelectedUsers([]);
  };

  const handleBulkDelete = () => {
    setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const exportData = (format) => {
    console.log(`Exporting ${filteredUsers.length} users as ${format}`);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  const getRoleBadge = (roleName) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    const roleColors = {
      'Super Admin': 'bg-purple-100 text-purple-800',
      'Restaurant Owner': 'bg-orange-100 text-orange-800',
      'Hotel Owner': 'bg-indigo-100 text-indigo-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'Staff': 'bg-green-100 text-green-800',
    };
    return `${baseClasses} ${roleColors[roleName] || 'bg-gray-100 text-gray-800'}`;
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronUp className="h-4 w-4 text-gray-400" />;
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-green-900">{stats.active}</p>
            </div>
            <UserCheck className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900 mb-1">Inactive Users</p>
              <p className="text-3xl font-bold text-red-900">{stats.inactive}</p>
            </div>
            <UserX className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {(filters.search || filters.roleId || filters.status) && (
            <button
              onClick={resetFilters}
              className="ml-auto text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filters.roleId}
              onChange={(e) => handleFilterChange('roleId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              {mockRoles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{paginatedUsers.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredUsers.length}</span> users
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {selectedUsers.length} selected
                </span>
                <button
                  onClick={handleBulkActivate}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium"
                >
                  Activate
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                >
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Export */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                <Download className="h-4 w-4" />
                Export
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => exportData('csv')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </button>
                <button
                  onClick={() => exportData('excel')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    User
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Email
                    <SortIcon field="email" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('roleName')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Current Role
                    <SortIcon field="roleName" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Change Role
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getRoleBadge(user.roleName)}>
                      {user.roleName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.roleId}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {mockRoles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'Active' ? (
                          <UserX className="h-4 w-4 text-red-600" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

      {/* View User Modal */}
      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={viewingUser.avatar}
                  alt={viewingUser.name}
                  className="h-20 w-20 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{viewingUser.name}</h3>
                  <p className="text-gray-600">{viewingUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 mt-1">{viewingUser.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1">
                    <span className={getRoleBadge(viewingUser.roleName)}>
                      {viewingUser.roleName}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={getStatusBadge(viewingUser.status)}>
                      {viewingUser.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-900 mt-1">{viewingUser.id}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    handleToggleStatus(viewingUser.id);
                    setIsViewModalOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    viewingUser.status === 'Active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {viewingUser.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <DeleteConfirmationModal
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default UserAssignment;
