import api from './api';

export const emissionService = {
  // Create a new emission record
  create: async (data) => {
    try {
      const response = await api.post('/emissions', {
        userId: data.userId,
        mineName: data.mineName,
        mineLocation: data.mineLocation,
        period: data.period,
        coalProduction: data.coalProduction,
        electricityUsage: data.electricityUsage,
        fuelConsumption: data.fuelConsumption,
        methaneEmissions: data.methaneEmissions,
        totalEmissions: data.totalEmissions
      });
      return response.data;
    } catch (error) {
      console.error('Create emission failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Get emissions for a user
  getUserEmissions: async (userId, queryParams) => {
    try {
      const response = await api.get(`/emissions/user/${userId}?${queryParams.toString()}`);
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
