import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  UserCheck,
  MoreVertical,
  MapPin,
  Star,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Shield,
  Award
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const Agents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    hotel: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, agent: null });

  // Mock data for development
  const mockAgents = [
    {
      _id: '1',
      name: 'John Anderson',
      email: 'john.anderson@hotel.com',
      phone: '+1 555-0123',
      department: 'Front Desk',
      hotel_name: 'Grand Palace Hotel',
      position: 'Senior Receptionist',
      employee_id: 'EMP001',
      hire_date: '2022-03-15',
      status: 'Active',
      performance_rating: 4.8,
      total_bookings: 245,
      monthly_target: 300,
      commission_earned: 15000,
      last_login: '2024-01-15 10:30 AM',
      profile_image: null
    },
    {
      _id: '2',
      name: 'Sarah Williams',
      email: 'sarah.williams@resort.com',
      phone: '+1 555-0124',
      department: 'Concierge',
      hotel_name: 'Ocean View Resort',
      position: 'Concierge Agent',
      employee_id: 'EMP002',
      hire_date: '2021-08-22',
      status: 'Active',
      performance_rating: 4.6,
      total_bookings: 189,
      monthly_target: 250,
      commission_earned: 12500,
      last_login: '2024-01-15 09:15 AM',
      profile_image: null
    },
    {
      _id: '3',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@lodge.com',
      phone: '+1 555-0125',
      department: 'Guest Relations',
      hotel_name: 'Mountain Lodge',
      position: 'Guest Relations Officer',
      employee_id: 'EMP003',
      hire_date: '2023-01-10',
      status: 'Training',
      performance_rating: 4.2,
      total_bookings: 67,
      monthly_target: 150,
      commission_earned: 4200,
      last_login: '2024-01-14 04:20 PM',
      profile_image: null
    }
  ];

  useEffect(() => {
    loadAgents();
  }, [filters]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      // For demo purposes, use mock data
      setTimeout(() => {
        let filteredAgents = mockAgents;
        
        if (filters.search) {
          filteredAgents = filteredAgents.filter(agent =>
            agent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            agent.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            agent.employee_id.toLowerCase().includes(filters.search.toLowerCase()) ||
            agent.department.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        if (filters.status) {
          filteredAgents = filteredAgents.filter(agent => 
            agent.status.toLowerCase() === filters.status.toLowerCase()
          );
        }

        if (filters.department) {
          filteredAgents = filteredAgents.filter(agent => 
            agent.department.toLowerCase() === filters.department.toLowerCase()
          );
        }

        setAgents(filteredAgents);
        setPagination({
          page: 1,
          totalPages: 1,
          total: filteredAgents.length,
          limit: 10
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Failed to load agents');
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
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

  const handleSelectAll = () => {
    if (selectedAgents.length === agents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(agents.map(agent => agent._id));
    }
  };

  const handleSelectAgent = (agentId) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const handleDeleteAgent = async (agent) => {
    if (window.confirm(`Are you sure you want to delete ${agent.name}?`)) {
      try {
        // await agentService.deleteAgent(agent._id);
        toast.success('Agent deleted successfully');
        loadAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
        toast.error('Failed to delete agent');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-800' },
      'Inactive': { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800' },
      'Training': { icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Suspended': { icon: XCircle, bg: 'bg-red-100', text: 'text-red-800' }
    };

    const config = statusConfig[status] || statusConfig['Inactive'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
            <p className="text-gray-600">Manage your hotel staff and agents</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/owner/agents/create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Agent
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Agents</h3>
              <p className="text-2xl font-semibold text-gray-900">{agents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Agents</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {agents.filter(agent => agent.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {agents.reduce((sum, agent) => sum + agent.total_bookings, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Commission</h3>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{agents.reduce((sum, agent) => sum + agent.commission_earned, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

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
              placeholder="Search agents..."
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Training">Training</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Departments</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Concierge">Concierge</option>
              <option value="Guest Relations">Guest Relations</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Security">Security</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Hotel Filter */}
          <div className="relative">
            <select
              value={filters.hotel}
              onChange={(e) => handleFilterChange('hotel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Hotels</option>
              <option value="grand-palace">Grand Palace Hotel</option>
              <option value="ocean-view">Ocean View Resort</option>
              <option value="mountain-lodge">Mountain Lodge</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Items per page */}
          <div className="relative">
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAgents.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedAgents.length} agent(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {}}
                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => {}}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors"
              >
                Suspend
              </button>
              <button
                onClick={() => {}}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Agents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAgents.length === agents.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department & Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
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
              {agents.map((agent) => (
                <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedAgents.includes(agent._id)}
                      onChange={() => handleSelectAgent(agent._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCheck className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        <div className="text-sm text-gray-500">{agent.employee_id} • {agent.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {agent.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {agent.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.department}</div>
                    <div className="text-sm text-gray-500">{agent.hotel_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getPerformanceColor(agent.performance_rating)}`}>
                      ★ {agent.performance_rating}/5.0
                    </div>
                    <div className="text-sm text-gray-500">
                      {agent.total_bookings}/{agent.monthly_target} bookings
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{agent.commission_earned.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">This month</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(agent.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/agents/${agent._id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/owner/agents/${agent._id}/edit`)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Agent"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteAgent(agent)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Agent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} agents
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleFilterChange('page', page)}
                  className={`px-3 py-1 rounded text-sm ${
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Agents;