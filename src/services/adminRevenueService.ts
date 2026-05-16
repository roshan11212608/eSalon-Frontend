import apiClient from './api/apiClient';

// Base path for admin revenue endpoints
const REVENUE_BASE = '/admin/revenue';

export interface RevenueSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  todayRevenue: number;
  platformFeesCollected: number;
  revenueGrowth: number;
  growthPeriod: string;
}

export interface RevenueStat {
  label: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  period: string;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  platformFees: number;
}

export interface SubscriptionStats {
  activeSubscriptions: number;
  expiredSubscriptions: number;
  newSubscriptions: number;
  renewals: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
}

export interface PaymentStats {
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalPaymentVolume: number;
  successRate: number;
}

export interface AdminRevenueOverviewResponse {
  revenueSummary: RevenueSummary;
  revenueStats: RevenueStat[];
  revenueTrends: RevenueTrend[];
  subscriptionStats: SubscriptionStats;
  paymentStats: PaymentStats;
}

export interface RevenueDataPoint {
  periodLabel: string;
  date: string;
  revenue: number;
  platformFees: number;
  netRevenue: number;
  transactionCount: number;
}

export interface RevenueComparison {
  previousPeriodRevenue: number;
  growth: number;
  growthPercentage: number;
}

export interface RevenueAnalyticsResponse {
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  platformFees: number;
  netRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  revenueDataPoints: RevenueDataPoint[];
  comparison: RevenueComparison;
}

export interface SubscriptionSummary {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  newSubscriptions: number;
  renewals: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
}

export interface PlanAnalytics {
  planId: number;
  planName: string;
  planType: string;
  monthlyPrice: number;
  activeCount: number;
  newCount: number;
  expiredCount: number;
  totalRevenue: number;
  revenuePercentage: number;
  color: string;
}

export interface SubscriptionTrend {
  date: string;
  newSubscriptions: number;
  renewals: number;
  cancellations: number;
  activeSubscriptions: number;
  revenue: number;
}

export interface SubscriptionMetrics {
  churnRate: number;
  retentionRate: number;
  averageLifetime: number;
  conversionRate: number;
  upgradeRate: number;
  downgradeRate: number;
}

export interface SubscriptionAnalyticsResponse {
  period: string;
  startDate: string;
  endDate: string;
  summary: SubscriptionSummary;
  planAnalytics: PlanAnalytics[];
  subscriptionTrends: SubscriptionTrend[];
  metrics: SubscriptionMetrics;
}

export interface PaymentSummary {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalVolume: number;
  successfulVolume: number;
  failedVolume: number;
  successRate: number;
  failureRate: number;
  averagePaymentAmount: number;
}

export interface PaymentAnalyticsTrend {
  period: string;
  date: string;
  total: number;
  successful: number;
  failed: number;
  pending: number;
  volume: number;
}

export interface PaymentMethodBreakdown {
  razorpay: number;
  total: number;
  percentage: number;
}

export interface FailedPaymentAnalysis {
  paymentId: number;
  amount: number;
  reason: string;
  date: string;
  salonId: number;
  salonName: string;
}

export interface PaymentAnalyticsResponse {
  period: string;
  startDate: string;
  endDate: string;
  summary: PaymentSummary;
  paymentTrends: PaymentAnalyticsTrend[];
  paymentMethodBreakdown: PaymentMethodBreakdown;
  failedPayments: FailedPaymentAnalysis[];
}

export interface SalonSummary {
  totalSalons: number;
  activeSalons: number;
  inactiveSalons: number;
  totalRevenue: number;
  averageRevenuePerSalon: number;
  newSalons: number;
}

export interface TopSalon {
  salonId: number;
  salonName: string;
  ownerName: string;
  platformFeesPaid: number;
  subscriptionMonths: number;
  planName: string;
  revenueContribution: number;
  percentage: number;
  rank: number;
}

export interface SalonRanking {
  rank: number;
  salonId: number;
  salonName: string;
  ownerName: string;
  planName: string;
  totalPlatformFees: number;
  activities: number;
  revenue: number;
  status: string;
  joinedDate: string;
}

export interface SalonAnalyticsResponse {
  period: string;
  startDate: string;
  endDate: string;
  summary: SalonSummary;
  topEarningSalons: TopSalon[];
  mostActiveSalons: TopSalon[];
  salonRankings: SalonRanking[];
}

class AdminRevenueService {
  /**
   * Get Revenue Overview Dashboard
   */
  async getRevenueOverview(): Promise<AdminRevenueOverviewResponse> {
    const response = await apiClient.get<AdminRevenueOverviewResponse>(
      `${REVENUE_BASE}/overview`
    );
    return response.data;
  }

  /**
   * Get Revenue Analytics
   */
  async getRevenueAnalytics(
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<RevenueAnalyticsResponse> {
    const params: any = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<RevenueAnalyticsResponse>(
      `${REVENUE_BASE}/analytics`,
      { params }
    );
    return response.data;
  }

  /**
   * Get Daily Revenue
   */
  async getDailyRevenue(): Promise<RevenueAnalyticsResponse> {
    const response = await apiClient.get<RevenueAnalyticsResponse>(
      `${REVENUE_BASE}/daily`
    );
    return response.data;
  }

  /**
   * Get Weekly Revenue
   */
  async getWeeklyRevenue(): Promise<RevenueAnalyticsResponse> {
    const response = await apiClient.get<RevenueAnalyticsResponse>(
      `${REVENUE_BASE}/weekly`
    );
    return response.data;
  }

  /**
   * Get Monthly Revenue
   */
  async getMonthlyRevenue(): Promise<RevenueAnalyticsResponse> {
    const response = await apiClient.get<RevenueAnalyticsResponse>(
      `${REVENUE_BASE}/monthly`
    );
    return response.data;
  }

  /**
   * Get Yearly Revenue
   */
  async getYearlyRevenue(): Promise<RevenueAnalyticsResponse> {
    const response = await apiClient.get<RevenueAnalyticsResponse>(
      `${REVENUE_BASE}/yearly`
    );
    return response.data;
  }

  /**
   * Get Subscription Analytics
   */
  async getSubscriptionAnalytics(
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<SubscriptionAnalyticsResponse> {
    const params: any = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<SubscriptionAnalyticsResponse>(
      `${REVENUE_BASE}/subscriptions`,
      { params }
    );
    return response.data;
  }

  /**
   * Get Payment Analytics
   */
  async getPaymentAnalytics(
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<PaymentAnalyticsResponse> {
    const params: any = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<PaymentAnalyticsResponse>(
      `${REVENUE_BASE}/payments`,
      { params }
    );
    return response.data;
  }

  /**
   * Get Salon Analytics
   */
  async getSalonAnalytics(
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<SalonAnalyticsResponse> {
    const params: any = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<SalonAnalyticsResponse>(
      `${REVENUE_BASE}/salons`,
      { params }
    );
    return response.data;
  }
}

export default new AdminRevenueService();
