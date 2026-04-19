// Profile service
import { apiRequest, API_ENDPOINTS } from './api/apiClient';

export class ProfileService {
  // Get profile data by user ID
  static async getProfileData(userId: number): Promise<any> {
    try {
      console.log('ProfileService - Fetching profile for userId:', userId);
      console.log('ProfileService - Endpoint:', API_ENDPOINTS.PROFILE.BY_USER(userId));
      const response = await apiRequest.get(API_ENDPOINTS.PROFILE.BY_USER(userId));
      console.log('ProfileService - Full response:', response);
      console.log('ProfileService - Response data:', response.data);
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        console.log('ProfileService - Extracted profile data:', response.data.data);
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('ProfileService - Get profile data error:', error);
      throw error;
    }
  }

  // Get all profiles
  static async getAllProfiles(): Promise<any> {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.PROFILE.BASE);
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get all profiles error:', error);
      throw error;
    }
  }

  // Create profile
  static async createProfile(profileData: any): Promise<any> {
    try {
      const response = await apiRequest.post(API_ENDPOINTS.PROFILE.BASE, profileData);
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }

  // Update profile
  static async updateProfile(userId: number, profileData: any): Promise<any> {
    try {
      const response = await apiRequest.put(API_ENDPOINTS.PROFILE.BY_USER(userId), profileData);
      // The backend returns ApiResponse with data field
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password (if needed in auth module)
  static async changePassword(passwordData: any): Promise<void> {
    try {
      await apiRequest.post('/auth/change-password', passwordData);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Delete account (if needed in auth module)
  static async deleteAccount(userId: number): Promise<void> {
    try {
      await apiRequest.delete(API_ENDPOINTS.PROFILE.BY_USER(userId));
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}

export default ProfileService;
