import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { styles } from './styles/activityStats.styles';
import { reportsService, ActivityStatsResponse } from '../../../services/reports/reportsService';

export default function ActivityStats() {
  const [activityStats, setActivityStats] = useState<ActivityStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityStats();
  }, []);

  const fetchActivityStats = async () => {
    try {
      const data = await reportsService.getActivityStats();
      setActivityStats(data);
    } catch (error) {
      console.error('Failed to fetch activity stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Today', value: activityStats?.todayCount?.toString() || '0', icon: 'calendar', color: '#10B981', route: '/(owner-tabs)/reports/today' },
    { label: 'Yesterday', value: activityStats?.yesterdayCount?.toString() || '0', icon: 'calendar-outline', color: '#6366F1', route: '/(owner-tabs)/reports/yesterday' },
    { label: 'This Week', value: activityStats?.weekCount?.toString() || '0', icon: 'calendar', color: '#F59E0B', route: '/(owner-tabs)/reports/weekly' },
    { label: 'This Month', value: activityStats?.monthCount?.toString() || '0', icon: 'calendar-number', color: '#EF4444', route: '/(owner-tabs)/reports/monthly' },
  ];

  const handleStatPress = (stat: any) => {
    Haptics.impactAsync();
    router.push(stat.route as any);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Get Your Reports </Text>
        <View style={styles.grid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.card, { backgroundColor: `${stat.color}08`, borderColor: `${stat.color}30` }]}>
              <View style={styles.content}>
                <Text style={styles.label}>{stat.label}</Text>
                <Text style={[styles.value, { color: stat.color }]}>...</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: `${stat.color}15` }]}>
                <Text style={[styles.badgeText, { color: stat.color }]}>Activities</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Your Reports </Text>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: `${stat.color}08`, borderColor: `${stat.color}30` }]}
            onPress={() => handleStatPress(stat)}
            activeOpacity={0.7}
          >
            <View style={styles.content}>
              <Text style={styles.label}>{stat.label}</Text>
              <Text style={[styles.value, { color: stat.color }]}>{stat.value}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: `${stat.color}15` }]}>
              <Text style={[styles.badgeText, { color: stat.color }]}>Activities</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
