import api from './api';

export const emissionService = {
  // Create a new emission record
  create: async (userId, type, amount) => {
    try {
      const response = await api.post('/emissions', { userId, type, amount });
      return response.data;
    } catch (error) {
      console.error('Create emission failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Get emissions for a user
  getUserEmissions: async (userId, startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      
      const response = await api.get(`/emissions/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Get emissions failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Update an emission record
  update: async (id, updates) => {
    try {
      const response = await api.put(`/emissions/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update emission failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Delete an emission record
  delete: async (id) => {
    try {
      const response = await api.delete(`/emissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete emission failed:', error.response?.data?.error || error.message);
      throw error;
    }
  }
};
