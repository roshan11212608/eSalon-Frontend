import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { shopServicesStyles } from './styles/shopServices.styles';
import shopServicesService from '@/src/services/shopServicesService';
import { useAuthStore } from '../../shared/hooks/useAuthStore';

export default function Services() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get shopId from auth store using hook for reactive updates
  const authState = useAuthStore();
  const shopId = authState.user?.shopId;

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching services with shopId:', shopId);
      const data = await shopServicesService.getServicesByShopId(shopId || '');
      console.log('Services fetched:', data);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Refresh services when screen comes into focus (after navigating back from add page)
  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [fetchServices])
  );

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Hair Services', 'Skin Care', 'Massage'];

  const handleAddService = () => {
    Haptics.notificationAsync();
    router.push('/shopServices/addNewServices');
  };

  const handleDeleteService = (id: number) => {
    setServiceToDelete(String(id));
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      await shopServicesService.deleteService(Number(serviceToDelete));
      setServices(services.filter(service => service.id !== Number(serviceToDelete)));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const cancelDeleteService = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  if (loading) {
    return (
      <View style={shopServicesStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={shopServicesStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={shopServicesStyles.scrollContent}
      >
      <View style={shopServicesStyles.header}>
        <Text style={shopServicesStyles.title}>Shop Services</Text>
        <TouchableOpacity style={shopServicesStyles.addButton} onPress={handleAddService}>
          <Ionicons name="add" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <View style={shopServicesStyles.searchSection}>
        <View style={shopServicesStyles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={shopServicesStyles.searchInput}
            placeholder="Search services..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={shopServicesStyles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                shopServicesStyles.categoryChip,
                selectedCategory === category && shopServicesStyles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                shopServicesStyles.categoryChipText,
                selectedCategory === category && shopServicesStyles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={shopServicesStyles.servicesList}>
        {filteredServices.map(service => (
          <View key={service.id} style={shopServicesStyles.serviceCard}>
            <View style={shopServicesStyles.serviceHeader}>
              <View style={shopServicesStyles.serviceIconContainer}>
                <View style={[shopServicesStyles.serviceIcon, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name={service.icon as any} size={20} color="#FFFFFF" />
                </View>
              </View>
              <View style={shopServicesStyles.serviceInfo}>
                <Text style={shopServicesStyles.serviceName}>{service.name}</Text>
                <Text style={shopServicesStyles.serviceCategory}>{service.category}</Text>
                <Text style={shopServicesStyles.serviceDescription}>{service.description}</Text>
              </View>
              <View style={shopServicesStyles.servicePricing}>
                <Text style={shopServicesStyles.servicePrice}>Rs {service.price}</Text>
                <Text style={shopServicesStyles.serviceDuration}>{service.durationMinutes} min</Text>
              </View>
            </View>

            <View style={shopServicesStyles.serviceFooter}>
              <TouchableOpacity
                style={shopServicesStyles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteService(service.id);
                }}
              >
                <Ionicons name="trash" size={16} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDeleteService}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 320,
          }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#FEE2E2',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <Ionicons name="trash" size={32} color="#DC2626" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8 }}>
                Delete Service
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                Are you sure you want to delete this service? This action cannot be undone.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                }}
                onPress={cancelDeleteService}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                }}
                onPress={confirmDeleteService}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
