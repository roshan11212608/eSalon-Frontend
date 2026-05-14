import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SubscriptionPlan } from '../types/plan.types';

interface Props {
  plans: SubscriptionPlan[];
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={s.barChart}>
      {data.map((d) => (
        <View key={d.label} style={s.barGroup}>
          <View style={s.barTrack}>
            <View
              style={[
                s.barFill,
                { height: `${Math.round((d.value / max) * 100)}%`, backgroundColor: color },
              ]}
            />
          </View>
          <Text style={s.barLabel}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

function HorizBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <View style={s.horizItem}>
      <View style={s.horizMeta}>
        <Text style={s.horizLabel}>{label}</Text>
        <Text style={[s.horizVal, { color }]}>{sub}</Text>
      </View>
      <View style={s.horizTrack}>
        <View style={[s.horizFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export const AnalyticsSection: React.FC<Props> = ({ plans }) => {
  const allAnalytics = plans[1]?.analytics ?? [];
  const revenueData = allAnalytics.map((a) => ({ label: a.month, value: a.revenue }));

  const totalRev = plans.reduce((s, p) => s + p.monthlyRevenue, 0);

  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <View style={s.sectionIconWrap}>
          <Ionicons name="analytics" size={16} color="#780115" />
        </View>
        <Text style={s.sectionTitle}>Analytics Overview</Text>
      </View>

      <View style={s.cardsRow}>
        {/* MRR Chart */}
        <View style={[s.card, isTablet && s.cardHalf]}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Revenue Trend (6M)</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>Monthly</Text>
            </View>
          </View>
          <View style={s.chartWrap}>
            {revenueData.length > 0 ? (
              <BarChart data={revenueData} color="#780115" />
            ) : (
              <View style={s.placeholder}>
                <Ionicons name="bar-chart-outline" size={36} color="#E5E7EB" />
                <Text style={s.placeholderText}>No data yet</Text>
              </View>
            )}
          </View>
          <View style={s.statRow}>
            <View style={s.statItem}>
              <Text style={[s.statVal, { color: '#059669' }]}>
                ₹{totalRev >= 1000 ? `${(totalRev / 1000).toFixed(1)}K` : totalRev}
              </Text>
              <Text style={s.statLbl}>Current MRR</Text>
            </View>
            <View style={s.statItem}>
              <Text style={[s.statVal, { color: '#7C3AED' }]}>+18%</Text>
              <Text style={s.statLbl}>vs Last Month</Text>
            </View>
            <View style={s.statItem}>
              <Text style={[s.statVal, { color: '#3B82F6' }]}>+22%</Text>
              <Text style={s.statLbl}>YoY Growth</Text>
            </View>
          </View>
        </View>

        {/* Plan Popularity */}
        <View style={[s.card, isTablet && s.cardHalf]}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Plan Distribution</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>Active Subs</Text>
            </View>
          </View>
          <View style={s.horizChartWrap}>
            {plans.map((p) => (
              <HorizBar
                key={p.id}
                label={p.name}
                value={p.activeSubscribers}
                max={Math.max(...plans.map((x) => x.activeSubscribers), 1)}
                color={p.color}
                sub={`${p.activeSubscribers} subs`}
              />
            ))}
          </View>
          <View style={s.trendRow}>
            {[
              { icon: 'trending-up', label: 'Most Popular', val: plans.find((p) => p.isPopular)?.name ?? '—', color: '#7C3AED' },
              { icon: 'cash', label: 'Top Revenue', val: 'Enterprise', color: '#780115' },
              { icon: 'person-add', label: 'Upgrade Rate', val: '34%', color: '#059669' },
            ].map((t) => (
              <View key={t.label} style={s.trendItem}>
                <Ionicons name={t.icon as any} size={13} color={t.color} />
                <Text style={s.trendLbl}>{t.label}</Text>
                <Text style={[s.trendVal, { color: t.color }]} numberOfLines={1}>{t.val}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const CARD_GAP = 12;
const CARD_WIDTH = isTablet ? (width - 48 - CARD_GAP) / 2 : width - 32;

const s = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },
  cardsRow: { flexDirection: isTablet ? 'row' : 'column', gap: CARD_GAP },
  card: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 16, width: CARD_WIDTH,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  cardHalf: { flex: 1, width: undefined },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '600', color: '#6B7280' },
  chartWrap: { height: 120, marginBottom: 12 },
  barChart: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4, height: '100%' },
  barTrack: { flex: 1, width: '60%', backgroundColor: '#F3F4F6', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 4, minHeight: 3 },
  barLabel: { fontSize: 9, color: '#9CA3AF', fontWeight: '600' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  placeholderText: { fontSize: 12, color: '#D1D5DB', fontWeight: '500' },
  statRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  statLbl: { fontSize: 9, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
  horizChartWrap: { gap: 12, marginBottom: 14 },
  horizItem: { gap: 5 },
  horizMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  horizLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },
  horizVal: { fontSize: 12, fontWeight: '700' },
  horizTrack: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  horizFill: { height: '100%', borderRadius: 3 },
  trendRow: { flexDirection: 'row', gap: 4 },
  trendItem: { flex: 1, alignItems: 'center', gap: 3, backgroundColor: '#F9FAFB', borderRadius: 10, padding: 8 },
  trendLbl: { fontSize: 9, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  trendVal: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
});
