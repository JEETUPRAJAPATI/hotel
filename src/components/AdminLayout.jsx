import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Top Navigation */}
      <AdminNavbar />
      
      {/* Main Content */}
      <div className="lg:ml-72 pt-20">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;