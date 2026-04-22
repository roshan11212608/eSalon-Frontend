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
    return matchesSearch;
  });

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
      <View style={shopServicesStyles.mainContainer}>
        <View style={shopServicesStyles.header}>
          <Text style={shopServicesStyles.title}>Shop<Text style={shopServicesStyles.titleAccent}> Services</Text></Text>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={shopServicesStyles.scrollContent}
        >
          <View style={shopServicesStyles.servicesList}>
            {/* Table Header */}
            <View style={shopServicesStyles.tableHeader}>
              <Text style={[shopServicesStyles.tableHeaderText, shopServicesStyles.colSerial]}>S.N</Text>
              <Text style={[shopServicesStyles.tableHeaderText, shopServicesStyles.colName]}>Services Name</Text>
              <Text style={[shopServicesStyles.tableHeaderText, shopServicesStyles.colAmount]}>Amount</Text>
              <Text style={[shopServicesStyles.tableHeaderText, shopServicesStyles.colAction]}>Action</Text>
            </View>

            {filteredServices.map((service, index) => (
              <View key={service.id} style={shopServicesStyles.serviceCard}>
                <Text style={shopServicesStyles.serviceSerial}>{index + 1})</Text>
                <View style={shopServicesStyles.serviceInfo}>
                  <Text style={shopServicesStyles.serviceName}>{service.name}</Text>
                </View>
                <View style={shopServicesStyles.servicePricing}>
                  <Text style={shopServicesStyles.servicePrice}>Rs {service.price}</Text>
                </View>
                <View style={shopServicesStyles.colAction}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteService(service.id);
                    }}
                  >
                    <Ionicons name="trash" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

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
