import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_PLANS } from '../data/mockPlans';
import { PaymentStatus, SubscriberSalon, SubscriptionPlan } from '../types/plan.types';

const STATUS_CONFIG: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
  paid:    { bg: '#D1FAE5', text: '#059669', label: 'Paid' },
  pending: { bg: '#FEF3C7', text: '#D97706', label: 'Pending' },
  overdue: { bg: '#FEE2E2', text: '#DC2626', label: 'Overdue' },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function SubscriberCard({ item, accentColor }: { item: SubscriberSalon; accentColor: string }) {
  const st = STATUS_CONFIG[item.paymentStatus];
  const sym = item.currency === 'INR' ? '₹' : item.currency;
  return (
    <View style={s.card}>
      <View style={s.cardLeft}>
        <View style={[s.avatar, { backgroundColor: `${accentColor}14` }]}>
          <Ionicons name="storefront" size={18} color={accentColor} />
        </View>
        <View style={s.cardInfo}>
          <Text style={s.salonName} numberOfLines={1}>{item.salonName}</Text>
          <Text style={s.ownerName}>{item.ownerName}</Text>
          <View style={s.dateRow}>
            <Ionicons name="calendar-outline" size={11} color="#9CA3AF" />
            <Text style={s.dateText}>Since {formatDate(item.activeSince)}</Text>
            <Text style={s.dateSep}>·</Text>
            <Text style={s.dateText}>Renews {formatDate(item.renewalDate)}</Text>
          </View>
        </View>
      </View>
      <View style={s.cardRight}>
        <Text style={[s.revenue, { color: accentColor }]}>
          {sym}{item.revenueContribution.toLocaleString('en-IN')}
          <Text style={s.revSub}>/mo</Text>
        </Text>
        <View style={[s.statusPill, { backgroundColor: st.bg }]}>
          <Text style={[s.statusText, { color: st.text }]}>{st.label}</Text>
        </View>
      </View>
    </View>
  );
}

export default function SubscribersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const goBack = () => router.replace('/(admin-tabs)/plans' as const);

  const plans = queryClient.getQueryData<SubscriptionPlan[]>(['admin', 'plans']) ?? MOCK_PLANS;
  const plan = plans.find(p => p.id === Number(id));

  if (!plan) {
    return (
      <SafeAreaView style={s.container} edges={['top', 'bottom']}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Subscribers</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={s.empty}>
          <Ionicons name="alert-circle-outline" size={48} color="#D1D5DB" />
          <Text style={s.emptyText}>Plan not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sym = plan.currency === 'INR' ? '₹' : plan.currency;
  const totalRev = plan.subscribers.reduce((sum, sub) => sum + sub.revenueContribution, 0);
  const paid = plan.subscribers.filter(sub => sub.paymentStatus === 'paid').length;
  const overdue = plan.subscribers.filter(sub => sub.paymentStatus === 'overdue').length;

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Subscribers</Text>
          <Text style={s.headerSub}>{plan.name}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Summary bar */}
      <View style={[s.summary, { borderLeftColor: plan.color, borderLeftWidth: 4 }]}>
        {[
          { val: String(plan.subscribers.length), lbl: 'Total', col: plan.color },
          { val: String(paid),   lbl: 'Paid',    col: '#059669' },
          { val: String(overdue), lbl: 'Overdue', col: '#DC2626' },
          { val: `${sym}${totalRev >= 1000 ? `${(totalRev / 1000).toFixed(1)}K` : totalRev}`, lbl: 'Revenue', col: plan.color },
        ].map((item, i, arr) => (
          <React.Fragment key={item.lbl}>
            <View style={s.summaryItem}>
              <Text style={[s.summaryVal, { color: item.col }]}>{item.val}</Text>
              <Text style={s.summaryLbl}>{item.lbl}</Text>
            </View>
            {i < arr.length - 1 && <View style={s.summaryDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* List */}
      {plan.subscribers.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="people-outline" size={56} color="#D1D5DB" />
          <Text style={s.emptyText}>No subscribers yet</Text>
          <Text style={s.emptySub}>Salons that subscribe to this plan will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={plan.subscribers}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={s.list}
          renderItem={({ item }) => <SubscriberCard item={item} accentColor={plan.color} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F3' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  headerSub: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
  summary: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', margin: 16, borderRadius: 14, paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, height: 30, backgroundColor: '#F3F4F6' },
  summaryVal: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  summaryLbl: { fontSize: 10, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  salonName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  ownerName: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginTop: 1 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  dateText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  dateSep: { fontSize: 11, color: '#D1D5DB' },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  revenue: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  revSub: { fontSize: 10, fontWeight: '500', color: '#9CA3AF' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 40 },
  emptyText: { fontSize: 17, fontWeight: '700', color: '#374151' },
  emptySub: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
});
