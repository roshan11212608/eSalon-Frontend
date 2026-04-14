import { Alert } from 'react-native';

export class NetworkError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export function handleNetworkError(error: any): void {
  console.error('Network Error:', error);

  // Handle specific network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('forcibly closed')) {
    Alert.alert(
      'Connection Error',
      'Network connection was lost. Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
    return;
  }

  // Handle timeout errors
  if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
    Alert.alert(
      'Request Timeout',
      'The request took too long. Please try again.',
      [{ text: 'OK' }]
    );
    return;
  }

  // Handle server errors
  if (error.response?.status >= 500) {
    Alert.alert(
      'Server Error',
      'The server is experiencing issues. Please try again later.',
      [{ text: 'OK' }]
    );
    return;
  }

  // Default error handling
  Alert.alert(
    'Error',
    error.message || 'An unexpected error occurred. Please try again.',
    [{ text: 'OK' }]
  );
}

export function isOnline(): boolean {
  // Basic online check - can be enhanced with proper network detection
  return true; // TODO: Implement proper online detection
}
