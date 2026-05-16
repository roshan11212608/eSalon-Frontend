import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Payment, PaymentStats, PaymentFilter } from './types/payment.types';
import { paymentService } from './services/paymentService';
import PaymentStatCard from './components/PaymentStatCard';
import PaymentCard from './components/PaymentCard';
import VerificationCard from './components/VerificationCard';
import FailedPaymentCard from './components/FailedPaymentCard';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import NepalVerificationModal from './modals/NepalVerificationModal';
import PaymentDetailsModal from './modals/PaymentDetailsModal';
import PendingPaymentsScreen from './PendingPaymentsScreen';

type Tab = 'All' | 'Pending Verification' | 'Failed';

export default function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState<'All' | 'India' | 'Nepal'>('All');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [paymentsData, statsData] = await Promise.all([
        paymentService.getPayments(),
        paymentService.getPaymentStats(),
      ]);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getFilteredPayments = () => {
    let filtered = payments;

    // Filter by tab
    if (activeTab === 'Pending Verification') {
      filtered = filtered.filter(p => p.status === 'Pending Verification');
    } else if (activeTab === 'Failed') {
      filtered = filtered.filter(p => p.status === 'Failed' || p.status === 'Rejected');
    }

    // Filter by country
    if (countryFilter !== 'All') {
      filtered = filtered.filter(p => p.country === countryFilter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.salonName.toLowerCase().includes(query) ||
          p.ownerName.toLowerCase().includes(query) ||
          p.transactionId.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const handlePaymentPress = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsModalVisible(true);
  };

  const handleVerificationPress = (payment: Payment) => {
    setSelectedPayment(payment);
    setVerificationModalVisible(true);
  };

  const handleVerified = () => {
    loadData();
  };

  const handleApprovePayment = async (paymentId: string) => {
    Alert.alert(
      'Approve Payment',
      'Are you sure you want to approve this payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await paymentService.approveNepalPayment(paymentId);
              Alert.alert('Success', 'Payment approved successfully');
              handleVerified();
            } catch (error) {
              Alert.alert('Error', 'Failed to approve payment');
            }
          },
        },
      ]
    );
  };

  const handleRejectPayment = async (paymentId: string) => {
    Alert.alert(
      'Reject Payment',
      'Are you sure you want to reject this payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentService.rejectNepalPayment(paymentId, 'Payment proof unclear');
              Alert.alert('Success', 'Payment rejected successfully');
              handleVerified();
            } catch (error) {
              Alert.alert('Error', 'Failed to reject payment');
            }
          },
        },
      ]
    );
  };

  const handleRetryPayment = async (paymentId: string) => {
    try {
      await paymentService.retryFailedPayment(paymentId);
      Alert.alert('Success', 'Payment retry initiated');
      handleVerified();
    } catch (error) {
      Alert.alert('Error', 'Failed to retry payment');
    }
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => {
    if (item.status === 'Failed') {
      return (
        <FailedPaymentCard
          payment={item}
          onRetry={() => handleRetryPayment(item.id)}
          onViewDetails={() => handlePaymentPress(item)}
        />
      );
    }

    if (item.status === 'Pending Verification') {
      return (
        <VerificationCard
          payment={item}
          onApprove={() => handleVerificationPress(item)}
          onReject={() => handleRejectPayment(item.id)}
          onRequestReupload={() => Alert.alert('Info', 'Reupload request sent')}
          onViewScreenshot={() => handleVerificationPress(item)}
        />
      );
    }

    return <PaymentCard payment={item} onPress={() => handlePaymentPress(item)} />;
  };

  if (loading) {
    return <LoadingState message="Loading payments..." />;
  }

  const filteredPayments = getFilteredPayments();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Payments</Text>
        <TouchableOpacity style={s.exportBtn}>
          <Ionicons name="download-outline" size={18} color="#6B7280" />
          <Text style={s.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      {stats && (
        <View style={s.statsContainer}>
          <PaymentStatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon="receipt-outline"
            color="#f7b638"
            trend="+12%"
            trendUp
          />
          <PaymentStatCard
            title="Successful"
            value={stats.successfulPayments}
            icon="checkmark-circle-outline"
            color="#10B981"
            trend="+8%"
            trendUp
          />
          <PaymentStatCard
            title="Pending"
            value={stats.pendingVerifications}
            icon="time-outline"
            color="#F59E0B"
          />
          <PaymentStatCard
            title="Failed"
            value={stats.failedPayments}
            icon="alert-circle-outline"
            color="#EF4444"
            trend="-2%"
            trendUp={false}
          />
        </View>
      )}

      <View style={s.filtersContainer}>
          <View style={s.searchBar}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={s.searchInput}
              placeholder="Search salon, owner, transaction ID..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.countryFilters}>
            {['All', 'India', 'Nepal'].map((country) => (
              <TouchableOpacity
                key={country}
                style={[s.filterChip, countryFilter === country && s.filterChipActive]}
                onPress={() => setCountryFilter(country as 'All' | 'India' | 'Nepal')}
              >
                <Text style={[s.filterChipText, countryFilter === country && s.filterChipTextActive]}>
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      <View style={s.tabsContainer}>
        {(['All', 'Pending Verification', 'Failed'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={s.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {filteredPayments.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No payments found"
          subtitle="Try adjusting your filters or search query"
        />
      ) : (
        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f7b638" />
          }
        />
      )}

      <NepalVerificationModal
        visible={verificationModalVisible}
        payment={selectedPayment}
        onClose={() => setVerificationModalVisible(false)}
        onVerified={handleVerified}
      />

      <PaymentDetailsModal
        visible={detailsModalVisible}
        payment={selectedPayment}
        onClose={() => setDetailsModalVisible(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  countryFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#f7b638',
    borderColor: '#f7b638',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.2,
  },
  filterChipTextActive: {
    color: '#1a1a1a',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#f7b638',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.1,
  },
  tabTextActive: {
    color: '#1a1a1a',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    backgroundColor: '#f7b638',
    borderRadius: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
