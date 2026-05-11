import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { PeriodType } from '../types/dashboard.types';
import { StorageService } from '../../../../services/storage/storageService';
import { UnifiedDashboardService, OwnerDashboardResponse } from '../services/unifiedDashboardService';
import { NotificationService } from '../../../../services/notificationService';

// Query keys for cache management
export const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  unified: (userId: string | number) => [...DASHBOARD_QUERY_KEYS.all, 'unified', userId.toString()] as const,
  notifications: (userId: string | number) => [...DASHBOARD_QUERY_KEYS.all, 'notifications', userId.toString()] as const,
} as const;

/**
 * Fetch unified dashboard data
 */
const fetchUnifiedDashboard = async (ownerId: string): Promise<OwnerDashboardResponse> => {
  const dashboard = await UnifiedDashboardService.getUnifiedDashboard(parseInt(ownerId));
  
  // Validate response
  if (!UnifiedDashboardService.validateDashboardResponse(dashboard)) {
    throw new Error('Invalid dashboard response received');
  }
  
  return dashboard;
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (): Promise<void> => {
  try {
    await NotificationService.markAllAsRead();
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

/**
 * Transform unified dashboard data to legacy format for compatibility
 */
const transformToLegacyFormat = (unified: OwnerDashboardResponse) => {
  return {
    profile: {
      id: unified.profile.id,
      name: unified.profile.name,
      email: unified.profile.email,
      phone: unified.profile.phone,
      role: unified.profile.role,
      shopId: '',
      shopName: unified.profile.shopName,
      shopAddress: unified.profile.shopAddress,
    },
    activityStats: {
      todayCount: unified.activityStats.todayCount,
      yesterdayCount: unified.activityStats.yesterdayCount,
      weekCount: unified.activityStats.weekCount,
      monthCount: unified.activityStats.monthCount,
    },
    financialSummary: {
      financialStats: unified.financialSummary.financialStats.map(stat => ({
        label: stat.label,
        value: stat.value,
        icon: stat.icon,
        color: stat.color,
        change: stat.change,
        changeDirection: stat.changeDirection,
      })),
      financialBreakdown: unified.financialSummary.financialBreakdown.map(breakdown => ({
        category: breakdown.category,
        amount: breakdown.amount,
        color: breakdown.color,
        percentage: breakdown.percentage,
      })),
      monthlyTrends: unified.financialSummary.monthlyTrends.map(trend => ({
        month: trend.month,
        revenue: trend.revenue,
        expenses: trend.expenses,
        profit: trend.profit,
      })),
      yearlyTrends: unified.financialSummary.yearlyTrends.map(trend => ({
        year: trend.year,
        revenue: trend.revenue,
        expenses: trend.expenses,
        profit: trend.profit,
      })),
    },
    notifications: unified.notifications.map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: notif.read,
      createdAt: notif.createdAt,
      relatedId: notif.relatedId,
      relatedType: notif.relatedType,
    })),
    unreadCount: unified.unreadCount,
    upcomingAppointments: unified.upcomingAppointments,
    topServices: unified.topServices,
    staffPerformance: unified.staffPerformance,
    todayRevenue: unified.todayRevenue,
  };
};

/**
 * Custom hook for Owner Dashboard data management
 * Uses unified API for optimal performance - single API call for all data
 */
export const useOwnerDashboard = (selectedPeriod: PeriodType = 'month') => {
  const queryClient = useQueryClient();

  // Get current user ID for cache isolation between users
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const getUserId = async () => {
      const user = await StorageService.getUserData();
      if (user?.id) {
        setCurrentUserId(user.id);
      }
    };
    getUserId();
  }, []);

  // Fetch unified dashboard data - single API call for everything
  const unifiedQuery = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.unified(currentUserId || 'unknown'),
    queryFn: () => fetchUnifiedDashboard(currentUserId || 'unknown'),
    enabled: !!currentUserId,
    staleTime: 2 * 60 * 1000, // 2 minutes for unified data
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    refetchOnWindowFocus: true, // Refetch when switching back to dashboard tab
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Transform unified data to legacy format for component compatibility
  const transformedData = useMemo(() => {
    if (!unifiedQuery.data) return null;
    return transformToLegacyFormat(unifiedQuery.data);
  }, [unifiedQuery.data]);

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // Invalidate unified dashboard query to refresh notifications
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.unified(currentUserId) });
    },
  });

  // Refetch all dashboard data
  const refetchAll = useCallback(async () => {
    await unifiedQuery.refetch();
  }, [unifiedQuery]);

  // Computed loading states
  const isLoading = unifiedQuery.isLoading;
  const isInitialLoading = unifiedQuery.isInitialLoading;
  const isRefetching = unifiedQuery.isRefetching;

  // Error state
  const error = unifiedQuery.error;
  const hasError = !!error;

  return {
    // Data (transformed to legacy format for compatibility)
    profile: transformedData?.profile,
    activityStats: transformedData?.activityStats,
    financialSummary: transformedData?.financialSummary,
    notifications: transformedData?.notifications || [],
    unreadCount: transformedData?.unreadCount || 0,
    
    // New unified data (for future components)
    upcomingAppointments: transformedData?.upcomingAppointments || [],
    topServices: transformedData?.topServices || [],
    staffPerformance: transformedData?.staffPerformance || [],
    todayRevenue: transformedData?.todayRevenue || '₹0',

    // Loading states
    isLoading,
    isInitialLoading,
    isRefetching,
    isNotificationsLoading: false, // No separate loading with unified API

    // Error states
    error: error ? (error as Error).message : null,
    hasError,

    // Actions
    refetchAll,
    refetchProfile: unifiedQuery.refetch, // All refetch the same unified data
    refetchActivityStats: unifiedQuery.refetch,
    refetchFinancialSummary: unifiedQuery.refetch,
    refetchNotifications: unifiedQuery.refetch,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAllAsReadMutation.isPending,

    // Performance metrics
    responseTime: unifiedQuery.data?.responseTimeMs,
    lastUpdated: unifiedQuery.data?.lastUpdated,
    
    // Query state
    unifiedQuery,
  };
};
