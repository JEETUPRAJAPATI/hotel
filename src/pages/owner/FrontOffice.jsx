import React from 'react';

const FrontOffice = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Front Office Operations</h2>
        <p className="text-gray-600">Monitor front desk operations across all properties.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Current Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Available Rooms:</span>
              <span className="font-semibold">28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Occupied Rooms:</span>
              <span className="font-semibold">142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maintenance:</span>
              <span className="font-semibold text-orange-600">5</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Check-in: Room 205</span>
              <span className="text-gray-500">10:30 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out: Room 318</span>
              <span className="text-gray-500">11:15 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Maintenance: Room 402</span>
              <span className="text-gray-500">11:45 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontOffice;