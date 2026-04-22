import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import EmployeeService from '@/src/services/employee/EmployeeService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';

export interface NewEmployee {
  name: string;
  email: string;
  phone: string;
  password: string;
  commissionPercentage: string;
  joinDate: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fixedHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  titleUnderline: {
    width: 50,
    height: 3,
    backgroundColor: '#f7b638',
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 8,
    minHeight: 36,
  },
  inputIcon: {
    marginRight: 10,
    backgroundColor: '#fff9e6',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 0,
  },
  helperText: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
  },
  inputWrapperError: {
    borderColor: '#DC2626',
  },
  registerButton: {
    backgroundColor: '#f7b638',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 42,
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
});

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

  const [errors, setErrors] = useState<Partial<Record<keyof NewEmployee, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof NewEmployee, boolean>>>({});

  const validateField = (field: keyof NewEmployee, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!/^[+]?[\d\s\-\(\)]+$/.test(value) || value.length < 10) error = 'Invalid phone number';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'commissionPercentage':
        if (!value.trim()) error = 'Commission is required';
        else if (isNaN(parseFloat(value)) || parseFloat(value) < 0 || parseFloat(value) > 100) error = 'Invalid commission (0-100)';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const handleFieldChange = (field: keyof NewEmployee, value: string) => {
    setNewEmployee(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: keyof NewEmployee, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSaveEmployee = async () => {
    Haptics.notificationAsync();

    // Validate all fields
    const newErrors: Partial<Record<keyof NewEmployee, string>> = {};
    let hasError = false;

    if (!newEmployee.name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    }

    if (!newEmployee.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
      newErrors.email = 'Invalid email format';
      hasError = true;
    }

    if (!newEmployee.phone.trim()) {
      newErrors.phone = 'Phone is required';
      hasError = true;
    } else if (!/^[+]?[\d\s\-\(\)]+$/.test(newEmployee.phone) || newEmployee.phone.length < 10) {
      newErrors.phone = 'Invalid phone number';
      hasError = true;
    }

    if (!newEmployee.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (newEmployee.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (!newEmployee.commissionPercentage.trim()) {
      newErrors.commissionPercentage = 'Commission is required';
      hasError = true;
    } else {
      const commission = parseFloat(newEmployee.commissionPercentage);
      if (isNaN(commission) || commission < 0 || commission > 100) {
        newErrors.commissionPercentage = 'Invalid commission (0-100)';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, phone: true, password: true, commissionPercentage: true });
      return;
    }

    try {
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
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Text style={styles.title}>Add New <Text style={styles.titleAccent}>Employee</Text></Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Employee Information</Text>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.name && touched.name && styles.inputWrapperError]}>
              <View style={styles.inputIcon}>
                <Ionicons name="person-outline" size={20} color="#999999" />
              </View>
              <TextInput
                style={styles.input}
                value={newEmployee.name}
                onChangeText={(text) => handleFieldChange('name', text)}
                onBlur={() => handleFieldBlur('name', newEmployee.name)}
                placeholder="Full name"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>
            {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.email && touched.email && styles.inputWrapperError]}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail-outline" size={20} color="#999999" />
              </View>
              <TextInput
                style={styles.input}
                value={newEmployee.email}
                onChangeText={(text) => handleFieldChange('email', text)}
                onBlur={() => handleFieldBlur('email', newEmployee.email)}
                placeholder="Email (Login ID)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>
            {errors.email && touched.email ? <Text style={styles.errorText}>{errors.email}</Text> : <Text style={styles.helperText}>This email will be used for employee login</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.phone && touched.phone && styles.inputWrapperError]}>
              <View style={styles.inputIcon}>
                <Ionicons name="call-outline" size={20} color="#999999" />
              </View>
              <TextInput
                style={styles.input}
                value={newEmployee.phone}
                onChangeText={(text) => handleFieldChange('phone', text)}
                onBlur={() => handleFieldBlur('phone', newEmployee.phone)}
                placeholder="Mobile number"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>
            {errors.phone && touched.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.password && touched.password && styles.inputWrapperError]}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed-outline" size={20} color="#999999" />
              </View>
              <TextInput
                style={styles.input}
                value={newEmployee.password}
                onChangeText={(text) => handleFieldChange('password', text)}
                onBlur={() => handleFieldBlur('password', newEmployee.password)}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>
            {errors.password && touched.password ? <Text style={styles.errorText}>{errors.password}</Text> : <Text style={styles.helperText}>Minimum 6 characters for secure login</Text>}
          </View>

          <Text style={styles.sectionTitle}>Employment Details</Text>

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, errors.commissionPercentage && touched.commissionPercentage && styles.inputWrapperError]}>
              <View style={styles.inputIcon}>
                <Ionicons name="stats-chart-outline" size={20} color="#999999" />
              </View>
              <TextInput
                style={styles.input}
                value={newEmployee.commissionPercentage}
                onChangeText={(text) => handleFieldChange('commissionPercentage', text)}
                onBlur={() => handleFieldBlur('commissionPercentage', newEmployee.commissionPercentage)}
                placeholder="Commission percentage"
                keyboardType="numeric"
                placeholderTextColor="#999999"
              />
            </View>
            {errors.commissionPercentage && touched.commissionPercentage && <Text style={styles.errorText}>{errors.commissionPercentage}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Ionicons name="calendar-outline" size={20} color="#999999" />
              </View>
              <TextInput
                style={styles.input}
                value={newEmployee.joinDate}
                onChangeText={(text) => setNewEmployee({...newEmployee, joinDate: text})}
                placeholder="Join date (YYYY-MM-DD)"
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSaveEmployee}
          >
            <Text style={styles.registerButtonText}>Create Employee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
