// Authentication service
import { apiRequest, API_ENDPOINTS } from './api/apiClient';
import { StorageService, type UserRole } from './storage/storageService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  shopName?: string;
  shopAddress?: string;
}

export interface OtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface AuthResponseData {
  token: string;
  refreshToken: string;
  userId: number;
  customUserId?: string;
  name: string;
  email: string;
  role: UserRole;
  shopId?: number;
  shopName?: string;
  shopAddress?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

export class AuthService {
  // Login user - unified authentication for both Users and Employees
  static async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    console.log('=== UNIFIED LOGIN START ===');
    console.log('Trying login for:', credentials.email);
    
    try {
      const response = await apiRequest.post<ApiResponse<AuthResponseData>>(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });
      
      const { data } = response.data;
      console.log('Login successful:', data);
      
      // Store auth data
      await StorageService.setAuthData({
        token: data.token,
        role: data.role,
        isFirstTime: false,
      });
      
      // Store user data separately
      await StorageService.setUserData({
        id: data.userId.toString(),
        userId: data.customUserId,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: '',
        shopId: data.shopId?.toString(),
        shopName: data.shopName,
        shopAddress: data.shopAddress,
      });
      console.log('AuthService: User data saved to storage:', { id: data.userId, name: data.name, email: data.email });
      
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register new user
  static async register(userData: RegisterData): Promise<AuthResponseData> {
    try {
      const response = await apiRequest.post<ApiResponse<AuthResponseData>>(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      const { data } = response.data;
      
      // Store auth data
      await StorageService.setAuthData({
        token: data.token,
        role: data.role,
        isFirstTime: false,
      });
      
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
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
  static async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await apiRequest.post<ApiResponse<AuthResponseData>>(API_ENDPOINTS.AUTH.REFRESH, null, {
        headers: {
          'X-Refresh-Token': refreshToken,
        },
      });
      const { data } = response.data;
      
      // Update stored token
      await StorageService.setToken(data.token);
      
      return data.token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await apiRequest.get<ApiResponse<string>>(API_ENDPOINTS.AUTH.HEALTH);
      return response.data.success;
    } catch (error) {
      console.error('Health check error:', error);
      return false;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await StorageService.getToken();
      return !!token;
    } catch {
      return false;
    }
  }

  // Send OTP
  static async sendOtp(request: OtpRequest): Promise<string> {
    try {
      const response = await apiRequest.post<ApiResponse<string>>(API_ENDPOINTS.AUTH.SEND_OTP, request);
      return response.data.data;
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  // Verify OTP
  static async verifyOtp(request: VerifyOtpRequest): Promise<string> {
    try {
      const response = await apiRequest.post<ApiResponse<string>>(API_ENDPOINTS.AUTH.VERIFY_OTP, request);
      return response.data.data;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
}

export default AuthService;
