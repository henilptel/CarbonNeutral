import api from './api';

export const userService = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/users/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      throw error;
    }
  },

  // Register a new user
  register: async (username, password) => {
    try {
      const response = await api.post('/users/register', { username, password });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.error || error.message);
      throw error;
    }
  }
};
