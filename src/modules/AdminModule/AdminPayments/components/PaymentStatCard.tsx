import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentStatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export default function PaymentStatCard({
  title,
  value,
  icon,
  color,
  trend,
  trendUp,
}: PaymentStatCardProps) {
  return (
    <View style={s.container}>
      <View style={[s.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={s.content}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.value}>{value}</Text>
        {trend && (
          <View style={s.trendContainer}>
            <Ionicons
              name={trendUp ? 'trending-up' : 'trending-down'}
              size={12}
              color={trendUp ? '#10B981' : '#EF4444'}
            />
            <Text style={[s.trend, { color: trendUp ? '#10B981' : '#EF4444' }]}>
              {trend}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    flexShrink: 1,
    minWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 9,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 1,
    flexShrink: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trend: {
    fontSize: 9,
    fontWeight: '600',
  },
});
