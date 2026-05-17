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
    <View style={styles.container}>
      <View style={[styles.iconBadge, { backgroundColor: `${color}22` }]}>
        <Ionicons name={(icon || 'storefront') as any} size={14} color={color} />
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {growth !== undefined && (
        <View style={[styles.growthBadge, { backgroundColor: growth >= 0 ? '#d1fae5' : '#fee2e2' }]}>
          <Ionicons
            name={growth >= 0 ? 'arrow-up' : 'arrow-down'}
            size={8}
            color={growth >= 0 ? '#059669' : '#DC2626'}
          />
          <Text style={[styles.growthText, { color: growth >= 0 ? '#059669' : '#DC2626' }]}>
            {Math.abs(growth)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    alignItems: 'center',
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 2,
    textAlign: 'center',
  },
  title: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  growthText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
