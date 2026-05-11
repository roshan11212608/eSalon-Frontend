import { apiService } from './apiService';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  userId: number | null;
  userName: string | null;
  shopId: number | null;
  shopName: string | null;
  employeeId: number | null;
  relatedId: number | null;
  createdAt: string;
  updatedAt: string;
}

export class NotificationService {
  static async getMyNotifications(): Promise<Notification[]> {
    try {
      const response = await apiService.get('/notifications/my');
      console.log('My notifications API Response:', response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get my notifications error:', error);
      throw error;
    }
  }

  static async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const response = await apiService.get('/notifications/my/unread');
      console.log('Unread notifications API Response:', response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Get unread notifications error:', error);
      throw error;
    }
  }

  static async getUnreadCount(): Promise<number> {
    try {
      const response = await apiService.get('/notifications/my/unread/count');
      console.log('Unread count API Response:', response.data);
      if (response.data && response.data.data !== undefined) {
        return response.data.data;
      }
      return 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  static async markAsRead(id: number): Promise<void> {
    try {
      const response = await apiService.put(`/notifications/${id}/read`);
      console.log('Mark as read API Response:', response.data);
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      const response = await apiService.put('/notifications/mark-all-read');
      console.log('Mark all as read API Response:', response.data);
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  static async createNotification(notification: Partial<Notification>): Promise<Notification> {
    try {
      const response = await apiService.post('/notifications', notification);
      console.log('Create notification API Response:', response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  static async deleteNotification(id: number): Promise<void> {
    try {
      await apiService.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }
}

export default NotificationService;
