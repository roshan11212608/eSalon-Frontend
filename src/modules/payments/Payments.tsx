import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/payments.styles';
import PaymentsList from './paymentsList';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';
import PaymentService, { PaymentStatus } from '@/src/services/paymentService';

export interface Payment {
  id: string;
  paymentType: 'customer_payment' | 'staff_payout';
  recipientName: string;
  recipientType: 'customer' | 'employee' | 'vendor' | 'other';
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  netAmount?: number;
  paymentMethod: 'cash' | 'online';
  category: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  itemType: 'payment';
}


export default function Payments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'verify' | 'cancel', id: string} | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const authState = useAuthStore();

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const shopId = authState.user?.shopId;
      const userRole = authState.user?.role;
      const employeeId = authState.user?.employeeId;

      console.log('Auth state:', { userRole, employeeId, shopId });

      if (!shopId) {
        console.error('No shopId found in auth state');
        Alert.alert('Error', 'Shop information not found');
        setPayments([]);
        return;
      }

      // Fetch payments - filter by employee ID for staff users
      let paymentsData;
      if (userRole?.toUpperCase() === 'STAFF' && employeeId) {
        console.log('Fetching payments for staff member with employee ID:', employeeId);
        paymentsData = await PaymentService.getPaymentsByShopAndEmployee(
          parseInt(shopId),
          parseInt(employeeId)
        );
      } else {
        console.log('Fetching all payments for shop');
        paymentsData = await PaymentService.getPaymentsByShop(parseInt(shopId));
      }
      console.log('Raw payments data:', paymentsData);
      
      // Map backend Payment type to frontend type
      const mappedPayments: Payment[] = paymentsData.map(p => ({
        id: p.id.toString(),
        paymentType: p.paymentType === 'CUSTOMER_PAYMENT' ? 'customer_payment' : 'staff_payout',
        recipientName: p.recipientName,
        recipientType: p.recipientType.toLowerCase() as 'customer' | 'employee' | 'vendor' | 'other',
        amount: typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount)),
        paymentMethod: p.paymentMethod.toLowerCase() as 'cash' | 'online',
        category: p.category,
        description: p.description || '',
        date: p.paymentDate.split('T')[0],
        status: p.status.toLowerCase() as 'pending' | 'completed' | 'cancelled',
        verificationStatus: p.verificationStatus as 'PENDING' | 'VERIFIED' | 'REJECTED',
        createdAt: p.createdAt,
        commissionRate: p.commissionRate ? (typeof p.commissionRate === 'number' ? p.commissionRate : parseFloat(String(p.commissionRate))) : undefined,
        commissionAmount: p.commissionAmount ? (typeof p.commissionAmount === 'number' ? p.commissionAmount : parseFloat(String(p.commissionAmount))) : undefined,
        netAmount: p.netAmount ? (typeof p.netAmount === 'number' ? p.netAmount : parseFloat(String(p.netAmount))) : undefined,
        itemType: 'payment',
      }));

      console.log('Mapped payments:', mappedPayments);
      setPayments(mappedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      Alert.alert('Error', 'Failed to load payments');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [authState]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useFocusEffect(
    useCallback(() => {
      fetchPayments();
    }, [fetchPayments])
  );

  const onRefresh = () => {
    Haptics.impactAsync();
    setRefreshing(true);
    fetchPayments();
  };

  const handleAddPayment = () => {
    Haptics.notificationAsync();
    router.push('/(owner-tabs)/payments/addPayment');
  };

  const handleDeletePayment = (id: string) => {
    setPaymentToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeletePayment = async () => {
    if (!paymentToDelete) return;
    try {
      await PaymentService.deletePayment(parseInt(paymentToDelete));
      setPayments(payments.filter(p => p.id !== paymentToDelete));
      setShowDeleteModal(false);
      setPaymentToDelete(null);
      setSuccessMessage('Payment deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting payment:', error);
      Alert.alert('Error', 'Failed to delete payment');
    }
  };

  const handleVerifyPayment = (id: string) => {
    setConfirmAction({ type: 'verify', id });
  };

  const handleCancelPayment = (id: string) => {
    setConfirmAction({ type: 'cancel', id });
  };

  const executeVerifyPayment = async () => {
    if (!confirmAction) return;
    try {
      await PaymentService.verifyPayment(parseInt(confirmAction.id));
      setPayments(payments.map(p => p.id === confirmAction.id ? { ...p, verificationStatus: 'VERIFIED' } : p));
      setSuccessMessage('Payment verified successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to verify payment');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setConfirmAction(null);
    }
  };

  const executeCancelPayment = async () => {
    if (!confirmAction) return;
    try {
      await PaymentService.cancelPayment(parseInt(confirmAction.id));
      setPayments(payments.map(p => p.id === confirmAction.id ? { ...p, status: 'cancelled' } : p));
      setSuccessMessage('Payment cancelled successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to cancel payment');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setConfirmAction(null);
    }
  };

  const cancelDeletePayment = () => {
    setShowDeleteModal(false);
    setPaymentToDelete(null);
  };

  const handlePaymentPress = (item: Payment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(owner-tabs)/payments/paymentsList?id=${item.id}`);
  };

  const allItems = payments.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredPayments = allItems.filter(item => {
    const matchesSearch = 
      item.recipientName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'All') {
      matchesFilter = true;
    } else if (selectedFilter === 'Customer Payments') {
      matchesFilter = item.paymentType === 'customer_payment';
    } else if (selectedFilter === 'Staff Payouts') {
      matchesFilter = item.paymentType === 'staff_payout';
    } else if (selectedFilter === 'Pending') {
      matchesFilter = item.status === PaymentStatus.PENDING.toLowerCase();
    } else if (selectedFilter === 'Completed') {
      matchesFilter = item.status === PaymentStatus.COMPLETED.toLowerCase();
    }
    
    return matchesSearch && matchesFilter;
  });

  const filterCategories = ['All', 'Customer Payments', 'Staff Payouts', 'Pending', 'Completed'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f7b638" />
          <Text style={styles.loadingText}>Loading payments...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.mainContainer}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pay<Text style={styles.titleAccent}>ments</Text></Text>
          {authState.user?.role?.toUpperCase() === 'OWNER' && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
              <Ionicons name="add" size={20} style={styles.addButtonIcon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search payments..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {filterCategories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedFilter === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#f7b638']}
              tintColor="#f7b638"
            />
          }
        >
          {/* Main Content Container */}
          <View style={styles.mainContent}>
            {filteredPayments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="card-outline" size={72} color="#CBD5E1" />
                </View>
                <Text style={styles.emptyTitle}>No Payments Yet</Text>
                <Text style={styles.emptyMessage}>
                  Start tracking your salon payments
                </Text>
                {authState.user?.role?.toUpperCase() === 'OWNER' && (
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={handleAddPayment}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.emptyButtonText}>Add Payment</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <PaymentsList
                payments={filteredPayments}
                onPaymentPress={handlePaymentPress}
                onDeletePayment={handleDeletePayment}
                onVerifyPayment={handleVerifyPayment}
                onCancelPayment={handleCancelPayment}
                getStatusColor={getStatusColor}
                userRole={authState.user?.role}
              />
            )}
          </View>
        </ScrollView>

        {showSuccess && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={20} color="white" style={styles.successMessageIcon} />
            <Text style={styles.successMessageText}>
              {successMessage}
            </Text>
          </View>
        )}

        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelDeletePayment}
        >
          <View style={styles.confirmationModalOverlay}>
            <View style={styles.confirmationModalContent}>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={[styles.confirmationModalIconContainer, styles.confirmationModalButtonDelete]}>
                  <Ionicons name="trash" size={32} color="#DC2626" />
                </View>
                <Text style={styles.confirmationModalTitle}>
                  Delete Payment
                </Text>
                <Text style={styles.confirmationModalDescription}>
                  Are you sure you want to delete this payment? This action cannot be undone.
                </Text>
              </View>
              <View style={styles.confirmationModalButtons}>
                <TouchableOpacity
                  style={[styles.confirmationModalButton, styles.confirmationModalButtonCancel]}
                  onPress={cancelDeletePayment}
                >
                  <Text style={[styles.confirmationModalButtonText, styles.confirmationModalButtonTextCancel]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmationModalButton, styles.confirmationModalButtonDelete]}
                  onPress={confirmDeletePayment}
                >
                  <Text style={[styles.confirmationModalButtonText, styles.confirmationModalButtonTextWhite]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Custom Confirmation Modal for Verify/Cancel */}
        <Modal
          visible={!!confirmAction}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setConfirmAction(null)}
        >
          <View style={styles.confirmationModalOverlay}>
            <View style={styles.confirmationModalContent}>
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={[
                  styles.confirmationModalIconContainer,
                  confirmAction?.type === 'verify' ? { backgroundColor: '#10B981' } : { backgroundColor: '#EF4444' }
                ]}>
                  <Ionicons 
                    name={confirmAction?.type === 'verify' ? 'checkmark-circle' : 'close-circle'} 
                    size={32} 
                    color="white" 
                  />
                </View>
                <Text style={styles.confirmationModalTitle}>
                  {confirmAction?.type === 'verify' ? 'Verify Payment' : 'Cancel Payment'}
                </Text>
                <Text style={styles.confirmationModalDescription}>
                  {confirmAction?.type === 'verify' 
                    ? 'Are you sure you want to verify this payment?' 
                    : 'Are you sure you want to cancel this payment? Once cancelled, this payment cannot be verified.'
                  }
                </Text>
              </View>
              <View style={styles.confirmationModalButtons}>
                <TouchableOpacity
                  style={[styles.confirmationModalButton, styles.confirmationModalButtonCancel]}
                  onPress={() => setConfirmAction(null)}
                >
                  <Text style={[styles.confirmationModalButtonText, styles.confirmationModalButtonTextCancel]}>
                    {confirmAction?.type === 'verify' ? 'Cancel' : 'No'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmationModalButton,
                    confirmAction?.type === 'verify' ? { backgroundColor: '#10B981' } : { backgroundColor: '#EF4444' }
                  ]}
                  onPress={confirmAction?.type === 'verify' ? executeVerifyPayment : executeCancelPayment}
                >
                  <Text style={styles.confirmationModalButtonText}>
                    {confirmAction?.type === 'verify' ? 'Verify' : 'Yes, Cancel'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
