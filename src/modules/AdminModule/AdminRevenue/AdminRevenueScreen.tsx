import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import adminRevenueService, {
  AdminRevenueOverviewResponse,
  RevenueAnalyticsResponse,
  SubscriptionAnalyticsResponse,
  PaymentAnalyticsResponse,
  SalonAnalyticsResponse
} from '../../../services/adminRevenueService';

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom';

export default function AdminRevenueScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<AdminRevenueOverviewResponse | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueAnalyticsResponse | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionAnalyticsResponse | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentAnalyticsResponse | null>(null);
  const [salonData, setSalonData] = useState<SalonAnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRevenueData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [overview, revenue, subscriptions, payments, salons] = await Promise.all([
        adminRevenueService.getRevenueOverview(),
        adminRevenueService.getRevenueAnalytics(selectedPeriod),
        adminRevenueService.getSubscriptionAnalytics(selectedPeriod),
        adminRevenueService.getPaymentAnalytics(selectedPeriod),
        adminRevenueService.getSalonAnalytics(selectedPeriod),
      ]);

      setOverviewData(overview);
      setRevenueData(revenue);
      setSubscriptionData(subscriptions);
      setPaymentData(payments);
      setSalonData(salons);
    } catch (err) {
      setError('Failed to load revenue data');
      console.error('Error loading revenue data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadRevenueData();
  }, [loadRevenueData]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Revenue</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading revenue data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Revenue</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRevenueData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Revenue</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Filter */}
        <View style={styles.filterContainer}>
          {(['today', 'week', 'month', 'year'] as PeriodType[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterButton,
                selectedPeriod === period && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedPeriod === period && styles.filterButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        {overviewData && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <Ionicons name="cash-outline" size={20} color="#6366F1" />
                <Text style={styles.summaryLabel}>Total Revenue</Text>
              </View>
              <Text style={styles.summaryValue}>
                {formatCurrency(overviewData.revenueSummary.totalRevenue)}
              </Text>
              <Text style={[
                styles.summaryChange,
                overviewData.revenueSummary.revenueGrowth >= 0 ? styles.changePositive : styles.changeNegative
              ]}>
                {overviewData.revenueSummary.revenueGrowth >= 0 ? '+' : ''}
                {overviewData.revenueSummary.revenueGrowth}% {overviewData.revenueSummary.growthPeriod}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <Ionicons name="people-outline" size={20} color="#10B981" />
                <Text style={styles.summaryLabel}>Active Subscriptions</Text>
              </View>
              <Text style={styles.summaryValue}>
                {formatNumber(overviewData.subscriptionStats.activeSubscriptions)}
              </Text>
              <Text style={styles.summaryChange}>
                {formatNumber(overviewData.subscriptionStats.newSubscriptions)} new this month
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <Ionicons name="calendar-outline" size={20} color="#F59E0B" />
                <Text style={styles.summaryLabel}>Today's Revenue</Text>
              </View>
              <Text style={styles.summaryValue}>
                {formatCurrency(overviewData.revenueSummary.todayRevenue)}
              </Text>
              <Text style={styles.summaryChange}>
                Platform fees collected
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <Ionicons name="storefront-outline" size={20} color="#8B5CF6" />
                <Text style={styles.summaryLabel}>Total Salons</Text>
              </View>
              <Text style={styles.summaryValue}>
                {formatNumber(overviewData.revenueStats.length)}
              </Text>
              <Text style={styles.summaryChange}>
                Active on platform
              </Text>
            </View>
          </View>
        )}

        {/* Revenue Overview Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.chartContainer}>
            {revenueData && revenueData.revenueDataPoints.length > 0 ? (
              <View style={styles.chartPlaceholder}>
                <Ionicons name="bar-chart" size={48} color="#6366F1" />
                <Text style={styles.chartText}>
                  Total: {formatCurrency(revenueData.totalRevenue)}
                </Text>
                <Text style={styles.chartSubtext}>
                  Platform Fees: {formatCurrency(revenueData.platformFees)}
                </Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="bar-chart-outline" size={64} color="#CCCCCC" />
                <Text style={styles.emptyText}>No revenue data for this period</Text>
              </View>
            )}
          </View>
        </View>

        {/* Subscription Analytics */}
        {subscriptionData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription Analytics</Text>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>MRR</Text>
                <Text style={styles.analyticsValue}>
                  {formatCurrency(subscriptionData.summary.monthlyRecurringRevenue)}
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>ARPU</Text>
                <Text style={styles.analyticsValue}>
                  {formatCurrency(subscriptionData.summary.averageRevenuePerUser)}
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Renewals</Text>
                <Text style={styles.analyticsValue}>
                  {formatNumber(subscriptionData.summary.renewals)}
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>New</Text>
                <Text style={styles.analyticsValue}>
                  {formatNumber(subscriptionData.summary.newSubscriptions)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Payment Analytics */}
        {paymentData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Analytics</Text>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Success Rate</Text>
                <Text style={styles.analyticsValue}>
                  {paymentData.summary.successRate.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Total Volume</Text>
                <Text style={styles.analyticsValue}>
                  {formatCurrency(paymentData.summary.totalVolume)}
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Successful</Text>
                <Text style={styles.analyticsValue}>
                  {formatNumber(paymentData.summary.successfulPayments)}
                </Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsLabel}>Failed</Text>
                <Text style={styles.analyticsValue}>
                  {formatNumber(paymentData.summary.failedPayments)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Top Salons */}
        {salonData && salonData.topEarningSalons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Earning Salons</Text>
            <View style={styles.salonList}>
              {salonData.topEarningSalons.slice(0, 5).map((salon, index) => (
                <View key={salon.salonId} style={styles.salonItem}>
                  <View style={styles.salonRank}>
                    <Text style={styles.salonRankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.salonInfo}>
                    <Text style={styles.salonName}>{salon.salonName}</Text>
                    <Text style={styles.salonOwner}>{salon.ownerName}</Text>
                  </View>
                  <View style={styles.salonRevenue}>
                    <Text style={styles.salonRevenueValue}>
                      {formatCurrency(salon.platformFeesPaid)}
                    </Text>
                    <Text style={styles.salonRevenuePercent}>
                      {salon.percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  summaryChange: {
    fontSize: 12,
    color: '#666666',
  },
  changePositive: {
    color: '#10B981',
  },
  changeNegative: {
    color: '#EF4444',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  chartText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  chartSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticsItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  salonList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  salonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  salonRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  salonRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  salonInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  salonOwner: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  salonRevenue: {
    alignItems: 'flex-end',
  },
  salonRevenueValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  salonRevenuePercent: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
});
