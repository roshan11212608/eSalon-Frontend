import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from '@/src/modules/employees/styles/employees.styles';
import shopServicesService from '@/src/services/shopServicesService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} style={styles.closeButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Service</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.card}>
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
        </View>
      </ScrollView>
    </View>
  );
}
