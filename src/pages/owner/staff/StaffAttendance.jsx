import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Eye,
  FileText,
  CalendarDays
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StaffAttendance = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [viewType, setViewType] = useState('daily'); // daily, weekly, monthly
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [attendanceData, setAttendanceData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({});

  // Mock attendance data
  const mockAttendance = [
    {
      id: 1,
      employee_id: 'EMP001',
      name: 'John Smith',
      department: 'Front Office',
      position: 'Front Desk Manager',
      date: '2024-01-15',
      check_in: '09:00',
      check_out: '18:00',
      break_time: '60',
      total_hours: '8.0',
      overtime: '0.0',
      status: 'present',
      shift: 'morning',
      notes: ''
    },
    {
      id: 2,
      employee_id: 'EMP002',
      name: 'Sarah Johnson',
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      date: '2024-01-15',
      check_in: '08:30',
      check_out: '17:30',
      break_time: '45',
      total_hours: '8.25',
      overtime: '0.25',
      status: 'present',
      shift: 'morning',
      notes: 'Early arrival'
    },
    {
      id: 3,
      employee_id: 'EMP003',
      name: 'Michael Chen',
      department: 'Restaurant',
      position: 'Head Chef',
      date: '2024-01-15',
      check_in: '14:00',
      check_out: '23:00',
      break_time: '60',
      total_hours: '8.0',
      overtime: '0.0',
      status: 'present',
      shift: 'evening',
      notes: ''
    },
    {
      id: 4,
      employee_id: 'EMP004',
      name: 'Emily Davis',
      department: 'Security',
      position: 'Security Guard',
      date: '2024-01-15',
      check_in: '',
      check_out: '',
      break_time: '',
      total_hours: '0.0',
      overtime: '0.0',
      status: 'absent',
      shift: 'night',
      notes: 'Sick leave'
    },
    {
      id: 5,
      employee_id: 'EMP005',
      name: 'Robert Wilson',
      department: 'Maintenance',
      position: 'Maintenance Technician',
      date: '2024-01-15',
      check_in: '09:30',
      check_out: '18:30',
      break_time: '60',
      total_hours: '8.0',
      overtime: '0.0',
      status: 'late',
      shift: 'morning',
      notes: 'Late arrival - traffic'
    }
  ];

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Security', 'Maintenance', 'Accounts', 'HR'];

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate, viewType]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAttendanceData(mockAttendance);
      
      // Calculate summary stats
      const totalStaff = mockAttendance.length;
      const presentStaff = mockAttendance.filter(a => a.status === 'present').length;
      const absentStaff = mockAttendance.filter(a => a.status === 'absent').length;
      const lateStaff = mockAttendance.filter(a => a.status === 'late').length;
      const avgWorkingHours = mockAttendance
        .filter(a => a.total_hours > 0)
        .reduce((sum, a) => sum + parseFloat(a.total_hours), 0) / (totalStaff - absentStaff);
      
      setSummaryStats({
        totalStaff,
        presentStaff,
        absentStaff,
        lateStaff,
        attendanceRate: ((presentStaff + lateStaff) / totalStaff * 100).toFixed(1),
        avgWorkingHours: avgWorkingHours.toFixed(1)
      });
      
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleMarkAttendance = async (employeeId, status) => {
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      
      setAttendanceData(prev =>
        prev.map(record =>
          record.employee_id === employeeId
            ? {
                ...record,
                status: status,
                check_in: status === 'present' && !record.check_in ? currentTime : record.check_in,
                check_out: status === 'present' && record.check_in && !record.check_out ? currentTime : record.check_out
              }
            : record
        )
      );
      
      toast.success(`Attendance marked as ${status}`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  const handleExportReport = async () => {
    try {
      // Mock export functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const exportData = filteredAndSortedData.map(record => ({
        'Employee ID': record.employee_id,
        'Name': record.name,
        'Department': record.department,
        'Date': record.date,
        'Check In': record.check_in || '-',
        'Check Out': record.check_out || '-',
        'Total Hours': record.total_hours,
        'Overtime': record.overtime,
        'Status': record.status,
        'Shift': record.shift,
        'Notes': record.notes || '-'
      }));
      
      const csv = [Object.keys(exportData[0]).join(',')];
      exportData.forEach(row => {
        csv.push(Object.values(row).join(','));
      });
      
      const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${selectedDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Attendance report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  // Filter and sort data
  const filteredAndSortedData = attendanceData
    .filter(record => {
      const matchesSearch = 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-50 text-green-700 border-green-200';
      case 'absent': return 'bg-red-50 text-red-700 border-red-200';
      case 'late': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/owner/staff')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Staff Attendance</h1>
          <p className="text-gray-600">Track and manage daily staff attendance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadAttendanceData}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Date and View Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('daily')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewType === 'daily'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewType('weekly')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewType === 'weekly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewType('monthly')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewType === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalStaff}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-900">{summaryStats.presentStaff}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-900">{summaryStats.absentStaff}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-orange-900">{summaryStats.lateStaff}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-purple-900">{summaryStats.attendanceRate}%</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Hours</p>
              <p className="text-2xl font-bold text-indigo-900">{summaryStats.avgWorkingHours}h</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setDepartmentFilter('all');
              setStatusFilter('all');
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Staff
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center gap-1">
                    Department
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedData.map((record) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{record.name}</div>
                        <div className="text-sm text-gray-500">{record.employee_id}</div>
                        <div className="text-sm text-gray-500">{record.position}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{record.department}</div>
                      <div className="text-sm text-gray-500 capitalize">{record.shift} Shift</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-gray-500">In:</span>
                        <span className="font-medium text-gray-900">
                          {record.check_in || '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-gray-500">Out:</span>
                        <span className="font-medium text-gray-900">
                          {record.check_out || '-'}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {record.total_hours}h
                      </div>
                      {parseFloat(record.overtime) > 0 && (
                        <div className="text-xs text-orange-600">
                          +{record.overtime}h OT
                        </div>
                      )}
                      {record.break_time && (
                        <div className="text-xs text-gray-500">
                          {record.break_time}m break
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-[150px] truncate">
                      {record.notes || '-'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {record.status === 'absent' && (
                        <button
                          onClick={() => handleMarkAttendance(record.employee_id, 'present')}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark Present"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      
                      {record.status !== 'absent' && (
                        <button
                          onClick={() => handleMarkAttendance(record.employee_id, 'absent')}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Mark Absent"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => navigate(`/owner/staff/${record.employee_id}/attendance`)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || departmentFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No attendance data available for the selected date'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAttendance;