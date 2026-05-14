import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../types/payment.types';
import { getCurrencySymbol } from '../types/payment.enums';

interface VerificationCardProps {
  payment: Payment;
  onApprove: () => void;
  onReject: () => void;
  onRequestReupload: () => void;
  onViewScreenshot: () => void;
}

export default function VerificationCard({
  payment,
  onApprove,
  onReject,
  onRequestReupload,
  onViewScreenshot,
}: VerificationCardProps) {
  const currencySymbol = getCurrencySymbol(payment.country);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.salonName}>{payment.salonName}</Text>
          <Text style={s.ownerName}>{payment.ownerName}</Text>
          <Text style={s.shopId}>Shop ID: {payment.salonId}</Text>
        </View>
        <View style={s.amountBadge}>
          <Text style={s.amount}>{currencySymbol}{payment.amount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={s.infoRow}>
        <Text style={s.label}>Transaction ID:</Text>
        <Text style={s.value}>{payment.transactionId}</Text>
      </View>

      <View style={s.infoRow}>
        <Text style={s.label}>Plan:</Text>
        <Text style={s.value}>{payment.planName}</Text>
      </View>

      <View style={s.infoRow}>
        <Text style={s.label}>Uploaded:</Text>
        <Text style={s.value}>{new Date(payment.verification?.uploadedAt || '').toLocaleString()}</Text>
      </View>

      {payment.verification?.paymentNote && (
        <View style={s.noteSection}>
          <Text style={s.noteLabel}>Payment Note:</Text>
          <Text style={s.noteText}>{payment.verification.paymentNote}</Text>
        </View>
      )}

      <TouchableOpacity style={s.screenshotPreview} onPress={onViewScreenshot}>
        <Image
          source={{ uri: payment.verification?.screenshotUrl }}
          style={s.screenshot}
          resizeMode="cover"
        />
        <View style={s.screenshotOverlay}>
          <Ionicons name="eye-outline" size={20} color="#FFF" />
          <Text style={s.screenshotText}>View Fullscreen</Text>
        </View>
      </TouchableOpacity>

      <View style={s.actions}>
        <TouchableOpacity style={[s.actionBtn, s.approveBtn]} onPress={onApprove}>
          <Ionicons name="checkmark-circle" size={18} color="#FFF" />
          <Text style={s.actionText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actionBtn, s.rejectBtn]} onPress={onReject}>
          <Ionicons name="close-circle" size={18} color="#FFF" />
          <Text style={s.actionText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actionBtn, s.reuploadBtn]} onPress={onRequestReupload}>
          <Ionicons name="refresh-outline" size={18} color="#FFF" />
          <Text style={s.actionText}>Reupload</Text>
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
  shopId: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  amountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  noteSection: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  screenshotPreview: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
  },
  screenshot: {
    width: '100%',
    height: '100%',
  },
  screenshotOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  screenshotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
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
  approveBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  reuploadBtn: {
    backgroundColor: '#F59E0B',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
});
