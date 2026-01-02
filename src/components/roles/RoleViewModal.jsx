import React from 'react';
import { X, Shield, Check, XCircle } from 'lucide-react';
import { sidebarPermissions } from '../../data/roleMockData';

const RoleViewModal = ({ role, onClose }) => {
  if (!role) return null;

  const getPermissionIcon = (hasPermission) => {
    return hasPermission ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-300" />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{role.name}</h2>
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Role Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  role.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {role.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {role.isSystemRole ? 'System Role' : 'Custom Role'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Permissions</p>
                <p className="text-sm font-medium text-gray-900">
                  {role.permissionCount} modules
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(role.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions Matrix</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sidebarPermissions.map((permission) => {
                    const perm = role.permissions?.[permission.id] || {};
                    const hasAnyPermission = perm.view || perm.create || perm.edit || perm.delete || perm.export;

                    if (!hasAnyPermission) return null;

                    return (
                      <tr key={permission.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {permission.name}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getPermissionIcon(perm.view)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getPermissionIcon(perm.create)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getPermissionIcon(perm.edit)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getPermissionIcon(perm.delete)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getPermissionIcon(perm.export)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Permission Summary</h4>
                <p className="text-sm text-gray-600">
                  This role has access to <span className="font-semibold">{role.permissionCount}</span> modules 
                  with varying permission levels. {role.isSystemRole && 'This is a system role and cannot be deleted.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleViewModal;
