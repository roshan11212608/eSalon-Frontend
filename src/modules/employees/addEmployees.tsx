import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/addEmployees.styles';

export interface NewEmployee {
  name: string;
  email: string;
  phone: string;
  password: string;
  commissionPercentage: string;
  joinDate: string;
  // shopId, shopName, shopAddress removed - backend will derive from authenticated user for security
}

interface AddEmployeesProps {
  visible: boolean;
  onClose: () => void;
  onSave: (employee: NewEmployee) => void;
}

export default function AddEmployees({ visible, onClose, onSave }: AddEmployeesProps) {
  const [newEmployee, setNewEmployee] = useState<NewEmployee>({
    name: '',
    email: '',
    phone: '',
    password: '',
    commissionPercentage: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Shop data fetching removed - backend will derive shop from authenticated user for security
  // No longer needed as backend uses getCurrentUserShop() method

  const handleSaveEmployee = () => {
    Haptics.notificationAsync();
    
    // Basic validation
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone || !newEmployee.password || !newEmployee.commissionPercentage) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation for login credentials
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.email)) {
      Alert.alert('Error', 'Please enter a valid email address for login');
      return;
    }

    // Password validation for security
    if (newEmployee.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(newEmployee.phone) || newEmployee.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Commission validation
    const commission = parseFloat(newEmployee.commissionPercentage);
    if (isNaN(commission) || commission < 0 || commission > 100) {
      Alert.alert('Error', 'Commission percentage must be between 0 and 100');
      return;
    }

    onSave(newEmployee);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      password: '',
      commissionPercentage: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleCancelAdd = () => {
    Haptics.notificationAsync();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancelAdd}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelAdd} style={styles.closeButton}>
              <Ionicons name="close" size={24} style={styles.closeButtonIcon} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Employee</Text>
            <View style={{ width: 32 }} />
          </View>
          
          <ScrollView 
            style={styles.modalScroll} 
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formLabel}>Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter employee name"
              value={newEmployee.name}
              onChangeText={(text) => setNewEmployee({...newEmployee, name: text})}
            />

            <Text style={styles.formLabel}>Email (Login ID)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.formInput, { flex: 1, borderWidth: 0 }]}
                placeholder="employee@example.com"
                value={newEmployee.email}
                onChangeText={(text) => setNewEmployee({...newEmployee, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.helperText}>This email will be used for employee login</Text>

            <Text style={styles.formLabel}>Phone</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter phone number"
              value={newEmployee.phone}
              onChangeText={(text) => setNewEmployee({...newEmployee, phone: text})}
              keyboardType="phone-pad"
            />

            <Text style={styles.formLabel}>Password (Login Password)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.formInput, { flex: 1, borderWidth: 0 }]}
                placeholder="Enter secure password"
                value={newEmployee.password}
                onChangeText={(text) => setNewEmployee({...newEmployee, password: text})}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.helperText}>Minimum 6 characters for secure login</Text>

            <Text style={styles.formLabel}>Commission Percentage (%)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter commission percentage"
              value={newEmployee.commissionPercentage}
              onChangeText={(text) => setNewEmployee({...newEmployee, commissionPercentage: text})}
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Join Date</Text>
            <TextInput
              style={styles.formInput}
              value={newEmployee.joinDate}
              onChangeText={(text) => setNewEmployee({...newEmployee, joinDate: text})}
              placeholder="YYYY-MM-DD"
              defaultValue={new Date().toISOString().split('T')[0]}
            />

            {/* Shop fields removed - backend will derive shop from authenticated user for security */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEmployee}>
              <Text style={styles.saveButtonText}>Save Employee</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
