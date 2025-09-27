import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building,
  User,
  FileText,
  Save,
  AlertCircle,
  Users
} from 'lucide-react';
import { departmentAPI, staffAPI } from '../services/staffService';
import toast from 'react-hot-toast';

const DepartmentModal = ({ 
  isOpen, 
  onClose, 
  mode = 'add', // 'add', 'edit', 'view'
  departmentData = null,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    department_name: '',
    department_code: '',
    description: '',
    manager_id: '',
    status: 'Active'
  });

  const [staff, setStaff] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load staff and initialize form data
  useEffect(() => {
    if (isOpen) {
      loadStaff();
      if (mode === 'edit' && departmentData) {
        setFormData({
          department_name: departmentData.department_name || '',
          department_code: departmentData.department_code || '',
          description: departmentData.description || '',
          manager_id: departmentData.manager_id?._id || '',
          status: departmentData.status || 'Active'
        });
      } else {
        // Reset form for add mode
        setFormData({
          department_name: '',
          department_code: '',
          description: '',
          manager_id: '',
          status: 'Active'
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, departmentData]);

  const loadStaff = async () => {
    try {
      const response = await staffAPI.getStaff({
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3', // Replace with actual hotel ID
        status: 'Active',
        limit: 100 // Get all active staff for manager selection
      });

      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-generate department code from name
    if (name === 'department_name' && mode === 'add') {
      const code = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 6);
      setFormData(prev => ({
        ...prev,
        department_code: code
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.department_name.trim()) {
      newErrors.department_name = 'Department name is required';
    }

    if (!formData.department_code.trim()) {
      newErrors.department_code = 'Department code is required';
    } else if (!/^[A-Z0-9]{2,10}$/.test(formData.department_code)) {
      newErrors.department_code = 'Department code must be 2-10 uppercase letters/numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3' // Replace with actual hotel ID
      };

      // Remove empty manager_id
      if (!submitData.manager_id) {
        delete submitData.manager_id;
      }

      let response;
      if (mode === 'edit') {
        response = await departmentAPI.updateDepartment(departmentData._id, submitData);
      } else {
        response = await departmentAPI.createDepartment(submitData);
      }

      if (response.data.success) {
        toast.success(`Department ${mode === 'edit' ? 'updated' : 'created'} successfully`);
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving department:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} department`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'add' && 'Add New Department'}
              {mode === 'edit' && 'Edit Department'}
              {mode === 'view' && 'Department Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="department_name"
                    value={formData.department_name}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.department_name ? 'border-red-500' : 'border-gray-300'
                    } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                    placeholder="Enter department name"
                  />
                </div>
                {errors.department_name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.department_name}
                  </p>
                )}
              </div>

              {/* Department Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code *
                </label>
                <input
                  type="text"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleInputChange}
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department_code ? 'border-red-500' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                  placeholder="Enter department code (e.g., FRONT, HOUSE, MAINT)"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.department_code && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.department_code}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  2-10 characters, uppercase letters and numbers only
                </p>
              </div>

              {/* Manager */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Manager
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="manager_id"
                    value={formData.manager_id}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      mode === 'view' ? 'bg-gray-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Manager (Optional)</option>
                    {staff.map(member => (
                      <option key={member._id} value={member._id}>
                        {member.full_name} - {member.designation}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Choose a staff member to manage this department
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    rows="4"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      mode === 'view' ? 'bg-gray-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe the department's responsibilities and purpose..."
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    mode === 'view' ? 'bg-gray-50' : 'border-gray-300'
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* View mode additional details */}
              {mode === 'view' && departmentData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Staff
                    </label>
                    <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                      <Users className="w-5 h-5" />
                      {departmentData.staff_count || 0}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active Staff
                    </label>
                    <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                      <Users className="w-5 h-5" />
                      {departmentData.active_staff_count || 0}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Created
                    </label>
                    <div className="text-sm text-gray-600">
                      {new Date(departmentData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Updated
                    </label>
                    <div className="text-sm text-gray-600">
                      {new Date(departmentData.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {mode === 'view' ? 'Close' : 'Cancel'}
              </button>
              
              {mode !== 'view' && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {mode === 'edit' ? 'Update Department' : 'Create Department'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DepartmentModal;