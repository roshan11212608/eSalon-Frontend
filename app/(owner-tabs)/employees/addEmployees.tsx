import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from '@/src/modules/employees/styles/employees.styles';
import EmployeeService, { NewEmployee } from '@/src/services/employee/EmployeeService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';

export default function AddEmployees() {
  const router = useRouter();
  const authState = useAuthStore();
  
  const [newEmployee, setNewEmployee] = useState<NewEmployee>({
    name: '',
    email: '',
    phone: '',
    password: '',
    commissionPercentage: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleSaveEmployee = async () => {
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

    try {
      // Get shop data from logged-in user
      const shopId = authState.user?.shopId;
      
      await EmployeeService.createEmployee({
        ...newEmployee,
        shopId: shopId,
      });
      
      Alert.alert('Success', 'Employee added successfully');
      router.back();
    } catch (error) {
      console.error('Error creating employee:', error);
      Alert.alert('Error', 'Failed to add employee');
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
        <Text style={styles.title}>Add New Employee</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.card}>
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

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEmployee}>
            <Text style={styles.saveButtonText}>Save Employee</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
