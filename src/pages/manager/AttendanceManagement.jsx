import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  ChevronDown,
  CalendarDays,
  Timer,
  Building
} from 'lucide-react';
import { attendanceAPI, staffAPI } from '../services/staffService';
import LoadingSpinner from '../components/LoadingSpinner';
import AttendanceModal from '../components/AttendanceModal';
import toast from 'react-hot-toast';

const AttendanceManagement = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
    staff_id: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // Load initial data
  useEffect(() => {
    loadAttendance();
    loadStaff();
  }, [filters]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAttendance({
        ...filters,
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3' // Replace with actual hotel ID
      });

      if (response.data.success) {
        setAttendance(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const response = await staffAPI.getStaff({
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3', // Replace with actual hotel ID
        status: 'Active',
        limit: 100 // Get all active staff
      });

      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
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
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const handleViewAttendance = async (attendanceId) => {
    try {
      const response = await attendanceAPI.getAttendanceById(attendanceId);
      if (response.data.success) {
        setSelectedAttendance(response.data.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error loading attendance details:', error);
      toast.error('Failed to load attendance details');
    }
  };

  const handleEditAttendance = (attendanceRecord) => {
    setSelectedAttendance(attendanceRecord);
    setShowEditModal(true);
  };

  const handleDeleteAttendance = async (attendanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        const response = await attendanceAPI.deleteAttendance(attendanceId);
        if (response.data.success) {
          toast.success('Attendance record deleted successfully');
          loadAttendance();
        }
      } catch (error) {
        console.error('Error deleting attendance:', error);
        toast.error('Failed to delete attendance record');
      }
    }
  };

  const handleBulkMarkAttendance = async (status) => {
    if (selectedRows.length === 0) {
      toast.error('Please select attendance records first');
      return;
    }

    try {
      const response = await attendanceAPI.bulkUpdateAttendance(selectedRows, { status });
      if (response.data.success) {
        toast.success(`Marked ${selectedRows.length} records as ${status}`);
        setSelectedRows([]);
        loadAttendance();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance records');
    }
  };

  const handleExportAttendance = async () => {
    try {
      const response = await attendanceAPI.exportAttendance({
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3',
        ...filters,
        format: 'xlsx'
      });

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${filters.date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Attendance exported successfully');
    } catch (error) {
      console.error('Error exporting attendance:', error);
      toast.error('Failed to export attendance');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Present: { icon: CheckCircle, color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
      Absent: { icon: XCircle, color: 'red', bg: 'bg-red-100', text: 'text-red-800' },
      Late: { icon: Clock, color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Half Day': { icon: AlertTriangle, color: 'orange', bg: 'bg-orange-100', text: 'text-orange-800' }
    };

    const config = statusConfig[status] || statusConfig.Absent;
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

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'N/A';
    
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    const diff = checkOutTime - checkInTime;
    
    if (diff < 0) return 'Invalid';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage staff attendance records</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Mark Attendance
          </button>

          <button
            onClick={() => navigate('/manager/staff')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Staff
          </button>

          <button
            onClick={() => navigate('/manager/departments')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Building className="w-4 h-4" />
            Departments
          </button>

          <button
            onClick={handleExportAttendance}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search staff..."
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Staff Filter */}
          <div className="relative">
            <select
              value={filters.staff_id}
              onChange={(e) => handleFilterChange('staff_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Staff</option>
              {staff.map(member => (
                <option key={member._id} value={member._id}>{member.full_name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ 
              search: '', 
              date: new Date().toISOString().split('T')[0],
              status: '', 
              staff_id: '', 
              page: 1, 
              limit: 10 
            })}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedRows.length} record(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkMarkAttendance('Present')}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  <UserCheck className="w-3 h-3" />
                  Mark Present
                </button>
                <button
                  onClick={() => handleBulkMarkAttendance('Absent')}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  <UserX className="w-3 h-3" />
                  Mark Absent
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(attendance.map(a => a._id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <CalendarDays className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">No Attendance Records Found</p>
                    <p>Start by marking attendance for today.</p>
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(record._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, record._id]);
                          } else {
                            setSelectedRows(selectedRows.filter(id => id !== record._id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {record.staff_id?.profile_image ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={record.staff_id?.profile_image}
                              alt={record.staff_id?.full_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.staff_id?.full_name || 'Unknown Staff'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.staff_id?.designation || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatTime(record.check_in_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatTime(record.check_out_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Timer className="w-4 h-4 text-gray-400" />
                        {calculateWorkingHours(record.check_in_time, record.check_out_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewAttendance(record._id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditAttendance(record)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Edit Attendance"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAttendance(record._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
      </motion.div>

      {/* Modals */}
      <AttendanceModal
        isOpen={showAddModal}
        mode="add"
        onClose={() => {
          setShowAddModal(false);
          setSelectedAttendance(null);
        }}
        onSuccess={loadAttendance}
      />

      <AttendanceModal
        isOpen={showEditModal}
        mode="edit"
        attendanceData={selectedAttendance}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAttendance(null);
        }}
        onSuccess={loadAttendance}
      />

      <AttendanceModal
        isOpen={showViewModal}
        mode="view"
        attendanceData={selectedAttendance}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAttendance(null);
        }}
      />
    </div>
  );
};

export default AttendanceManagement;