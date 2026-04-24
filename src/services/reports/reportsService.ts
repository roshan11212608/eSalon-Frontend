/**
 * Reports API Service
 * Handles all report-related API calls
 */

import { apiService, ApiResponse } from '../apiService';
import { API_ENDPOINTS } from '../../config/api';

// Report DTOs matching backend response structure

export interface ExpenseStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: string;
  color: string;
}

export interface RecentExpense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor: string;
}

export interface ExpenseTrend {
  period: string;
  amount: number;
}

export interface ExpenseReportResponse {
  expenseStats: ExpenseStat[];
  expenseCategories: ExpenseCategory[];
  recentExpenses: RecentExpense[];
  expenseTrends: ExpenseTrend[];
}

export interface PayrollStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface StaffPayroll {
  id: number;
  name: string;
  role: string;
  totalEarnings: string;
  paidAmount: string;
  currentMonthRemaining: string;
  previousMonthCommission: string;
  remainingAmount: string;
  lastPaymentDate: string;
  status: string;
}

export interface PaymentReportResponse {
  payrollStats: PayrollStat[];
  staffPayroll: StaffPayroll[];
}

export interface ServiceData {
  name: string;
  activities: number;
  color: string;
}

export interface ServiceAnalyticsResponse {
  totalServices: number;
  services: ServiceData[];
  topPopularServices: ServiceData[];
}

export interface FinancialStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface FinancialBreakdown {
  category: string;
  amount: string;
  percentage: string;
  color: string;
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

export interface FinancialSummaryResponse {
  financialStats: FinancialStat[];
  financialBreakdown: FinancialBreakdown[];
  monthlyTrends: MonthlyTrend[];
  yearlyTrends: YearlyTrend[];
}

export interface StaffActivity {
  id: number;
  staffName: string;
  service: string;
  customer: string;
  amount: number;
  time: string;
  earnings: number;
  commission: number;
}

export interface StaffGroupedData {
  staffName: string;
  totalActivities: number;
  totalEarnings: number;
  totalCommission: number;
  activities: StaffActivity[];
}

export interface StaffActivityReportResponse {
  periodTitle: string;
  periodDate: string;
  totalActivities: number;
  totalEarnings: number;
  staffEarnings: number;
  shopProfit: number;
  staffActivities: StaffActivity[];
  groupedActivities: Map<string, StaffGroupedData>;
}

export interface StaffStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface EarningsBreakdown {
  category: string;
  amount: string;
  percentage: string;
  color: string;
}

export interface PaymentSummary {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface StaffMonthlyTrend {
  month: string;
  earnings: string;
  activities: number;
}

export interface StaffYearlyTrend {
  year: string;
  earnings: string;
  activities: number;
}

export interface StaffReportResponse {
  staffStats: StaffStat[];
  earningsBreakdown: EarningsBreakdown[];
  paymentsSummary: PaymentSummary[];
  monthlyTrends: StaffMonthlyTrend[];
  yearlyTrends: StaffYearlyTrend[];
}

export interface ActivityStatsResponse {
  todayCount: number;
  yesterdayCount: number;
  weekCount: number;
  monthCount: number;
}

/**
 * Reports Service
 */
export const reportsService = {
  /**
   * Get Expense Report
   * @param shopId - Shop ID (optional, uses authenticated user's shop if not provided)
   * @param period - Time period (today, week, month, year)
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getExpenseReport(
    shopId?: number,
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<ExpenseReportResponse> {
    const params = new URLSearchParams({ period });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    
    // Use authenticated endpoint if shopId is not provided
    const url = shopId 
      ? `${API_ENDPOINTS.REPORTS.EXPENSE}/${shopId}${queryString ? `?${queryString}` : ''}`
      : `${API_ENDPOINTS.REPORTS.EXPENSE}/authenticated${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<ApiResponse<ExpenseReportResponse>>(url);
    return response.data.data;
  },

  /**
   * Get Payment Report
   * @param shopId - Shop ID (optional, uses authenticated user's shop if not provided)
   * @param period - Time period (today, week, month, year)
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getPaymentReport(
    shopId?: number,
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<PaymentReportResponse> {
    const params = new URLSearchParams({ period });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    
    // Use authenticated endpoint if shopId is not provided
    const url = shopId 
      ? `${API_ENDPOINTS.REPORTS.PAYMENT}/${shopId}${queryString ? `?${queryString}` : ''}`
      : `${API_ENDPOINTS.REPORTS.PAYMENT}/authenticated${queryString ? `?${queryString}` : ''}`;
    
    console.log('getPaymentReport URL:', url);
    
    const response = await apiService.get<ApiResponse<PaymentReportResponse>>(url);
    return response.data.data;
  },

  /**
   * Get Service Analytics
   * @param shopId - Shop ID (optional, uses authenticated user's shop if not provided)
   * @param period - Time period (today, week, month, year)
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getServiceAnalytics(
    shopId?: number,
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<ServiceAnalyticsResponse> {
    const params = new URLSearchParams({ period });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    
    // Use authenticated endpoint if shopId is not provided
    const url = shopId 
      ? `${API_ENDPOINTS.REPORTS.SERVICE_ANALYTICS}/${shopId}${queryString ? `?${queryString}` : ''}`
      : `${API_ENDPOINTS.REPORTS.SERVICE_ANALYTICS}/authenticated${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<ApiResponse<ServiceAnalyticsResponse>>(url);
    return response.data.data;
  },

  /**
   * Get Financial Summary
   * @param shopId - Shop ID (optional, uses authenticated user's shop if not provided)
   * @param period - Time period (today, week, month, year)
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getFinancialSummary(
    shopId?: number,
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<FinancialSummaryResponse> {
    const params = new URLSearchParams({ period });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    
    // Use authenticated endpoint if shopId is not provided
    const url = shopId 
      ? `${API_ENDPOINTS.REPORTS.FINANCIAL_SUMMARY}/${shopId}${queryString ? `?${queryString}` : ''}`
      : `${API_ENDPOINTS.REPORTS.FINANCIAL_SUMMARY}/authenticated${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<ApiResponse<FinancialSummaryResponse>>(url);
    return response.data.data;
  },

  /**
   * Get Staff Activity Report
   * @param period - Time period (today, week, month, year)
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getStaffActivityReport(
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<StaffActivityReportResponse> {
    const params = new URLSearchParams({ period });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiService.get<ApiResponse<StaffActivityReportResponse>>(
      `${API_ENDPOINTS.REPORTS.STAFF_ACTIVITY}?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get Staff Report
   * @param staffId - Staff/Employee ID
   * @param period - Time period (today, week, month, year)
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getStaffReport(
    staffId: number,
    period: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<StaffReportResponse> {
    const params = new URLSearchParams({
      period,
    });
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiService.get<ApiResponse<StaffReportResponse>>(
      `${API_ENDPOINTS.REPORTS.STAFF}/${staffId}?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * Get Activity Stats
   * Returns activity counts for today, yesterday, this week, and this month
   */
  async getActivityStats(): Promise<ActivityStatsResponse> {
    const response = await apiService.get<ApiResponse<ActivityStatsResponse>>(
      `${API_ENDPOINTS.REPORTS.BASE}/activity-stats`
    );
    return response.data.data;
  },
};

export default reportsService;
