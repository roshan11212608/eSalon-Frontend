/**
 * Admin Dashboard Type Definitions
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
}

// Admin Stats
export interface AdminStats {
  totalSalons: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  pendingApprovals: number;
  supportTickets: number;
}

// Financial Stat Item
export interface FinancialStat {
  label: string;
  value: string;
  color: string;
  icon: string;
  change?: string;
}

// Salon Summary
export interface SalonSummary {
  id: string | number;
  name: string;
  owner: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  revenue: string;
  joinedDate: string;
}

// Subscription Plan
export interface PlanSummary {
  id: string | number;
  name: string;
  price: string;
  subscribers: number;
  revenue: string;
}

// Revenue Trend
export interface RevenueTrend {
  period: string;
  revenue: number;
  subscriptions: number;
}

// Notification Types
export type NotificationType = 'salon' | 'subscription' | 'payment' | 'system' | 'support';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

// Dashboard Response
export interface DashboardResponse {
  profile: UserProfile;
  stats: AdminStats;
  financialStats: FinancialStat[];
  recentSalons: SalonSummary[];
  plans: PlanSummary[];
  revenueTrends: RevenueTrend[];
  notifications: Notification[];
  unreadCount: number;
}

// Period Type
export type PeriodType = 'today' | 'week' | 'month';

// Component Props Types
export interface DashboardHeaderProps {
  displayName: string;
  initials: string;
  greeting: string;
  unreadCount: number;
  onNotificationPress: () => void;
}

export interface SummaryCardsProps {
  stats: AdminStats;
  cardAnimations: Animated.Value[];
}

export interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export interface FinancialStatsProps {
  financialStats: FinancialStat[];
}

export interface NotificationModalProps {
  visible: boolean;
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
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

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
