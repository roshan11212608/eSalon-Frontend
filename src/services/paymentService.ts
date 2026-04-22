// Payment service
import { apiService, ApiError } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export enum PaymentType {
  CUSTOMER_PAYMENT = 'CUSTOMER_PAYMENT',
  STAFF_PAYOUT = 'STAFF_PAYOUT'
}

export enum PaymentMethod {
  CASH = 'CASH',
  ONLINE = 'ONLINE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface Payment {
  id: number;
  paymentType: PaymentType;
  recipientName: string;
  recipientType: string;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  netAmount?: number;
  paymentMethod: PaymentMethod;
  category: string;
  description: string;
  paymentDate: string;
  status: PaymentStatus;
  employeeId?: number;
  shopId: number;
  verificationStatus?: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  paymentType: PaymentType;
  recipientName: string;
  recipientType: string;
  amount: number;
  commissionRate?: number;
  paymentMethod: PaymentMethod;
  category: string;
  description?: string;
  paymentDate?: string;
  employeeId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

export class PaymentService {
  // Get all payments by shop ID
  static async getPaymentsByShop(shopId: number): Promise<Payment[]> {
    try {
      const response = await apiService.get<ApiResponse<Payment[]>>(
        API_ENDPOINTS.PAYMENT.BY_SHOP(shopId)
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  }

  // Get payment by ID
  static async getPaymentById(id: number): Promise<Payment> {
    try {
      const response = await apiService.get<ApiResponse<Payment>>(
        API_ENDPOINTS.PAYMENT.BY_ID(id)
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching payment:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  }

  // Get payments by shop and type
  static async getPaymentsByShopAndType(shopId: number, paymentType: string): Promise<Payment[]> {
    try {
      const response = await apiService.get<ApiResponse<Payment[]>>(
        API_ENDPOINTS.PAYMENT.BY_SHOP_AND_TYPE(shopId, paymentType)
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching payments by type:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  }

  // Get payments by employee ID
  static async getPaymentsByEmployee(employeeId: number): Promise<Payment[]> {
    try {
      const response = await apiService.get<ApiResponse<Payment[]>>(
        API_ENDPOINTS.PAYMENT.BY_EMPLOYEE(employeeId)
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching payments by employee:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  }

  // Get payments by shop and employee ID
  static async getPaymentsByShopAndEmployee(shopId: number, employeeId: number): Promise<Payment[]> {
    try {
      const response = await apiService.get<ApiResponse<Payment[]>>(
        API_ENDPOINTS.PAYMENT.BY_SHOP_AND_EMPLOYEE(shopId, employeeId)
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching payments by shop and employee:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  }

  // Get payments by shop and status
  static async getPaymentsByShopAndStatus(shopId: number, status: string): Promise<Payment[]> {
    try {
      const response = await apiService.get<ApiResponse<Payment[]>>(
        API_ENDPOINTS.PAYMENT.BY_SHOP_AND_STATUS(shopId, status)
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching payments by status:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  }

  // Create new payment
  static async createPayment(request: CreatePaymentRequest): Promise<Payment> {
    try {
      const response = await apiService.post<ApiResponse<Payment>>(
        API_ENDPOINTS.PAYMENT.BASE,
        request
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating payment:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  }

  // Update payment
  static async updatePayment(id: number, request: Partial<CreatePaymentRequest>): Promise<Payment> {
    try {
      const response = await apiService.put<ApiResponse<Payment>>(
        API_ENDPOINTS.PAYMENT.BY_ID(id),
        request
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating payment:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to update payment');
    }
  }

  // Complete payment
  static async completePayment(id: number): Promise<Payment> {
    try {
      const response = await apiService.post<ApiResponse<Payment>>(
        API_ENDPOINTS.PAYMENT.COMPLETE(id),
        {}
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error completing payment:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to complete payment');
    }
  }

  // Cancel payment
  static async cancelPayment(id: number): Promise<Payment> {
    try {
      const response = await apiService.post<ApiResponse<Payment>>(
        API_ENDPOINTS.PAYMENT.CANCEL(id),
        {}
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error cancelling payment:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to cancel payment');
    }
  }

  // Verify payment
  static async verifyPayment(id: number): Promise<Payment> {
    try {
      const response = await apiService.post<ApiResponse<Payment>>(
        `/payments/${id}/verify`,
        {}
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to verify payment');
    }
  }

  // Delete payment
  static async deletePayment(id: number): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.PAYMENT.BY_ID(id));
    } catch (error: any) {
      console.error('Error deleting payment:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Failed to delete payment');
    }
  }
}

export default PaymentService;
