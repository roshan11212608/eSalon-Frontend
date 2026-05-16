export interface Payment {
  id: string;
  transactionId: string;
  salonId: string;
  salonName: string;
  ownerId: string;
  ownerName: string;
  country: 'India' | 'Nepal' | 'Others';
  planName: string;
  planId: string;
  amount: number;
  currency: 'INR' | 'NPR' | 'USD';
  paymentMethod: PaymentMethod;
  gateway: PaymentGateway;
  status: PaymentStatus;
  paymentType: PaymentType;
  paidDate: string;
  renewalDate?: string;
  invoiceNumber?: string;
  gst?: number;
  tax?: number;
  gatewayResponse?: GatewayResponse;
  verification?: NepalVerification;
  failureReason?: string;
  retryAttempts?: number;
  adminNote?: string;
}

export interface NepalVerification {
  screenshotUrl: string;
  uploadedAt: string;
  paymentNote?: string;
  verificationStatus: 'Pending' | 'Approved' | 'Rejected' | 'Reupload Requested';
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNote?: string;
}

export interface GatewayResponse {
  paymentId: string;
  orderId: string;
  signature: string;
  rawResponse?: Record<string, any>;
}

export interface PaymentStats {
  totalTransactions: number;
  successfulPayments: number;
  pendingVerifications: number;
  failedPayments: number;
  totalRevenue: number;
  successRate: number;
}

export interface PaymentFilter {
  country?: 'India' | 'Nepal' | 'All';
  status?: PaymentStatus | 'All';
  paymentMethod?: PaymentMethod | 'All';
  gateway?: PaymentGateway | 'All';
  dateRange?: 'This Month' | 'Last Month' | 'This Year' | 'All Time';
  searchQuery?: string;
}

export interface Invoice {
  invoiceNumber: string;
  paymentId: string;
  salonName: string;
  amount: number;
  currency: string;
  paidDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 
  | 'Razorpay'
  | 'UPI'
  | 'Card'
  | 'Net Banking'
  | 'eSewa QR'
  | 'Manual Verification';

export type PaymentGateway = 'Razorpay' | 'eSewa' | 'Manual';

export type PaymentStatus = 
  | 'Success'
  | 'Failed'
  | 'Pending'
  | 'Pending Verification'
  | 'Rejected'
  | 'Refunded'
  | 'CANCELLED';

export type PaymentType = 'Subscription' | 'One-time' | 'Renewal';
