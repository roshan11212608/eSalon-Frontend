export type BillingCycle = 'monthly' | 'yearly' | 'both';
export type PlanStatus = 'active' | 'inactive';
export type PlanTier = 'basic' | 'professional' | 'enterprise';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface PlanFeature {
  id: string;
  name: string;
  icon: string;
  included: boolean;
}

export interface SubscriberSalon {
  id: number;
  salonName: string;
  ownerName: string;
  activeSince: string;
  renewalDate: string;
  paymentStatus: PaymentStatus;
  revenueContribution: number;
  currency: string;
}

export interface RevenueAnalytics {
  month: string;
  revenue: number;
  subscribers: number;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  tier: PlanTier;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  billingCycle: BillingCycle;
  status: PlanStatus;
  isPopular: boolean;
  color: string;
  employeeLimit: number | null;
  trialDays: number;
  durationInDays: number;
  features: PlanFeature[];
  activeSubscribers: number;
  trialUsers: number;
  monthlyRevenue: number;
  annualRevenue: number;
  subscribers: SubscriberSalon[];
  analytics: RevenueAnalytics[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanStatCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  growth?: number;
  color: string;
}

export interface CreatePlanForm {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  employeeLimit: string;
  color: string;
  isPopular: boolean;
  status: PlanStatus;
  featureIds: string[];
}

export interface PlanFilterOptions {
  status: PlanStatus | 'all';
  tier: PlanTier | 'all';
  searchQuery: string;
}

/** Backward-compat alias used by adminPlanService API mapper. */
export type Plan = SubscriptionPlan;
