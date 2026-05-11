import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Animated, ActivityIndicator } from 'react-native';
import { styles } from '../styles/ownerDashboard.styles';
import { useOwnerDashboard } from '../hooks/useOwnerDashboard';
import { PeriodType } from '../types/dashboard.types';
import { DEFAULT_VALUES, ANIMATION_CONFIG, getGreeting, DASHBOARD_SCREEN } from '../config/dashboardConfig';
import DashboardHeader from '../components/DashboardHeader';
import SummaryCards from '../components/SummaryCards';
import PeriodSelector from '../components/PeriodSelector';
import FinancialStats from '../components/FinancialStats';
import RevenueCharts from '../components/RevenueCharts';
import NotificationModal from '../components/NotificationModal';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import QuickActions from '../components/QuickActions';
import PeriodSelectorLoader from '../components/PeriodSelectorLoader';
import { SummaryCardSkeleton, StatCardSkeleton, ChartSkeleton } from '../components/SkeletonLoader';

export default function OwnerDashboardScreen() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(DEFAULT_VALUES.INITIAL_PERIOD);
  const [refreshing, setRefreshing] = useState(false);
  const [isChangingPeriod, setIsChangingPeriod] = useState(false);

  // Create animation values for summary cards
  const cardAnimation1 = useRef(new Animated.Value(ANIMATION_CONFIG.CARDS.initialOpacity)).current;
  const cardAnimation2 = useRef(new Animated.Value(ANIMATION_CONFIG.CARDS.initialOpacity)).current;
  const cardAnimation3 = useRef(new Animated.Value(ANIMATION_CONFIG.CARDS.initialOpacity)).current;
  const cardAnimation4 = useRef(new Animated.Value(ANIMATION_CONFIG.CARDS.initialOpacity)).current;

  const cardAnimations = useMemo(() => [
    cardAnimation1,
    cardAnimation2,
    cardAnimation3,
    cardAnimation4,
  ], [cardAnimation1, cardAnimation2, cardAnimation3, cardAnimation4]);

  // Use the custom dashboard hook with React Query
  const {
    profile,
    activityStats,
    financialSummary,
    notifications,
    unreadCount,
    isInitialLoading,
    isRefetching,
    error,
    hasError,
    refetchAll,
    markAllAsRead,
  } = useOwnerDashboard(selectedPeriod);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAll();
    setRefreshing(false);
  };

  const handleNotificationPress = () => {
    setShowNotifications(true);
    markAllAsRead();
  };

  const handlePeriodChange = (period: PeriodType) => {
    if (period === selectedPeriod) return;
    setIsChangingPeriod(true);
    setSelectedPeriod(period);
    // Hide loader after a short delay to allow data to load
    setTimeout(() => setIsChangingPeriod(false), 1000);
  };

  // Get display name and initials from profile
  const displayName = profile?.name || DEFAULT_VALUES.DISPLAY_NAME;
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const greeting = getGreeting();

  // Display counts for summary cards
  const displayCounts = useMemo(() => ({
    today: activityStats?.todayCount || 0,
    yesterday: activityStats?.yesterdayCount || 0,
    week: activityStats?.weekCount || 0,
    month: activityStats?.monthCount || 0,
  }), [activityStats]);

  if (hasError) {
    return (
      <View style={styles.mainContainer}>
        <ErrorState error={error || DASHBOARD_SCREEN.FALLBACK_ERROR_MESSAGE} onRetry={refetchAll} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Dashboard Header */}
      <DashboardHeader
        displayName={displayName}
        initials={initials}
        greeting={greeting}
        unreadCount={unreadCount}
        onNotificationPress={handleNotificationPress}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing || isRefetching} onRefresh={handleRefresh} />
        }
      >
        {/* Activity Summary */}
        {isInitialLoading ? (
          <View style={styles.activitySummarySection}>
            <ActivityIndicator size="small" color={DASHBOARD_SCREEN.LOADING_INDICATOR_COLOR} style={{ marginBottom: 16 }} />
            <View style={styles.summaryContainer}>
              {[1, 2, 3, 4].map((i) => <SummaryCardSkeleton key={i} />)}
            </View>
          </View>
        ) : (
          activityStats && (
            <SummaryCards
              displayCounts={displayCounts}
              cardAnimations={cardAnimations}
            />
          )
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Period Selector */}
        {isChangingPeriod ? (
          <PeriodSelectorLoader />
        ) : (
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        )}

        {/* Financial Stats */}
        {isInitialLoading || isChangingPeriod ? (
          <View style={styles.statsContainer}>
            {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
          </View>
        ) : financialSummary?.financialStats && financialSummary.financialStats.length > 0 ? (
          <FinancialStats financialStats={financialSummary.financialStats} />
        ) : !isInitialLoading && !isChangingPeriod ? (
          <EmptyState
            icon={DASHBOARD_SCREEN.EMPTY_STATES.FINANCIAL.ICON}
            title={DASHBOARD_SCREEN.EMPTY_STATES.FINANCIAL.TITLE}
            subtitle={DASHBOARD_SCREEN.EMPTY_STATES.FINANCIAL.SUBTITLE}
          />
        ) : null}

        {/* Revenue Charts */}
        {isInitialLoading || isChangingPeriod ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : financialSummary ? (
          <RevenueCharts financialData={financialSummary} />
        ) : !isInitialLoading && !isChangingPeriod ? (
          <EmptyState
            icon={DASHBOARD_SCREEN.EMPTY_STATES.CHARTS.ICON}
            title={DASHBOARD_SCREEN.EMPTY_STATES.CHARTS.TITLE}
            subtitle={DASHBOARD_SCREEN.EMPTY_STATES.CHARTS.SUBTITLE}
          />
        ) : null}
      </ScrollView>

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotifications}
        notifications={notifications}
        unreadCount={unreadCount}
        onClose={() => setShowNotifications(false)}
        onNotificationPress={(notification) => {
          // Handle notification press if needed
          console.log('Notification pressed:', notification);
        }}
        onMarkAllAsRead={markAllAsRead}
      />
    </View>
  );
}

