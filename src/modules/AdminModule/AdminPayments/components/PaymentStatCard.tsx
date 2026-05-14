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
        <Ionicons name={icon} size={24} color={color} />
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
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trend: {
    fontSize: 11,
    fontWeight: '600',
  },
});
