import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/employees.styles';
import EmployeesList from './employeesList';
import EmployeeService, { Employee as EmployeeType } from '@/src/services/employee/EmployeeService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';

export default function Employees() {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [employeeToReactivate, setEmployeeToReactivate] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');

  // Get auth state using hook for reactive updates
  const authState = useAuthStore();

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                         (employee.email?.toLowerCase() || '').includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get shopId from logged-in user to filter employees by shop
      const shopId = authState.user?.shopId;
      
      if (!shopId) {
        console.error('No shopId found in auth state');
        Alert.alert('Error', 'Shop information not found');
        setEmployees([]);
        return;
      }
      
      const data = await EmployeeService.getEmployeesByShop(Number(shopId));
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      Alert.alert('Error', 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  }, [authState]);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Refresh employees when screen comes into focus (after navigating back from details page)
  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [fetchEmployees])
  );

  const handleAddEmployee = () => {
    Haptics.notificationAsync();
    router.push('/employees/addEmployees');
  };

  const handleDeleteEmployee = (id: string) => {
    console.log('Delete button pressed for employee ID:', id);
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
  };

  const handleReactivateEmployee = (id: string) => {
    console.log('Reactivate button pressed for employee ID:', id);
    setEmployeeToReactivate(id);
    setShowReactivateModal(true);
  };

  const confirmReactivateEmployee = async () => {
    if (!employeeToReactivate) return;
    try {
      await EmployeeService.reactivateEmployee(employeeToReactivate);
      console.log('Employee reactivated, refreshing list');
      fetchEmployees();
      setShowReactivateModal(false);
      setEmployeeToReactivate(null);
      setSuccessMessage('Employee reactivated successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error reactivating employee:', error);
      Alert.alert('Error', 'Failed to reactivate employee');
    }
  };

  const cancelReactivateEmployee = () => {
    setShowReactivateModal(false);
    setEmployeeToReactivate(null);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      await EmployeeService.deleteEmployee(employeeToDelete);
      console.log('Employee deleted, refreshing list');
      fetchEmployees(); // Refresh the list
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const cancelDeleteEmployee = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleEmployeePress = (employee: EmployeeType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/employees/employeesList?id=${employee.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading employees...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Logo Section */}
          {/* <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="people" size={40} color="#f7b638" />
            </View>
            <Text style={styles.logoText}>Employees</Text>
            <Text style={styles.tagline}>Manage Your Team</Text>
          </View> */}

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Employees</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
              <Ionicons name="add" size={20} style={styles.addButtonIcon} />
            </TouchableOpacity>
          </View>

          {/* Employees Card */}
          <View style={styles.card}>

            <View style={styles.searchSection}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search employees..."
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholderTextColor={styles.searchInputPlaceholder.color}
                />
              </View>
            </View>

            <EmployeesList
              employees={filteredEmployees}
              onEmployeePress={handleEmployeePress}
              onDeleteEmployee={handleDeleteEmployee}
              onReactivateEmployee={handleReactivateEmployee}
            />
          </View>
        </ScrollView>
      </View>

      {showSuccess && (
        <View style={styles.successMessage}>
          <Ionicons name="checkmark-circle" size={20} color="white" style={styles.successMessageIcon} />
          <Text style={styles.successMessageText}>
            {successMessage}
          </Text>
        </View>
      )}

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDeleteEmployee}
      >
        <View style={styles.confirmationModalOverlay}>
          <View style={styles.confirmationModalContent}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={[styles.confirmationModalIconContainer, styles.confirmationModalButtonDelete]}>
                <Ionicons name="trash" size={32} color="#DC2626" />
              </View>
              <Text style={styles.confirmationModalTitle}>
                Delete Employee
              </Text>
              <Text style={styles.confirmationModalDescription}>
                Are you sure you want to delete this employee? This action cannot be undone.
              </Text>
            </View>
            <View style={styles.confirmationModalButtons}>
              <TouchableOpacity
                style={[styles.confirmationModalButton, styles.confirmationModalButtonCancel]}
                onPress={cancelDeleteEmployee}
              >
                <Text style={[styles.confirmationModalButtonText, styles.confirmationModalButtonTextCancel]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationModalButton, styles.confirmationModalButtonDelete]}
                onPress={confirmDeleteEmployee}
              >
                <Text style={[styles.confirmationModalButtonText, styles.confirmationModalButtonTextWhite]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showReactivateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelReactivateEmployee}
      >
        <View style={styles.confirmationModalOverlay}>
          <View style={styles.confirmationModalContent}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={[styles.confirmationModalIconContainer, styles.confirmationModalButtonReactivate]}>
                <Ionicons name="refresh" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.confirmationModalTitle}>
                Re-activate Employee
              </Text>
              <Text style={styles.confirmationModalDescription}>
                Are you sure you want to re-activate this employee? They will be able to login again.
              </Text>
            </View>
            <View style={styles.confirmationModalButtons}>
              <TouchableOpacity
                style={[styles.confirmationModalButton, styles.confirmationModalButtonCancel]}
                onPress={cancelReactivateEmployee}
              >
                <Text style={[styles.confirmationModalButtonText, styles.confirmationModalButtonTextCancel]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationModalButton, styles.confirmationModalButtonReactivate]}
                onPress={confirmReactivateEmployee}
              >
                <Text style={[styles.confirmationModalButtonText, styles.confirmationModalButtonTextWhite]}>
                  Re-activate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
