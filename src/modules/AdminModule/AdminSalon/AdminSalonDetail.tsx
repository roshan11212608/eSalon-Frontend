import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { styles } from './styles/salonDetail.styles';
import { AdminSalonService } from './services/adminSalonService';

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
      case 'active':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'pending':
      case 'trial':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'inactive':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'enterprise':
        return '#780115';
      case 'professional':
        return '#f7b638';
      case 'basic':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  if (!numericId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Salon Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
          <Text style={styles.errorText}>Invalid salon</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Salon Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#780115" />
          <Text style={[styles.errorText, { marginTop: 12 }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !salon) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Salon Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#DC2626" />
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Salon not found'}
          </Text>
          <TouchableOpacity style={{ marginTop: 16 }} onPress={() => refetch()}>
            <Text style={{ color: '#780115', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(salon.subscription.status);
  const planColor = getPlanColor(salon.subscription.plan);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Salon Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="pencil" size={20} color="#780115" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.iconSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="storefront" size={48} color="#780115" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.salonName}>{salon.name}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {salon.subscription.status.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.planBadge, { backgroundColor: `${planColor}20` }]}>
              <Text style={[styles.planText, { color: planColor }]}>
                {salon.subscription.plan}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Owner Information</Text>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person" size={20} color="#780115" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{salon.owner.name}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="mail" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{salon.owner.email}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{salon.owner.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Business Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="business" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{salon.business.email}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{salon.business.phone}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{salon.business.address}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="map" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{salon.business.city}, {salon.business.state}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Subscription Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={20} color={planColor} />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Plan</Text>
              <Text style={[styles.value, { color: planColor }]}>{salon.subscription.plan}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="cash" size={20} color="#10B981" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Monthly Fee</Text>
              <Text style={styles.value}>{salon.subscription.monthlyFee}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Expiry Date</Text>
              <Text style={styles.value}>{salon.subscription.expiryDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Performance Metrics</Text>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="people" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Staff Count</Text>
              <Text style={styles.value}>{salon.metrics.staffCount}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Monthly Revenue</Text>
              <Text style={styles.value}>{salon.metrics.monthlyRevenue}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Total Appointments</Text>
              <Text style={styles.value}>{salon.metrics.totalAppointments}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="people" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Active Clients</Text>
              <Text style={styles.value}>{salon.metrics.activeClients}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Call Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Send Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
