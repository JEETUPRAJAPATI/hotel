import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  Percent,
  User,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import ViewAgentDrawer from './agents/ViewAgentDrawer';
import toast from 'react-hot-toast';

const Agents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, agentId: null });
  const [viewAgent, setViewAgent] = useState({ isOpen: false, agent: null });

  // Mock data - replace with actual API call
  const mockAgents = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+91 98765 43210',
      role: 'Sales Agent',
      commission_percentage: 5.5,
      address: '123 Business Park, Tech District',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      status: 'Active',
      created_at: '2024-01-15T10:00:00Z',
      profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+91 87654 32109',
      role: 'Field Agent',
      commission_percentage: 6.0,
      address: '456 Market Street, Downtown',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      status: 'Active',
      created_at: '2024-01-20T14:30:00Z',
      profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b2e0c8c2?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+91 76543 21098',
      role: 'Online Agent',
      commission_percentage: 4.5,
      address: '789 Tech Hub, Innovation Center',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      status: 'Inactive',
      created_at: '2024-02-01T09:15:00Z',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+91 65432 10987',
      role: 'Support Agent',
      commission_percentage: 3.5,
      address: '321 Support Center, Help District',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      status: 'Active',
      created_at: '2024-02-10T11:45:00Z',
      profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'David Rodriguez',
      email: 'david.rodriguez@example.com',
      phone: '+91 54321 09876',
      role: 'Sales Agent',
      commission_percentage: 5.0,
      address: '654 Commerce Plaza, Business Bay',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      status: 'Active',
      created_at: '2024-02-15T16:20:00Z',
      profile_image: null
    }
  ];

  const roles = ['Sales Agent', 'Field Agent', 'Online Agent', 'Support Agent'];
  const statuses = ['Active', 'Inactive'];

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    filterAndSortAgents();
  }, [agents, searchTerm, selectedRole, selectedStatus, sortField, sortDirection]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAgents(mockAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAgents = () => {
    let filtered = [...agents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone.includes(searchTerm)
      );
    }

    // Role filter
    if (selectedRole) {
      filtered = filtered.filter(agent => agent.role === selectedRole);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(agent => agent.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAgents(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAgentSelect = (agentId) => {
    setSelectedAgents(prev => {
      const newSelected = prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId];
      
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    const currentPageAgents = getCurrentPageAgents().map(agent => agent.id);
    const allSelected = currentPageAgents.every(id => selectedAgents.includes(id));
    
    if (allSelected) {
      setSelectedAgents(prev => prev.filter(id => !currentPageAgents.includes(id)));
    } else {
      setSelectedAgents(prev => [...new Set([...prev, ...currentPageAgents])]);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAgents(prev => prev.map(agent => 
        selectedAgents.includes(agent.id) 
          ? { ...agent, status }
          : agent
      ));
      
      setSelectedAgents([]);
      setShowBulkActions(false);
      toast.success(`${selectedAgents.length} agents status updated to ${status}`);
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update agents status');
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAgents(prev => prev.filter(agent => !selectedAgents.includes(agent.id)));
      setSelectedAgents([]);
      setShowBulkActions(false);
      toast.success(`${selectedAgents.length} agents deleted successfully`);
    } catch (error) {
      console.error('Error deleting agents:', error);
      toast.error('Failed to delete agents');
    }
  };

  const handleViewAgent = (agent) => {
    setViewAgent({ isOpen: true, agent });
  };

  const handleEditAgent = (agentId) => {
    navigate(`/owner/agents/edit/${agentId}`);
  };

  const handleDeleteAgent = (agentId) => {
    setDeleteModal({ isOpen: true, agentId });
  };

  const confirmDelete = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAgents(prev => prev.filter(agent => agent.id !== deleteModal.agentId));
      setDeleteModal({ isOpen: false, agentId: null });
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  };

  const getCurrentPageAgents = () => {
    const indexOfLastAgent = currentPage * agentsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
    return filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  };

  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
    return status === 'Active' 
      ? `${baseClasses} bg-green-100 text-green-800` 
      : `${baseClasses} bg-red-100 text-red-800`;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-600">Manage your hotel booking agents</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/owner/agents/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-green-600">
                {agents.filter(agent => agent.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Commission</p>
              <p className="text-2xl font-bold text-purple-600">
                {(agents.reduce((sum, agent) => sum + agent.commission_percentage, 0) / agents.length || 0).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-orange-600">24</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('');
              setSelectedStatus('');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-blue-900 font-medium">
                {selectedAgents.length} agent(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('Active')}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Inactive')}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedAgents([]);
                    setShowBulkActions(false);
                  }}
                  className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={getCurrentPageAgents().length > 0 && 
                      getCurrentPageAgents().every(agent => selectedAgents.includes(agent.id))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Agent
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-2">
                    Role
                    {sortField === 'role' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact</th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('commission_percentage')}
                >
                  <div className="flex items-center gap-2">
                    Commission
                    {sortField === 'commission_percentage' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getCurrentPageAgents().map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAgents.includes(agent.id)}
                      onChange={() => handleAgentSelect(agent.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {agent.profile_image ? (
                        <img
                          src={agent.profile_image}
                          alt={agent.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-sm text-gray-500">{agent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {agent.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {agent.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {agent.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <Percent className="w-4 h-4" />
                      {agent.commission_percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(agent.status)}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewAgent(agent)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditAgent(agent.id)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Agent"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Agent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * agentsPerPage) + 1} to {Math.min(currentPage * agentsPerPage, filteredAgents.length)} of {filteredAgents.length} agents
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* View Agent Drawer */}
      <ViewAgentDrawer
        isOpen={viewAgent.isOpen}
        onClose={() => setViewAgent({ isOpen: false, agent: null })}
        agent={viewAgent.agent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, agentId: null })}
        onConfirm={confirmDelete}
        title="Delete Agent"
        message="Are you sure you want to delete this agent? This action cannot be undone."
      />
    </div>
  );
};

export default Agents;