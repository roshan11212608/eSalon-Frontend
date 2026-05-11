import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/adminDashboard.styles';
import { FinancialStatsProps } from '../types/dashboard.types';

export default function FinancialStats({ financialStats }: FinancialStatsProps) {
  return (
    <View style={styles.statsContainer}>
      {financialStats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          {stat.change && (
            <Text style={{ fontSize: 12, color: stat.color, fontWeight: '600', marginTop: 4 }}>
              {stat.change}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
