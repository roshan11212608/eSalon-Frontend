import { PaymentStatus, PaymentMethod } from './payment.types';

export const PaymentStatusConfig = {
  Success: {
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    label: 'Success',
  },
  Failed: {
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    label: 'Failed',
  },
  Pending: {
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    label: 'Pending',
  },
  'Pending Verification': {
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    label: 'Pending Verification',
  },
  Rejected: {
    color: '#991B1B',
    backgroundColor: '#FEE2E2',
    label: 'Rejected',
  },
  Refunded: {
    color: '#8B5CF6',
    backgroundColor: '#EDE9FE',
    label: 'Refunded',
  },
} as const;

export const PaymentMethodConfig = {
  Razorpay: {
    icon: 'card-outline',
    color: '#3395FF',
    label: 'Razorpay',
  },
  UPI: {
    icon: 'phone-portrait-outline',
    color: '#6B21A8',
    label: 'UPI',
  },
  Card: {
    icon: 'card-outline',
    color: '#1E40AF',
    label: 'Card',
  },
  'Net Banking': {
    icon: 'globe-outline',
    color: '#047857',
    label: 'Net Banking',
  },
  'eSewa QR': {
    icon: 'qr-code-outline',
    color: '#6C63FF',
    label: 'eSewa QR',
  },
  'Manual Verification': {
    icon: 'shield-checkmark-outline',
    color: '#F59E0B',
    label: 'Manual',
  },
} as const;

export const PaymentGatewayConfig = {
  Razorpay: {
    label: 'Razorpay',
    color: '#3395FF',
  },
  eSewa: {
    label: 'eSewa',
    color: '#6C63FF',
  },
  Manual: {
    label: 'Manual',
    color: '#F59E0B',
  },
} as const;

export const CountryConfig = {
  India: {
    currency: '₹',
    currencyCode: 'INR',
    flag: '🇮🇳',
    label: 'India',
  },
  Nepal: {
    currency: 'Rs.',
    currencyCode: 'NPR',
    flag: '🇳🇵',
    label: 'Nepal',
  },
  Others: {
    currency: '$',
    currencyCode: 'USD',
    flag: '🌍',
    label: 'Others',
  },
} as const;

export const getStatusColor = (status: PaymentStatus): string => {
  return PaymentStatusConfig[status]?.color || '#6B7280';
};

export const getStatusBackgroundColor = (status: PaymentStatus): string => {
  return PaymentStatusConfig[status]?.backgroundColor || '#F3F4F6';
};

export const getPaymentMethodIcon = (method: PaymentMethod): string => {
  return PaymentMethodConfig[method]?.icon || 'card-outline';
};

export const getPaymentMethodColor = (method: PaymentMethod): string => {
  return PaymentMethodConfig[method]?.color || '#6B7280';
};

export const getCurrencySymbol = (country: 'India' | 'Nepal' | 'Others'): string => {
  return CountryConfig[country]?.currency || '$';
};
