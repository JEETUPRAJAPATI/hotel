import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiUsers, 
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiFileText,
  FiCalendar,
  FiActivity,
  FiTrendingUp
} from 'react-icons/fi';
import agentService from '../services/agentService';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const AgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load agent data
  useEffect(() => {
    loadAgent();
  }, [id]);

  const loadAgent = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAgent(id);
      setAgent(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await agentService.deleteAgent(id);
      navigate('/manager/agents');
    } catch (err) {
      setError(err.message || 'Failed to delete agent');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get agent type icon
  const getAgentTypeIcon = (type) => {
    switch (type) {
      case 'Individual': return <FiUser className="w-6 h-6" />;
      case 'Agency': return <FiUsers className="w-6 h-6" />;
      case 'Corporate': return <FiHome className="w-6 h-6" />;
      default: return <FiUser className="w-6 h-6" />;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );
  if (!agent) return (
    <div className="p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Agent not found</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/manager/agents')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Agents</span>
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Details</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to={`/manager/agents/${agent._id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit Agent</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Agent Image & Basic Info */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-center text-white">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={agent.agent_image || 'https://via.placeholder.com/128/9CA3AF/FFFFFF?text=A'}
                    alt={agent.agent_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">{agent.agent_name}</h2>
                {agent.company_name && (
                  <p className="text-blue-100 mb-2">{agent.company_name}</p>
                )}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {getAgentTypeIcon(agent.agent_type)}
                  <span className="text-blue-100">{agent.agent_type}</span>
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{agent.commission_rate}%</div>
                    <div className="text-sm text-gray-600">Commission</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Bookings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <div className="flex items-center space-x-3">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{agent.contact_person}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center space-x-3">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${agent.phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                        {agent.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${agent.email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                        {agent.email}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="flex items-start space-x-3">
                    <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="text-gray-900">
                      {agent.address && <div>{agent.address}</div>}
                      <div>{agent.city}, {agent.state}</div>
                      <div>{agent.country}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Financial Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate</label>
                    <div className="flex items-center space-x-3">
                      <FiTrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl font-bold text-green-600">{agent.commission_rate}%</span>
                    </div>
                  </div>
                  
                  {agent.gst_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <div className="flex items-center space-x-3">
                        <FiFileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-mono">{agent.gst_number}</span>
                      </div>
                    </div>
                  )}
                  
                  {agent.pan_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                      <div className="flex items-center space-x-3">
                        <FiCreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-mono">{agent.pan_number}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {agent.bank_account && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
                      <div className="flex items-center space-x-3">
                        <FiCreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-mono">{agent.bank_account}</span>
                      </div>
                    </div>
                  )}
                  
                  {agent.ifsc_code && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <div className="flex items-center space-x-3">
                        <FiCreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-mono">{agent.ifsc_code}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiActivity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Agent Timeline</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FiCalendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Agent Created</div>
                    <div className="text-sm text-gray-600">
                      {new Date(agent.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FiEdit2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Last Updated</div>
                    <div className="text-sm text-gray-600">
                      {new Date(agent.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Agent"
        message={`Are you sure you want to delete "${agent.agent_name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AgentDetails;