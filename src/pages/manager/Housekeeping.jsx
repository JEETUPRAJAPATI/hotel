import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Calendar,
  MapPin,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Filter,
  Download,
  Search,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Wind,
  Tv,
  Phone,
  ClipboardList,
  UserCheck,
  Wrench,
  Star
} from 'lucide-react';

const Housekeeping = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);
 
  const [housekeepingData, setHousekeepingData] = useState({
    overview: {
      totalRooms: 120,
      cleanRooms: 85,
      dirtyRooms: 20,
      outOfOrderRooms: 8,
      maintenanceRooms: 7
    },
    rooms: [
      {
        id: 'R101',
        number: '101',
        floor: 1,
        type: 'Standard',
        status: 'clean',
        lastCleaned: '2024-01-15 14:30',
        assignedTo: 'Maria Garcia',
        guestCheckout: '2024-01-15 12:00',
        nextCheckin: '2024-01-15 16:00',
        amenities: ['wifi', 'tv', 'phone', 'coffee'],
        priority: 'high',
        notes: 'Ready for guest arrival'
      },
      {
        id: 'R102',
        number: '102',
        floor: 1,
        type: 'Deluxe',
        status: 'dirty',
        lastCleaned: '2024-01-14 10:15',
        assignedTo: 'John Smith',
        guestCheckout: '2024-01-15 11:30',
        nextCheckin: '2024-01-15 15:00',
        amenities: ['wifi', 'tv', 'phone', 'coffee', 'bath'],
        priority: 'urgent',
        notes: 'Guest reported bathroom issue'
      },
      {
        id: 'R201',
        number: '201',
        floor: 2,
        type: 'Suite',
        status: 'maintenance',
        lastCleaned: '2024-01-13 16:45',
        assignedTo: 'Technical Team',
        guestCheckout: null,
        nextCheckin: null,
        amenities: ['wifi', 'tv', 'phone', 'coffee', 'bath', 'car'],
        priority: 'medium',
        notes: 'Air conditioning repair needed'
      },
      {
        id: 'R205',
        number: '205',
        floor: 2,
        type: 'Presidential',
        status: 'occupied',
        lastCleaned: '2024-01-15 09:00',
        assignedTo: 'Elite Team',
        guestCheckout: null,
        nextCheckin: null,
        amenities: ['wifi', 'tv', 'phone', 'coffee', 'bath', 'car', 'wind'],
        priority: 'high',
        notes: 'VIP guest - special attention required'
      }
    ],
    staff: [
      {
        id: 'S001',
        name: 'Maria Garcia',
        role: 'Senior Housekeeper',
        shift: 'Morning (6:00-14:00)',
        roomsAssigned: 12,
        roomsCompleted: 8,
        status: 'active',
        performance: 95
      },
      {
        id: 'S002',
        name: 'John Smith',
        role: 'Housekeeper',
        shift: 'Afternoon (14:00-22:00)',
        roomsAssigned: 10,
        roomsCompleted: 6,
        status: 'active',
        performance: 88
      },
      {
        id: 'S003',
        name: 'Sarah Johnson',
        role: 'Maintenance Staff',
        shift: 'Full Day (8:00-16:00)',
        roomsAssigned: 5,
        roomsCompleted: 3,
        status: 'break',
        performance: 92
      }
    ],
    tasks: [
      {
        id: 'T001',
        type: 'cleaning',
        room: 'R102',
        title: 'Standard Room Cleaning',
        description: 'Complete cleaning and restocking',
        assignedTo: 'John Smith',
        priority: 'urgent',
        estimatedTime: 45,
        status: 'in_progress',
        createdAt: '2024-01-15 13:00'
      },
      {
        id: 'T002',
        type: 'maintenance',
        room: 'R201',
        title: 'AC Repair',
        description: 'Fix air conditioning unit - not cooling properly',
        assignedTo: 'Technical Team',
        priority: 'medium',
        estimatedTime: 120,
        status: 'pending',
        createdAt: '2024-01-15 12:30'
      }
    ]
  });

  const [newTask, setNewTask] = useState({
    type: 'cleaning',
    room: '',
    title: '',
    description: '',
    priority: 'medium',
    estimatedTime: 30
  });

  const [newRoom, setNewRoom] = useState({
    number: '',
    floor: 1,
    type: 'Standard',
    amenities: [],
    assignedTo: '',
    notes: ''
  });

  const statusConfig = {
    clean: { label: 'Clean', color: 'green', icon: CheckCircle },
    dirty: { label: 'Dirty', color: 'red', icon: XCircle },
    occupied: { label: 'Occupied', color: 'blue', icon: Users },
    maintenance: { label: 'Maintenance', color: 'yellow', icon: Wrench },
    out_of_order: { label: 'Out of Order', color: 'gray', icon: AlertCircle }
  };

  const priorityConfig = {
    low: { label: 'Low', color: 'gray' },
    medium: { label: 'Medium', color: 'yellow' },
    high: { label: 'High', color: 'orange' },
    urgent: { label: 'Urgent', color: 'red' }
  };

  const amenityIcons = {
    wifi: Wifi,
    tv: Tv,
    phone: Phone,
    coffee: Coffee,
    bath: Bath,
    car: Car,
    wind: Wind,
    bed: Bed
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.clean;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  const filteredRooms = housekeepingData.rooms.filter(room => {
    const matchesStatus = selectedStatus === 'all' || room.status === selectedStatus;
    const matchesFloor = selectedFloor === 'all' || room.floor.toString() === selectedFloor;
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesFloor && matchesSearch;
  });

  const handleCreateTask = () => {
    console.log('Creating task:', newTask);
    setShowTaskModal(false);
    setNewTask({
      type: 'cleaning',
      room: '',
      title: '',
      description: '',
      priority: 'medium',
      estimatedTime: 30
    });
  };

  const handleRoomStatusUpdate = (roomId, newStatus) => {
    setHousekeepingData(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === roomId ? { ...room, status: newStatus } : room
      )
    }));
  };

  const handleCreateRoom = () => {
    const roomId = `R${newRoom.number}`;
    const room = {
      id: roomId,
      number: newRoom.number,
      floor: newRoom.floor,
      type: newRoom.type,
      status: 'clean',
      lastCleaned: new Date().toISOString(),
      assignedTo: newRoom.assignedTo,
      guestCheckout: null,
      nextCheckin: null,
      amenities: newRoom.amenities,
      priority: 'medium',
      notes: newRoom.notes
    };

    setHousekeepingData(prev => ({
      ...prev,
      rooms: [...prev.rooms, room]
    }));

    setShowRoomModal(false);
    setNewRoom({
      number: '',
      floor: 1,
      type: 'Standard',
      amenities: [],
      assignedTo: '',
      notes: ''
    });
  };

  const handleEditRoom = () => {
    setHousekeepingData(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === editingRoom.id ? { ...room, ...editingRoom } : room
      )
    }));
    setShowEditModal(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = () => {
    setHousekeepingData(prev => ({
      ...prev,
      rooms: prev.rooms.filter(room => room.id !== deletingRoom.id)
    }));
    setShowDeleteModal(false);
    setDeletingRoom(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Housekeeping Management</h1>
            <p className="text-gray-600">Manage room status, cleaning schedules, and maintenance tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button 
              onClick={() => setShowRoomModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>
            <button 
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{housekeepingData.overview.totalRooms}</p>
            </div>
            <Home className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clean Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{housekeepingData.overview.cleanRooms}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dirty Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{housekeepingData.overview.dirtyRooms}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{housekeepingData.overview.maintenanceRooms}</p>
            </div>
            <Wrench className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Order</p>
              <p className="text-2xl font-bold text-gray-900">{housekeepingData.overview.outOfOrderRooms}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Rooms</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by room number, type, or staff..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="clean">Clean</option>
              <option value="dirty">Dirty</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="out_of_order">Out of Order</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Bulk Actions
            </button>
          </div>
        </div>
      </motion.div>

      {/* Room Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Room {room.number}</h3>
                <p className="text-sm text-gray-600">{room.type}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(room.status)}
                {getPriorityBadge(room.priority)}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                Floor {room.floor}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserCheck className="w-4 h-4" />
                {room.assignedTo}
              </div>
              
              {room.lastCleaned && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  Last cleaned: {new Date(room.lastCleaned).toLocaleString()}
                </div>
              )}
              
              {room.nextCheckin && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Next check-in: {new Date(room.nextCheckin).toLocaleString()}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity];
                return Icon ? (
                  <div key={amenity} className="p-1 bg-gray-100 rounded">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                ) : null;
              })}
            </div>

            {room.notes && (
              <div className="text-xs text-gray-500 mb-4 italic">
                {room.notes}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowViewModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                
                <button 
                  onClick={() => {
                    setEditingRoom(room);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={room.status}
                  onChange={(e) => handleRoomStatusUpdate(room.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="clean">Mark Clean</option>
                  <option value="dirty">Mark Dirty</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out_of_order">Out of Order</option>
                </select>
                
                <button 
                  onClick={() => {
                    setDeletingRoom(room);
                    setShowDeleteModal(true);
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Staff Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Staff Performance</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm">Manage Staff</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {housekeepingData.staff.map((staff) => (
            <div key={staff.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{staff.name}</h4>
                  <p className="text-sm text-gray-600">{staff.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{staff.performance}%</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Shift:</span>
                  <span>{staff.shift}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rooms Assigned:</span>
                  <span>{staff.roomsAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="text-green-600">{staff.roomsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`capitalize ${staff.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {staff.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(staff.roomsCompleted / staff.roomsAssigned) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((staff.roomsCompleted / staff.roomsAssigned) * 100)}% progress
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Current Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Tasks</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm">View All Tasks</button>
        </div>

        <div className="space-y-4">
          {housekeepingData.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${task.type === 'cleaning' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                  {task.type === 'cleaning' ? 
                    <ClipboardList className={`w-5 h-5 ${task.type === 'cleaning' ? 'text-blue-600' : 'text-yellow-600'}`} /> :
                    <Wrench className={`w-5 h-5 ${task.type === 'cleaning' ? 'text-blue-600' : 'text-yellow-600'}`} />
                  }
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">Room {task.room} • {task.assignedTo}</p>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {getPriorityBadge(task.priority)}
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {task.estimatedTime}min
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                <input
                  type="text"
                  value={newTask.room}
                  onChange={(e) => setNewTask({...newTask, room: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., R101"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief task description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Detailed task instructions..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Est. Time (min)</label>
                  <input
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    max="480"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Room</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                <input
                  type="text"
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({...newRoom, number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 101"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                <select
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({...newRoom, floor: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Floor 1</option>
                  <option value={2}>Floor 2</option>
                  <option value={3}>Floor 3</option>
                  <option value={4}>Floor 4</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <input
                  type="text"
                  value={newRoom.assignedTo}
                  onChange={(e) => setNewRoom({...newRoom, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff member name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newRoom.notes}
                  onChange={(e) => setNewRoom({...newRoom, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRoomModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Room
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Room Modal */}
      {showViewModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Room {selectedRoom.number} Details</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Room Number</label>
                  <p className="text-gray-900">{selectedRoom.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Floor</label>
                  <p className="text-gray-900">Floor {selectedRoom.floor}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{selectedRoom.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  {getStatusBadge(selectedRoom.status)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Assigned To</label>
                <p className="text-gray-900">{selectedRoom.assignedTo}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Last Cleaned</label>
                <p className="text-gray-900">{new Date(selectedRoom.lastCleaned).toLocaleString()}</p>
              </div>
              
              {selectedRoom.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-gray-900">{selectedRoom.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Room {editingRoom.number}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={editingRoom.type}
                  onChange={(e) => setEditingRoom({...editingRoom, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <input
                  type="text"
                  value={editingRoom.assignedTo}
                  onChange={(e) => setEditingRoom({...editingRoom, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editingRoom.notes}
                  onChange={(e) => setEditingRoom({...editingRoom, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRoom}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Update Room
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Room Modal */}
      {showDeleteModal && deletingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Room {deletingRoom.number}</h3>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete Room {deletingRoom.number}? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Room
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Housekeeping;