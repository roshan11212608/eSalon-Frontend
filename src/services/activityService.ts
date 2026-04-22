// Activity service
import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export class ActivityService {
  // Get activity data for a specific shop
  static async getActivityData(shopId: number): Promise<any[]> {
    try {
      const response = await apiService.get(API_ENDPOINTS.ACTIVITY.BY_SHOP(shopId));
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get activity data error:', error);
      throw error;
    }
  }

  // Get activities by shop (for activity list)
  static async getActivitiesByShop(shopId: number): Promise<any> {
    try {
      const response = await apiService.get(API_ENDPOINTS.ACTIVITY.BY_SHOP(shopId));
      console.log('API Response:', response.data);
      // The new apiService returns { data, status } structure
      // The backend returns ApiResponse structure with data field
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get activities by shop error:', error);
      throw error;
    }
  }

  // Get activities by employee (optimized - backend filtering)
  static async getActivitiesByEmployee(employeeId: number): Promise<any> {
    try {
      const response = await apiService.get(`/activity/employee/${employeeId}`);
      console.log('Activities by employee API Response:', response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get activities by employee error:', error);
      throw error;
    }
  }

  // Get my activities (JWT-based - for staff members)
  static async getMyActivities(): Promise<any> {
    try {
      const response = await apiService.get('/activity/my');
      console.log('My activities API Response:', response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get my activities error:', error);
      throw error;
    }
  }

  // Get my activities with filtering and pagination (JWT-based - for staff members)
  static async getMyActivitiesPaginated(
    filter: string = 'all',
    page: number = 0,
    size: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      let url = `/activity/my/paginated?filter=${filter}&page=${page}&size=${size}`;
      
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await apiService.get(url);
      console.log('My activities paginated API Response:', response.data);
      const pageData = response.data && response.data.data ? response.data.data : response.data;
      // Return both content array and pagination metadata
      return {
        content: pageData.content || [],
        totalPages: pageData.totalPages || 0,
        totalElements: pageData.totalElements || 0,
        last: pageData.last || false,
        page: pageData.number || page,
        size: pageData.size || size
      };
    } catch (error) {
      console.error('Get my activities paginated error:', error);
      throw error;
    }
  }

  // Get all activities (for debugging)
  static async getAllActivities(): Promise<any> {
    try {
      const response = await apiService.get(API_ENDPOINTS.ACTIVITY.BASE);
      console.log('All activities API Response:', response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get all activities error:', error);
      throw error;
    }
  }

  // Add activity
  static async addActivity(activity: any): Promise<any> {
    try {
      console.log('Sending activity to backend:', activity);
      const response = await apiService.post(API_ENDPOINTS.ACTIVITY.BASE, activity);
      console.log('Backend response:', response.data);
      if (response.data && response.data.data) {
        console.log('Created activity data:', response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error('Add activity error:', error);
      throw error;
    }
  }

  // Update activity
  static async updateActivity(id: string, activity: any): Promise<any> {
    try {
      const response = await apiService.put(`${API_ENDPOINTS.ACTIVITY.BASE}/${id}`, activity);
      return response.data;
    } catch (error) {
      console.error('Update activity error:', error);
      throw error;
    }
  }

  // Delete activity
  static async deleteActivity(id: string): Promise<void> {
    try {
      await apiService.delete(`${API_ENDPOINTS.ACTIVITY.BASE}/${id}`);
    } catch (error) {
      console.error('Delete activity error:', error);
      throw error;
    }
  }
}

export default ActivityService;
