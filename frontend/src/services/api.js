import axios from 'axios';
import { clearAuth } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data and redirect to login
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  getAllUsers: (params) => api.get('/auth/users', { params }),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// Vehicle API
export const vehicleAPI = {
  getAll: (params) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (vehicleData) => api.post('/vehicles', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicles/${id}`),
  getStats: () => api.get('/vehicles/stats'),
};

// Daily Check API
export const dailyCheckAPI = {
  getAll: (params) => api.get('/daily-checks', { params }),
  getById: (id) => api.get(`/daily-checks/${id}`),
  create: (checkData) => api.post('/daily-checks', checkData),
  update: (id, checkData) => api.put(`/daily-checks/${id}`, checkData),
  delete: (id) => api.delete(`/daily-checks/${id}`),
  getByVehicle: (vehicleId, params) => api.get(`/daily-checks/vehicle/${vehicleId}`, { params }),
  getStats: (params) => api.get('/daily-checks/stats', { params }),
};

// Maintenance API
export const maintenanceAPI = {
  getAll: (params) => api.get('/maintenance', { params }),
  getById: (id) => api.get(`/maintenance/${id}`),
  create: (maintenanceData) => api.post('/maintenance', maintenanceData),
  update: (id, maintenanceData) => api.put(`/maintenance/${id}`, maintenanceData),
  delete: (id) => api.delete(`/maintenance/${id}`),
  getByVehicle: (vehicleId, params) => api.get(`/maintenance/vehicle/${vehicleId}`, { params }),
  getStats: (params) => api.get('/maintenance/stats', { params }),
};

// Monthly Report API
export const monthlyReportAPI = {
  getAll: (params) => api.get('/monthly-reports', { params }),
  getById: (id) => api.get(`/monthly-reports/${id}`),
  create: (reportData) => api.post('/monthly-reports', reportData),
  update: (id, reportData) => api.put(`/monthly-reports/${id}`, reportData),
  delete: (id) => api.delete(`/monthly-reports/${id}`),
  getByVehicle: (vehicleId, params) => api.get(`/monthly-reports/vehicle/${vehicleId}`, { params }),
  getStats: (params) => api.get('/monthly-reports/stats', { params }),
};

export default api;
