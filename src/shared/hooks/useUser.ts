import { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage/storageService';

interface AuthState {
  isLoggedIn: boolean;
  hasShop: boolean;
  role: string | null;
  userData: any | null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  hasShop: boolean;
}

export function useUser() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    hasShop: false,
    role: null,
    userData: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      setIsLoading(true);
      const token = await StorageService.getToken();
      const role = await StorageService.getRole();
      
      console.log('useUser hook loaded state:', { isLoggedIn: !!token, hasShop: false, role });
      setAuthState({
        isLoggedIn: !!token,
        hasShop: false,
        role,
        userData: null
      });
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuthState = async () => {
    await loadAuthState();
  };

  const updateUser = async (userData: UserData) => {
    try {
      // Note: StorageService doesn't have updateUserData method
      // This would need to be implemented or use a different approach
      console.log('Update user data:', userData);
      await refreshAuthState();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const setShopStatus = async (hasShop: boolean, role: 'owner' | 'staff' | 'admin' | null) => {
    try {
      // Note: StorageService doesn't have updateAuthData method
      // This would need to be implemented or use a different approach
      console.log('Set shop status:', { hasShop, role });
      await refreshAuthState();
    } catch (error) {
      console.error('Error setting shop status:', error);
    }
  };

  return {
    ...authState,
    isLoading,
    refreshAuthState,
    updateUser,
    setShopStatus,
    // Convenience getters
    isOwner: authState.role === 'owner',
    isStaff: authState.role === 'staff',
    isAdmin: authState.role === 'admin',
    hasShop: authState.hasShop,
  };
}
