import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image,
  Modal, StyleSheet, Text, TextInput, TouchableOpacity, View,
  RefreshControl,
} from 'react-native';
import apiService from '../../../services/apiService';

interface PaymentItem {
  id: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  paymentProofImage: string;
  shopId: number;
  status: string;
  createdAt: string;
}

export default function PendingPaymentsScreen() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingPayments(0);
    setRefreshing(false);
  };

  const loadPendingPayments = async (pageNum = 0) => {
    try {
      const response = await apiService.get(`/payments/admin/pending?page=${pageNum}&size=10`);
      const newPayments = response.data.data.content || [];
      
      if (pageNum === 0) {
        setPayments(newPayments);
      } else {
        setPayments([...payments, ...newPayments]);
      }
      
      setHasMore(!response.data.data.last);
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Error', 'Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: number) => {
    console.log('Approve button clicked for payment:', paymentId);
    Alert.alert('Debug', `Approve clicked for payment ${paymentId}`);
    setSelectedPaymentId(paymentId);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedPaymentId) return;
    console.log('Confirming approve for payment:', selectedPaymentId);
    try {
      const response = await apiService.post(`/payments/admin/${selectedPaymentId}/approve`);
      console.log('Approve response:', response);
      setPayments(payments.map(p => p.id === selectedPaymentId ? { ...p, status: 'APPROVED' } : p));
      setShowApproveModal(false);
      setSelectedPaymentId(null);
    } catch (error: any) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (paymentId: number) => {
    setSelectedPaymentId(paymentId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedPaymentId) return;
    console.log('Confirming reject for payment:', selectedPaymentId);
    try {
      const response = await apiService.post(`/payments/admin/${selectedPaymentId}/reject`);
      console.log('Reject response:', response);
      setPayments(payments.map(p => p.id === selectedPaymentId ? { ...p, status: 'REJECTED' } : p));
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedPaymentId(null);
    } catch (error: any) {
      console.error('Reject error:', error);
    }
  };

  const renderPaymentItem = ({ item }: { item: PaymentItem }) => {
    const statusColor = item.status === 'APPROVED' ? '#D1FAE5' : item.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7';
    const statusTextColor = item.status === 'APPROVED' ? '#065F46' : item.status === 'REJECTED' ? '#991B1B' : '#92400E';
    const isPending = !item.status || item.status === 'PENDING';
    
    console.log('Payment item:', item.id, 'status:', item.status, 'isPending:', isPending);

    return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View>
          <Text style={s.shopId}>Shop ID {item.shopId}</Text>
          <Text style={s.date}>{new Date(item.createdAt).toDateString()}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={[s.statusText, { color: statusTextColor }]}>{item.status || 'PENDING'}</Text>
        </View>
      </View>

      <View style={s.cardBody}>
        <View style={s.row}>
          <Text style={s.label}>Amount</Text>
          <Text style={s.value}>{item.amount}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Method</Text>
          <Text style={s.value}>{item.paymentMethod}</Text>
        </View>
        {item.transactionId && (
          <View style={s.row}>
            <Text style={s.label}>Transaction ID</Text>
            <Text style={s.value}>{item.transactionId}</Text>
          </View>
        )}

        {item.paymentProofImage && (
          <View style={s.imageSection}>
            <Text style={s.label}>Payment Proof</Text>
            <TouchableOpacity
              onPress={() => setSelectedImage(item.paymentProofImage)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.paymentProofImage }}
                style={s.proofImage}
                resizeMode="cover"
              />
              <View style={s.imageOverlay}>
                <Ionicons name="expand" size={24} color="#FFF" />
                <Text style={s.imageOverlayText}>Tap to expand</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isPending && (
        <View style={s.actions}>
          <TouchableOpacity
            style={[s.actionBtn, s.approveBtn]}
            onPress={() => handleApprove(item.id)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={s.actionText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionBtn, s.rejectBtn]}
            onPress={() => handleReject(item.id)}
          >
            <Ionicons name="close-circle" size={20} color="#FFF" />
            <Text style={s.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  };

  if (loading) {
    return (
      <View style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#f7b638" />
          <Text style={s.loadingText}>Loading pending payments...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Pending Nepal Payments</Text>
        <Text style={s.subtitle}>Review and verify payment proofs</Text>
      </View>

      {payments.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#10B981" />
          <Text style={s.emptyTitle}>No pending payments</Text>
          <Text style={s.emptySubtitle}>All payments have been processed</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          onEndReached={() => hasMore && loadPendingPayments(page + 1)}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f7b638" />
          }
        />
      )}

      <Modal
        visible={selectedImage !== null}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={s.modalContainer}>
          <TouchableOpacity
            style={s.modalClose}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={s.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={showRejectModal}
        transparent={true}
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={s.rejectModalOverlay}>
          <View style={s.rejectModalContent}>
            <Text style={s.rejectModalTitle}>Reject Payment</Text>
            <Text style={s.rejectModalSubtitle}>Please provide a reason for rejecting this payment</Text>
            <TextInput
              style={s.rejectInput}
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={s.rejectModalActions}>
              <TouchableOpacity
                style={[s.rejectModalBtn, s.rejectModalCancel]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedPaymentId(null);
                }}
              >
                <Text style={s.rejectModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.rejectModalBtn, s.rejectModalConfirm]}
                onPress={confirmReject}
              >
                <Text style={s.rejectModalConfirmText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showApproveModal}
        transparent={true}
        onRequestClose={() => setShowApproveModal(false)}
      >
        <View style={s.rejectModalOverlay}>
          <View style={s.rejectModalContent}>
            <Text style={s.rejectModalTitle}>Approve Payment</Text>
            <Text style={s.rejectModalSubtitle}>Are you sure you want to approve this payment?</Text>
            <View style={s.rejectModalActions}>
              <TouchableOpacity
                style={[s.rejectModalBtn, s.rejectModalCancel]}
                onPress={() => {
                  setShowApproveModal(false);
                  setSelectedPaymentId(null);
                }}
              >
                <Text style={s.rejectModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.rejectModalBtn, s.approveModalConfirm]}
                onPress={confirmApprove}
              >
                <Text style={s.rejectModalConfirmText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  header: {
    paddingHorizontal: 20, paddingVertical: 20,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#1a1a1a', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, fontWeight: '400' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 },
  loadingText: { fontSize: 15, color: '#9CA3AF', fontWeight: '500' },
  list: { padding: 16, gap: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FAFAFA',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  shopId: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', letterSpacing: -0.2 },
  date: { fontSize: 12, color: '#9CA3AF', marginTop: 3, fontWeight: '500' },
  statusBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#FEF3C7',
  },
  statusText: { fontSize: 11, fontWeight: '700', color: '#D97706', letterSpacing: 0.3 },
  cardBody: { padding: 20, gap: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  value: { fontSize: 14, color: '#1a1a1a', fontWeight: '600' },
  imageSection: { marginTop: 4 },
  proofImage: {
    width: '100%', height: 180, borderRadius: 12,
    marginTop: 10, backgroundColor: '#F8F8F8',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlayText: {
    color: '#FFF', fontSize: 14, fontWeight: '600', marginTop: 8,
  },
  actions: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FAFAFA',
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  approveBtn: { backgroundColor: '#10B981' },
  rejectBtn: { backgroundColor: '#EF4444' },
  actionText: { fontSize: 15, fontWeight: '600', color: '#FFF', letterSpacing: 0.2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', letterSpacing: -0.3 },
  emptySubtitle: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalClose: {
    position: 'absolute', top: 50, right: 20,
    zIndex: 1, padding: 10,
  },
  fullImage: {
    width: '100%', height: '100%',
  },
  rejectModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  rejectModalContent: {
    backgroundColor: '#FFF', borderRadius: 20,
    padding: 24, width: '100%', maxWidth: 400,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  rejectModalTitle: {
    fontSize: 20, fontWeight: '700', color: '#1a1a1a',
    marginBottom: 8, letterSpacing: -0.3,
  },
  rejectModalSubtitle: {
    fontSize: 14, color: '#6B7280', marginBottom: 16,
  },
  rejectInput: {
    backgroundColor: '#F5F5F7', borderRadius: 12,
    padding: 16, fontSize: 15, color: '#1a1a1a',
    minHeight: 100, marginBottom: 20,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  rejectModalActions: {
    flexDirection: 'row', gap: 12,
  },
  rejectModalBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  rejectModalCancel: {
    backgroundColor: '#F5F5F7', borderWidth: 1, borderColor: '#E5E7EB',
  },
  rejectModalConfirm: {
    backgroundColor: '#EF4444',
  },
  approveModalConfirm: {
    backgroundColor: '#10B981',
  },
  rejectModalCancelText: {
    fontSize: 15, fontWeight: '600', color: '#6B7280',
  },
  rejectModalConfirmText: {
    fontSize: 15, fontWeight: '600', color: '#FFF',
  },
});
