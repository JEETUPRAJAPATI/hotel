import React, { useState, useEffect } from 'react';
import { X, Save, Shield, AlertCircle } from 'lucide-react';
import { sidebarPermissions } from '../../data/roleMockData';

const RoleFormModal = ({ role = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    isSystemRole: false,
    permissions: {}
  });
  const [errors, setErrors] = useState({});
  const [fullAccess, setFullAccess] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        status: role.status || 'Active',
        isSystemRole: role.isSystemRole || false,
        permissions: role.permissions || {}
      });
      checkFullAccess(role.permissions || {});
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'Active',
        isSystemRole: false,
        permissions: {}
      });
      setFullAccess(false);
    }
    setErrors({});
  }, [role]);

  const checkFullAccess = (permissions) => {
    const allEnabled = sidebarPermissions.every(perm => {
      const p = permissions[perm.id];
      return p && p.view && p.create && p.edit && p.delete && p.export;
    });
    setFullAccess(allEnabled);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFullAccessToggle = () => {
    const newFullAccess = !fullAccess;
    setFullAccess(newFullAccess);
    
    if (newFullAccess) {
      const allPermissions = {};
      sidebarPermissions.forEach(perm => {
        allPermissions[perm.id] = {
          view: true,
          create: true,
          edit: true,
          delete: true,
          export: true
        };
      });
      setFormData(prev => ({ ...prev, permissions: allPermissions }));
    } else {
      setFormData(prev => ({ ...prev, permissions: {} }));
    }
  };

  const handlePermissionChange = (permissionId, action, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: {
          ...(prev.permissions[permissionId] || {}),
          [action]: value
        }
      }
    }));
    setFullAccess(false);
  };

  const handlePermissionRowToggle = (permissionId) => {
    const currentPerm = formData.permissions[permissionId] || {};
    const allEnabled = currentPerm.view && currentPerm.create && currentPerm.edit && currentPerm.delete && currentPerm.export;
    
    const newValue = !allEnabled;
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: {
          view: newValue,
          create: newValue,
          edit: newValue,
          delete: newValue,
          export: newValue
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Role description is required';
    }
    const hasPermissions = Object.keys(formData.permissions).some(key => 
      Object.values(formData.permissions[key]).some(val => val === true)
    );
    if (!hasPermissions) {
      newErrors.permissions = 'At least one permission must be granted';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const permissionCount = Object.keys(formData.permissions).filter(key => 
        Object.values(formData.permissions[key]).some(val => val === true)
      ).length;

      const roleData = {
        ...formData,
        id: role ? role.id : Date.now().toString(),
        permissionCount,
        createdAt: role ? role.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSave(roleData, role ? 'edit' : 'create');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {role ? 'Edit Role' : 'Create New Role'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter role name"
                    disabled={role?.isSystemRole}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the role and its responsibilities"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fullAccess}
                    onChange={handleFullAccessToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Full Access</span>
                </label>
              </div>

              {errors.permissions && (
                <p className="mb-3 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.permissions}
                </p>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Module
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                          View
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                          Create
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                          Edit
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                          Delete
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                          Export
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                          All
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sidebarPermissions.map((permission) => {
                        const perm = formData.permissions[permission.id] || {};
                        const allEnabled = perm.view && perm.create && perm.edit && perm.delete && perm.export;
                        
                        return (
                          <tr key={permission.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {permission.name}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.view || false}
                                onChange={(e) => handlePermissionChange(permission.id, 'view', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.create || false}
                                onChange={(e) => handlePermissionChange(permission.id, 'create', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.edit || false}
                                onChange={(e) => handlePermissionChange(permission.id, 'edit', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.delete || false}
                                onChange={(e) => handlePermissionChange(permission.id, 'delete', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.export || false}
                                onChange={(e) => handlePermissionChange(permission.id, 'export', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={allEnabled}
                                onChange={() => handlePermissionRowToggle(permission.id)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Save className="h-4 w-4" />
              {role ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormModal;
