import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaymentStatus } from '../types/payment.types';
import { getStatusColor, getStatusBackgroundColor } from '../types/payment.enums';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'small' | 'medium' | 'large';
}

export default function PaymentStatusBadge({ status, size = 'small' }: PaymentStatusBadgeProps) {
  const color = getStatusColor(status);
  const backgroundColor = getStatusBackgroundColor(status);

  const sizeStyles = {
    small: { paddingHorizontal: 6, paddingVertical: 3, fontSize: 10 },
    medium: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 },
    large: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 },
  };

  return (
    <View style={[s.container, { backgroundColor }, sizeStyles[size]]}>
      <Text style={[s.text, { color, fontSize: sizeStyles[size].fontSize }]}>
        {status}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
