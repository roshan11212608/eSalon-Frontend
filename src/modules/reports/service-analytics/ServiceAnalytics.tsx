import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/serviceAnalytics.styles';
import { reportsService, ServiceAnalyticsResponse } from '../../../services/reports/reportsService';

export default function ServiceAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<ServiceAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const fetchServiceAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getServiceAnalytics(undefined, selectedPeriod);
      setReportData(data);
    } catch (err: any) {
      setError('Failed to load service analytics');
      console.error('Error fetching service analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const getPeriodData = () => {
    if (!reportData) {
      return {
        totalServices: 0,
        services: [],
      };
    }
    return reportData;
  };

  const { totalServices, services } = getPeriodData();

  // Find top 3 popular services
  const topPopularServices = [...services].sort((a, b) => b.activities - a.activities).slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service <Text style={styles.highlightText}>Analytics</Text></Text>
      </View>
      <ScrollView style={styles.scrollView}>
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
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Loading service analytics...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchServiceAnalytics}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Total Services Card */}
            <View style={styles.totalServicesCard}>
              <View style={styles.totalServicesIcon}>
                <Ionicons name="list" size={40} color="#F59E0B" />
              </View>
              <Text style={styles.totalServicesLabel}>Total Services</Text>
              <Text style={styles.totalServicesValue}>{totalServices}</Text>
            </View>

            {/* Most Popular Services Card */}
            <View style={styles.mostPopularCard}>
              <View style={styles.mostPopularHeader}>
                <Ionicons name="star" size={24} color="#10B981" />
                <Text style={styles.mostPopularTitle}>Top Popular Services</Text>
              </View>
              {topPopularServices.map((service, index) => (
                <View key={index} style={styles.popularServiceItem}>
                  <View style={styles.popularServiceRank}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={[styles.serviceDotLarge, { backgroundColor: service.color }]} />
                  <View style={styles.popularServiceInfo}>
                    <Text style={styles.popularServiceName}>{service.name}</Text>
                    <Text style={styles.popularServiceBookings}>{service.activities} activities</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* All Services List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Services</Text>
              {services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <View style={styles.serviceInfo}>
                    <View style={[styles.serviceDot, { backgroundColor: service.color }]} />
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </View>
                  <View style={styles.serviceStats}>
                    <Text style={styles.serviceBookings}>{service.activities} activities</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
