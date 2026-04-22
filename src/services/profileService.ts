// Profile service
import { apiService, ApiError, ErrorType } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export class ProfileService {
  // Get profile data by user ID
  static async getProfileData(userId: number): Promise<any> {
    try {
      console.log('ProfileService - Fetching profile for userId:', userId);
      console.log('ProfileService - Endpoint:', API_ENDPOINTS.PROFILE.BY_USER(userId));
      
      const response = await apiService.get(API_ENDPOINTS.PROFILE.BY_USER(userId));
      console.log('ProfileService - Response data:', response.data);
      
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        console.log('ProfileService - Extracted profile data:', response.data.data);
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('ProfileService - Get profile data error:', error);
      
      // Handle different error types for better UX
      if (error instanceof ApiError) {
        // Network errors - show user-friendly message
        if (error.type === ErrorType.NETWORK) {
          throw new ApiError('Unable to connect to server. Please check your internet connection.', error.type, error.statusCode);
        }
        // Timeout errors - show user-friendly message
        if (error.type === ErrorType.TIMEOUT) {
          throw new ApiError('Request timed out. Please try again.', error.type, error.statusCode);
        }
        // Server errors - show user-friendly message
        if (error.type === ErrorType.SERVER) {
          throw new ApiError('Server is temporarily unavailable. Please try again later.', error.type, error.statusCode);
        }
        // Re-throw other errors
        throw error;
      }
      
      throw new Error('Failed to fetch profile data');
    }
  }

  // Get all profiles
  static async getAllProfiles(): Promise<any> {
    try {
      const response = await apiService.get(API_ENDPOINTS.PROFILE.BASE);
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get all profiles error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new Error('Failed to fetch all profiles');
    }
  }

  // Create profile
  static async createProfile(profileData: any): Promise<any> {
    try {
      const response = await apiService.post(API_ENDPOINTS.PROFILE.BASE, profileData);
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new Error('Failed to create profile');
    }
  }

  // Update profile
  static async updateProfile(userId: number, profileData: any): Promise<any> {
    try {
      const response = await apiService.put(API_ENDPOINTS.PROFILE.BY_USER(userId), profileData);
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new Error('Failed to update profile');
    }
  }

  // Change password (if needed in auth module)
  static async changePassword(passwordData: any): Promise<void> {
    try {
      await apiService.post('/auth/change-password', passwordData);
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new Error('Failed to change password');
    }
  }

  // Delete account (if needed in auth module)
  static async deleteAccount(userId: number): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.PROFILE.BY_USER(userId));
    } catch (error) {
      console.error('Delete account error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new Error('Failed to delete account');
    }
  }
}

export default ProfileService;
