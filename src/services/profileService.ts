// Profile service
import { apiRequest, API_ENDPOINTS } from './api/apiClient';

export class ProfileService {
  // Get profile data
  static async getProfileData(): Promise<any> {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get profile data error:', error);
      throw error;
    }
  }

  // Update profile
  static async updateProfile(profileData: any): Promise<any> {
    try {
      const response = await apiRequest.put(API_ENDPOINTS.USER.UPDATE, profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password
  static async changePassword(passwordData: any): Promise<void> {
    try {
      await apiRequest.post('/auth/change-password', passwordData);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Delete account
  static async deleteAccount(): Promise<void> {
    try {
      await apiRequest.delete(API_ENDPOINTS.USER.DELETE);
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}

export default ProfileService;
