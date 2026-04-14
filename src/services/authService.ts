// Authentication service
import { apiRequest, API_ENDPOINTS } from './api/apiClient';
import { StorageService, type UserRole } from './storage/storageService';
import type { User } from './types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
  role: UserRole;
}

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiRequest.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });
      
      const { token, role } = response.data;
      
      // Store auth data
      await StorageService.setAuthData({
        token,
        role,
        isFirstTime: false,
      });
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiRequest.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      const { token, role } = response.data;
      
      // Store auth data
      await StorageService.setAuthData({
        token,
        role,
        isFirstTime: false,
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await StorageService.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Refresh token
  static async refreshToken(): Promise<string> {
    try {
      const response = await apiRequest.post(API_ENDPOINTS.AUTH.REFRESH);
      const { token } = response.data;
      
      // Update stored token
      await StorageService.setToken(token);
      
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<any> {
    try {
      const token = await StorageService.getToken();
      if (!token) {
        return null;
      }
      
      const response = await apiRequest.get(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
}

export default AuthService;
