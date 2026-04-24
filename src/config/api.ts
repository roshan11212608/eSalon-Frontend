/**
 * Centralized API Configuration
 * 
 * This file manages all API-related configuration including:
 * - Base URL for different environments
 * - Timeout settings
 * - Retry configuration
 * - Environment detection
 * 
 * Uses environment variables with fallbacks for development
 */

// Environment detection
const __DEV__ = process.env.NODE_ENV !== 'production';

// Default local IP fallback for development
const DEFAULT_DEV_URL = 'http://192.168.0.5:8080/api';

// API Configuration
export const API_CONFIG = {
  // API URL from environment variable or fallback
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? DEFAULT_DEV_URL : 'https://api.esalon.com/api'),
  
  // Environment from environment variable or NODE_ENV
  ENVIRONMENT: process.env.EXPO_PUBLIC_ENV || (__DEV__ ? 'development' : 'production'),
  
  // Request timeout in milliseconds (from env or default 8000ms)
  TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '8000', 10),
  
  // Retry count for failed requests (from env or default 3)
  RETRY_COUNT: parseInt(process.env.EXPO_PUBLIC_API_RETRY_COUNT || '3', 10),
};

/**
 * Get the appropriate base URL based on environment
 * @returns {string} The base URL for API calls
 */
export const getBaseURL = (): string => {
  return API_CONFIG.BASE_URL;
};

/**
 * Get the current environment
 * @returns {string} 'development', 'staging', or 'production'
 */
export const getEnvironment = (): string => {
  return API_CONFIG.ENVIRONMENT;
};

/**
 * Check if running in development mode
 * @returns {boolean}
 */
export const isDevelopment = (): boolean => {
  return __DEV__;
};

/**
 * API Endpoints Configuration
 * All API endpoints should be defined here for easy maintenance
 */
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
    BY_SHOP: (shopId: number) => `/shop-services/shop-id/${shopId}`,
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
  
  // Payments
  PAYMENT: {
    BASE: '/payments',
    BY_ID: (id: number) => `/payments/${id}`,
    BY_SHOP: (shopId: number) => `/payments/shop/${shopId}`,
    BY_SHOP_AND_TYPE: (shopId: number, paymentType: string) => `/payments/shop/${shopId}/type/${paymentType}`,
    BY_SHOP_AND_STATUS: (shopId: number, status: string) => `/payments/shop/${shopId}/status/${status}`,
    BY_SHOP_AND_EMPLOYEE: (shopId: number, employeeId: number) => `/payments/shop/${shopId}/employee/${employeeId}`,
    BY_EMPLOYEE: (employeeId: number) => `/payments/employee/${employeeId}`,
    COMPLETE: (id: number) => `/payments/${id}/complete`,
    CANCEL: (id: number) => `/payments/${id}/cancel`,
  },
  
  // Dashboard
  DASHBOARD: {
    SHOP: (shopId: number) => `/dashboard/shop/${shopId}`,
    OWNER: (ownerId: number) => `/dashboard/owner/${ownerId}`,
    ADMIN: '/dashboard/admin',
  },
  
  // Reports
  REPORTS: {
    BASE: '/reports',
    EXPENSE: '/reports/expense',
    PAYMENT: '/reports/payment',
    SERVICE_ANALYTICS: '/reports/service-analytics',
    FINANCIAL_SUMMARY: '/reports/financial',
    STAFF_ACTIVITY: '/reports/staff-activity',
    STAFF: '/reports/staff',
  },
  
  // Health Check
  HEALTH: '/health',
} as const;

/**
 * Export the base URL for direct use
 */
export const BASE_URL = getBaseURL();
