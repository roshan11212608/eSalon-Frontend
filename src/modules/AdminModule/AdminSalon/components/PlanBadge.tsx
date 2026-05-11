import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SubscriptionPlan } from '../types/salon.types';

interface PlanBadgeProps {
  plan: SubscriptionPlan;
  size?: 'small' | 'medium' | 'large';
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, size = 'medium' }) => {
  const getPlanConfig = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'enterprise':
        return { bg: '#F3E8FF', text: '#7C3AED', label: 'Enterprise' };
      case 'professional':
        return { bg: '#FEF3C7', text: '#F59E0B', label: 'Professional' };
      case 'basic':
        return { bg: '#F3F4F6', text: '#6B7280', label: 'Basic' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', label: 'Unknown' };
    }
  };

  const config = getPlanConfig(plan);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.container, sizeStyles.container, { backgroundColor: config.bg }]}>
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
        text: { fontSize: 11 }
      };
    case 'large':
      return {
        container: { paddingHorizontal: 12, paddingVertical: 6 },
        text: { fontSize: 14 }
      };
    default:
      return {
        container: { paddingHorizontal: 10, paddingVertical: 5 },
        text: { fontSize: 12 }
      };
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
