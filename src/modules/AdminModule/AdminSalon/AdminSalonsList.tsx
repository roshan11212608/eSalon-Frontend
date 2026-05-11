import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles/salonsList.styles';
import { StatCard } from './components/StatCard';
import { SalonCard } from './components/SalonCard';
import { 
  Salon, 
  SalonStatus, 
  SubscriptionPlan
} from './types/salon.types';
import { mockSalons, statCards } from './data/mockData';


export default function AdminSalonsList({ navigation }: any = {}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SalonStatus | 'all'>('all');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter salons based on search and filters
  const filteredSalons = useMemo(() => {
    return mockSalons.filter((salon) => {
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
  }, [searchQuery, selectedStatus, selectedPlan]);

    
  // Handle salon actions
  const handleSalonAction = (action: string, salon: Salon) => {
    console.log('handleSalonAction called:', action, salon.name);
    console.log('Router available:', !!router);
    switch (action) {
      case 'view':
        console.log('View action triggered');
        console.log('Navigating to:', `/AdminSalonDetail?id=${salon.id}`);
        // Use Expo Router to navigate to AdminSalonDetail with salon ID
        router.push(`/AdminSalonDetail?id=${salon.id}`);
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
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Salons Management</Text>
        </View>
        
        <View style={styles.content}>
          {/* Skeleton Stats Cards */}
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

          {/* Skeleton Search */}
          <View style={styles.searchSection}>
            <View style={[styles.searchContainer, styles.skeletonCard]}>
              <View style={styles.skeletonSearchIcon} />
              <View style={styles.skeletonSearchInput} />
            </View>
          </View>

          {/* Skeleton Filters */}
          <View style={styles.filterSection}>
            <View style={[styles.filterContainer, styles.skeletonCard]}>
              <View style={styles.skeletonFilterRow}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <View key={item} style={styles.skeletonFilterTab} />
                ))}
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#780115" />
          <Text style={styles.loadingText}>Loading amazing salons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render salon list view
  const renderSalonList = () => {
    console.log('renderSalonList called');
    return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salons Management</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {statCards.map((item) => (
              <View key={item.id} style={styles.statCardWrapper}>
                <StatCard data={item} />
              </View>
            ))}
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
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

        {/* Filter Section */}
        <View style={styles.filterSection}>
          {/* Status Filters */}
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
              {renderFilterTab('all', selectedStatus, () => setSelectedStatus('all'), 'All')}
              {renderFilterTab('active', selectedStatus, () => setSelectedStatus('active'), 'Active')}
              {renderFilterTab('trial', selectedStatus, () => setSelectedStatus('trial'), 'Trial')}
            </View>
            <View style={styles.filterRow}>
              {renderFilterTab('expired', selectedStatus, () => setSelectedStatus('expired'), 'Expired')}
              {renderFilterTab('inactive', selectedStatus, () => setSelectedStatus('inactive'), 'Inactive')}
              {renderFilterTab('suspended', selectedStatus, () => setSelectedStatus('suspended'), 'Suspended')}
            </View>
          </View>

          {/* Plan Filters */}
          <View style={styles.planFilterContainer}>
            <Text style={styles.filterLabel}>Subscription Plan</Text>
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                {renderFilterTab('all', selectedPlan, () => setSelectedPlan('all'), 'All Plans')}
                {renderFilterTab('basic', selectedPlan, () => setSelectedPlan('basic'), 'Basic')}
                {renderFilterTab('professional', selectedPlan, () => setSelectedPlan('professional'), 'Professional')}
                {renderFilterTab('enterprise', selectedPlan, () => setSelectedPlan('enterprise'), 'Enterprise')}
              </View>
            </View>
          </View>
        </View>

        {/* Salons List */}
        <View style={styles.salonsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              All Salons ({filteredSalons.length})
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredSalons.length} of {mockSalons.length} salons
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
    </SafeAreaView>
    );
  };

  // Main return statement - render salon list
  return renderSalonList();
}
