import api from './api';

export const sinkService = {
  // Create a new sink project
  create: async (data) => {
    try {
      const response = await api.post('/sinks', {
        userId: data.userId,
        projectName: data.projectName,
        location: data.location,
        forestArea: data.forestArea,
        treeSpecies: data.treeSpecies,
        treeDensity: data.treeDensity,
        forestAge: data.forestAge,
        soilType: data.soilType,
        maintenanceLevel: data.maintenanceLevel,
        annualSequestration: data.annualSequestration,
        tenYearSequestration: data.tenYearSequestration,
        thirtyYearSequestration: data.thirtyYearSequestration,
        carbonDensity: data.carbonDensity
      });
      return response.data;
    } catch (error) {
      console.error('Create sink failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Get sinks for a user
  getUserSinks: async (userId, startDate, endDate) => {
    try {
      const params = {};
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      
      const response = await api.get(`/sinks/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Get sinks failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Update a sink project
  update: async (id, updates) => {
    try {
      const response = await api.put(`/sinks/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update sink failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Delete a sink project
  delete: async (id) => {
    try {
      const response = await api.delete(`/sinks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete sink failed:', error.response?.data?.error || error.message);
      throw error;
    }
  }
};
