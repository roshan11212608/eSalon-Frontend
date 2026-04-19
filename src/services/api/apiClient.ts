// API client configuration and utilities
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { StorageService } from '../storage/storageService';

// API base configuration
// Use your computer's IP for mobile device testing
// const API_BASE_URL = "http://192.168.1.60:8080/api";
const API_BASE_URL = "http://127.0.0.1:8080/api";
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
    HEALTH: '/auth/',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
  },
  // Profile
  PROFILE: {
    BASE: '/profile',
    BY_USER: (userId: number) => `/profile/${userId}`,
  },
  // Shop management
  SHOP: {
    BASE: '/shop',
    BY_ID: (id: number) => `/shop/${id}`,
  },
  // Shop Services
  SHOP_SERVICE: {
    BASE: '/shop-services',
    BY_ID: (id: number) => `/shop-services/${id}`,
  },
  // Employees
  EMPLOYEE: {
    BASE: '/employees',
    BY_ID: (id: number) => `/employees/${id}`,
    BY_SHOP: (shopId: number) => `/employees/shop/${shopId}`,
  },
  // Activities
  ACTIVITY: {
    BASE: '/activity',
    BY_ID: (id: number) => `/activity/${id}`,
    BY_SHOP: (shopId: number) => `/activity/shop/${shopId}`,
    BY_USER: (userId: number) => `/activity/user/${userId}`,
  },
  // Expenses
  EXPENSE: {
    BASE: '/expenses',
    BY_ID: (id: number) => `/expenses/${id}`,
    BY_SHOP: (shopId: number) => `/expenses/shop/${shopId}`,
  },
  // Dashboard
  DASHBOARD: {
    SHOP: (shopId: number) => `/dashboard/shop/${shopId}`,
    OWNER: (ownerId: number) => `/dashboard/owner/${ownerId}`,
    ADMIN: '/dashboard/admin',
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
