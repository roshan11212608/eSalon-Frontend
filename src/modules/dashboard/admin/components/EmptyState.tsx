import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/adminDashboard.styles';
import { EmptyStateProps } from '../types/dashboard.types';

export default function EmptyState({ icon = 'cube-outline', title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.emptyStateContainer}>
      <Ionicons name={icon as any} size={48} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
    </View>
  );
}
