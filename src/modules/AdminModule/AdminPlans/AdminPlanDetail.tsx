import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminPlanService } from './services/adminPlanService';
import { styles } from './styles/planDetail.styles';
import { PlanTier } from './types/plan.types';

const TIER_COLOR: Record<PlanTier, string> = {
  basic: '#6B7280',
  professional: '#D97706',
  enterprise: '#780115',
};

const TIER_ICON: Record<PlanTier, keyof typeof Ionicons.glyphMap> = {
  basic: 'star-outline',
  professional: 'star-half',
  enterprise: 'star',
};

export default function AdminPlanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const numericId = parseInt(id || '0', 10);

  const {
    data: plan,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'plans', numericId],
    queryFn: () => AdminPlanService.getPlanById(numericId),
    enabled: Number.isFinite(numericId) && numericId > 0,
  });

  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  if (!numericId || error || (!isLoading && !plan)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader('Plan Details')}
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Plan not found'}
          </Text>
          {!!error && (
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader('Plan Details')}
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#780115" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plan) return null;

  const tierColor = TIER_COLOR[plan.tier];
  const tierIcon = TIER_ICON[plan.tier];
  const isActive = plan.status === 'active';

  const formatPrice = (price: number) => {
    const symbol = plan.currency === 'INR' ? '₹' : plan.currency;
    return `${symbol}${price.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader('Plan Details')}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          <View style={[styles.heroStripe, { backgroundColor: tierColor }]} />
          <View style={styles.heroBody}>
            <View style={[styles.heroIconRing, { borderColor: tierColor }]}>
              <View style={[styles.heroIconCircle, { backgroundColor: `${tierColor}18` }]}>
                <Ionicons name={tierIcon} size={38} color={tierColor} />
              </View>
            </View>
            <Text style={styles.planName}>{plan.name}</Text>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: `${tierColor}15` }]}>
                <Text style={[styles.badgeText, { color: tierColor }]}>
                  {plan.tier.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: isActive ? '#D1FAE5' : '#F3F4F6' }]}>
                <Text style={[styles.badgeText, { color: isActive ? '#059669' : '#9CA3AF' }]}>
                  {plan.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={[styles.heroPrice, { color: tierColor }]}>
                {formatPrice(plan.monthlyPrice)}
              </Text>
              <Text style={styles.heroPricePeriod}>/month</Text>
            </View>

            {!!plan.description && (
              <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 4 }}>
                {plan.description}
              </Text>
            )}
          </View>
        </View>

        {/* ── Pricing ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardAccent, { backgroundColor: tierColor }]} />
            <Text style={styles.cardTitle}>Pricing</Text>
          </View>
          {[
            {
              icon: 'pricetag-outline' as const,
              color: tierColor,
              label: 'Price',
              value: formatPrice(plan.monthlyPrice),
            },
            {
              icon: 'time-outline' as const,
              color: '#059669',
              label: 'Duration',
              value: `${plan.durationInDays} days`,
            },
            {
              icon: 'cash-outline' as const,
              color: '#7C3AED',
              label: 'Currency',
              value: plan.currency,
            },
          ].map((row) => (
            <View key={row.label} style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: `${row.color}12` }]}>
                <Ionicons name={row.icon} size={16} color={row.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: row.color }]}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Metrics ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardAccent, { backgroundColor: '#7C3AED' }]} />
            <Text style={styles.cardTitle}>Subscription Metrics</Text>
          </View>
          <View style={styles.metricsGrid}>
            {[
              {
                icon: 'people' as const,
                color: '#3B82F6',
                value: String(plan.activeSubscribers),
                label: 'Subscribers',
              },
              {
                icon: 'person-add' as const,
                color: '#059669',
                value: plan.employeeLimit === null ? '∞' : String(plan.employeeLimit),
                label: 'Max Staff',
              },
              {
                icon: 'cash' as const,
                color: '#7C3AED',
                value:
                  plan.activeSubscribers > 0
                    ? (() => {
                        const rev = plan.monthlyPrice * plan.activeSubscribers;
                        return rev >= 100000
                          ? `₹${(rev / 100000).toFixed(1)}L`
                          : rev >= 1000
                          ? `₹${(rev / 1000).toFixed(1)}K`
                          : `₹${rev}`;
                      })()
                    : '—',
                label: 'Monthly Rev.',
              },
              {
                icon: 'layers' as const,
                color: tierColor,
                value: plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1),
                label: 'Tier',
              },
            ].map((m) => (
              <View key={m.label} style={styles.metricBox}>
                <View style={[styles.metricIcon, { backgroundColor: `${m.color}12` }]}>
                  <Ionicons name={m.icon} size={20} color={m.color} />
                </View>
                <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionPill, { backgroundColor: tierColor, shadowColor: tierColor }]}
            onPress={() => Alert.alert('Edit Plan', `Edit ${plan.name}`)}
          >
            <Ionicons name="create" size={18} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Edit Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionPillOutline}
            onPress={() =>
              Alert.alert(
                isActive ? 'Deactivate Plan' : 'Activate Plan',
                `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} ${plan.name}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: isActive ? 'Deactivate' : 'Activate',
                    style: isActive ? 'destructive' : 'default',
                    onPress: () => Alert.alert('Updated', `${plan.name} has been ${isActive ? 'deactivated' : 'activated'}`),
                  },
                ]
              )
            }
          >
            <Ionicons
              name={isActive ? 'pause-circle-outline' : 'play-circle-outline'}
              size={18}
              color={isActive ? '#DC2626' : '#059669'}
            />
            <Text style={[styles.actionPillOutlineText, { color: isActive ? '#DC2626' : '#059669' }]}>
              {isActive ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
