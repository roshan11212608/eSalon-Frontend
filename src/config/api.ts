import { Platform } from 'react-native';

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
// NOTE: For web development, localhost works better than IP addresses
const DEFAULT_DEV_URL = Platform.OS === 'web'
  ? 'http://localhost:8080/api'
  : 'http://192.168.0.8:8080/api';

// API Configuration
export const API_CONFIG = {
  // API URL: Use env variable if available, otherwise use fallbacks
  BASE_URL: process.env.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL
    : (__DEV__ ? DEFAULT_DEV_URL : 'https://api.esalon.com/api'),

  // Environment from environment variable or NODE_ENV
  ENVIRONMENT: process.env.EXPO_PUBLIC_ENV || (__DEV__ ? 'development' : 'production'),

  // Request timeout in milliseconds (from env or default 8000ms)
  TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '8000', 10),

  // Retry count for failed requests (from env or default 3)
  RETRY_COUNT: parseInt(process.env.EXPO_PUBLIC_API_RETRY_COUNT || '3', 10),
};

// Log the configuration for debugging
console.log('API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  ENVIRONMENT: API_CONFIG.ENVIRONMENT,
  PLATFORM: Platform.OS,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});

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
    RESET_PASSWORD: '/auth/reset-password',
    CHECK_EMAIL: '/auth/check-email',
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
  
  // Shop Payments (Staff payouts, Customer receipts - note-taking)
  SHOP_PAYMENT: {
    BASE: '/shop-payments',
    GET_ALL: '/shop-payments',
    BY_ID: (id: number) => `/shop-payments/${id}`,
    BY_SHOP: (shopId: number) => `/shop-payments/shop/${shopId}`,
    BY_SHOP_AND_TYPE: (shopId: number, paymentType: string) => `/shop-payments/shop/${shopId}/type/${paymentType}`,
    BY_SHOP_AND_STATUS: (shopId: number, status: string) => `/shop-payments/shop/${shopId}/status/${status}`,
    BY_DATE_RANGE: (shopId: number) => `/shop-payments/shop/${shopId}/range`,
    BY_EMPLOYEE: (employeeId: number) => `/shop-payments/employee/${employeeId}`,
    BY_SHOP_AND_EMPLOYEE: (shopId: number, employeeId: number) => `/shop-payments/shop/${shopId}/employee/${employeeId}`,
    CREATE: '/shop-payments',
    UPDATE: (id: number) => `/shop-payments/${id}`,
    COMPLETE: (id: number) => `/shop-payments/${id}/complete`,
    CANCEL: (id: number) => `/shop-payments/${id}/cancel`,
    VERIFY: (id: number) => `/shop-payments/${id}/verify`,
    DELETE: (id: number) => `/shop-payments/${id}`,
  },
  
  // Subscription Payments (Razorpay, eSewa - real transactions)
  SUBSCRIPTION_PAYMENT: {
    ORDER: '/subscription-payments/order',
    RAZORPAY_VERIFY: '/subscription-payments/razorpay/verify',
    NEPAL_UPLOAD_PROOF: '/subscription-payments/nepal/upload-proof',
    ADMIN_PENDING: '/subscription-payments/admin/pending',
    ADMIN_APPROVE: (id: number) => `/subscription-payments/admin/${id}/approve`,
    ADMIN_REJECT: (id: number) => `/subscription-payments/admin/${id}/reject`,
    BY_ID: (id: number) => `/subscription-payments/${id}`,
    BY_SHOP: (shopId: number) => `/subscription-payments/shop/${shopId}`,
  },
  
  // Legacy Payment endpoints (for backward compatibility)
  PAYMENT: {
    BASE: '/payments',
    GET_ALL: '/payments',
    BY_ID: (id: number) => `/payments/${id}`,
    BY_SHOP: (shopId: number) => `/payments/shop/${shopId}`,
    BY_SHOP_AND_TYPE: (shopId: number, paymentType: string) => `/payments/shop/${shopId}/type/${paymentType}`,
    BY_SHOP_AND_STATUS: (shopId: number, status: string) => `/payments/shop/${shopId}/status/${status}`,
    BY_DATE_RANGE: (shopId: number) => `/payments/shop/${shopId}/range`,
    BY_EMPLOYEE: (employeeId: number) => `/payments/employee/${employeeId}`,
    BY_SHOP_AND_EMPLOYEE: (shopId: number, employeeId: number) => `/payments/shop/${shopId}/employee/${employeeId}`,
    CREATE: '/payments',
    UPDATE: (id: number) => `/payments/${id}`,
    COMPLETE: (id: number) => `/payments/${id}/complete`,
    CANCEL: (id: number) => `/payments/${id}/cancel`,
    VERIFY: (id: number) => `/payments/${id}/verify`,
    DELETE: (id: number) => `/payments/${id}`,
    SUBSCRIPTION_ORDER: '/payments/subscription/order',
    RAZORPAY_VERIFY: '/payments/razorpay/verify',
    NEPAL_UPLOAD_PROOF: '/payments/nepal/upload-proof',
  },
  
  // Dashboard
  DASHBOARD: {
    SHOP: (shopId: number) => `/dashboard/shop/${shopId}`,
    OWNER: (ownerId: number) => `/dashboard/owner/${ownerId}`,
    ADMIN: '/dashboard/admin',
  },

  /** Public plan browsing – accessible to OWNER and ADMIN roles */
  PLANS: {
    ACTIVE: '/plans/active',
  },

  /** Admin: salons/shops registered via owner signup (`/auth/register`) */
  ADMIN: {
    SHOPS: '/admin/shops',
    SHOP_BY_ID: (id: number) => `/admin/shops/${id}`,
    PLANS: '/admin/plans',
    PLAN_BY_ID: (id: number) => `/admin/plans/${id}`,
    PLAN_CREATE: '/admin/plans',
    PLAN_UPDATE: (id: number) => `/admin/plans/${id}`,
    PLAN_DELETE: (id: number) => `/admin/plans/${id}`,
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
