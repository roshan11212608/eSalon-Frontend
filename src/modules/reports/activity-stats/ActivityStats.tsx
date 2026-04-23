import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { styles } from './styles/activityStats.styles';

export default function ActivityStats() {
  const activityStats = [
    { label: 'To8day', value: '12', icon: 'calendar', color: '#10B981', route: '/(owner-tabs)/reports/today' },
    { label: 'Yesterday', value: '15', icon: 'calendar-outline', color: '#6366F1', route: '/(owner-tabs)/reports/yesterday' },
    { label: 'This Week', value: '45', icon: 'calendar', color: '#F59E0B', route: '/(owner-tabs)/reports/weekly' },
    { label: 'This Month', value: '156', icon: 'calendar-number', color: '#EF4444', route: '/(owner-tabs)/reports/monthly' },
  ];

  const handleStatPress = (stat: any) => {
    Haptics.impactAsync();
    router.push(stat.route as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Your Reports </Text>
      <View style={styles.grid}>
        {activityStats.map((stat, index) => (
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
