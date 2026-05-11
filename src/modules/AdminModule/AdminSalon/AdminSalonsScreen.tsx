import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './styles/salonsScreen.styles';

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

export default function AdminSalonsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SalonStatus | 'all'>('all');

  const filteredSalons = useMemo(() => {
    return mockSalons.filter((salon) => {
      const matchesSearch =
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || salon.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

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

  const SalonCard = ({ salon }: { salon: Salon }) => {
    const statusColor = getStatusColor(salon.status);
    const planColor = getPlanColor(salon.plan);

    return (
      <TouchableOpacity
        style={styles.salonCard}
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/salons/[id]', params: { id: String(salon.id) } })}
      >
        <View style={styles.salonHeader}>
          <View style={styles.salonIcon}>
            <Ionicons name="storefront" size={24} color="#780115" />
          </View>
          <View style={styles.salonHeaderContent}>
            <Text style={styles.salonName}>{salon.name}</Text>
            <Text style={styles.salonOwner}>{salon.owner}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {salon.status}
            </Text>
          </View>
        </View>

        <View style={styles.salonDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="card" size={16} color={planColor} />
            <Text style={[styles.detailText, { color: planColor }]}>{salon.plan}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash" size={16} color="#10B981" />
            <Text style={styles.detailText}>{salon.revenue}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{salon.staffCount} Staff</Text>
          </View>
        </View>

        <View style={styles.salonFooter}>
          <View style={styles.contactInfo}>
            <Ionicons name="mail" size={14} color="#9CA3AF" />
            <Text style={styles.contactText}>{salon.email}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Ionicons name="call" size={14} color="#9CA3AF" />
            <Text style={styles.contactText}>{salon.phone}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salons</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons or owners..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'pending', 'inactive'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                selectedStatus === status && styles.filterTabActive,
              ]}
              onPress={() => setSelectedStatus(status)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === status && styles.filterTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Salon List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              All Salons ({filteredSalons.length})
            </Text>
          </View>

          {filteredSalons.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="storefront-outline" size={64} color="#CCCCCC" />
              <Text style={styles.emptyText}>No salons found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filteredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
