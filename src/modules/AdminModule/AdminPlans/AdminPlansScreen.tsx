import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator, Alert, Dimensions, FlatList, Modal, RefreshControl,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatCard } from '../AdminSalon/components/StatCard';
import { AnalyticsSection } from './components/AnalyticsSection';
import { PlanCard } from './components/PlanCard';
import { MOCK_PLANS, computeStatCards } from './data/mockPlans';
import { AdminPlanService } from './services/adminPlanService';
import { styles } from './styles/plansList.styles';
import { PlanStatus, PlanTier, SubscriptionPlan } from './types/plan.types';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function AdminPlansScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: plans = MOCK_PLANS, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: AdminPlanService.listPlans,
    placeholderData: MOCK_PLANS,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PlanStatus | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<PlanTier | 'all'>('all');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    plan: null as SubscriptionPlan | null,
    loading: false,
    success: false,
  });

  const statCards = useMemo(() => computeStatCards(plans), [plans]);

  const filteredPlans = useMemo(
    () =>
      plans.filter((p) => {
        const q = searchQuery.toLowerCase();
        const matchQ =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tier.toLowerCase().includes(q) ||
          p.features.some((f) => f.name.toLowerCase().includes(q));
        const matchS = selectedStatus === 'all' || p.status === selectedStatus;
        const matchT = selectedTier === 'all' || p.tier === selectedTier;
        return matchQ && matchS && matchT;
      }),
    [plans, searchQuery, selectedStatus, selectedTier]
  );

  const handleToggleStatus = useCallback((plan: SubscriptionPlan) => {
    const next: SubscriptionPlan['status'] = plan.status === 'active' ? 'inactive' : 'active';
    Alert.alert(
      `${next === 'active' ? 'Activate' : 'Deactivate'} Plan`,
      `Are you sure you want to ${next === 'active' ? 'activate' : 'deactivate'} ${plan.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: next === 'active' ? 'Activate' : 'Deactivate',
          style: next === 'inactive' ? 'destructive' : 'default',
          onPress: () =>
            queryClient.setQueryData<SubscriptionPlan[]>(['admin', 'plans'], (old = []) =>
              old.map(p => p.id === plan.id ? { ...p, status: next } : p)
            ),
        },
      ]
    );
  }, [queryClient]);

  const performDelete = useCallback(async () => {
    if (!deleteModal.plan) return;
    
    setDeleteModal(prev => ({ ...prev, loading: true }));
    try {
      await AdminPlanService.deletePlan(deleteModal.plan.id);
      queryClient.setQueryData<SubscriptionPlan[]>(['admin', 'plans'], (old = []) =>
        old.filter(p => p.id !== deleteModal.plan!.id)
      );
      setDeleteModal(prev => ({ ...prev, loading: false, success: true }));
      // Auto-close after success
      setTimeout(() => {
        setDeleteModal({ visible: false, plan: null, loading: false, success: false });
      }, 1500);
    } catch (e) {
      console.error('Delete failed:', e);
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  }, [deleteModal.plan, queryClient]);

  const handleDelete = useCallback((plan: SubscriptionPlan) => {
    setDeleteModal({ visible: true, plan, loading: false, success: false });
  }, []);

  const handleDuplicate = useCallback((plan: SubscriptionPlan) => {
    const copy: SubscriptionPlan = {
      ...plan, id: Date.now(), name: `${plan.name} (Copy)`,
      isPopular: false, activeSubscribers: 0, trialUsers: 0,
      monthlyRevenue: 0, annualRevenue: 0,
      subscribers: [], analytics: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    queryClient.setQueryData<SubscriptionPlan[]>(['admin', 'plans'], (old = []) => [...old, copy]);
  }, [queryClient]);

  const handleEdit = useCallback((plan: SubscriptionPlan) => {
    // Prevent editing plans with fake IDs (timestamps from duplicate function)
    if (plan.id > 1_000_000_000) {
      Alert.alert('Cannot Edit', 'This is a duplicated plan (not saved to backend). Please create a new plan instead.');
      return;
    }
    router.push(`/(admin-tabs)/plans/edit/${plan.id}`);
  }, [router]);

  const FilterTab = ({ value, current, label, onPress }:
    { value: string; current: string; label: string; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.filterTab, current === value && styles.filterTabActive]}
      onPress={onPress} activeOpacity={0.7}
    >
      <Text style={[styles.filterText, current === value && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const cardWidth = isTablet ? (width - 48 - 12) / 2 : undefined;

  if (isLoading && plans === MOCK_PLANS) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Plans & Billing</Text>
            <Text style={styles.headerSub}>Manage subscription plans</Text>
          </View>
        </View>
        <View style={lStyles.center}>
          <ActivityIndicator size="large" color="#780115" />
          <Text style={lStyles.text}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && plans.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Plans & Billing</Text>
            <Text style={styles.headerSub}>Manage subscription plans</Text>
          </View>
        </View>
        <View style={lStyles.center}>
          <Ionicons name="cloud-offline-outline" size={56} color="#D1D5DB" />
          <Text style={lStyles.errorText}>Could not load plans</Text>
          <Text style={lStyles.errorSub}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
          <TouchableOpacity style={lStyles.retryBtn} onPress={() => refetch()}>
            <Text style={lStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Plans & Billing</Text>
          <Text style={styles.headerSub}>Manage subscription plans</Text>
        </View>
        <TouchableOpacity
          style={styles.newPlanBtn}
          onPress={() => router.push('/(admin-tabs)/plans/create')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="#FFF" />
          <Text style={styles.newPlanBtnText}>New Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}
            tintColor="#780115" colors={['#780115']} />
        }
      >
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {statCards.map(item => (
              <View key={item.id} style={styles.statCardWrapper}>
                <StatCard data={item} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search plans, features..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.filterRow}>
            {(['all', 'active', 'inactive'] as const).map(v => (
              <FilterTab key={v} value={v} current={selectedStatus}
                label={v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
                onPress={() => setSelectedStatus(v)} />
            ))}
          </View>
          <View style={styles.planFilterContainer}>
            <Text style={styles.filterLabel}>Tier</Text>
            <View style={styles.filterRow}>
              {([{ v: 'all', l: 'All Tiers' }, { v: 'basic', l: 'Basic' }, { v: 'professional', l: 'Pro' }, { v: 'enterprise', l: 'Enterprise' }]).map(({ v, l }) => (
                <FilterTab key={v} value={v} current={selectedTier} label={l} onPress={() => setSelectedTier(v as PlanTier | 'all')} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.plansSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subscription Plans</Text>
            <Text style={styles.sectionSubtitle}>{filteredPlans.length} / {plans.length}</Text>
          </View>
          {filteredPlans.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="layers-outline" size={56} color="#D1D5DB" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No plans found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          ) : (
            <FlatList
              data={filteredPlans}
              keyExtractor={item => String(item.id)}
              scrollEnabled={false}
              numColumns={isTablet ? 2 : 1}
              key={isTablet ? 'tablet' : 'mobile'}
              columnWrapperStyle={isTablet ? styles.tabletRow : undefined}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <View style={isTablet ? { width: cardWidth, flexShrink: 1 } : undefined}>
                  <PlanCard
                    plan={item}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onViewSubscribers={p => router.push(`/(admin-tabs)/plans/subscribers/${p.id}`)}
                  />
                </View>
              )}
            />
          )}
        </View>

        <AnalyticsSection plans={plans} />
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => !deleteModal.loading && setDeleteModal({ visible: false, plan: null, loading: false, success: false })}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            {deleteModal.success ? (
              // Success state
              <View style={modalStyles.successCenter}>
                <View style={modalStyles.successIcon}>
                  <Ionicons name="checkmark" size={32} color="#FFF" />
                </View>
                <Text style={modalStyles.successTitle}>Deleted Successfully</Text>
                <Text style={modalStyles.successSub}>{deleteModal.plan?.name} has been removed</Text>
              </View>
            ) : (
              // Confirmation state
              <>
                <View style={modalStyles.header}>
                  <Ionicons name="trash-outline" size={24} color="#DC2626" />
                  <Text style={modalStyles.title}>Delete Plan</Text>
                </View>
                <View style={modalStyles.divider} />
                <Text style={modalStyles.message}>
                  Are you sure you want to delete <Text style={modalStyles.planName}>{deleteModal.plan?.name}</Text>? This action cannot be undone.
                </Text>
                <View style={modalStyles.actions}>
                  <TouchableOpacity
                    style={modalStyles.cancelBtn}
                    onPress={() => setDeleteModal({ visible: false, plan: null, loading: false, success: false })}
                    disabled={deleteModal.loading}
                  >
                    <Text style={modalStyles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[modalStyles.deleteBtn, deleteModal.loading && modalStyles.deleteBtnDisabled]}
                    onPress={performDelete}
                    disabled={deleteModal.loading}
                  >
                    {deleteModal.loading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={modalStyles.deleteText}>Delete</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const lStyles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  text: { fontSize: 15, color: '#9CA3AF', fontWeight: '500' },
  errorText: { fontSize: 17, fontWeight: '700', color: '#374151', marginTop: 4 },
  errorSub: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
  retryBtn: { marginTop: 4, backgroundColor: '#780115', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 24,
  },
  planName: {
    fontWeight: '700',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  deleteBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  successCenter: {
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  successSub: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
});
