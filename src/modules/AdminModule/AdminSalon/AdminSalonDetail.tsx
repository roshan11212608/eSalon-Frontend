import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from './styles/salonDetail.styles';

type SalonStatus = 'active' | 'inactive' | 'pending';

interface Salon {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  plan: string;
  status: SalonStatus;
  revenue: string;
  joinedDate: string;
  staffCount: number;
}

const mockSalons: Salon[] = [
  {
    id: 1,
    name: 'Glamour Salon',
    owner: 'Priya Sharma',
    email: 'priya@glamour.com',
    phone: '+91 98765 43210',
    plan: 'Professional',
    status: 'active',
    revenue: '₹45,000',
    joinedDate: '2024-01-15',
    staffCount: 8,
  },
  {
    id: 2,
    name: 'Style Studio',
    owner: 'Rahul Mehta',
    email: 'rahul@stylestudio.com',
    phone: '+91 98765 43211',
    plan: 'Basic',
    status: 'active',
    revenue: '₹28,000',
    joinedDate: '2024-02-20',
    staffCount: 5,
  },
  {
    id: 3,
    name: 'Beauty Hub',
    owner: 'Sneha Patel',
    email: 'sneha@beautyhub.com',
    phone: '+91 98765 43212',
    plan: 'Enterprise',
    status: 'pending',
    revenue: '₹0',
    joinedDate: '2024-03-10',
    staffCount: 3,
  },
  {
    id: 4,
    name: 'Elegant Cuts',
    owner: 'Amit Singh',
    email: 'amit@elegantcuts.com',
    phone: '+91 98765 43213',
    plan: 'Professional',
    status: 'active',
    revenue: '₹52,000',
    joinedDate: '2023-12-05',
    staffCount: 12,
  },
  {
    id: 5,
    name: 'Royal Spa',
    owner: 'Neha Kapoor',
    email: 'neha@royalspa.com',
    phone: '+91 98765 43214',
    plan: 'Enterprise',
    status: 'active',
    revenue: '₹78,000',
    joinedDate: '2023-11-20',
    staffCount: 15,
  },
  {
    id: 6,
    name: 'Quick Trim',
    owner: 'Vikram Joshi',
    email: 'vikram@quicktrim.com',
    phone: '+91 98765 43215',
    plan: 'Basic',
    status: 'inactive',
    revenue: '₹12,000',
    joinedDate: '2024-01-28',
    staffCount: 2,
  },
];

export default function AdminSalonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const salon = mockSalons.find((s) => s.id === parseInt(id || '0'));

  if (!salon) {
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
          <Text style={styles.errorText}>Salon not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: SalonStatus) => {
    switch (status) {
      case 'active':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'inactive':
        return { bg: '#FEE2E2', text: '#DC2626' };
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return '#780115';
      case 'Professional':
        return '#f7b638';
      case 'Basic':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const statusColor = getStatusColor(salon.status);
  const planColor = getPlanColor(salon.plan);

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
        {/* Salon Icon */}
        <View style={styles.iconSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="storefront" size={48} color="#780115" />
          </View>
        </View>

        {/* Salon Name & Status */}
        <View style={styles.section}>
          <Text style={styles.salonName}>{salon.name}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {salon.status.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.planBadge, { backgroundColor: `${planColor}20` }]}>
              <Text style={[styles.planText, { color: planColor }]}>
                {salon.plan}
              </Text>
            </View>
          </View>
        </View>

        {/* Owner Info */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Owner Information</Text>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person" size={20} color="#780115" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{salon.owner}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="mail" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{salon.email}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{salon.phone}</Text>
            </View>
          </View>
        </View>

        {/* Business Info */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Business Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={20} color={planColor} />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Subscription Plan</Text>
              <Text style={[styles.value, { color: planColor }]}>{salon.plan}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="cash" size={20} color="#10B981" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Total Revenue</Text>
              <Text style={styles.value}>{salon.revenue}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="people" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Staff Members</Text>
              <Text style={styles.value}>{salon.staffCount}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color="#6B7280" />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Joined Date</Text>
              <Text style={styles.value}>{salon.joinedDate}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
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
