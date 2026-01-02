import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  Building,
  Utensils,
  Plus,
  Search,
  Filter,
  Download,
  X,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Mail,
  Phone,
  MapPin,
  Percent
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminAgentsManagement = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentTypeFilter, setAgentTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hotelFilter, setHotelFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalAgents: 0,
    activeAgents: 0,
    inactiveAgents: 0,
    hotelAgents: 0,
    restaurantAgents: 0
  });

  // Mock hotels and restaurants data
  const mockHotels = [
    { id: 1, name: 'Grand Plaza Hotel' },
    { id: 2, name: 'Royal Palace Hotel' },
    { id: 3, name: 'Sunset Beach Resort' },
    { id: 4, name: 'Mountain View Inn' }
  ];

  const mockRestaurants = [
    { id: 1, name: 'The Italian Corner' },
    { id: 2, name: 'Spice Garden' },
    { id: 3, name: 'Ocean Breeze Cafe' },
    { id: 4, name: 'Royal Dine' }
  ];

  // Mock agents data
  const mockAgentsData = [
    {
      id: 1,
      agent_id: 'AGT-2024-001',
      name: 'John Smith',
      email: 'john.smith@agency.com',
      phone: '+91 98765 43210',
      agent_type: 'Both',
      assigned_hotels: [1, 2],
      assigned_restaurants: [1, 3],
      commission: 12,
      status: 'active',
      address: '123 Main St, Mumbai, Maharashtra',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      agent_id: 'AGT-2024-002',
      name: 'Sarah Johnson',
      email: 'sarah.j@travels.com',
      phone: '+91 98765 43211',
      agent_type: 'Hotel',
      assigned_hotels: [1, 3, 4],
      assigned_restaurants: [],
      commission: 10,
      status: 'active',
      address: '456 Park Avenue, Delhi',
      created_at: '2024-01-20'
    },
    {
      id: 3,
      agent_id: 'AGT-2024-003',
      name: 'Michael Brown',
      email: 'michael.b@foodie.com',
      phone: '+91 98765 43212',
      agent_type: 'Restaurant',
      assigned_hotels: [],
      assigned_restaurants: [2, 3, 4],
      commission: 8,
      status: 'active',
      address: '789 Lake Road, Bangalore',
      created_at: '2024-02-01'
    },
    {
      id: 4,
      agent_id: 'AGT-2024-004',
      name: 'Emily Davis',
      email: 'emily.d@bookings.com',
      phone: '+91 98765 43213',
      agent_type: 'Both',
      assigned_hotels: [2, 4],
      assigned_restaurants: [1, 2],
      commission: 15,
      status: 'inactive',
      address: '321 Beach Road, Goa',
      created_at: '2024-02-10'
    },
    {
      id: 5,
      agent_id: 'AGT-2024-005',
      name: 'David Wilson',
      email: 'david.w@travel.com',
      phone: '+91 98765 43214',
      agent_type: 'Hotel',
      assigned_hotels: [1, 2, 3],
      assigned_restaurants: [],
      commission: 11,
      status: 'active',
      address: '555 Hill Station, Shimla',
      created_at: '2024-02-15'
    },
    {
      id: 6,
      agent_id: 'AGT-2024-006',
      name: 'Lisa Anderson',
      email: 'lisa.a@dine.com',
      phone: '+91 98765 43215',
      agent_type: 'Restaurant',
      assigned_hotels: [],
      assigned_restaurants: [1, 3],
      commission: 9,
      status: 'active',
      address: '777 Market Street, Chennai',
      created_at: '2024-03-01'
    }
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAgents(mockAgentsData);

      // Calculate summary
      const totalAgents = mockAgentsData.length;
      const activeAgents = mockAgentsData.filter(a => a.status === 'active').length;
      const inactiveAgents = mockAgentsData.filter(a => a.status === 'inactive').length;
      const hotelAgents = mockAgentsData.filter(a => a.agent_type === 'Hotel' || a.agent_type === 'Both').length;
      const restaurantAgents = mockAgentsData.filter(a => a.agent_type === 'Restaurant' || a.agent_type === 'Both').length;

      setSummary({
        totalAgents,
        activeAgents,
        inactiveAgents,
        hotelAgents,
        restaurantAgents
      });
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAgent = (agentId) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAgents.length === filteredAndSortedAgents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(filteredAndSortedAgents.map(agent => agent.id));
    }
  };

  const handleDelete = async (agent) => {
    const confirmed = window.confirm(`Are you sure you want to delete agent "${agent.name}"?`);
    if (!confirmed) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAgents(prev => prev.filter(a => a.id !== agent.id));
      toast.success(`Agent ${agent.name} deleted successfully`);
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  };

  const handleStatusToggle = async (agent) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newStatus = agent.status === 'active' ? 'inactive' : 'active';
      setAgents(prev =>
        prev.map(a =>
          a.id === agent.id ? { ...a, status: newStatus } : a
        )
      );

      toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedAgents.length === 0) {
      toast.error('Please select agents first');
      return;
    }

    try {
      setBulkActionLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (action) {
        case 'activate':
          setAgents(prev =>
            prev.map(a =>
              selectedAgents.includes(a.id) ? { ...a, status: 'active' } : a
            )
          );
          toast.success(`${selectedAgents.length} agents activated`);
          break;
        case 'deactivate':
          setAgents(prev =>
            prev.map(a =>
              selectedAgents.includes(a.id) ? { ...a, status: 'inactive' } : a
            )
          );
          toast.success(`${selectedAgents.length} agents deactivated`);
          break;
        case 'delete':
          setAgents(prev => prev.filter(a => !selectedAgents.includes(a.id)));
          toast.success(`${selectedAgents.length} agents deleted`);
          break;
      }

      setSelectedAgents([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`Agents exported as ${format.toUpperCase()} successfully!`);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Failed to export agents');
    } finally {
      setExportLoading(false);
    }
  };

  const getHotelNames = (hotelIds) => {
    return hotelIds.map(id => {
      const hotel = mockHotels.find(h => h.id === id);
      return hotel ? hotel.name : '';
    }).filter(Boolean).join(', ');
  };

  const getRestaurantNames = (restaurantIds) => {
    return restaurantIds.map(id => {
      const restaurant = mockRestaurants.find(r => r.id === id);
      return restaurant ? restaurant.name : '';
    }).filter(Boolean).join(', ');
  };

  // Filter and sort agents
  const filteredAndSortedAgents = agents
    .filter(agent => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        agent.name.toLowerCase().includes(searchLower) ||
        agent.email.toLowerCase().includes(searchLower) ||
        agent.phone.includes(searchTerm) ||
        agent.agent_id.toLowerCase().includes(searchLower);

      const matchesType = agentTypeFilter === 'all' || agent.agent_type === agentTypeFilter;
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;

      const matchesHotel = hotelFilter === 'all' ||
        agent.assigned_hotels.includes(parseInt(hotelFilter));

      const matchesRestaurant = restaurantFilter === 'all' ||
        agent.assigned_restaurants.includes(parseInt(restaurantFilter));

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const createdDate = new Date(agent.created_at);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case 'today':
            matchesDate = createdDate.toDateString() === today.toDateString();
            break;
          case 'this_week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            matchesDate = createdDate >= weekStart;
            break;
          case 'this_month':
            matchesDate = createdDate.getMonth() === today.getMonth() &&
              createdDate.getFullYear() === today.getFullYear();
            break;
        }
      }

      return matchesSearch && matchesType && matchesStatus && matchesHotel && matchesRestaurant && matchesDate;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = filteredAndSortedAgents.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getAgentTypeColor = (type) => {
    switch (type) {
      case 'Hotel': return 'bg-blue-50 text-blue-700';
      case 'Restaurant': return 'bg-purple-50 text-purple-700';
      case 'Both': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page Header - Fixed */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage all agents across hotels and restaurants</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadAgents()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => navigate('/admin/agents/create')}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Agent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalAgents}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.activeAgents}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Agents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.inactiveAgents}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <UserX className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hotel Agents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.hotelAgents}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Restaurant Agents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.restaurantAgents}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Utensils className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              {(agentTypeFilter !== 'all' || statusFilter !== 'all' || hotelFilter !== 'all' || restaurantFilter !== 'all' || dateFilter !== 'all') && (
                <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                  Active
                </span>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200 overflow-hidden"
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agent Type</label>
                    <select
                      value={agentTypeFilter}
                      onChange={(e) => { setAgentTypeFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hotel</label>
                    <select
                      value={hotelFilter}
                      onChange={(e) => { setHotelFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Hotels</option>
                      {mockHotels.map(hotel => (
                        <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant</label>
                    <select
                      value={restaurantFilter}
                      onChange={(e) => { setRestaurantFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Restaurants</option>
                      {mockRestaurants.map(restaurant => (
                        <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="this_week">This Week</option>
                      <option value="this_month">This Month</option>
                    </select>
                  </div>
                </div>

                {(agentTypeFilter !== 'all' || statusFilter !== 'all' || hotelFilter !== 'all' || restaurantFilter !== 'all' || dateFilter !== 'all') && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => {
                        setAgentTypeFilter('all');
                        setStatusFilter('all');
                        setHotelFilter('all');
                        setRestaurantFilter('all');
                        setDateFilter('all');
                        setCurrentPage(1);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search and Bulk Actions - Fixed */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or agent ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {selectedAgents.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedAgents.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('activate')}
                disabled={bulkActionLoading}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                disabled={bulkActionLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Agents Table - Scrollable */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAgents.length === filteredAndSortedAgents.length && filteredAndSortedAgents.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('agent_id')}
                  >
                    <div className="flex items-center gap-2">
                      Agent ID
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Agent Name
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Agent Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Assigned Hotels
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Assigned Restaurants
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('commission')}
                  >
                    <div className="flex items-center gap-2">
                      Commission
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAgents.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium">No agents found</p>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedAgents.map((agent, index) => (
                    <motion.tr
                      key={agent.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAgents.includes(agent.id)}
                          onChange={() => handleSelectAgent(agent.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">{agent.agent_id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {agent.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {agent.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAgentTypeColor(agent.agent_type)}`}>
                          {agent.agent_type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {agent.assigned_hotels.length > 0 ? (
                            <span title={getHotelNames(agent.assigned_hotels)}>
                              {getHotelNames(agent.assigned_hotels)}
                            </span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {agent.assigned_restaurants.length > 0 ? (
                            <span title={getRestaurantNames(agent.assigned_restaurants)}>
                              {getRestaurantNames(agent.assigned_restaurants)}
                            </span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                          <Percent className="w-3 h-3 text-gray-400" />
                          {agent.commission}%
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(agent.status)}`}>
                          {agent.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/agents/${agent.id}`)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/agents/edit/${agent.id}`)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(agent)}
                            className={`p-1.5 rounded transition-colors ${
                              agent.status === 'active'
                                ? 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={agent.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {agent.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(agent)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedAgents.length)} of {filteredAndSortedAgents.length} agents
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Export Agents</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={exportLoading}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">CSV Format</div>
                    <div className="text-sm text-gray-500">Compatible with Excel and Google Sheets</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('excel')}
                  disabled={exportLoading}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Excel Format</div>
                    <div className="text-sm text-gray-500">Native Microsoft Excel format</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  disabled={exportLoading}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">PDF Format</div>
                    <div className="text-sm text-gray-500">Printable document format</div>
                  </div>
                </button>
              </div>

              {exportLoading && (
                <div className="mt-4 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-sm text-gray-600">Exporting...</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAgentsManagement;
