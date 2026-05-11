/**
 * Owner Dashboard Type Definitions
 * Strict TypeScript interfaces for all dashboard data structures
 */
import { Animated } from 'react-native';

// User Profile Types
export interface UserProfile {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  shopId?: string | number;
}

// Activity Statistics
export interface ActivityStats {
  todayCount: number;
  yesterdayCount: number;
  weekCount: number;
  monthCount: number;
}

// Financial Stat Item
export interface FinancialStat {
  label: string;
  value: string;
  color: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Financial Breakdown Item
export interface FinancialBreakdownItem {
  category: string;
  amount: string;
  color: string;
  percentage?: string;
}

// Monthly Trend
export interface MonthlyTrend {
  month: string;
  revenue: string;
  expenses?: string;
  profit?: string;
}

// Yearly Trend
export interface YearlyTrend {
  year: string;
  revenue: string;
  expenses?: string;
  profit?: string;
}

// Financial Summary
export interface FinancialSummary {
  financialStats: FinancialStat[];
  financialBreakdown: FinancialBreakdownItem[];
  monthlyTrends: MonthlyTrend[];
  yearlyTrends: YearlyTrend[];
  totalRevenue?: string;
  totalExpenses?: string;
  netProfit?: string;
}

// Notification Types
export type NotificationType = 'appointment' | 'payment' | 'system' | 'promotion' | 'reminder' | string;

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  relatedId?: string | number | null;
  actionUrl?: string;
}

// Grouped Notifications by Date
export interface NotificationGroup {
  date: string;
  label: string;
  notifications: Notification[];
}

// Dashboard Aggregated Response
export interface DashboardResponse {
  profile: UserProfile;
  activityStats: ActivityStats;
  financialSummary: FinancialSummary;
  notifications: Notification[];
  unreadCount: number;
}

// Chart Data Types
export interface PieChartData {
  name: string;
  population: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }[];
}

// Period Type
export type PeriodType = 'today' | 'week' | 'month';

// Loading States
export interface DashboardLoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// Component Props Types
export interface DashboardHeaderProps {
  displayName: string;
  initials: string;
  greeting: string;
  unreadCount: number;
  onNotificationPress: () => void;
}

export interface SummaryCardsProps {
  displayCounts: {
    today: number;
    yesterday: number;
    week: number;
    month: number;
  };
  cardAnimations: Animated.Value[];
}

export interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export interface FinancialStatsProps {
  financialStats: FinancialStat[];
}

export interface RevenueChartsProps {
  financialData: FinancialSummary;
}

export interface NotificationModalProps {
  visible: boolean;
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
  onNotificationPress?: (notification: Notification) => void;
  onMarkAllAsRead?: () => void;
}

export interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle: string;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: object;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
