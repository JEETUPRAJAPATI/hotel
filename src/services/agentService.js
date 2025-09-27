import api from './api';

// Agent Service for API communication
const agentService = {
  // Get all agents with pagination and filters
  getAgents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await api.get(`/agents?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single agent by ID
  getAgent: async (id) => {
    try {
      const response = await api.get(`/agents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new agent
  createAgent: async (agentData) => {
    try {
      const response = await api.post('/agents', agentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update agent
  updateAgent: async (id, agentData) => {
    try {
      const response = await api.put(`/agents/${id}`, agentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete agent (soft delete)
  deleteAgent: async (id) => {
    try {
      const response = await api.delete(`/agents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk update agent status
  bulkUpdateStatus: async (agentIds, status) => {
    try {
      const response = await api.put('/agents/bulk-status', {
        agent_ids: agentIds,
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get agent statistics
  getAgentStats: async () => {
    try {
      const response = await api.get('/agents/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export agents to CSV
  exportAgents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await api.get(`/agents/export?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response header or set default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'agents.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Export completed successfully' };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search agents (simplified method)
  searchAgents: async (searchTerm, filters = {}) => {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      
      return await agentService.getAgents(params);
    } catch (error) {
      throw error;
    }
  },

  // Get agents by type
  getAgentsByType: async (agentType) => {
    try {
      return await agentService.getAgents({ agent_type: agentType });
    } catch (error) {
      throw error;
    }
  },

  // Get agents by status
  getAgentsByStatus: async (status) => {
    try {
      return await agentService.getAgents({ status });
    } catch (error) {
      throw error;
    }
  },

  // Get agents by location
  getAgentsByLocation: async (city, state, country) => {
    try {
      const params = {};
      if (city) params.city = city;
      if (state) params.state = state;
      if (country) params.country = country;
      
      return await agentService.getAgents(params);
    } catch (error) {
      throw error;
    }
  }
};

export default agentService;