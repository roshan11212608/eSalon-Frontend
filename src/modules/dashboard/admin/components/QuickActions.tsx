import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { styles } from '../styles/adminDashboard.styles';

const quickActions = [
  { icon: 'storefront' as const, label: 'Salons', color: '#f7b638', route: '/(admin-tabs)/salons' as Href },
  { icon: 'card' as const, label: 'Plans', color: '#f7b638', route: '/(admin-tabs)/plans' as Href },
  { icon: 'cash' as const, label: 'Revenue', color: '#f7b638', route: '/(admin-tabs)/revenue' as Href },
  { icon: 'people' as const, label: 'Users', color: '#f7b638', route: null },
  { icon: 'settings' as const, label: 'Settings', color: '#f7b638', route: null },
  { icon: 'bar-chart' as const, label: 'Reports', color: '#f7b638', route: null },
];

export default function QuickActions() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.quickActionButton}
            onPress={() => action.route && router.push(action.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon} size={18} color={action.color} />
            </View>
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
