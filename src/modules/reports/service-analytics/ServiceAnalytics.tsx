import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/serviceAnalytics.styles';

export default function ServiceAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'today':
        return {
          totalServices: 24,
          services: [
            { name: 'Haircut', activities: 5, color: '#10B981' },
            { name: 'Color Treatment', activities: 3, color: '#6366F1' },
            { name: 'Styling', activities: 2, color: '#F59E0B' },
            { name: 'Hair Spa', activities: 2, color: '#8B5CF6' },
            { name: 'Beard Trim', activities: 1, color: '#EF4444' },
            { name: 'Facial', activities: 1, color: '#EC4899' },
          ],
        };
      case 'week':
        return {
          totalServices: 24,
          services: [
            { name: 'Haircut', activities: 20, color: '#10B981' },
            { name: 'Color Treatment', activities: 15, color: '#6366F1' },
            { name: 'Styling', activities: 10, color: '#F59E0B' },
            { name: 'Hair Spa', activities: 7, color: '#8B5CF6' },
            { name: 'Beard Trim', activities: 6, color: '#EF4444' },
            { name: 'Facial', activities: 5, color: '#EC4899' },
          ],
        };
      case 'month':
      default:
        return {
          totalServices: 24,
          services: [
            { name: 'Haircut', activities: 120, color: '#10B981' },
            { name: 'Color Treatment', activities: 85, color: '#6366F1' },
            { name: 'Styling', activities: 65, color: '#F59E0B' },
            { name: 'Hair Spa', activities: 42, color: '#8B5CF6' },
            { name: 'Beard Trim', activities: 38, color: '#EF4444' },
            { name: 'Facial', activities: 28, color: '#EC4899' },
          ],
        };
    }
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
      </ScrollView>
    </View>
  );
}
