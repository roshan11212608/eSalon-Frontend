import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import shopServicesService from '@/src/services/shopServicesService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';
import { styles } from './styles/addNewServices.styles';

export default function AddNewServices() {
  const router = useRouter();
  const authState = useAuthStore();

  const [newService, setNewService] = useState({
    name: '',
    price: '',
    icon: 'cut'
  });

  const handleSaveService = async () => {
    Haptics.notificationAsync();

    if (!newService.name || !newService.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const shopId = authState.user?.shopId;

      await shopServicesService.createService({
        name: newService.name,
        price: parseFloat(newService.price),
        durationMinutes: 30,
        description: 'Professional service',
        isActive: true,
        shopId: shopId,
      });

      Alert.alert('Success', 'Service added successfully!');
      router.back();
    } catch (error) {
      console.error('Error creating service:', error);
      Alert.alert('Error', 'Failed to add service');
    }
  };

  const handleCancel = () => {
    Haptics.notificationAsync();
    router.back();
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add New <Text style={styles.modalTitleAccent}>Services</Text></Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#f7b638" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.modalContent}
      >
        <Text style={styles.formLabel}>Service Name</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter service name"
          value={newService.name}
          onChangeText={(text) => setNewService({...newService, name: text})}
        />

        <Text style={styles.formLabel}>Price (Rs)</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter price"
          value={newService.price}
          onChangeText={(text) => setNewService({...newService, price: text})}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveService}>
          <Text style={styles.saveButtonText}>Save Service</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}