/**
 * API Service Layer
 * 
 * This file provides a centralized, reusable API service with:
 * - Standard HTTP methods (GET, POST, PUT, DELETE, PATCH)
 * - Centralized error handling with error types
 * - Automatic token injection
 * - Network error detection
 * - Retry mechanism with exponential backoff
 * - Timeout handling
 * - Structured error responses
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { BASE_URL, API_CONFIG } from '../config/api';
import { StorageService } from './storage/storageService';

/**
 * Error types for better error handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class for API errors with enhanced error information
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Error structure
 */
export interface ApiErrorResponse {
  message: string;
  type: ErrorType;
  statusCode?: number;
}

/**
 * API Response structure
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding auth token
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await StorageService.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        } as any;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling common responses
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized - clear auth data
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - clearing auth data');
      await StorageService.clearAuthData();
    }
    return Promise.reject(error);
  }
);

/**
 * Determine if error is a network error
 */
const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && !!error.request;
};

/**
 * Determine if error is a timeout error
 */
const isTimeoutError = (error: AxiosError): boolean => {
  return error.code === 'ECONNABORTED' || error.message.includes('timeout');
};

/**
 * Determine if error is a server error (5xx)
 */
const isServerError = (error: AxiosError): boolean => {
  return error.response?.status ? error.response.status >= 500 : false;
};

/**
 * Determine if error is a client error (4xx)
 */
const isClientError = (error: AxiosError): boolean => {
  return error.response?.status ? error.response.status >= 400 && error.response.status < 500 : false;
};

/**
 * Format error for UI consumption with error type
 */
const formatError = (error: any): ApiErrorResponse => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
    };
  }

  if (isAxiosError(error)) {
    if (isTimeoutError(error)) {
      return {
        message: 'Request timed out. Please check your connection and try again.',
        type: ErrorType.TIMEOUT,
      };
    }

    if (isNetworkError(error)) {
      return {
        message: 'Network error. Please check your internet connection.',
        type: ErrorType.NETWORK,
      };
    }

    if (isServerError(error)) {
      return {
        message: 'Server is temporarily unavailable. Please try again later.',
        type: ErrorType.SERVER,
        statusCode: error.response?.status,
      };
    }

    // Client errors (4xx)
    const message = error.response?.data?.message || error.message || 'Request failed';
    return {
      message,
      type: ErrorType.UNKNOWN,
      statusCode: error.response?.status,
    };
  }

  // Generic error
  return {
    message: error.message || 'An unexpected error occurred',
    type: ErrorType.UNKNOWN,
  };
};

/**
 * Sleep function for retry delay
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry request with exponential backoff
 * Only retries network errors and server errors (5xx)
 * Does not retry client errors (4xx)
 */
const retryRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retries: number = API_CONFIG.RETRY_COUNT
): Promise<AxiosResponse<T>> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;
      
      // Check if error is retryable
      if (isAxiosError(error)) {
        // Don't retry client errors (4xx)
        if (isClientError(error)) {
          throw error;
        }
        
        // Only retry network errors and server errors
        if (!isNetworkError(error) && !isServerError(error) && !isTimeoutError(error)) {
          throw error;
        }
      } else {
        // Non-axios errors should not be retried
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff: 100ms * 2^attempt
      const delay = 100 * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms`);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

/**
 * API Service Methods with retry and timeout handling
 */
export const apiService = {
  /**
   * GET request with retry mechanism
   * @param url - API endpoint
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await retryRequest(() => apiClient.get(url, config));
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const formattedError = formatError(error);
      throw new ApiError(formattedError.message, formattedError.type, formattedError.statusCode, error);
    }
  },

  /**
   * POST request with retry mechanism
   * @param url - API endpoint
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await retryRequest(() => apiClient.post(url, data, config));
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const formattedError = formatError(error);
      throw new ApiError(formattedError.message, formattedError.type, formattedError.statusCode, error);
    }
  },

  /**
   * PUT request with retry mechanism
   * @param url - API endpoint
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await retryRequest(() => apiClient.put(url, data, config));
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const formattedError = formatError(error);
      throw new ApiError(formattedError.message, formattedError.type, formattedError.statusCode, error);
    }
  },

  /**
   * DELETE request with retry mechanism
   * @param url - API endpoint
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await retryRequest(() => apiClient.delete(url, config));
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const formattedError = formatError(error);
      throw new ApiError(formattedError.message, formattedError.type, formattedError.statusCode, error);
    }
  },

  /**
   * PATCH request with retry mechanism
   * @param url - API endpoint
   * @param data - Request body data
   * @param config - Optional axios config
   * @returns Promise with response data
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await retryRequest(() => apiClient.patch(url, data, config));
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const formattedError = formatError(error);
      throw new ApiError(formattedError.message, formattedError.type, formattedError.statusCode, error);
    }
  },
};

/**
 * Health Check Service
 * Checks if the API server is reachable
 * Smart health check: only called on startup or after repeated failures
 */
let healthCheckCache: { isHealthy: boolean; timestamp: number } | null = null;
const HEALTH_CHECK_CACHE_DURATION = 60000; // 1 minute

export const healthCheck = {
  /**
   * Perform a health check (cached)
   * @param force - Force a fresh check, bypass cache
   * @returns Promise with server status
   */
  async check(force: boolean = false): Promise<{ isHealthy: boolean; message: string }> {
    // Return cached result if available and not forced
    if (!force && healthCheckCache && Date.now() - healthCheckCache.timestamp < HEALTH_CHECK_CACHE_DURATION) {
      return {
        isHealthy: healthCheckCache.isHealthy,
        message: healthCheckCache.isHealthy ? 'Server is healthy (cached)' : 'Server is unhealthy (cached)',
      };
    }

    try {
      await apiService.get('/health');
      healthCheckCache = { isHealthy: true, timestamp: Date.now() };
      return {
        isHealthy: true,
        message: 'Server is healthy',
      };
    } catch (error) {
      const formattedError = formatError(error);
      healthCheckCache = { isHealthy: false, timestamp: Date.now() };
      return {
        isHealthy: false,
        message: formattedError.message,
      };
    }
  },

  /**
   * Invalidate health check cache
   */
  invalidateCache(): void {
    healthCheckCache = null;
  },
};

export default apiService;
