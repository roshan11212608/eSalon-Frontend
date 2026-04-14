// Shop service
import { apiRequest, API_ENDPOINTS } from './api/apiClient';
import type { Shop, Service } from './types/shop';

export class ShopService {
  // Get shop data
  static async getShopData(): Promise<Shop> {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.SHOP.SETTINGS);
      return response.data;
    } catch (error) {
      console.error('Get shop data error:', error);
      throw error;
    }
  }

  // Update shop settings
  static async updateShopSettings(settings: Partial<Shop>): Promise<Shop> {
    try {
      const response = await apiRequest.put(API_ENDPOINTS.SHOP.UPDATE, settings);
      return response.data;
    } catch (error) {
      console.error('Update shop settings error:', error);
      throw error;
    }
  }

  // Get shop services
  static async getServices(): Promise<Service[]> {
    try {
      const response = await apiRequest.get(API_ENDPOINTS.SERVICE.LIST);
      return response.data;
    } catch (error) {
      console.error('Get services error:', error);
      throw error;
    }
  }

  // Add new service
  static async addService(service: Omit<Service, 'id'>): Promise<Service> {
    try {
      const response = await apiRequest.post(API_ENDPOINTS.SERVICE.CREATE, service);
      return response.data;
    } catch (error) {
      console.error('Add service error:', error);
      throw error;
    }
  }

  // Update service
  static async updateService(id: string, service: Partial<Service>): Promise<Service> {
    try {
      const response = await apiRequest.put(`${API_ENDPOINTS.SERVICE.UPDATE}/${id}`, service);
      return response.data;
    } catch (error) {
      console.error('Update service error:', error);
      throw error;
    }
  }

  // Delete service
  static async deleteService(id: string): Promise<void> {
    try {
      await apiRequest.delete(`${API_ENDPOINTS.SERVICE.DELETE}/${id}`);
    } catch (error) {
      console.error('Delete service error:', error);
      throw error;
    }
  }
}

export default ShopService;
