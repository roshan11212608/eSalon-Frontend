import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'user_token',
  ROLE: 'user_role', // 'owner' | 'staff' | 'admin'
  IS_FIRST_TIME: 'is_first_time',
  SHOP_ID: 'shop_id',
  USER_DATA: 'user_data'
};

// Types
export type UserRole = 'owner' | 'staff' | 'admin';

export interface UserData {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role?: UserRole;
  phone?: string;
  shopId?: string;
  shopName?: string;
  shopAddress?: string;
}

export interface AuthData {
  token: string;
  role: UserRole;
  isFirstTime: boolean;
  shopId?: string;
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

  // Get shopId
  static async getShopId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SHOP_ID);
    } catch (error) {
      console.error('Error getting shopId:', error);
      return null;
    }
  }

  // Get all auth data
  static async getAuthData(): Promise<AuthData> {
    try {
      const [token, role, isFirstTime, shopId] = await Promise.all([
        this.getToken(),
        this.getRole(),
        this.getIsFirstTime(),
        this.getShopId()
      ]);

      console.log('StorageService.getAuthData - token:', token);
      console.log('StorageService.getAuthData - role:', role);
      console.log('StorageService.getAuthData - isFirstTime:', isFirstTime);
      console.log('StorageService.getAuthData - shopId:', shopId);

      return {
        token: token || '',
        role: role as UserRole, // Don't default to owner, use actual stored role
        isFirstTime: isFirstTime ?? true,
        shopId: shopId || undefined
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return {
        token: '',
        role: 'owner',
        isFirstTime: true,
        shopId: undefined
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

  // Save shopId
  static async setShopId(shopId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SHOP_ID, shopId);
    } catch (error) {
      console.error('Error setting shopId:', error);
      throw error;
    }
  }

  // Save all auth data
  static async setAuthData(authData: AuthData): Promise<void> {
    try {
      const promises = [
        this.setToken(authData.token),
        this.setRole(authData.role),
        this.setIsFirstTime(authData.isFirstTime)
      ];
      
      if (authData.shopId) {
        promises.push(this.setShopId(authData.shopId));
      }
      
      await Promise.all(promises);
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
        AsyncStorage.removeItem(STORAGE_KEYS.IS_FIRST_TIME),
        AsyncStorage.removeItem(STORAGE_KEYS.SHOP_ID),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA)
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

  // Get user data
  static async getUserData(): Promise<UserData | null> {
    try {
      const userDataJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userDataJson ? JSON.parse(userDataJson) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Save user data
  static async setUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data:', error);
      throw error;
    }
  }
}
