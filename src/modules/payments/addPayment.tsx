import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/addPayment.styles';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';
import { PaymentService, PaymentType, PaymentMethod } from '@/src/services/paymentService';
import EmployeeService from '@/src/services/employee/EmployeeService';
import Loader from '@/src/shared/components/Loader';
import FullScreenLoader from '@/src/shared/components/FullScreenLoader';

export default function AddPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const authState = useAuthStore();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<{ id: string; name: string; commissionRate: number } | null>(null);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [staffList, setStaffList] = useState<{ id: string; name: string; commissionRate: number }[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    commissionRate: '',
    paymentMethod: 'cash' as PaymentMethod,
    date: new Date().toISOString(),
    remarks: '',
  });

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const fetchStaff = useCallback(async () => {
    try {
      setLoadingStaff(true);
      const shopId = authState.user?.shopId;
      
      if (!shopId) {
        console.error('No shopId found in auth state');
        Alert.alert('Error', 'Shop ID not found. Please log in again.');
        setStaffList([]);
        return;
      }
      
      const data = await EmployeeService.getEmployeesByShop(Number(shopId));
      
      if (!data || data.length === 0) {
        console.warn('No employees returned from API');
        Alert.alert('Info', 'No employees found for your shop. Please add employees first.');
        setStaffList([]);
        return;
      }
      
      // Transform employee data to dropdown format
      const staffOptions = data
        .map(emp => ({
          id: emp.id,
          name: emp.name,
          commissionRate: emp.commissionPercentage || 0
        }));
      
      setStaffList(staffOptions);
    } catch (error) {
      console.error('Error fetching staff:', error);
      Alert.alert('Error', `Failed to load staff: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStaffList([]);
    } finally {
      setLoadingStaff(false);
    }
  }, [authState.user?.shopId]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Auto-fill data when coming from payment report
  useEffect(() => {
    if (params.employeeId && params.employeeName && params.amount && staffList.length > 0) {
      const employee = staffList.find(emp => emp.id.toString() === params.employeeId);
      
      if (employee) {
        setSelectedStaff({
          id: employee.id,
          name: employee.name,
          commissionRate: employee.commissionRate
        });
        setNewPayment(prev => ({
          ...prev,
          amount: params.amount as string,
          commissionRate: employee.commissionRate.toString(),
        }));
      }
    }
  }, [params, staffList]);

  useFocusEffect(
    useCallback(() => {
      // Reset form when screen gains focus
      setNewPayment({
        amount: '',
        commissionRate: '',
        paymentMethod: 'cash' as PaymentMethod,
        date: new Date().toISOString(),
        remarks: '',
      });
      setSelectedStaff(null);
      setShowSuccessMessage(false);
      setShowConfirmDialog(false);
    }, [])
  );

  const paymentMethods: PaymentMethod[] = [PaymentMethod.CASH, PaymentMethod.ONLINE];

  const calculateCommission = () => {
    if (newPayment.amount && newPayment.commissionRate) {
      const amount = parseFloat(newPayment.amount);
      const rate = parseFloat(newPayment.commissionRate);
      const commissionAmount = (amount * rate) / 100;
      const netAmount = amount - commissionAmount;
      return { commissionAmount, netAmount };
    }
    return null;
  };

  const handleStaffSelect = (staff: { id: string; name: string; commissionRate: number }) => {
    setSelectedStaff(staff);
    setNewPayment({ ...newPayment, commissionRate: staff.commissionRate.toString() });
    setShowStaffDropdown(false);
  };

  const handleSavePayment = () => {
    Haptics.notificationAsync();
    
    console.log('selectedStaff:', selectedStaff);
    console.log('newPayment.amount:', newPayment.amount);
    console.log('newPayment.commissionRate:', newPayment.commissionRate);
    console.log('shopId:', authState.user?.shopId);
    
    if (!selectedStaff || !newPayment.amount || !newPayment.commissionRate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const shopId = authState.user?.shopId;
    if (!shopId) {
      Alert.alert('Error', 'Shop information not found');
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmPayment = async () => {
    setShowConfirmDialog(false);
    setShowFullScreenLoader(true);
    let paymentCreated = false;
    
    try {
      const commission = calculateCommission();
      
      if (!commission) {
        Alert.alert('Error', 'Invalid commission calculation');
        return;
      }
      
      console.log('Creating payment with data:', {
        paymentType: PaymentType.STAFF_PAYOUT,
        recipientName: selectedStaff?.name,
        recipientType: 'employee',
        amount: parseFloat(newPayment.amount),
        commissionRate: parseFloat(newPayment.commissionRate),
        paymentMethod: newPayment.paymentMethod,
        category: 'Staff Payout',
        description: newPayment.remarks,
        employeeId: selectedStaff?.id,
      });

      const payment = await PaymentService.createPayment({
        paymentType: PaymentType.STAFF_PAYOUT,
        recipientName: selectedStaff!.name,
        recipientType: 'employee',
        amount: parseFloat(newPayment.amount),
        commissionRate: parseFloat(newPayment.commissionRate),
        paymentMethod: newPayment.paymentMethod,
        category: 'Staff Payout',
        description: newPayment.remarks,
        employeeId: parseInt(selectedStaff!.id),
      });

      console.log('Payment created successfully:', payment);
      paymentCreated = true;
    } catch (error: any) {
      console.error('Error creating payment:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Failed to create payment');
    } finally {
      setShowFullScreenLoader(false);
    }
    
    if (paymentCreated) {
      setSuccessMessageText('Payment added successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        router.push('/(owner-tabs)/payments');
      }, 1500);
    }
  };

  const cancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    Haptics.notificationAsync();
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>Staff Payout</Text>
        <View style={styles.headerSpacer} />
      </View>

      {showSuccessMessage && (
        <View style={styles.successMessageContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.successMessageText}>{successMessageText}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Select Staff *</Text>
          {loadingStaff ? (
            <View style={styles.dropdownButton}>
              <Loader text="Loading staff..." size="small" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowStaffDropdown(true)}
              disabled={showFullScreenLoader || staffList.length === 0}
            >
              <Text style={selectedStaff ? styles.dropdownText : styles.dropdownPlaceholder}>
                {staffList.length === 0 ? 'No staff available' : (selectedStaff?.name || 'Select staff member')}
              </Text>
              {staffList.length > 0 && <Ionicons name="chevron-down" size={20} color="#6B7280" />}
            </TouchableOpacity>
          )}

          <Text style={styles.formLabel}>Amount (₹) *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter amount"
            value={newPayment.amount}
            onChangeText={(text) => setNewPayment({ ...newPayment, amount: text })}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.formLabel}>Commission Rate (%)</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>
              {newPayment.commissionRate ? `${newPayment.commissionRate}%` : 'Select staff to see commission rate'}
            </Text>
          </View>
          
          {calculateCommission() && (
            <View style={styles.commissionPreview}>
              <View style={styles.commissionRow}>
                <Text style={styles.commissionLabel}>Commission Amount:</Text>
                <Text style={styles.commissionValue}>
                  ₹{calculateCommission()?.commissionAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.commissionRow}>
                <Text style={styles.commissionLabel}>Net Payout:</Text>
                <Text style={styles.netValue}>
                  ₹{calculateCommission()?.netAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.formLabel}>Payment Method</Text>
          <View style={styles.buttonGroup}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.methodButton,
                  newPayment.paymentMethod === method && styles.methodButtonActive,
                ]}
                onPress={() => setNewPayment({ ...newPayment, paymentMethod: method })}
              >
                <Ionicons
                  name={method === PaymentMethod.CASH ? 'cash' : 'globe'}
                  size={16}
                  color={newPayment.paymentMethod === method ? '#FFFFFF' : '#6B7280'}
                  style={styles.methodButtonIcon}
                />
                <Text
                  style={[
                    styles.methodButtonText,
                    newPayment.paymentMethod === method && styles.methodButtonTextActive,
                  ]}
                >
                  {method.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>Date</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{formatDateDisplay(newPayment.date)}</Text>
          </View>

          <Text style={styles.formLabel}>Remarks</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="Enter remarks"
            value={newPayment.remarks}
            onChangeText={(text) => setNewPayment({ ...newPayment, remarks: text })}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSavePayment} disabled={showFullScreenLoader}>
            {showFullScreenLoader ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <>
                <Ionicons name="save" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Payment</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={showFullScreenLoader}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showStaffDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStaffDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStaffDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Staff</Text>
            <ScrollView style={styles.modalList}>
              {staffList.length === 0 ? (
                <View style={styles.modalItem}>
                  <Text style={styles.modalItemText}>No staff available</Text>
                </View>
              ) : (
                staffList.map((staff) => (
                  <TouchableOpacity
                    key={staff.id}
                    style={styles.modalItem}
                    onPress={() => handleStaffSelect(staff)}
                  >
                    <View style={styles.modalItemContent}>
                      <Ionicons name="person" size={20} color="#6B7280" />
                      <Text style={styles.modalItemText}>{staff.name}</Text>
                    </View>
                    <Text style={styles.modalItemSubtext}>Commission: {staff.commissionRate}%</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowStaffDropdown(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showConfirmDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelConfirm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Ionicons name="information-circle" size={48} color="#007AFF" />
            <Text style={styles.confirmModalTitle}>Confirm Payment</Text>
            <Text style={styles.confirmModalText}>
              Are you sure you want to pay ₹{newPayment.amount} to {selectedStaff?.name || 'this staff'}?
            </Text>
            <Text style={styles.confirmModalSubtext}>
              Commission: {newPayment.commissionRate}%
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={cancelConfirm}
              >
                <Text style={styles.confirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmConfirmButton}
                onPress={confirmPayment}
              >
                <Text style={styles.confirmConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FullScreenLoader visible={showFullScreenLoader} />
    </View>
  );
}
