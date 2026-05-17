import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { styles } from './styles/salonsList.styles';
import { StatCard } from './components/StatCard';
import { SalonCard } from './components/SalonCard';
import { 
  Salon, 
  SalonStatus, 
  SubscriptionPlan
} from './types/salon.types';
import {
  AdminSalonService,
  buildStatCardsFromSalons,
} from './services/adminSalonService';


export default function AdminSalonsList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SalonStatus | 'all'>('all');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | 'all'>('all');

  const {
    data: salons = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'registered-shops'],
    queryFn: () => AdminSalonService.listRegisteredShops(),
  });

  const statCards = useMemo(() => buildStatCardsFromSalons(salons), [salons]);

  const filteredSalons = useMemo(() => {
    return salons.filter((salon) => {
      const matchesSearch = searchQuery === '' || 
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.owner.phone.includes(searchQuery) ||
        salon.business.phone.includes(searchQuery);

      const matchesStatus = selectedStatus === 'all' || salon.subscription.status === selectedStatus;
      const matchesPlan = selectedPlan === 'all' || salon.subscription.plan === selectedPlan;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [salons, searchQuery, selectedStatus, selectedPlan]);

  const handleSalonAction = (action: string, salon: Salon) => {
    switch (action) {
      case 'view':
        router.push(`/(admin-tabs)/salons/${salon.id}`);
        break;
      case 'edit':
        Alert.alert('Edit Salon', `Edit ${salon.name}`);
        break;
      case 'login':
        Alert.alert('Login as Salon', `Login as ${salon.name}`);
        break;
      case 'more':
        Alert.alert(
          'Choose an action',
          undefined,
          [
            { text: 'Suspend', onPress: () => Alert.alert('Suspend', 'Salon suspended') },
            { text: 'Renew Subscription', onPress: () => Alert.alert('Renew', 'Subscription renewed') },
            { text: 'Delete', onPress: () => Alert.alert('Delete', 'Salon deleted'), style: 'destructive' },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        break;
    }
  };

  const renderSalonCard = ({ item }: { item: Salon }) => (
    <SalonCard 
      salon={item} 
      onPress={(salon) => handleSalonAction('view', salon)}
      onActionPress={handleSalonAction}
    />
  );

  const renderFilterTab = (filter: string, currentValue: string, onPress: () => void, label?: string) => (
    <TouchableOpacity
      style={[
        styles.filterTab,
        currentValue === filter && styles.filterTabActive,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterText,
          currentValue === filter && styles.filterTextActive,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label || filter.charAt(0).toUpperCase() + filter.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Salons Management</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} style={[styles.statCardWrapper, styles.skeletonCard]}>
                  <View style={styles.skeletonHeader}>
                    <View style={styles.skeletonIcon} />
                    <View style={styles.skeletonGrowth} />
                  </View>
                  <View style={styles.skeletonValue} />
                  <View style={styles.skeletonTitle} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.searchSection}>
            <View style={[styles.searchContainer, styles.skeletonCard]}>
              <View style={styles.skeletonSearchIcon} />
              <View style={styles.skeletonSearchInput} />
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterRow}>
              {renderFilterTab('all', selectedStatus, () => setSelectedStatus('all'), 'All')}
              {renderFilterTab('active', selectedStatus, () => setSelectedStatus('active'), 'Active')}
              {renderFilterTab('trial', selectedStatus, () => setSelectedStatus('trial'), 'Trial')}
              {renderFilterTab('expired', selectedStatus, () => setSelectedStatus('expired'), 'Expired')}
              {renderFilterTab('inactive', selectedStatus, () => setSelectedStatus('inactive'), 'Inactive')}
              {renderFilterTab('suspended', selectedStatus, () => setSelectedStatus('suspended'), 'Suspended')}
            </View>

            <View style={styles.planFilterContainer}>
              <Text style={styles.filterLabel}>Plan</Text>
              <View style={styles.filterRow}>
                {renderFilterTab('all', selectedPlan, () => setSelectedPlan('all'), 'All Plans')}
                {renderFilterTab('basic', selectedPlan, () => setSelectedPlan('basic'), 'Basic')}
                {renderFilterTab('professional', selectedPlan, () => setSelectedPlan('professional'), 'Pro')}
                {renderFilterTab('enterprise', selectedPlan, () => setSelectedPlan('enterprise'), 'Enterprise')}
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#780115" />
          <Text style={styles.loadingText}>Loading salons...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Salons Management</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="cloud-offline-outline" size={64} color="#CCCCCC" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>Could not load salons</Text>
          <Text style={styles.emptySubtext}>{error instanceof Error ? error.message : 'Unknown error'}</Text>
          <TouchableOpacity style={{ marginTop: 16, padding: 12 }} onPress={() => refetch()}>
            <Text style={{ color: '#780115', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>Salons <Text style={styles.headerAccent}>Management</Text></Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor="#780115"
          />
        }
      >
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {statCards.map((item) => (
              <View key={item.id} style={styles.statCardWrapper}>
                <StatCard data={item} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#f7b638" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search salons, owners, email, or phone..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.filterRow}>
            {renderFilterTab('all', selectedStatus, () => setSelectedStatus('all'), 'All')}
            {renderFilterTab('active', selectedStatus, () => setSelectedStatus('active'), 'Active')}
            {renderFilterTab('trial', selectedStatus, () => setSelectedStatus('trial'), 'Trial')}
            {renderFilterTab('expired', selectedStatus, () => setSelectedStatus('expired'), 'Expired')}
            {renderFilterTab('inactive', selectedStatus, () => setSelectedStatus('inactive'), 'Inactive')}
            {renderFilterTab('suspended', selectedStatus, () => setSelectedStatus('suspended'), 'Suspended')}
          </View>

          <View style={styles.planFilterContainer}>
            <Text style={styles.filterLabel}>Plan</Text>
            <View style={styles.filterRow}>
              {renderFilterTab('all', selectedPlan, () => setSelectedPlan('all'), 'All Plans')}
              {renderFilterTab('basic', selectedPlan, () => setSelectedPlan('basic'), 'Basic')}
              {renderFilterTab('professional', selectedPlan, () => setSelectedPlan('professional'), 'Pro')}
              {renderFilterTab('enterprise', selectedPlan, () => setSelectedPlan('enterprise'), 'Enterprise')}
            </View>
          </View>
        </View>

        <View style={styles.salonsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Salons</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredSalons.length} / {salons.length}
            </Text>
          </View>

          {filteredSalons.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="storefront-outline" size={64} color="#CCCCCC" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No salons found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredSalons}
              renderItem={renderSalonCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
