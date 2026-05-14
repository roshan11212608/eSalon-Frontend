import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../types/payment.types';
import PaymentStatusBadge from './PaymentStatusBadge';
import { getCurrencySymbol } from '../types/payment.enums';

interface PaymentCardProps {
  payment: Payment;
  onPress: () => void;
}

export default function PaymentCard({ payment, onPress }: PaymentCardProps) {
  const currencySymbol = getCurrencySymbol(payment.country);

  return (
    <TouchableOpacity style={s.container} onPress={onPress} activeOpacity={0.7}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.countryFlag}>
            <Text style={s.flag}>{payment.country === 'India' ? '🇮🇳' : payment.country === 'Nepal' ? '🇳🇵' : '🌍'}</Text>
          </View>
          <View style={s.headerInfo}>
            <Text style={s.salonName}>{payment.salonName}</Text>
            <Text style={s.ownerName}>{payment.ownerName}</Text>
          </View>
        </View>
        <PaymentStatusBadge status={payment.status} />
      </View>

      <View style={s.body}>
        <View style={s.row}>
          <Text style={s.label}>Shop ID:</Text>
          <Text style={s.value}>{payment.salonId}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Transaction ID:</Text>
          <Text style={s.value}>{payment.transactionId}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Plan:</Text>
          <Text style={s.value}>{payment.planName}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Amount:</Text>
          <Text style={s.amount}>{currencySymbol}{payment.amount.toLocaleString()}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Method:</Text>
          <View style={s.methodRow}>
            <Ionicons 
              name={payment.paymentMethod === 'Razorpay' || payment.paymentMethod === 'Card' ? 'card-outline' : payment.paymentMethod === 'UPI' ? 'phone-portrait-outline' : payment.paymentMethod === 'eSewa QR' ? 'qr-code-outline' : 'shield-checkmark-outline'} 
              size={14} 
              color="#6B7280" 
            />
            <Text style={s.value}>{payment.paymentMethod}</Text>
          </View>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Paid Date:</Text>
          <Text style={s.value}>{new Date(payment.paidDate).toLocaleDateString()}</Text>
        </View>
        {payment.renewalDate && (
          <View style={s.row}>
            <Text style={s.label}>Renewal Date:</Text>
            <Text style={s.value}>{new Date(payment.renewalDate).toLocaleDateString()}</Text>
          </View>
        )}
      </View>

      {payment.status === 'Pending Verification' && (
        <View style={s.verificationBanner}>
          <Ionicons name="time-outline" size={16} color="#F59E0B" />
          <Text style={s.verificationText}>Awaiting verification</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  countryFlag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 20,
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
  body: {
    gap: 8,
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
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  verificationText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
  },
});
