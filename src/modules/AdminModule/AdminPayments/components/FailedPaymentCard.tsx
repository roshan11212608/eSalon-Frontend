import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../types/payment.types';
import { getCurrencySymbol } from '../types/payment.enums';

interface FailedPaymentCardProps {
  payment: Payment;
  onRetry: () => void;
  onViewDetails: () => void;
}

export default function FailedPaymentCard({ payment, onRetry, onViewDetails }: FailedPaymentCardProps) {
  const currencySymbol = getCurrencySymbol(payment.country);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.errorIcon}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
          </View>
          <View style={s.headerInfo}>
            <Text style={s.salonName}>{payment.salonName}</Text>
            <Text style={s.ownerName}>{payment.ownerName}</Text>
          </View>
        </View>
        <Text style={s.retryCount}>Retry: {payment.retryAttempts || 0}</Text>
      </View>

      <View style={s.body}>
        <View style={s.row}>
          <Text style={s.label}>Transaction ID:</Text>
          <Text style={s.value}>{payment.transactionId}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Amount:</Text>
          <Text style={s.amount}>{currencySymbol}{payment.amount.toLocaleString()}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Method:</Text>
          <Text style={s.value}>{payment.paymentMethod}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Failed Date:</Text>
          <Text style={s.value}>{new Date(payment.paidDate).toLocaleDateString()}</Text>
        </View>
      </View>

      {payment.failureReason && (
        <View style={s.errorSection}>
          <Text style={s.errorLabel}>Failure Reason:</Text>
          <Text style={s.errorText}>{payment.failureReason}</Text>
        </View>
      )}

      <View style={s.actions}>
        <TouchableOpacity style={[s.actionBtn, s.retryBtn]} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color="#FFF" />
          <Text style={s.actionText}>Retry Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actionBtn, s.detailsBtn]} onPress={onViewDetails}>
          <Ionicons name="information-circle" size={16} color="#6B7280" />
          <Text style={[s.actionText, s.detailsText]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 12,
    color: '#6B7280',
  },
  retryCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  body: {
    gap: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  amount: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  errorSection: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#7F1D1D',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtn: {
    backgroundColor: '#EF4444',
  },
  detailsBtn: {
    backgroundColor: '#F3F4F6',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  detailsText: {
    color: '#1a1a1a',
  },
});
