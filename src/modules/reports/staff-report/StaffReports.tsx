import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/staffReports.styles';
import { reportsService, StaffReportResponse } from '../../../services/reports/reportsService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';

export default function StaffReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<StaffReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authState = useAuthStore();
  const staffId = authState.user?.employeeId ? parseInt(authState.user.employeeId) : 1;

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const fetchStaffReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getStaffReport(staffId, selectedPeriod);
      setReportData(data);
    } catch (err: any) {
      setError('Failed to load staff report');
      console.error('Error fetching staff report:', err);
    } finally {
      setLoading(false);
    }
  }, [staffId, selectedPeriod]);

  useEffect(() => {
    fetchStaffReport();
  }, [fetchStaffReport]);

  useFocusEffect(
    useCallback(() => {
      fetchStaffReport();
    }, [fetchStaffReport])
  );

  const getPeriodData = () => {
    if (!reportData) {
      return {
        staffStats: [],
        earningsBreakdown: [],
        paymentsSummary: [],
        monthlyTrends: [],
        yearlyTrends: [],
      };
    }
    return reportData;
  };

  const { staffStats, earningsBreakdown, paymentsSummary, monthlyTrends, yearlyTrends } = getPeriodData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My <Text style={styles.highlightText}>Reports</Text></Text>
      </View>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        {timePeriods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading report data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchStaffReport}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Statistics Cards */}
          <View style={styles.statsContainer}>
            {staffStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Earnings Breakdown Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
            {earningsBreakdown.map((item, index) => (
              <View key={index} style={styles.breakdownItem}>
                <View style={styles.breakdownInfo}>
                  <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
                  <Text style={styles.breakdownCategory}>{item.category}</Text>
                </View>
                <View style={styles.breakdownAmount}>
                  <Text style={styles.breakdownValue}>{item.amount}</Text>
                  <Text style={styles.breakdownPercentage}>{item.percentage}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Payments Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payments Summary</Text>
            <View style={styles.statsContainer}>
              {paymentsSummary.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Monthly Trends Graph */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earnings Trends</Text>
            <View style={styles.chartContainer}>
              {monthlyTrends.map((trend, index) => {
                const maxEarnings = Math.max(...monthlyTrends.map(t => parseFloat(t.earnings.replace('₹', '').replace(',', ''))));
                const barWidth = (parseFloat(trend.earnings.replace('₹', '').replace(',', '')) / maxEarnings) * 150;
                const weekLabel = trend.month.split(' ')[0];
                const hasDateRange = trend.month.includes('(');
                const dateRange = hasDateRange ? trend.month.split(' (')[1].replace(')', '') : null;
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <Text style={styles.chartBarLabel}>{weekLabel}</Text>
                    <View style={styles.chartBarWrapper}>
                      <View style={[styles.chartBar, { width: barWidth, backgroundColor: '#10B981' }]} />
                      {hasDateRange && <Text style={styles.chartDateRange}>{dateRange}</Text>}
                    </View>
                    <Text style={styles.chartBarValue}>{trend.earnings}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Yearly Trends Graph */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yearly Trends</Text>
            <View style={styles.chartContainer}>
              {yearlyTrends.map((trend, index) => {
                const maxEarnings = Math.max(...yearlyTrends.map(t => parseFloat(t.earnings.replace('₹', '').replace(',', ''))));
                const barWidth = (parseFloat(trend.earnings.replace('₹', '').replace(',', '')) / maxEarnings) * 150;
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <Text style={styles.chartBarLabel}>{trend.year}</Text>
                    <View style={styles.chartBarWrapper}>
                      <View style={[styles.chartBar, { width: barWidth, backgroundColor: '#6366F1' }]} />
                    </View>
                    <Text style={styles.chartBarValue}>{trend.earnings}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
