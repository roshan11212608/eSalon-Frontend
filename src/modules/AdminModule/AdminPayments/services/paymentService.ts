import { Payment, PaymentStats, PaymentFilter, Invoice, PaymentStatus } from '../types/payment.types';
import apiService from '../../../../services/apiService';

class PaymentService {
  async getPayments(filter?: PaymentFilter): Promise<Payment[]> {
    try {
      const response = await apiService.get('/payments/admin/all?page=0&size=100');
      const payments = response.data.data.content || [];
      console.log('All payments from backend:', payments);
      const subscriptionPayments = payments.filter((p: any) => p.paymentType === 'SUBSCRIPTION');
      console.log('Subscription payments:', subscriptionPayments);
      return subscriptionPayments.map((p: any) => this.mapToPayment(p));
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  async getPendingPayments(): Promise<Payment[]> {
    try {
      const response = await apiService.get('/payments/admin/pending?page=0&size=100');
      const payments = response.data.data.content || [];
      return payments.map(this.mapToPayment);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      return [];
    }
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    try {
      const response = await apiService.get(`/payments/${id}`);
      return this.mapToPayment(response.data.data);
    } catch (error) {
      console.error('Error fetching payment:', error);
      return undefined;
    }
  }

  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await apiService.get('/payments/admin/all?page=0&size=100');
      const payments = response.data.data.content || [];
      const subscriptionPayments = payments.filter((p: any) => p.paymentType === 'SUBSCRIPTION');
      const total = subscriptionPayments.length;
      const successRate = total > 0 ? (subscriptionPayments.filter((p: any) => p.status === 'SUCCESS' || p.status === 'VERIFIED' || p.status === 'APPROVED').length / total) * 100 : 0;
      return {
        totalTransactions: total,
        successfulPayments: subscriptionPayments.filter((p: any) => p.status === 'SUCCESS' || p.status === 'VERIFIED' || p.status === 'APPROVED').length,
        pendingVerifications: subscriptionPayments.filter((p: any) => p.status === 'PENDING').length,
        failedPayments: subscriptionPayments.filter((p: any) => p.status === 'FAILED').length,
        totalRevenue: subscriptionPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        successRate,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalTransactions: 0,
        successfulPayments: 0,
        pendingVerifications: 0,
        failedPayments: 0,
        totalRevenue: 0,
        successRate: 0,
      };
    }
  }

  async approveNepalPayment(paymentId: string, note?: string): Promise<void> {
    await apiService.post(`/payments/admin/${paymentId}/approve`);
  }

  async rejectNepalPayment(paymentId: string, note?: string): Promise<void> {
    await apiService.post(`/payments/admin/${paymentId}/reject`, { adminNote: note });
  }

  async requestReupload(paymentId: string, note?: string): Promise<void> {
    // TODO: Implement reupload request endpoint
    throw new Error('Not implemented');
  }

  async getInvoice(paymentId: string): Promise<Invoice | null> {
    // TODO: Implement invoice endpoint
    return null;
  }

  async retryFailedPayment(paymentId: string): Promise<void> {
    // TODO: Implement retry endpoint
    throw new Error('Not implemented');
  }

  private mapToPayment(dto: any): Payment {
    console.log('Mapping payment DTO:', dto);
    return {
      id: dto.id?.toString() || '',
      salonId: dto.shopShopId || dto.shopId?.toString() || '',
      salonName: dto.shopName || dto.recipientName || `Shop ${dto.shopId || 'N/A'}`,
      ownerId: '',
      ownerName: dto.ownerName || dto.recipientName || 'Unknown',
      transactionId: dto.transactionId || 'N/A',
      amount: dto.amount || 0,
      currency: dto.currency || 'INR',
      status: this.mapStatus(dto.status),
      paymentMethod: dto.paymentMethod || 'Manual Verification',
      gateway: dto.paymentMethod || 'Manual',
      country: dto.shopCountry || dto.country || (dto.currency === 'NPR' ? 'Nepal' : 'India'),
      paymentType: dto.paymentType || 'Subscription',
      paidDate: dto.paymentDate || dto.createdAt,
      planName: dto.description || 'Subscription',
      planId: '',
      invoiceNumber: `INV-${dto.id}`,
      tax: 0,
      verification: dto.paymentProofImage ? {
        screenshotUrl: dto.paymentProofImage,
        uploadedAt: dto.createdAt || '',
        verificationStatus: dto.status === 'PENDING' ? 'Pending' : dto.status === 'VERIFIED' || dto.status === 'APPROVED' ? 'Approved' : dto.status === 'CANCELLED' || dto.status === 'REJECTED' ? 'Rejected' : 'Pending',
        verifiedAt: dto.verifiedAt,
        verifiedBy: dto.verifiedBy ? 'Admin' : undefined,
        verificationNote: '',
      } : undefined,
    };
  }

  private mapStatus(status: string): PaymentStatus {
    const statusMap: { [key: string]: PaymentStatus } = {
      'PENDING': 'Pending Verification',
      'VERIFIED': 'Success',
      'CANCELLED': 'Rejected',
      'SUCCESS': 'Success',
      'FAILED': 'Failed',
      'APPROVED': 'Success',
      'REJECTED': 'Rejected',
      'COMPLETED': 'Success',
    };
    return statusMap[status] || 'Pending Verification';
  }
}

export const paymentService = new PaymentService();
