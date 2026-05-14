import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatCard as StatCardType } from '../types/salon.types';

interface StatCardProps {
  data: StatCardType;
}

export const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { title, value, growth, color, icon } = data;

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={[styles.iconBadge, { backgroundColor: `${color}22` }]}>
        <Ionicons name={(icon || 'storefront') as any} size={16} color={color} />
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      {growth !== undefined && (
        <View style={[styles.growthPill, { backgroundColor: growth >= 0 ? '#D1FAE5' : '#FEE2E2' }]}>
          <Text style={[styles.growthText, { color: growth >= 0 ? '#059669' : '#DC2626' }]}>
            {growth >= 0 ? '↑' : '↓'}{Math.abs(growth)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    minHeight: 100,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    lineHeight: 13,
  },
  growthPill: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 16,
  },
  growthText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
