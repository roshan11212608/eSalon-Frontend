import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/timePeriodReport.styles';
import { StorageService } from '../../../services/storage/storageService';
import reportsService from '../../../services/reports/reportsService';
import type { StaffActivityReportResponse } from '../../../services/reports/reportsService';

export default function TimePeriodReport() {
  const { period } = useLocalSearchParams<{ period: string }>();
  const router = useRouter();
  const [shopId, setShopId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<StaffActivityReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShopId = async () => {
      try {
        const userData = await StorageService.getUserData();
        if (userData?.shopId) {
          setShopId(Number(userData.shopId));
        }
      } catch (error) {
        console.error('Error loading shopId:', error);
      }
    };
    loadShopId();
  }, []);

  useEffect(() => {
    if (shopId) {
      fetchTimePeriodReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId, period]);

  const fetchTimePeriodReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getStaffActivityReport(period || 'month');
      setReportData(data);
    } catch (err: any) {
      setError('Failed to load time period report');
      console.error('Error fetching time period report:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodTitle = () => {
    switch (period) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      default:
        return 'Report';
    }
  };

  const getPeriodDate = () => {
    const today = new Date();
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    switch (period) {
      case 'today':
        return formatDate(today);
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return formatDate(yesterday);
      case 'weekly':
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
      case 'monthly':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return `${formatDate(startOfMonth)} - ${formatDate(endOfMonth)}`;
      default:
        return formatDate(today);
    }
  };

  // Helper function to format numbers in Indian comma notation
  const formatIndianCurrency = (amount: number) => {
    const amountStr = amount.toString();
    let lastThree = amountStr.substring(amountStr.length - 3);
    const otherNumbers = amountStr.substring(0, amountStr.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return result;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{getPeriodTitle()} <Text style={styles.highlightText}>Report</Text></Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0554f0" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{getPeriodTitle()} <Text style={styles.highlightText}>Report</Text></Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={{ marginTop: 10, color: '#EF4444', textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={fetchTimePeriodReport} style={{ marginTop: 20, backgroundColor: '#0554f0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
            <Text style={{ color: '#fff' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const groupedActivities = reportData?.groupedActivities;
  const groupedActivitiesArray = groupedActivities 
    ? (groupedActivities instanceof Map ? Object.fromEntries(groupedActivities) : groupedActivities)
    : {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{getPeriodTitle()} <Text style={styles.highlightText}>Report</Text></Text>
          <Text style={styles.dateText}>{getPeriodDate()}</Text>
        </View>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.activitiesCard]}>
            <Text style={styles.summaryLabel}>Total Activities</Text>
            <Text style={styles.summaryValue}>{reportData?.totalActivities || 0}</Text>
          </View>
          <View style={[styles.summaryCard, styles.earningsCard]}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={styles.summaryValue}>₹{formatIndianCurrency(reportData?.totalEarnings || 0)}</Text>
          </View>
          <View style={[styles.summaryCard, styles.staffCard]}>
            <Text style={styles.summaryLabel}>Staff Earnings</Text>
            <Text style={styles.summaryValue}>₹{formatIndianCurrency(reportData?.staffEarnings || 0)}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.profitCard]}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="trending-up" size={24} color="#ffffff" />
            </View>
            <Text style={styles.profitCardLabel}>Shop Profit</Text>
            <Text style={styles.profitCardValue}>₹{formatIndianCurrency(reportData?.shopProfit || 0)}</Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Net Profit</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Staff Report</Text>
          
          {Object.entries(groupedActivitiesArray).map(([staffName, data]: [string, any]) => (
            <View key={staffName} style={styles.staffActivityCard}>
              <View style={styles.activityRow}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{staffName.charAt(0)}</Text>
                  </View>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.staffName}>{staffName}</Text>
                </View>
                <View style={styles.activitiesCount}>
                  <Text style={styles.activitiesCountText}>{data.totalActivities}</Text>
                  <Text style={styles.activitiesCountLabel}>Activities</Text>
                </View>
              </View>
              <View style={styles.staffStatsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Earning</Text>
                  <Text style={styles.statValue}>₹{formatIndianCurrency(data.totalEarnings || 0)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Commission</Text>
                  <Text style={styles.statValue}>₹{formatIndianCurrency(data.totalCommission || 0)}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Staff Earnings Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Staff Earnings</Text>
            <View style={styles.chart}>
              {Object.entries(groupedActivitiesArray).map(([staffName, data]: [string, any], index: number) => {
                const maxEarning = Math.max(...Object.values(groupedActivitiesArray).map((d: any) => d.totalEarnings || 0));
                const barHeight = maxEarning > 0 ? ((data.totalEarnings || 0) / maxEarning) * 150 : 0;
                const colors = ['#0554f0', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                return (
                  <View key={staffName} style={styles.chartBarContainer}>
                    <View style={styles.chartBarWrapper}>
                      <View style={[styles.chartBar, { height: barHeight, backgroundColor: colors[index % colors.length] }]} />
                    </View>
                    <Text style={styles.chartBarLabel}>{staffName.split(' ')[0]}</Text>
                    <Text style={styles.chartBarValue}>₹{formatIndianCurrency(data.totalEarnings)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
