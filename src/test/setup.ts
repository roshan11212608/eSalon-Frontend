/**
 * Jest Test Setup
 * Global test configuration and mocks
 */

import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  Feather: 'Feather',
  MaterialIcons: 'MaterialIcons',
}));

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(),
    size: jest.fn(),
  })),
}));

// Mock Firebase
jest.mock('@react-native-firebase/app', () => ({
  utils: () => ({
    FilePath: {
      PICTURES_DIRECTORY: '/path/to/pictures',
    },
  }),
}));

jest.mock('@react-native-firebase/analytics', () => ({
  default: () => ({
    logEvent: jest.fn(),
    logScreenView: jest.fn(),
    setUserId: jest.fn(),
    setUserProperty: jest.fn(),
    logAppOpen: jest.fn(),
  }),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  default: () => ({
    requestPermission: jest.fn(),
    hasPermission: jest.fn(),
    getToken: jest.fn(),
    deleteToken: jest.fn(),
    onMessage: jest.fn(),
    onTokenRefresh: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
  }),
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  setUser: jest.fn(),
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
  getCurrentScope: jest.fn(() => ({
    setUser: jest.fn(),
  })),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
  useNetInfo: jest.fn(),
}));

// Mock Storage Service
jest.mock('../../services/storage/storageService', () => ({
  StorageService: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    getUserData: jest.fn(),
    setUserData: jest.fn(),
    clearAuthData: jest.fn(),
  },
}));

// Mock API Service
jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore specific console logs during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock timers
jest.useFakeTimers();

// Setup global test environment
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllTimers();
});
