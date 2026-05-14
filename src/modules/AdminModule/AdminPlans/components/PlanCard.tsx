import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PlanTier, SubscriptionPlan } from '../types/plan.types';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onToggleStatus: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  onDuplicate: (plan: SubscriptionPlan) => void;
  onViewSubscribers: (plan: SubscriptionPlan) => void;
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const TIER_ICON: Record<PlanTier, keyof typeof Ionicons.glyphMap> = {
  basic: 'star-outline',
  professional: 'star-half',
  enterprise: 'star',
};

export const PlanCard: React.FC<PlanCardProps> = ({
  plan, onEdit, onToggleStatus, onDelete, onDuplicate, onViewSubscribers,
}) => {
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const color = plan.color;
  const isActive = plan.status === 'active';
  const tierIcon = TIER_ICON[plan.tier];
  const sym = plan.currency === 'INR' ? '₹' : plan.currency;
  const fmtP = (n: number) => `${sym}${n.toLocaleString('en-IN')}`;
  const fmtRev = (n: number) => n >= 100000 ? `${sym}${(n / 100000).toFixed(1)}L` : `${sym}${(n / 1000).toFixed(1)}K`;

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {/* Top color stripe */}
      <View style={[styles.topStripe, { backgroundColor: color }]} />

      {/* Popular ribbon */}
      {plan.isPopular && (
        <View style={[styles.popularRibbon, { backgroundColor: '#7C3AED' }]}>
          <Ionicons name="star" size={9} color="#FFF" />
          <Text style={styles.popularText}>POPULAR</Text>
        </View>
      )}

      <View style={styles.body}>
        {/* ── Header ── */}
        <View style={styles.headRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${color}14` }]}>
            <Ionicons name={tierIcon} size={28} color={color} />
          </View>
          <View style={styles.headMeta}>
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.tierPill, { backgroundColor: `${color}14` }]}>
                <Text style={[styles.tierPillText, { color }]}>{plan.tier.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: isActive ? '#D1FAE5' : '#F3F4F6' }]}>
                <View style={[styles.statusDot, { backgroundColor: isActive ? '#059669' : '#9CA3AF' }]} />
                <Text style={[styles.statusText, { color: isActive ? '#059669' : '#9CA3AF' }]}>
                  {isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>{plan.description}</Text>

        <View style={styles.divider} />

        {/* ── Pricing ── */}
        <View style={styles.pricingRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={[styles.priceValue, { color }]}>{fmtP(plan.monthlyPrice)}</Text>
            <Text style={styles.priceSub}>30 days (1 month)</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Metrics ── */}
        <View style={styles.metricsRow}>
          {[
            { icon: 'people', val: String(plan.activeSubscribers), lbl: 'Subscribers', col: '#3B82F6' },
            { icon: 'cash', val: fmtRev(plan.monthlyRevenue), lbl: 'MRR', col: '#059669' },
            { icon: 'person-add', val: plan.employeeLimit === null ? '∞' : String(plan.employeeLimit), lbl: 'Max Staff', col: color },
            { icon: 'time', val: `${plan.durationInDays}d`, lbl: 'Duration', col: '#7C3AED' },
          ].map((m, i, arr) => (
            <React.Fragment key={m.lbl}>
              <View style={[
                styles.metricItem,
                !isTablet && (i === 0 || i === 2) && styles.metricItemBorderRight,
                !isTablet && (i === 0 || i === 1) && styles.metricItemBorderBottom,
              ]}>
                <Ionicons name={m.icon as any} size={12} color={m.col} />
                <Text style={[styles.metricVal, { color: m.col }]}>{m.val}</Text>
                <Text style={styles.metricLbl}>{m.lbl}</Text>
              </View>
              {isTablet && i < arr.length - 1 && <View style={styles.metricSep} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ── Actions ── */}
      <View style={styles.actionsBar}>
        <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: color, shadowColor: color }]} onPress={() => onEdit(plan)}>
          <Ionicons name="create-outline" size={13} color="#FFF" />
          <Text style={styles.btnPrimaryText}>Edit Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGhost} onPress={() => onViewSubscribers(plan)}>
          <Ionicons name="people-outline" size={13} color="#374151" />
          <Text style={styles.btnGhostText}>Subscribers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.kebab} onPress={() => setShowMoreMenu(!showMoreMenu)}>
          <Ionicons name="ellipsis-vertical" size={17} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Inline kebab menu */}
      {showMoreMenu && (
        <View style={styles.moreMenu}>
          {[
            { icon: isActive ? 'pause-circle-outline' : 'play-circle-outline', label: isActive ? 'Deactivate' : 'Activate', col: isActive ? '#DC2626' : '#059669', fn: () => { onToggleStatus(plan); setShowMoreMenu(false); } },
            { icon: 'copy-outline', label: 'Duplicate', col: '#3B82F6', fn: () => { onDuplicate(plan); setShowMoreMenu(false); } },
            { icon: 'trash-outline', label: 'Delete Plan', col: '#DC2626', fn: () => { onDelete(plan); setShowMoreMenu(false); } },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.moreMenuItem} onPress={item.fn}>
              <Ionicons name={item.icon as any} size={15} color={item.col} />
              <Text style={[styles.moreMenuText, { color: item.col }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 2,
  },
  topStripe: { height: 5, width: '100%' },
  popularRibbon: {
    position: 'absolute', top: 5, right: 16, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
  },
  popularText: { fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 0.8 },
  body: { padding: isTablet ? 20 : 14 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  iconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headMeta: { flex: 1, gap: 6 },
  planName: { fontSize: isTablet ? 19 : 17, fontWeight: '800', color: '#111827', letterSpacing: -0.4 },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tierPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tierPillText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  description: { fontSize: 13, color: '#6B7280', lineHeight: 19, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  pricingRow: { flexDirection: 'row', alignItems: 'stretch' },
  priceBlock: { flex: 1, alignItems: 'center', gap: 3 },
  priceSep: { width: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },
  priceLabel: { fontSize: 11, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  priceValue: { fontSize: isTablet ? 22 : 17, fontWeight: '900', letterSpacing: -0.5 },
  priceSub: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  savingsPill: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  savingsText: { fontSize: 10, fontWeight: '700', color: '#059669' },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: isTablet ? 'nowrap' : 'wrap',
    alignItems: isTablet ? 'center' : 'flex-start',
    backgroundColor: '#F9FAFB', borderRadius: 12,
    paddingVertical: isTablet ? 12 : 4,
    paddingHorizontal: 4,
  },
  metricItem: {
    width: isTablet ? undefined : '50%',
    flex: isTablet ? 1 : undefined,
    alignItems: 'center', gap: 3,
    paddingVertical: isTablet ? 0 : 10,
  },
  metricSep: { width: 1, height: 30, backgroundColor: '#E5E7EB' },
  metricItemBorderRight: { borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  metricItemBorderBottom: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  metricVal: { fontSize: isTablet ? 13 : 14, fontWeight: '800', letterSpacing: -0.2 },
  metricLbl: { fontSize: isTablet ? 9 : 10, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  featuresSection: { gap: 2 },
  moreBtn: { paddingTop: 6 },
  moreBtnText: { fontSize: 13, fontWeight: '600' },
  actionsBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingBottom: 14, paddingTop: 4,
  },
  btnPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 10, borderRadius: 24,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 4,
  },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  btnGhost: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 10, borderRadius: 24, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FAFAFA',
  },
  btnGhostText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  kebab: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  moreMenu: {
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    backgroundColor: '#FAFAFA', paddingVertical: 4,
  },
  moreMenuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  moreMenuText: { fontSize: 14, fontWeight: '600' },
});
