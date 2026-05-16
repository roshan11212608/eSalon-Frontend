import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Payment } from '../types/payment.types';
import { getCurrencySymbol } from '../types/payment.enums';
import { paymentService } from '../services/paymentService';

interface PaymentDetailsModalProps {
  visible: boolean;
  payment: Payment | null;
  onClose: () => void;
}

export default function PaymentDetailsModal({
  visible,
  payment,
  onClose,
}: PaymentDetailsModalProps) {
  const handleCopyTransactionId = () => {
    if (!payment) return;
    // In production, use clipboard
    Alert.alert('Copied', 'Transaction ID copied to clipboard');
  };

  const handleDownloadInvoice = async () => {
    if (!payment) return;
    try {
      const invoice = await paymentService.getInvoice(payment.id);
      if (invoice) {
        Alert.alert('Success', 'Invoice downloaded successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download invoice');
    }
  };

  const handleViewSalon = () => {
    Alert.alert('Navigate', 'Navigate to salon details');
  };

  if (!payment) return null;

  const currencySymbol = getCurrencySymbol(payment.country);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.overlay}>
        <View style={s.container}>
          <View style={s.header}>
            <Text style={s.title}>Payment Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={s.content}>
            <View style={s.section}>
              <Text style={s.sectionTitle}>Transaction Information</Text>
              <View style={s.detailRow}>
                <Text style={s.label}>Transaction ID:</Text>
                <View style={s.valueRow}>
                  <Text style={s.value}>{payment.transactionId}</Text>
                  <TouchableOpacity onPress={handleCopyTransactionId}>
                    <Ionicons name="copy" size={16} color="#f7b638" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Invoice Number:</Text>
                <Text style={s.value}>{payment.invoiceNumber || 'N/A'}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Payment Type:</Text>
                <Text style={s.value}>{payment.paymentType}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Status:</Text>
                <Text style={[s.value, { color: '#10B981' }]}>{payment.status}</Text>
              </View>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Salon Information</Text>
              <View style={s.detailRow}>
                <Text style={s.label}>Salon Name:</Text>
                <Text style={s.value}>{payment.salonName}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Owner Name:</Text>
                <Text style={s.value}>{payment.ownerName}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Country:</Text>
                <Text style={s.value}>{payment.country}</Text>
              </View>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Payment Details</Text>
              <View style={s.detailRow}>
                <Text style={s.label}>Plan:</Text>
                <Text style={s.value}>{payment.planName}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Amount:</Text>
                <Text style={s.amount}>{currencySymbol}{payment.amount.toLocaleString()}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Currency:</Text>
                <Text style={s.value}>{payment.currency}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Payment Method:</Text>
                <Text style={s.value}>{payment.paymentMethod}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.label}>Gateway:</Text>
                <Text style={s.value}>{payment.gateway}</Text>
              </View>
              {payment.gst && (
                <View style={s.detailRow}>
                  <Text style={s.label}>GST:</Text>
                  <Text style={s.value}>{currencySymbol}{payment.gst}</Text>
                </View>
              )}
              {payment.tax && (
                <View style={s.detailRow}>
                  <Text style={s.label}>Tax:</Text>
                  <Text style={s.value}>{currencySymbol}{payment.tax}</Text>
                </View>
              )}
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Dates</Text>
              <View style={s.detailRow}>
                <Text style={s.label}>Paid Date:</Text>
                <Text style={s.value}>{new Date(payment.paidDate).toLocaleString()}</Text>
              </View>
              {payment.renewalDate && (
                <View style={s.detailRow}>
                  <Text style={s.label}>Renewal Date:</Text>
                  <Text style={s.value}>{new Date(payment.renewalDate).toLocaleDateString()}</Text>
                </View>
              )}
            </View>

            {payment.verification && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Verification Details</Text>
                <View style={s.detailRow}>
                  <Text style={s.label}>Status:</Text>
                  <Text style={s.value}>{payment.verification.verificationStatus}</Text>
                </View>
                {payment.verification.verifiedBy && (
                  <View style={s.detailRow}>
                    <Text style={s.label}>Verified By:</Text>
                    <Text style={s.value}>{payment.verification.verifiedBy}</Text>
                  </View>
                )}
                {payment.verification.verifiedAt && (
                  <View style={s.detailRow}>
                    <Text style={s.label}>Verified At:</Text>
                    <Text style={s.value}>{new Date(payment.verification.verifiedAt).toLocaleString()}</Text>
                  </View>
                )}
                {payment.verification.verificationNote && (
                  <View style={s.noteBox}>
                    <Text style={s.noteLabel}>Verification Note:</Text>
                    <Text style={s.noteText}>{payment.verification.verificationNote}</Text>
                  </View>
                )}
              </View>
            )}

            {payment.failureReason && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Failure Information</Text>
                <View style={s.errorBox}>
                  <Text style={s.errorLabel}>Failure Reason:</Text>
                  <Text style={s.errorText}>{payment.failureReason}</Text>
                </View>
                {payment.retryAttempts && (
                  <View style={s.detailRow}>
                    <Text style={s.label}>Retry Attempts:</Text>
                    <Text style={s.value}>{payment.retryAttempts}</Text>
                  </View>
                )}
              </View>
            )}

            {(payment.status === 'Rejected' || payment.status === 'CANCELLED') && payment.adminNote ? (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Admin Note</Text>
                <View style={s.adminNoteBox}>
                  <View style={s.adminNoteHeader}>
                    <Ionicons name="chatbubble" size={16} color="#DC2626" />
                    <Text style={s.adminNoteLabel}>Rejection Note:</Text>
                  </View>
                  <Text style={s.adminNoteText}>{payment.adminNote}</Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          <View style={s.actions}>
            <TouchableOpacity style={s.actionBtn} onPress={handleDownloadInvoice}>
              <Ionicons name="download" size={18} color="#FFF" />
              <Text style={s.actionText}>Download Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, s.secondaryBtn]} onPress={handleViewSalon}>
              <Ionicons name="storefront" size={18} color="#6B7280" />
              <Text style={[s.actionText, s.secondaryText]}>View Salon</Text>
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '700',
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
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
  adminNoteBox: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  adminNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  adminNoteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  adminNoteText: {
    fontSize: 13,
    color: '#1a1a1a',
    lineHeight: 18,
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
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f7b638',
  },
  secondaryBtn: {
    backgroundColor: '#F3F4F6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  secondaryText: {
    color: '#1a1a1a',
  },
});
