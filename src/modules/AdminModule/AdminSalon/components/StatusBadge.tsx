import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SalonStatus } from '../types/salon.types';

interface StatusBadgeProps {
  status: SalonStatus;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const getStatusConfig = (status: SalonStatus) => {
    switch (status) {
      case 'active':
        return { bg: '#D1FAE5', text: '#059669', label: 'Active' };
      case 'trial':
        return { bg: '#DBEAFE', text: '#3B82F6', label: 'Trial' };
      case 'expired':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'Expired' };
      case 'suspended':
        return { bg: '#FED7AA', text: '#EA580C', label: 'Suspended' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', label: 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.container, sizeStyles.container, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.text }, sizeStyles.dot]} />
      <Text style={[styles.text, sizeStyles.text, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        container: { paddingHorizontal: 8, paddingVertical: 4 },
        text: { fontSize: 11 },
        dot: { width: 4, height: 4 }
      };
    case 'large':
      return {
        container: { paddingHorizontal: 12, paddingVertical: 6 },
        text: { fontSize: 14 },
        dot: { width: 6, height: 6 }
      };
    default:
      return {
        container: { paddingHorizontal: 10, paddingVertical: 5 },
        text: { fontSize: 12 },
        dot: { width: 5, height: 5 }
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 50,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
