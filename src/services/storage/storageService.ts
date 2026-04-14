import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'user_token',
  ROLE: 'user_role', // 'owner' | 'staff' | 'admin'
  IS_FIRST_TIME: 'is_first_time'
};

// Types
export type UserRole = 'owner' | 'staff' | 'admin';

export interface AuthData {
  token: string;
  role: UserRole;
  isFirstTime: boolean;
}

// Storage service
export class StorageService {
  // Get token
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Get role
  static async getRole(): Promise<UserRole | null> {
    try {
      const role = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
      return role as UserRole | null;
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  }

  // Get isFirstTime
  static async getIsFirstTime(): Promise<boolean> {
    try {
      const isFirstTime = await AsyncStorage.getItem(STORAGE_KEYS.IS_FIRST_TIME);
      return isFirstTime === 'true';
    } catch (error) {
      console.error('Error getting isFirstTime:', error);
      return true; // Default to true if error
    }
  }

  // Get all auth data
  static async getAuthData(): Promise<AuthData> {
    try {
      const [token, role, isFirstTime] = await Promise.all([
        this.getToken(),
        this.getRole(),
        this.getIsFirstTime()
      ]);

      return {
        token: token || '',
        role: role || 'owner', // Default to owner
        isFirstTime: isFirstTime ?? true
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return {
        token: '',
        role: 'owner',
        isFirstTime: true
      };
    }
  }

  // Save token
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw error;
    }
  }

  // Save role
  static async setRole(role: UserRole): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (error) {
      console.error('Error setting role:', error);
      throw error;
    }
  }

  // Save isFirstTime
  static async setIsFirstTime(isFirstTime: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_FIRST_TIME, isFirstTime.toString());
    } catch (error) {
      console.error('Error setting isFirstTime:', error);
      throw error;
    }
  }

  // Save all auth data
  static async setAuthData(authData: AuthData): Promise<void> {
    try {
      await Promise.all([
        this.setToken(authData.token),
        this.setRole(authData.role),
        this.setIsFirstTime(authData.isFirstTime)
      ]);
    } catch (error) {
      console.error('Error setting auth data:', error);
      throw error;
    }
  }

  // Clear all data (logout)
  static async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.ROLE),
        AsyncStorage.removeItem(STORAGE_KEYS.IS_FIRST_TIME)
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}
