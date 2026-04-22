// API client configuration and utilities
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { StorageService } from '../storage/storageService';
import { BASE_URL, API_CONFIG } from '../../config/api';

// API base configuration - using centralized config
const API_BASE_URL = BASE_URL;
const API_TIMEOUT = API_CONFIG.TIMEOUT;

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Add subscriber to be notified when token is refreshed
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers that token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 error - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the new token
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshToken = await StorageService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              'X-Refresh-Token': refreshToken,
            },
          }
        );

        const { token } = response.data.data;
        
        // Store new token
        await StorageService.setToken(token);
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Notify all subscribers
        onTokenRefreshed(token);
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth data
        console.error('Token refresh failed:', refreshError);
        await StorageService.clearAuthData();
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

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
