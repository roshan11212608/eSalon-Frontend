import { apiRequest, API_ENDPOINTS } from './api/apiClient';

export interface ShopService {
  id?: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  shopId?: string;
  shopName?: string;
  isActive?: boolean;
}

class ShopServicesService {
  async getAllServices(): Promise<ShopService[]> {
    try {
      const response = await apiRequest.get<{ data: ShopService[] }>(API_ENDPOINTS.SHOP_SERVICE.BASE);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching shop services:', error);
      throw error;
    }
  }

  async getServiceById(id: number): Promise<ShopService> {
    try {
      const response = await apiRequest.get<{ data: ShopService }>(API_ENDPOINTS.SHOP_SERVICE.BY_ID(id));
      return response.data.data;
    } catch (error) {
      console.error('Error fetching shop service by ID:', error);
      throw error;
    }
  }

  async getServicesByShop(shopId: string | number): Promise<ShopService[]> {
    try {
      const response = await apiRequest.get<{ data: ShopService[] }>(`/shop-services/shop/${shopId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching shop services by shop:', error);
      throw error;
    }
  }

  async getServicesByShopId(shopId: string): Promise<ShopService[]> {
    try {
      console.log('Fetching services from endpoint:', `/shop-services/shop-id/${shopId}`);
      const response = await apiRequest.get<{ data: ShopService[] }>(`/shop-services/shop-id/${shopId}`);
      console.log('API response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching shop services by shopId:', error);
      throw error;
    }
  }

  async createService(service: ShopService): Promise<ShopService> {
    try {
      console.log('Creating service at endpoint:', API_ENDPOINTS.SHOP_SERVICE.BASE);
      console.log('Request payload:', JSON.stringify(service, null, 2));
      const response = await apiRequest.post<{ data: ShopService }>(API_ENDPOINTS.SHOP_SERVICE.BASE, service);
      console.log('Response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating shop service:', error);
      throw error;
    }
  }

  async updateService(id: number, service: ShopService): Promise<ShopService> {
    try {
      const response = await apiRequest.put<{ data: ShopService }>(API_ENDPOINTS.SHOP_SERVICE.BY_ID(id), service);
      return response.data.data;
    } catch (error) {
      console.error('Error updating shop service:', error);
      throw error;
    }
  }

  async deleteService(id: number): Promise<void> {
    try {
      await apiRequest.delete(API_ENDPOINTS.SHOP_SERVICE.BY_ID(id));
    } catch (error) {
      console.error('Error deleting shop service:', error);
      throw error;
    }
  }
}

export default new ShopServicesService();
