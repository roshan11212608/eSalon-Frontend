import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/revenue.styles';
import adminRevenueService, {
  AdminRevenueOverviewResponse,
  RevenueAnalyticsResponse,
  SubscriptionAnalyticsResponse,
  PaymentAnalyticsResponse,
  SalonAnalyticsResponse,
} from '../../../services/adminRevenueService';

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom';
const PERIODS: PeriodType[] = ['today', 'week', 'month', 'year'];

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Revenue <Text style={styles.headerAccent}>Analytics</Text></Text>
    </View>
  );
}

function SummaryCard({ icon, iconColor, label, value, sub, subColor }: {
  icon: any; iconColor: string; label: string; value: string; sub: string; subColor?: string;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryCardHeader}>
        <Ionicons name={icon} size={16} color={iconColor} />
        <Text style={styles.summaryLabel} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={styles.summaryValue} numberOfLines={1}>{value}</Text>
      <Text style={[styles.summaryChange, subColor ? { color: subColor } : null]} numberOfLines={1}>{sub}</Text>
    </View>
  );
}

function StatGrid({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.analyticsGrid}>
        {items.map(item => (
          <View key={item.label} style={styles.analyticsItem}>
            <Text style={styles.analyticsLabel}>{item.label}</Text>
            <Text style={styles.analyticsValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

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
    } catch {
      setError('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => { loadRevenueData(); }, [loadRevenueData]);

  const fc = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  const fn = (n: number) => n.toLocaleString('en-IN');

  if (loading) return (
    <View style={styles.container}>
      <Header />
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f7b638" />
        <Text style={styles.loadingText}>Loading revenue data...</Text>
      </View>
    </View>
  );

  if (error) return (
    <View style={styles.container}>
      <Header />
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.loadingText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRevenueData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Period Filter */}
        <View style={styles.filterContainer}>
          {PERIODS.map(p => (
            <TouchableOpacity key={p}
              style={[styles.filterButton, selectedPeriod === p && styles.filterButtonActive]}
              onPress={() => setSelectedPeriod(p)}>
              <Text style={[styles.filterButtonText, selectedPeriod === p && styles.filterButtonTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        {overviewData && (
          <View style={styles.summaryContainer}>
            <SummaryCard icon="cash-outline" iconColor="#059669" label="Total Revenue"
              value={fc(overviewData.revenueSummary.totalRevenue)}
              sub={`${overviewData.revenueSummary.revenueGrowth >= 0 ? '+' : ''}${overviewData.revenueSummary.revenueGrowth}% ${overviewData.revenueSummary.growthPeriod}`}
              subColor={overviewData.revenueSummary.revenueGrowth >= 0 ? '#059669' : '#EF4444'} />
            <SummaryCard icon="people-outline" iconColor="#3B82F6" label="Active Subscriptions"
              value={fn(overviewData.subscriptionStats.activeSubscriptions)}
              sub={`${fn(overviewData.subscriptionStats.newSubscriptions)} new`} />
            <SummaryCard icon="calendar-outline" iconColor="#F59E0B" label="Today Revenue"
              value={fc(overviewData.revenueSummary.todayRevenue)} sub="Platform fees" />
            <SummaryCard icon="storefront-outline" iconColor="#8B5CF6" label="Total Salons"
              value={fn(salonData?.summary.totalSalons ?? 0)}
              sub={`${salonData?.summary.activeSalons ?? 0} active`} />
          </View>
        )}

        {/* Revenue Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.chartContainer}>
            {revenueData && revenueData.revenueDataPoints.length > 0 ? (
              <View style={styles.chartPlaceholder}>
                <Ionicons name="bar-chart" size={40} color="#f7b638" />
                <Text style={styles.chartText}>Total: {fc(revenueData.totalRevenue)}</Text>
                <Text style={styles.chartSubtext}>Platform Fees: {fc(revenueData.platformFees)}</Text>
              </View>
            ) : (
              <View style={styles.chartPlaceholder}>
                <Ionicons name="bar-chart-outline" size={40} color="#e0e0e0" />
                <Text style={styles.chartSubtext}>No data for this period</Text>
              </View>
            )}
          </View>
        </View>

        {/* Subscription Analytics */}
        {subscriptionData && (
          <StatGrid title="Subscription Analytics" items={[
            { label: 'MRR', value: fc(subscriptionData.summary.monthlyRecurringRevenue) },
            { label: 'ARPU', value: fc(subscriptionData.summary.averageRevenuePerUser) },
            { label: 'Renewals', value: fn(subscriptionData.summary.renewals) },
            { label: 'New', value: fn(subscriptionData.summary.newSubscriptions) },
          ]} />
        )}

        {/* Payment Analytics */}
        {paymentData && (
          <StatGrid title="Payment Analytics" items={[
            { label: 'Success Rate', value: `${paymentData.summary.successRate.toFixed(1)}%` },
            { label: 'Total Volume', value: fc(paymentData.summary.totalVolume) },
            { label: 'Successful', value: fn(paymentData.summary.successfulPayments) },
            { label: 'Failed', value: fn(paymentData.summary.failedPayments) },
          ]} />
        )}

        {/* Top Salons */}
        {salonData && salonData.topEarningSalons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Earning Salons</Text>
            <View style={styles.salonList}>
              {salonData.topEarningSalons.slice(0, 5).map((salon, i) => (
                <View key={salon.salonId} style={styles.salonItem}>
                  <View style={styles.salonRank}><Text style={styles.salonRankText}>#{i + 1}</Text></View>
                  <View style={styles.salonInfo}>
                    <Text style={styles.salonName}>{salon.salonName}</Text>
                    <Text style={styles.salonOwner}>{salon.ownerName}</Text>
                  </View>
                  <View style={styles.salonRevenue}>
                    <Text style={styles.salonRevenueValue}>{fc(salon.platformFeesPaid)}</Text>
                    <Text style={styles.salonRevenuePercent}>{salon.percentage.toFixed(1)}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

