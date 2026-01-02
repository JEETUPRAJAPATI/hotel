import React, { useState } from 'react';
import CommonSidebar from './sidebar/CommonSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop only visible, mobile only when open */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:z-30
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <CommonSidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          onNavItemClick={() => setMobileSidebarOpen(false)}
        />
      </div>
      
      {/* Top Navigation */}
      <AdminNavbar onMenuClick={toggleMobileSidebar} />
      
      {/* Main Content - No margin on mobile, margin on desktop */}
      <div className={`pt-16 lg:pt-20 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <div className="w-full overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;