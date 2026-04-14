// API client configuration and utilities
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { StorageService } from '../storage/storageService';

// API base configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.esalon.com/v1';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = await StorageService.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response) => {
    // Handle common response patterns
    return response;
  },
  async (error) => {
    // Handle common error patterns
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth data and redirect to login
      console.warn('Unauthorized access - clearing auth data');
      await StorageService.clearAuthData();
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  // User management
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
  },
  // Shop management
  SHOP: {
    LIST: '/shop/list',
    CREATE: '/shop/create',
    UPDATE: '/shop/update',
    DELETE: '/shop/delete',
    SETTINGS: '/shop/settings',
  },
  // Appointments
  APPOINTMENT: {
    LIST: '/appointment/list',
    CREATE: '/appointment/create',
    UPDATE: '/appointment/update',
    DELETE: '/appointment/delete',
    CANCEL: '/appointment/cancel',
  },
  // Services
  SERVICE: {
    LIST: '/service/list',
    CREATE: '/service/create',
    UPDATE: '/service/update',
    DELETE: '/service/delete',
  },
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REPORTS: '/analytics/reports',
    STATS: '/analytics/stats',
  },
} as const;

// API request functions
export const apiRequest = {
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => 
    apiClient.get(url, config),
    
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => 
    apiClient.post(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => 
    apiClient.put(url, data, config),
    
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => 
    apiClient.delete(url, config),
    
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => 
    apiClient.patch(url, data, config),
};

export default apiClient;
