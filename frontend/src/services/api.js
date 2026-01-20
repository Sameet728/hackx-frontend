import axios from 'axios';

/**
 * Base API Service
 * Centralized axios configuration for all API calls
 */

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens later)
api.interceptors.request.use(
  (config) => {
    // Add auth token here when implemented
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * API Service Methods
 */
export const apiService = {
  // Health check
  getHealthStatus: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Area Summary
  getAreaSummary: async () => {
    const response = await api.get('/area-summary');
    return response.data;
  },

  // Health Incidents
  getHealthIncidents: async (params) => {
    const response = await api.get('/health-incidents', { params });
    return response.data;
  },

  // Sanitation Complaints
  getSanitationComplaints: async (params) => {
    const response = await api.get('/sanitation-complaints', { params });
    return response.data;
  },

  // Environmental Data
  getEnvironmentalData: async (params) => {
    const response = await api.get('/environmental-data', { params });
    return response.data;
  },

  // Outbreak Risk Prediction
  getOutbreakRisk: async (area) => {
    const response = await api.get('/outbreak-risk', { params: { area } });
    return response.data;
  },
};

export default api;
