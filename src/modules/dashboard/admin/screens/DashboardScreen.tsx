import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Animated } from 'react-native';
import { styles } from '../styles/adminDashboard.styles';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { PeriodType } from '../types/dashboard.types';
import { DEFAULT_VALUES, ANIMATION_CONFIG, getGreeting } from '../config/dashboardConfig';
import DashboardHeader from '../components/DashboardHeader';
import SummaryCards from '../components/SummaryCards';
import PeriodSelector from '../components/PeriodSelector';
import FinancialStats from '../components/FinancialStats';
import QuickActions from '../components/QuickActions';
import NotificationModal from '../components/NotificationModal';

export default function AdminDashboardScreen() {
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

  // Use the custom dashboard hook
  const {
    stats,
    financialStats,
    notifications,
    unreadCount,
    isLoading,
    refetchAll,
    markAllAsRead,
  } = useAdminDashboard(selectedPeriod);

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
    setTimeout(() => setIsChangingPeriod(false), 500);
  };

  // Mock profile data for admin
  const displayName = 'System Administrator';
  const initials = 'AD';
  const greeting = getGreeting();

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
          <RefreshControl refreshing={refreshing || isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Summary Cards */}
        {stats && (
          <SummaryCards
            stats={stats}
            cardAnimations={cardAnimations}
          />
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Period Selector */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {/* Financial Stats */}
        {!isChangingPeriod && financialStats.length > 0 && (
          <FinancialStats financialStats={financialStats} />
        )}
      </ScrollView>

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotifications}
        notifications={notifications}
        unreadCount={unreadCount}
        onClose={() => setShowNotifications(false)}
        onMarkAllAsRead={markAllAsRead}
      />
    </View>
  );
}
