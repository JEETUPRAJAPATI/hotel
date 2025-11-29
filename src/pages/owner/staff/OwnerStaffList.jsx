import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  X,
  Building,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  MoreVertical,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OwnerStaffList = () => {
  const navigate = useNavigate();
  
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const itemsPerPage = 10;

  // Mock staff data
  const mockStaff = [
    {
      id: 1,
      name: 'John Smith',
      employee_id: 'EMP001',
      email: 'john.smith@hotel.com',
      phone: '+91 98765 43210',
      department: 'Front Office',
      position: 'Front Desk Manager',
      status: 'active',
      hire_date: '2023-01-15',
      salary: 45000,
      address: '123 Main Street, Mumbai',
      emergency_contact: '+91 98765 43211',
      avatar: '',
      shift: 'Morning',
      reporting_to: 'General Manager'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      employee_id: 'EMP002',
      email: 'sarah.johnson@hotel.com',
      phone: '+91 87654 32109',
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      status: 'active',
      hire_date: '2023-02-20',
      salary: 35000,
      address: '456 Park Avenue, Mumbai',
      emergency_contact: '+91 87654 32110',
      avatar: '',
      shift: 'Morning',
      reporting_to: 'Housekeeping Manager'
    },
    {
      id: 3,
      name: 'Michael Chen',
      employee_id: 'EMP003',
      email: 'michael.chen@hotel.com',
      phone: '+91 76543 21098',
      department: 'Restaurant',
      position: 'Head Chef',
      status: 'active',
      hire_date: '2022-11-10',
      salary: 55000,
      address: '789 Restaurant Row, Mumbai',
      emergency_contact: '+91 76543 21099',
      avatar: '',
      shift: 'Evening',
      reporting_to: 'F&B Manager'
    },
    {
      id: 4,
      name: 'Emily Davis',
      employee_id: 'EMP004',
      email: 'emily.davis@hotel.com',
      phone: '+91 65432 10987',
      department: 'Security',
      position: 'Security Guard',
      status: 'inactive',
      hire_date: '2023-03-05',
      salary: 25000,
      address: '321 Security Lane, Mumbai',
      emergency_contact: '+91 65432 10988',
      avatar: '',
      shift: 'Night',
      reporting_to: 'Security Manager'
    },
    {
      id: 5,
      name: 'Robert Wilson',
      employee_id: 'EMP005',
      email: 'robert.wilson@hotel.com',
      phone: '+91 54321 09876',
      department: 'Maintenance',
      position: 'Maintenance Technician',
      status: 'active',
      hire_date: '2023-04-12',
      salary: 30000,
      address: '654 Workshop Street, Mumbai',
      emergency_contact: '+91 54321 09877',
      avatar: '',
      shift: 'Morning',
      reporting_to: 'Maintenance Manager'
    }
  ];

  const departments = ['Front Office', 'Housekeeping', 'Restaurant', 'Security', 'Maintenance', 'Accounts', 'HR'];

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStaff(mockStaff);
    } catch (error) {
      console.error('Error loading staff:', error);
      toast.error('Failed to load staff data');
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDepartmentFilter = (department) => {
    setDepartmentFilter(department);
    setCurrentPage(1);
  };

  const handleSelectStaff = (id) => {
    setSelectedStaff(prev =>
      prev.includes(id)
        ? prev.filter(staffId => staffId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStaff(filteredAndSortedStaff.map(staff => staff.id));
    } else {
      setSelectedStaff([]);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStaff(prev =>
        prev.map(staff =>
          staff.id === id ? { ...staff, status: newStatus } : staff
        )
      );
      toast.success(`Staff ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating staff status:', error);
      toast.error('Failed to update staff status');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setStaff(prev => prev.filter(staff => staff.id !== id));
        toast.success('Staff member deleted successfully');
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error('Failed to delete staff member');
      }
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = filteredAndSortedStaff.map(staff => ({
        'Employee ID': staff.employee_id,
        'Name': staff.name,
        'Email': staff.email,
        'Phone': staff.phone,
        'Department': staff.department,
        'Position': staff.position,
        'Status': staff.status,
        'Hire Date': staff.hire_date,
        'Salary': staff.salary,
        'Shift': staff.shift,
        'Reporting To': staff.reporting_to
      }));
      
      if (format === 'csv') {
        const csv = [Object.keys(exportData[0]).join(',')];
        exportData.forEach(row => {
          csv.push(Object.values(row).join(','));
        });
        const blob = new Blob([csv.join('\\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staff-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      toast.success(`Staff data exported as ${format.toUpperCase()} successfully`);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export staff data');
    } finally {
      setExportLoading(false);
    }
  };

  // Filter and sort staff
  const filteredAndSortedStaff = staff
    .filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredAndSortedStaff.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-red-50 text-red-700 border-red-200';
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage hotel staff members and departments</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={() => navigate('/owner/staff/attendance')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Attendance
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <button
            onClick={() => navigate('/owner/staff/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-green-900">
                {staff.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-purple-900">{departments.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{Math.round(staff.reduce((sum, s) => sum + s.salary, 0) / staff.length).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => handleDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedStaff.length} of {staff.length} staff members
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDepartmentFilter('all');
                setCurrentPage(1);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium self-start sm:self-auto"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <button
          onClick={loadStaff}
          className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {selectedStaff.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
            <span className="text-sm text-blue-700 font-medium">
              {selectedStaff.length} selected
            </span>
          </div>
        )}
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStaff.length === filteredAndSortedStaff.length && filteredAndSortedStaff.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Staff
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center gap-1">
                    Department
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th 
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {paginatedStaff.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(member.id)}
                      onChange={() => handleSelectStaff(member.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.employee_id}</div>
                        <div className="text-xs text-gray-500">{member.position}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">{member.department}</span>
                      <span className="text-xs text-gray-500">{member.shift} Shift</span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 text-sm">
                        ₹{member.salary.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">per month</span>
                    </div>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                      {getStatusIcon(member.status)}
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/owner/staff/${member.id}`)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      
                      <button
                        onClick={() => navigate(`/owner/staff/edit/${member.id}`)}
                        className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Staff"
                      >
                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      
                      {member.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(member.id, 'inactive')}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <UserX className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(member.id, 'active')}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Activate"
                        >
                          <UserCheck className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteStaff(member.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 md:px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedStaff.length)} of{' '}
              {filteredAndSortedStaff.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  return page <= totalPages ? (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm border rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedStaff.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first staff member to get started'}
            </p>
            <button
              onClick={() => navigate('/owner/staff/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Staff Member
            </button>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowExportModal(false)} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-lg p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Export Staff Data</h3>
                  <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Export {filteredAndSortedStaff.length} staff records
                  </p>
                  
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={exportLoading}
                    className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">CSV Format</div>
                      <div className="text-sm text-gray-500">Excel compatible</div>
                    </div>
                  </button>
                  
                  {exportLoading && (
                    <div className="flex items-center justify-center py-4">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm text-gray-600">Preparing export...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerStaffList;