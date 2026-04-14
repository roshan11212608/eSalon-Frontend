import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../constants/config';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff' | 'admin' | null;
  hasShop: boolean;
  shopId?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing auth state on mount
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // TODO: Implement actual auth check with AsyncStorage
      // const token = await AsyncStorage.getItem(APP_CONFIG.storage.authTokenKey);
      // const userData = await AsyncStorage.getItem(APP_CONFIG.storage.userDataKey);
      
      // For now, return mock state
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login
    console.log('Login attempt:', email);
  };

  const logout = async () => {
    // TODO: Implement actual logout
    console.log('Logout');
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthState,
  };
}
