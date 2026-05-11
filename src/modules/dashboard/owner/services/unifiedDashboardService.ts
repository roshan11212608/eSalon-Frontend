import { apiService, ApiResponse } from '../../../../services/apiService';

// Unified Dashboard Types
export interface OwnerDashboardResponse {
  profile: ProfileInfo;
  activityStats: ActivityStats;
  financialSummary: FinancialSummary;
  notifications: NotificationInfo[];
  unreadCount: number;
  upcomingAppointments: AppointmentInfo[];
  topServices: ServiceInfo[];
  staffPerformance: StaffPerformanceInfo[];
  todayRevenue: string;
  insights: BusinessInsight[];
  lastUpdated: string;
  responseTimeMs: number;
}

export interface ProfileInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  shopAddress: string;
  role: string;
}

export interface ActivityStats {
  todayCount: number;
  yesterdayCount: number;
  weekCount: number;
  monthCount: number;
  totalCount: number;
  growthRate: number;
}

export interface FinancialSummary {
  financialStats: FinancialStat[];
  financialBreakdown: FinancialBreakdown[];
  monthlyTrends: MonthlyTrend[];
  yearlyTrends: YearlyTrend[];
  totalRevenue: string;
  totalExpenses: string;
  netProfit: string;
  averageRevenue: string;
}

export interface FinancialStat {
  label: string;
  value: string;
  icon: string;
  color: string;
  change: string;
  changeDirection: 'UP' | 'DOWN' | 'SAME';
}

export interface FinancialBreakdown {
  category: string;
  amount: string;
  color: string;
  percentage: string;
}

export interface MonthlyTrend {
  month: string;
  revenue: string;
  expenses: string;
  profit: string;
}

export interface YearlyTrend {
  year: string;
  revenue: string;
  expenses: string;
  profit: string;
}

export interface NotificationInfo {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  relatedId: string;
  relatedType: string;
}

export interface AppointmentInfo {
  id: number;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: string;
  staffName: string;
  amount: string;
}

export interface ServiceInfo {
  id: number;
  name: string;
  category: string;
  bookingCount: number;
  revenue: string;
  growthRate: number;
  trendDirection: 'UP' | 'DOWN' | 'SAME';
}

export interface StaffPerformanceInfo {
  id: number;
  name: string;
  role: string;
  appointmentsCompleted: number;
  revenueGenerated: string;
  rating: number;
  hoursWorked: number;
  performanceGrade: string;
}

export interface BusinessInsight {
  id: string;
  title: string;
  description: string;
  value: string;
  unit: string;
  trend: string;
  trendDirection: 'UP' | 'DOWN' | 'SAME';
  icon: string;
  color: string;
  category: string;
  generatedAt: string;
}

/**
 * Unified Dashboard Service
 * Handles all dashboard API calls with optimized caching and error handling
 */
export class UnifiedDashboardService {
  private static readonly BASE_ENDPOINT = '/dashboard';
  private static readonly UNIFIED_ENDPOINT = '/dashboard/owner/:ownerId/unified';

  /**
   * Fetch unified dashboard data in a single API call
   * Target: <500ms cached, <2s fresh
   */
  static async getUnifiedDashboard(ownerId: number): Promise<OwnerDashboardResponse> {
    const startTime = Date.now();
    
    try {
      // Force correct endpoint to avoid caching issues
      const endpoint = `/dashboard/owner/${ownerId}/unified`;
      console.log('HARDCODED ENDPOINT:', endpoint);
      const response = await apiService.get<ApiResponse<OwnerDashboardResponse>>(endpoint);
      
      const totalTime = Date.now() - startTime;
      console.log(`Unified dashboard fetched in ${totalTime}ms for owner: ${ownerId}`);
      
      if (!response.data?.data) {
        throw new Error('No dashboard data received');
      }
      
      return response.data.data;
      
    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`Failed to fetch unified dashboard in ${totalTime}ms:`, error);
      
      // Enhanced error handling
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Authentication failed. Please login again.');
        }
        if (error.message.includes('403')) {
          throw new Error('Access denied. Insufficient permissions.');
        }
        if (error.message.includes('404')) {
          throw new Error('Dashboard data not found.');
        }
        if (error.message.includes('500')) {
          throw new Error('Server error. Please try again later.');
        }
      }
      
      throw new Error('Failed to load dashboard data. Please refresh.');
    }
  }

  /**
   * Parse amount string to number
   */
  static parseAmount(amount: string): number {
    if (!amount) return 0;
    const cleanAmount = amount.replace(/[₹$,]/g, '');
    return parseFloat(cleanAmount) || 0;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number | string): string {
    const num = typeof amount === 'string' ? this.parseAmount(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  /**
   * Calculate percentage change
   */
  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Get trend direction from percentage
   */
  static getTrendDirection(percentage: number): 'UP' | 'DOWN' | 'SAME' {
    if (percentage > 0.5) return 'UP';
    if (percentage < -0.5) return 'DOWN';
    return 'SAME';
  }

  /**
   * Validate dashboard response
   */
  static validateDashboardResponse(data: OwnerDashboardResponse): boolean {
    try {
      // Check required fields
      if (!data.profile || !data.activityStats || !data.financialSummary) {
        console.error('Missing required dashboard sections');
        return false;
      }

      // Check profile
      if (!data.profile.id || !data.profile.name) {
        console.error('Invalid profile data');
        return false;
      }

      // Check activity stats
      if (typeof data.activityStats.todayCount !== 'number') {
        console.error('Invalid activity stats');
        return false;
      }

      // Check financial summary
      if (!Array.isArray(data.financialSummary.financialStats)) {
        console.error('Invalid financial summary');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Dashboard validation error:', error);
      return false;
    }
  }

  /**
   * Transform legacy dashboard data to unified format (for migration)
   */
  static transformLegacyData(legacyData: any): OwnerDashboardResponse {
    // This method helps migrate from the old multi-API approach to unified API
    const now = new Date().toISOString();
    
    return {
      profile: {
        id: legacyData.profile?.id || 0,
        name: legacyData.profile?.name || 'Unknown',
        email: legacyData.profile?.email || '',
        phone: legacyData.profile?.phone || '',
        shopName: legacyData.profile?.shopName || '',
        shopAddress: legacyData.profile?.shopAddress || '',
        role: legacyData.profile?.role || 'owner',
      },
      activityStats: {
        todayCount: legacyData.activityStats?.todayCount || 0,
        yesterdayCount: legacyData.activityStats?.yesterdayCount || 0,
        weekCount: legacyData.activityStats?.weekCount || 0,
        monthCount: legacyData.activityStats?.monthCount || 0,
        totalCount: legacyData.activityStats?.totalCount || 0,
        growthRate: legacyData.activityStats?.growthRate || 0,
      },
      financialSummary: {
        financialStats: legacyData.financialSummary?.financialStats || [],
        financialBreakdown: legacyData.financialSummary?.financialBreakdown || [],
        monthlyTrends: legacyData.financialSummary?.monthlyTrends || [],
        yearlyTrends: legacyData.financialSummary?.yearlyTrends || [],
        totalRevenue: legacyData.financialSummary?.totalRevenue || '₹0',
        totalExpenses: legacyData.financialSummary?.totalExpenses || '₹0',
        netProfit: legacyData.financialSummary?.netProfit || '₹0',
        averageRevenue: legacyData.financialSummary?.averageRevenue || '₹0',
      },
      notifications: legacyData.notifications || [],
      unreadCount: legacyData.unreadCount || 0,
      upcomingAppointments: legacyData.upcomingAppointments || [],
      topServices: legacyData.topServices || [],
      staffPerformance: legacyData.staffPerformance || [],
      todayRevenue: legacyData.todayRevenue || '₹0',
      insights: legacyData.insights || [],
      lastUpdated: now,
      responseTimeMs: 0,
    };
  }

  /**
   * Get performance metrics for monitoring
   */
  static getPerformanceMetrics(data: OwnerDashboardResponse) {
    return {
      responseTime: data.responseTimeMs,
      dataPoints: this.countDataPoints(data),
      lastUpdated: data.lastUpdated,
      cacheHit: data.responseTimeMs < 600, // Assume <600ms is cache hit
    };
  }

  private static countDataPoints(data: OwnerDashboardResponse): number {
    let count = 0;
    count += data.notifications?.length || 0;
    count += data.upcomingAppointments?.length || 0;
    count += data.topServices?.length || 0;
    count += data.staffPerformance?.length || 0;
    count += data.insights?.length || 0;
    count += data.financialSummary?.financialStats?.length || 0;
    count += data.financialSummary?.financialBreakdown?.length || 0;
    count += data.financialSummary?.monthlyTrends?.length || 0;
    count += data.financialSummary?.yearlyTrends?.length || 0;
    return count;
  }
}

export default UnifiedDashboardService;
