import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { departmentAPI } from '../services/staffService';
import LoadingSpinner from '../components/LoadingSpinner';
import DepartmentModal from '../components/DepartmentModal';
import toast from 'react-hot-toast';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Load departments on component mount and filter changes
  useEffect(() => {
    loadDepartments();
  }, [filters]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getDepartments({
        ...filters,
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3' // Replace with actual hotel ID
      });

      if (response.data.success) {
        setDepartments(response.data.data);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Error loading departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    handleFilterChange('search', value);
  };

  const handleViewDepartment = async (departmentId) => {
    try {
      const response = await departmentAPI.getDepartmentById(departmentId);
      if (response.data.success) {
        setSelectedDepartment(response.data.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error loading department details:', error);
      toast.error('Failed to load department details');
    }
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        const response = await departmentAPI.deleteDepartment(departmentId);
        if (response.data.success) {
          toast.success('Department deleted successfully');
          loadDepartments();
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800' },
      Inactive: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.Inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage hotel departments and their details</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search departments..."
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ search: '', status: '', page: 1, limit: 10 })}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Departments Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {departments.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Departments Found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first department.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            </div>
          </div>
        ) : (
          departments.map((department) => (
            <motion.div
              key={department._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {department.department_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Code: {department.department_code}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusBadge(department.status)}
                  </div>
                </div>

                {/* Description */}
                {department.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {department.description}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {department.staff_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Staff Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {department.active_staff_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Active Staff</div>
                  </div>
                </div>

                {/* Manager */}
                {department.manager && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Department Manager</div>
                    <div className="text-sm font-medium text-gray-900">
                      {department.manager.full_name}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(department.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDepartment(department._id)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditDepartment(department)}
                      className="text-green-600 hover:text-green-800 p-1 rounded"
                      title="Edit Department"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="bg-white rounded-lg shadow-md px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.current_page - 1) * pagination.per_page + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total_records)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total_records}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.total_pages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.total_pages ||
                      (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.current_page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === pagination.current_page - 2 ||
                      page === pagination.current_page + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.total_pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <DepartmentModal
        isOpen={showAddModal}
        mode="add"
        onClose={() => {
          setShowAddModal(false);
          setSelectedDepartment(null);
        }}
        onSuccess={loadDepartments}
      />

      <DepartmentModal
        isOpen={showEditModal}
        mode="edit"
        departmentData={selectedDepartment}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDepartment(null);
        }}
        onSuccess={loadDepartments}
      />

      <DepartmentModal
        isOpen={showViewModal}
        mode="view"
        departmentData={selectedDepartment}
        onClose={() => {
          setShowViewModal(false);
          setSelectedDepartment(null);
        }}
      />
    </div>
  );
};

export default DepartmentManagement;