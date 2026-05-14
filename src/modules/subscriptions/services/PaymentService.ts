import apiService from '../../../services/apiService';
import { API_ENDPOINTS } from '../../../config/api';
import type { SubscriptionStatus } from '../types';

export interface SubscriptionPaymentRequest {
  planId: number;
  shopId: number;
  currency: string;
}

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  currency: string;
  amount: number;
  planName: string;
  planId: number;
  shopId: number;
}

export interface RazorpayVerificationRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
  planId: number;
  shopId: number;
}

export interface NepalPaymentProofRequest {
  planId: number;
  planName: string;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  paymentProofImage: string;
}

export interface SubscriptionPayment {
  id: number;
  planName: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentType: 'SUBSCRIPTION';
  paymentProofImage?: string;
  createdAt: string;
  verifiedAt?: string;
  rejectedReason?: string;
}

export const PaymentService = {
  async createSubscriptionOrder(request: SubscriptionPaymentRequest): Promise<RazorpayOrderResponse> {
    const response = await apiService.post(API_ENDPOINTS.PAYMENT.SUBSCRIPTION_ORDER, request);
    return response.data.data;
  },

  async verifyRazorpayPayment(request: RazorpayVerificationRequest): Promise<any> {
    const response = await apiService.post(API_ENDPOINTS.PAYMENT.RAZORPAY_VERIFY, request);
    return response.data.data;
  },

  async uploadNepalPaymentProof(request: NepalPaymentProofRequest): Promise<any> {
    const response = await apiService.post(API_ENDPOINTS.PAYMENT.NEPAL_UPLOAD_PROOF, request);
    return response.data.data;
  },

  async getOwnerSubscriptionPayments(): Promise<SubscriptionPayment[]> {
    const response = await apiService.get('/subscription-payments/shop/0');
    return response.data.data || [];
  },

  async getOwnerSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await apiService.get('/payments/owner/subscription-status');
    return response.data.data;
  },
};
