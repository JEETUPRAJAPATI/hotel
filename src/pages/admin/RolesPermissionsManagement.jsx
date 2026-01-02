import React, { useState } from 'react';
import { Shield, Users } from 'lucide-react';
import RoleList from '../../components/roles/RoleList';
import UserAssignment from '../../components/roles/UserAssignment';

const RolesPermissionsManagement = () => {
  const [activeTab, setActiveTab] = useState('roles');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Roles & Permissions
          </h1>
        </div>
        <p className="text-gray-600">
          Manage user roles, permissions, and access control
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'roles'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4" />
              Role Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4" />
              User Assignment
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'roles' && <RoleList />}
          {activeTab === 'users' && <UserAssignment />}
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionsManagement;
