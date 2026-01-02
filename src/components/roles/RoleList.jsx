import React, { useState, useMemo } from 'react';
import { 
  Eye, Edit, Trash2, Search, Filter, Download, FileText, FileSpreadsheet, 
  X, Plus, Shield, ChevronUp, ChevronDown 
} from 'lucide-react';
import RoleFormModal from './RoleFormModal';
import RoleViewModal from './RoleViewModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import Pagination from '../Pagination';
import { mockRoles, getRoleStats, filterRoles, sortRoles } from '../../data/roleMockData';

const RoleList = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort roles
  const filteredRoles = useMemo(() => {
    const filtered = filterRoles(roles, filters);
    return sortRoles(filtered, sortBy, sortOrder);
  }, [roles, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoles, currentPage, itemsPerPage]);

  // Stats
  const stats = getRoleStats(filteredRoles);

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

  const handleView = (role) => {
    setSelectedRole(role);
    setIsViewModalOpen(true);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setIsFormModalOpen(true);
  };

  const handleDelete = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleSaveRole = (roleData, action) => {
    if (action === 'create') {
      setRoles(prev => [...prev, roleData]);
    } else if (action === 'edit') {
      setRoles(prev => prev.map(role => 
        role.id === roleData.id ? roleData : role
      ));
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = (roleId) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
    setIsDeleteModalOpen(false);
  };

  const exportData = (format) => {
    console.log(`Exporting ${filteredRoles.length} roles as ${format}`);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-red-100 text-red-800`;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Total Roles</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-900">{stats.active}</p>
            </div>
            <Shield className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900 mb-1">Inactive</p>
              <p className="text-3xl font-bold text-red-900">{stats.inactive}</p>
            </div>
            <Shield className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900 mb-1">System Roles</p>
              <p className="text-3xl font-bold text-purple-900">{stats.systemRoles}</p>
            </div>
            <Shield className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {(filters.search || filters.status) && (
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
              Search Roles
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by role name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{paginatedRoles.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{filteredRoles.length}</span> roles
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

            {/* Add Role */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Role
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Role Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('permissionCount')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Permissions
                    <SortIcon field="permissionCount" />
                  </button>
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
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                  >
                    Created Date
                    <SortIcon field="createdAt" />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{role.name}</div>
                        {role.isSystemRole && (
                          <div className="text-xs text-gray-500">System Role</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{role.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {role.permissionCount}
                      </span>
                      <span className="text-xs text-gray-500">modules</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(role.status)}>
                      {role.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(role)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!role.isSystemRole && (
                        <button
                          onClick={() => handleDelete(role)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
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

      {/* Modals */}
      {isViewModalOpen && (
        <RoleViewModal
          role={selectedRole}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {isFormModalOpen && (
        <RoleFormModal
          role={editingRole}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveRole}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          title="Delete Role"
          message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
          onConfirm={() => handleConfirmDelete(selectedRole.id)}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default RoleList;
