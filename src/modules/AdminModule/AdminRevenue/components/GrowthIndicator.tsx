import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GrowthIndicatorProps {
  value: number;
  period?: 'MoM' | 'WoW' | 'YoY';
  showLabel?: boolean;
  compact?: boolean;
}

export default function GrowthIndicator({
  value,
  period = 'MoM',
  showLabel = true,
  compact = false,
}: GrowthIndicatorProps) {
  const isPositive = value >= 0;
  const color = isPositive ? '#10B981' : '#EF4444';
  const iconName = isPositive ? 'arrow-up' : 'arrow-down';

  if (compact) {
    return (
      <View style={[styles.compactContainer, { borderColor: color }]}>
        <Ionicons name={iconName as any} size={12} color={color} />
        <Text style={[styles.compactValue, { color }]}>
          {Math.abs(value).toFixed(1)}%
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.periodLabel}>{period}</Text>}
      <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
        <Ionicons name={iconName as any} size={14} color={color} />
        <Text style={[styles.value, { color }]}>
          {isPositive ? '+' : ''}{value.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

export function RevenueComparisonBadge({
  current,
  previous,
  period = 'last month',
}: {
  current: number;
  previous: number;
  period?: string;
}) {
  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const isPositive = growth >= 0;

  return (
    <View style={styles.comparisonContainer}>
      <Text style={styles.comparisonText}>
        {isPositive ? '+' : ''}{growth.toFixed(1)}% from {period}
      </Text>
      <Ionicons
        name={isPositive ? 'trending-up' : 'trending-down'}
        size={14}
        color={isPositive ? '#10B981' : '#EF4444'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  compactValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  comparisonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});
