import React from 'react';

const Housekeeping = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Housekeeping Management</h2>
        <p className="text-gray-600">Oversee housekeeping operations and staff.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Room Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Clean & Ready:</span>
              <span className="font-semibold text-green-600">125</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="font-semibold text-orange-600">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dirty:</span>
              <span className="font-semibold text-red-600">8</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Staff Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">On Duty:</span>
              <span className="font-semibold">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Break:</span>
              <span className="font-semibold">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Off Duty:</span>
              <span className="font-semibold">5</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tasks</h3>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              Room 201 - Deep Clean
            </div>
            <div className="bg-gray-50 p-2 rounded">
              Room 315 - Maintenance Check
            </div>
            <div className="bg-gray-50 p-2 rounded">
              Laundry - Express Service
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Housekeeping;