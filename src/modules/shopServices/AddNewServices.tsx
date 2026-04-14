import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/addNewServices.styles';

interface AddNewServicesProps {
  visible: boolean;
  onClose: () => void;
  onSave: (service: {
    name: string;
    price: number;
    category: string;
    duration: string;
    description: string;
    icon: string;
    status: string;
  }) => void;
}

export default function AddNewServices({ visible, onClose, onSave }: AddNewServicesProps) {
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    icon: 'cut'
  });

  const handleSaveService = () => {
    Haptics.notificationAsync();
    if (!newService.name || !newService.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const serviceToAdd = {
      name: newService.name,
      price: parseFloat(newService.price),
      category: 'Hair Services',
      duration: '30 min',
      description: 'Professional service',
      icon: newService.icon,
      status: 'active'
    };

    onSave(serviceToAdd);
    setNewService({
      name: '',
      price: '',
      icon: 'cut'
    });
    Alert.alert('Success', 'Service added successfully!');
  };

  const handleCancelAdd = () => {
    Haptics.notificationAsync();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleCancelAdd}>
            <Ionicons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Service</Text>
        </View>
        <View style={styles.modalContent}>
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
      </View>
    </Modal>
  );
}