export interface Subscription {
  id: string;
  planName: string;
  ownerName: string;
  shopName: string;
  amount: number;
  status: 'Active' | 'Inactive' | 'Pending' | 'Expired';
  startDate: string;
  endDate: string;
  duration: '1 Month' | '3 Months' | '6 Months' | '1 Year';
}

export interface SubscriptionStatus {
  planName: string;
  status: 'NO_SUBSCRIPTION' | 'ACTIVE' | 'EXPIRED' | 'PENDING_VERIFICATION' | 'REJECTED';
  startDate: string;
  expiryDate: string;
  daysRemaining: number;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string;
  adminNote: string;
  amount: number;
  paymentProofImage: string;
  paymentUploadedAt: string;
  planTier: string;
  planId: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  duration: '1 Month' | '3 Months' | '6 Months' | '1 Year';
  price: number;
  description: string;
}

/** Owner-facing plan shape — returned by GET /api/plans/active */
export interface OwnerPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  employeeLimit: number | null;
  durationInDays: number;
  features: string[];
  isPopular: boolean;
  color: string;
  tier: string;
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
