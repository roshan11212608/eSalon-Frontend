
import apiClient, { API_ENDPOINTS } from '../api/apiClient';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  commissionPercentage: number;
  joinDate: string;
  isActive?: boolean;
  shopId?: string;
}

export interface NewEmployee {
  name: string;
  email: string;
  phone: string;
  password: string;
  commissionPercentage: string;
  joinDate: string;
  shopId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMPLOYEE.BASE);
      const result: ApiResponse<Employee[]> = response.data;
      return result.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMPLOYEE.BY_ID(Number(id)));
      const result: ApiResponse<Employee> = response.data;
      return result.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  async createEmployee(employee: NewEmployee): Promise<Employee> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.EMPLOYEE.BASE, {
        ...employee,
        shopId: employee.shopId || '1', // Use provided shopId or default to '1'
        shopName: 'Main Salon', // TODO: Get from context
      });
      const result: ApiResponse<Employee> = response.data;
      return result.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.EMPLOYEE.BY_ID(Number(id)), employee);
      const result: ApiResponse<Employee> = response.data;
      return result.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.EMPLOYEE.BY_ID(Number(id)));
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  async reactivateEmployee(id: string): Promise<Employee> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.EMPLOYEE.BY_ID(Number(id)) + '/reactivate');
      const result: ApiResponse<Employee> = response.data;
      return result.data;
    } catch (error) {
      console.error('Error reactivating employee:', error);
      throw error;
    }
  }

  async getEmployeesByShop(shopId: number): Promise<Employee[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMPLOYEE.BY_SHOP(shopId));
      const result: ApiResponse<Employee[]> = response.data;
      return result.data;
    } catch (error) {
      console.error('Error fetching shop employees:', error);
      throw error;
    }
  }

  async toggleEmployeeStatus(id: string): Promise<Employee> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.EMPLOYEE.BY_ID(Number(id)), {
        isActive: false // TODO: Implement proper status toggle
      });
      const result: ApiResponse<Employee> = response.data;
      return result.data;
    } catch (error) {
      console.error('Error toggling employee status:', error);
      throw error;
    }
  }
}

export default new EmployeeService();
