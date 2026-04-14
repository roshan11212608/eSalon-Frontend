// Activity service
import { apiRequest } from './api/apiClient';

export class ActivityService {
  // Get activity data
  static async getActivityData(): Promise<any[]> {
    try {
      const response = await apiRequest.get('/activity');
      return response.data;
    } catch (error) {
      console.error('Get activity data error:', error);
      throw error;
    }
  }

  // Add activity
  static async addActivity(activity: any): Promise<any> {
    try {
      const response = await apiRequest.post('/activity', activity);
      return response.data;
    } catch (error) {
      console.error('Add activity error:', error);
      throw error;
    }
  }

  // Update activity
  static async updateActivity(id: string, activity: any): Promise<any> {
    try {
      const response = await apiRequest.put(`/activity/${id}`, activity);
      return response.data;
    } catch (error) {
      console.error('Update activity error:', error);
      throw error;
    }
  }

  // Delete activity
  static async deleteActivity(id: string): Promise<void> {
    try {
      await apiRequest.delete(`/activity/${id}`);
    } catch (error) {
      console.error('Delete activity error:', error);
      throw error;
    }
  }
}

export default ActivityService;
