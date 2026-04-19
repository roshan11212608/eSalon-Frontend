export const APP_CONFIG = {
  name: 'eSalon',
  version: '1.0.0',
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8080/api',
    timeout: 10000,
  },
  storage: {
    authTokenKey: 'authToken',
    userDataKey: 'userData',
  },
  theme: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
