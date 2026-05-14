import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminSalonService } from './services/adminSalonService';
import { styles } from './styles/salonDetail.styles';

export default function AdminSalonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const numericId = parseInt(id || '0', 10);

  const {
    data: salon,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'registered-shops', numericId],
    queryFn: () => AdminSalonService.getRegisteredShopById(numericId),
    enabled: Number.isFinite(numericId) && numericId > 0,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':    return { solid: '#059669', bg: '#D1FAE5', text: '#059669' };
      case 'trial':     return { solid: '#3B82F6', bg: '#EFF6FF', text: '#3B82F6' };
      case 'expired':   return { solid: '#DC2626', bg: '#FEE2E2', text: '#DC2626' };
      case 'suspended': return { solid: '#EA580C', bg: '#FFF7ED', text: '#EA580C' };
      default:          return { solid: '#9CA3AF', bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'enterprise':   return '#780115';
      case 'professional': return '#D97706';
      default:             return '#6B7280';
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  if (!numericId || error || (!isLoading && !salon)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader('Salon Details')}
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Salon not found'}
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
        {renderHeader('Salon Details')}
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#780115" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(salon.subscription.status);
  const planColor = getPlanColor(salon.subscription.plan);
  const initials = getInitials(salon.name);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader('Salon Details')}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          <View style={[styles.heroStripe, { backgroundColor: statusColor.solid }]} />
          <View style={styles.heroBody}>
            <View style={[styles.avatarRing, { borderColor: statusColor.solid }]}>
              <View style={[styles.avatarCircle, { backgroundColor: `${statusColor.solid}18` }]}>
                <Text style={[styles.avatarText, { color: statusColor.solid }]}>{initials}</Text>
              </View>
            </View>
            <Text style={styles.salonName}>{salon.name}</Text>
            <View style={styles.shopIdRow}>
              <Ionicons name="pricetag-outline" size={12} color="#9CA3AF" />
              <Text style={styles.shopIdLabel}>Shop Id: </Text>
              <Text style={styles.shopIdValue}>{salon.shopId}</Text>
            </View>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
                <Text style={[styles.badgeText, { color: statusColor.text }]}>
                  {salon.subscription.status.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: `${planColor}18` }]}>
                <Text style={[styles.badgeText, { color: planColor, textTransform: 'capitalize' }]}>
                  {salon.subscription.plan}
                </Text>
              </View>
              {salon.isVerified && (
                <View style={[styles.badge, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="checkmark-circle" size={11} color="#059669" />
                  <Text style={[styles.badgeText, { color: '#059669' }]}>Verified</Text>
                </View>
              )}
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateChip}>Joined {salon.dates.joinedDate}</Text>
              <Text style={styles.dateChip}>Active {salon.dates.lastActive}</Text>
            </View>
          </View>
        </View>

        {/* ── Owner ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardAccent, { backgroundColor: '#780115' }]} />
            <Text style={styles.cardTitle}>Owner Information</Text>
          </View>
          {[
            { icon: 'person' as const,  color: '#780115', label: 'Name',  value: salon.owner.name },
            { icon: 'mail' as const,    color: '#3B82F6', label: 'Email', value: salon.owner.email },
            { icon: 'call' as const,    color: '#059669', label: 'Phone', value: salon.owner.phone },
          ].map((row) => (
            <View key={row.label} style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: `${row.color}12` }]}>
                <Ionicons name={row.icon} size={16} color={row.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Business ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardAccent, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.cardTitle}>Business Details</Text>
          </View>
          {[
            { icon: 'mail' as const,     color: '#3B82F6', label: 'Email',    value: salon.business.email },
            { icon: 'call' as const,     color: '#059669', label: 'Phone',    value: salon.business.phone },
            { icon: 'location' as const, color: '#EA580C', label: 'Address',  value: salon.business.address },
            { icon: 'map' as const,      color: '#7C3AED', label: 'Location', value: `${salon.business.city}, ${salon.business.state}` },
          ].map((row) => (
            <View key={row.label} style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: `${row.color}12` }]}>
                <Ionicons name={row.icon} size={16} color={row.color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Subscription ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardAccent, { backgroundColor: planColor }]} />
            <Text style={styles.cardTitle}>Subscription</Text>
          </View>
          {[
            { icon: 'card' as const,     color: planColor,  label: 'Plan',        value: salon.subscription.plan },
            { icon: 'cash' as const,     color: '#059669',  label: 'Monthly Fee', value: salon.subscription.monthlyFee },
            { icon: 'calendar' as const, color: '#6B7280',  label: 'Expiry Date', value: salon.subscription.expiryDate },
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
            <Text style={styles.cardTitle}>Performance Metrics</Text>
          </View>
          {[
            { icon: 'people' as const,     color: '#780115', label: 'Staff Count',         value: String(salon.metrics.staffCount) },
            { icon: 'cash' as const,       color: '#059669', label: 'Monthly Revenue',     value: String(salon.metrics.monthlyRevenue) },
            { icon: 'calendar' as const,   color: '#3B82F6', label: 'Total Appointments',  value: String(salon.metrics.totalAppointments) },
            { icon: 'person-add' as const, color: '#D97706', label: 'Active Clients',      value: String(salon.metrics.activeClients) },
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

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionPill, { backgroundColor: '#780115' }]}>
            <Ionicons name="call" size={18} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Call Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionPill, { backgroundColor: '#1D4ED8' }]}>
            <Ionicons name="mail" size={18} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Send Email</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
