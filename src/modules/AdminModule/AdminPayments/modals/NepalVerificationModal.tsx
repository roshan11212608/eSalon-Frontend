import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../types/payment.types';
import { getCurrencySymbol } from '../types/payment.enums';
import { paymentService } from '../services/paymentService';

interface NepalVerificationModalProps {
  visible: boolean;
  payment: Payment | null;
  onClose: () => void;
  onVerified: () => void;
}

export default function NepalVerificationModal({
  visible,
  payment,
  onClose,
  onVerified,
}: NepalVerificationModalProps) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState<'approve' | 'reject' | 'reupload' | null>(null);

  const handleApprove = async () => {
    if (!payment) return;
    setLoading(true);
    try {
      await paymentService.approveNepalPayment(payment.id, note);
      setSuccessState('approve');
      setTimeout(() => {
        onVerified();
        onClose();
        setNote('');
        setSuccessState(null);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to approve payment');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!payment) return;
    if (!note.trim()) {
      Alert.alert('Required', 'Please provide a reason for rejection');
      return;
    }
    setLoading(true);
    try {
      await paymentService.rejectNepalPayment(payment.id, note);
      setSuccessState('reject');
      setTimeout(() => {
        onVerified();
        onClose();
        setNote('');
        setSuccessState(null);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to reject payment');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReupload = async () => {
    if (!payment) return;
    if (!note.trim()) {
      Alert.alert('Required', 'Please provide instructions for reupload');
      return;
    }
    setLoading(true);
    try {
      await paymentService.requestReupload(payment.id, note);
      setSuccessState('reupload');
      setTimeout(() => {
        onVerified();
        onClose();
        setNote('');
        setSuccessState(null);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to request reupload');
    } finally {
      setLoading(false);
    }
  };

  if (!payment) return null;

  const currencySymbol = getCurrencySymbol(payment.country);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.overlay}>
        <View style={s.container}>
          {/* Success Overlay */}
          {successState && (
            <View style={s.successOverlay}>
              <View style={s.successContent}>
                {successState === 'approve' ? (
                  <View>
                    <View style={s.successIconContainer}>
                      <Ionicons name="checkmark-circle-outline" size={60} color="#10B981" />
                    </View>
                    <Text style={s.successTitle}>Payment Approved</Text>
                    <Text style={s.successMessage}>The payment has been successfully approved</Text>
                  </View>
                ) : null}
                {successState === 'reject' ? (
                  <View>
                    <View style={s.successIconContainer}>
                      <Ionicons name="close-circle-outline" size={60} color="#EF4444" />
                    </View>
                    <Text style={s.successTitle}>Payment Rejected</Text>
                    <Text style={s.successMessage}>The payment has been successfully rejected</Text>
                  </View>
                ) : null}
                {successState === 'reupload' ? (
                  <View>
                    <View style={s.successIconContainer}>
                      <Ionicons name="refresh-outline" size={60} color="#F59E0B" />
                    </View>
                    <Text style={s.successTitle}>Reupload Requested</Text>
                    <Text style={s.successMessage}>The owner has been notified to reupload payment proof</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}

          <View style={s.header}>
            <Text style={s.title}>Verify Nepal Payment</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={s.content}>
            <View style={s.section}>
              <Text style={s.sectionTitle}>Payment Details</Text>
              <View style={s.detailRow}>
                <Text style={s.label}>Salon:</Text>
                <Text style={s.value}>{payment.salonName}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Shop ID:</Text>
                <Text style={s.value}>{payment.salonId}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Owner:</Text>
                <Text style={s.value}>{payment.ownerName}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Amount:</Text>
                <Text style={s.amount}>{currencySymbol}{payment.amount.toLocaleString()}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Plan:</Text>
                <Text style={s.value}>{payment.planName}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Transaction ID:</Text>
                <Text style={s.value}>{payment.transactionId}</Text>
              </View>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Payment Proof</Text>
              <TouchableOpacity style={s.screenshotContainer}>
                <Image
                  source={{ uri: payment.verification?.screenshotUrl }}
                  style={s.screenshot}
                  resizeMode="contain"
                />
                <View style={s.screenshotOverlay}>
                  <Ionicons name="expand" size={24} color="#FFF" />
                  <Text style={s.screenshotText}>Tap to expand</Text>
                </View>
              </TouchableOpacity>
              <View style={s.detailRow}>
                <Text style={s.label}>Uploaded:</Text>
                <Text style={s.value}>
                  {new Date(payment.verification?.uploadedAt || '').toLocaleString()}
                </Text>
              </View>
              {payment.verification?.paymentNote && (
                <View style={s.noteBox}>
                  <Text style={s.noteLabel}>Payment Note:</Text>
                  <Text style={s.noteText}>{payment.verification.paymentNote}</Text>
                </View>
              )}
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Verification Note</Text>
              <TextInput
                style={s.noteInput}
                placeholder="Add verification note (required for rejection/reupload)"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <View style={s.actions}>
            <TouchableOpacity
              style={[s.actionBtn, s.approveBtn]}
              onPress={handleApprove}
              disabled={loading}
            >
              {loading ? (
                <Ionicons name="reload" size={20} color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                  <Text style={s.actionText}>Approve</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, s.rejectBtn]}
              onPress={handleReject}
              disabled={loading}
            >
              {loading ? (
                <Ionicons name="reload" size={20} color="#FFF" />
              ) : (
                <>
                  <Ionicons name="close-circle" size={20} color="#FFF" />
                  <Text style={s.actionText}>Reject</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, s.reuploadBtn]}
              onPress={handleRequestReupload}
              disabled={loading}
            >
              {loading ? (
                <Ionicons name="reload" size={20} color="#FFF" />
              ) : (
                <>
                  <Ionicons name="refresh" size={20} color="#FFF" />
                  <Text style={s.actionText}>Reupload</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailRow: {
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
  amount: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  screenshotContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
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
    gap: 8,
    paddingVertical: 10,
  },
  screenshotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  noteBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
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
  noteInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1a1a1a',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  successContent: {
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
