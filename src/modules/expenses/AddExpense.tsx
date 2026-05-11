import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { expensesStyles } from './styles/expenses.styles';
import expenseService, { CreateExpenseRequest } from '../../services/expenseService';
import { StorageService } from '@/src/services/storage/storageService';

const EXPENSE_NAMES = [
  'Electricity Bill',
  'Water Bill',
  'Rent',
  'Internet Bill',
  'Office Supplies',
  'Cleaning Supplies',
  'Equipment Purchase',
  'Marketing Expense',
  'Maintenance',
  'Insurance',
  'License Fee',
  'Other'
];

const EXPENSE_CATEGORY_MAP: Record<string, string> = {
  'Electricity Bill': 'Utilities',
  'Water Bill': 'Utilities',
  'Rent': 'Rent',
  'Internet Bill': 'Utilities',
  'Office Supplies': 'Supplies',
  'Cleaning Supplies': 'Supplies',
  'Equipment Purchase': 'Equipment',
  'Marketing Expense': 'Marketing',
  'Maintenance': 'Other',
  'Insurance': 'Other',
  'License Fee': 'Other',
  'Other': 'Other'
};

const localStyles = {
  inputContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666666',
    marginTop: 16,
    fontSize: 16,
  },
  dropdownContainer: {
    position: 'relative' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%' as any,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1F2937',
    marginBottom: 16,
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500' as const,
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center' as const,
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#f7b638',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center' as const,
    marginBottom: 10,
    minHeight: 42,
    justifyContent: 'center' as const,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center' as const,
    marginTop: 8,
    marginBottom: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666666',
  },
};

export default function AddExpense() {
  const router = useRouter();
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [isCustomName, setIsCustomName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const getCurrentLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [newExpense, setNewExpense] = useState({
    name: '',
    category: 'Utilities',
    amount: '',
    expenseDate: getCurrentLocalDateTime(),
    description: '',
    paymentMethod: 'Cash'
  });

  const handleSaveExpense = async () => {
    Haptics.notificationAsync();
    if (!newExpense.name || !newExpense.amount || !newExpense.expenseDate) {
      setAlertMessage('Please fill in all required fields');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    try {
      setIsSaving(true);
      const storedShopId = await StorageService.getShopId();
      if (!storedShopId || parseInt(storedShopId) === 1) {
        setAlertMessage('Shop ID not available');
        setAlertType('error');
        setShowAlert(true);
        return;
      }

      const expenseToAdd: CreateExpenseRequest = {
        name: newExpense.name,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        expenseDate: newExpense.expenseDate,
        description: newExpense.description,
        paymentMethod: newExpense.paymentMethod,
        shopId: parseInt(storedShopId),
      };

      await expenseService.createExpense(expenseToAdd);
      setAlertMessage('Expense added successfully!');
      setAlertType('success');
      setShowAlert(true);
      // Clear form after successful save
      setNewExpense({
        name: '',
        category: 'Utilities',
        amount: '',
        expenseDate: getCurrentLocalDateTime(),
        description: '',
        paymentMethod: 'Cash'
      });
      setIsCustomName(false);
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      setAlertMessage('Failed to add expense');
      setAlertType('error');
      setShowAlert(true);
      console.error('Error creating expense:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Haptics.notificationAsync();
    router.back();
  };

  return (
    <View style={expensesStyles.mainContainer}>
      <View style={expensesStyles.header}>
        <Text style={expensesStyles.title}>Add New <Text style={expensesStyles.titleAccent}>Expense</Text></Text>
        <TouchableOpacity style={expensesStyles.addButton} onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1, backgroundColor: '#F8FAFC' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={expensesStyles.scrollContent}
      >
        <View style={{ padding: 16 }}>
          <Text style={expensesStyles.formLabel}>Expense Name <Text style={expensesStyles.requiredAsterisk}>*</Text></Text>
            <TouchableOpacity
              style={[expensesStyles.formInput, { flexDirection: 'row' as const, alignItems: 'center' as const }]}
              onPress={() => setShowNameDropdown(true)}
            >
              <Text style={{ color: newExpense.name ? '#1F2937' : '#9CA3AF', flex: 1 }}>
                {newExpense.name || 'Select expense name'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>

            {isCustomName && (
              <TextInput
                style={expensesStyles.formInput}
                placeholder="Enter custom expense name"
                value={newExpense.name === 'Other' ? '' : newExpense.name}
                onChangeText={(text) => setNewExpense({...newExpense, name: text})}
              />
            )}

          <View style={localStyles.inputContainer}>
            <Text style={expensesStyles.formLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={expensesStyles.categoryButtons}>
              {['Utilities', 'Rent', 'Supplies', 'Salaries', 'Marketing', 'Equipment', 'Other'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    expensesStyles.categoryButton,
                    newExpense.category === category && expensesStyles.categoryButtonActive
                  ]}
                  onPress={() => setNewExpense({...newExpense, category})}
                >
                  <Text style={[
                    expensesStyles.categoryButtonText,
                    newExpense.category === category && expensesStyles.categoryButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={localStyles.inputContainer}>
            <Text style={expensesStyles.formLabel}>Amount <Text style={expensesStyles.requiredAsterisk}>*</Text></Text>
            <TextInput
              style={expensesStyles.formInput}
              placeholder="Enter amount"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
              keyboardType="numeric"
            />
          </View>

          <View style={localStyles.inputContainer}>
            <Text style={expensesStyles.formLabel}>Date <Text style={expensesStyles.requiredAsterisk}>*</Text></Text>
            <TextInput
              style={expensesStyles.formInput}
              value={newExpense.expenseDate}
              onChangeText={(text) => setNewExpense({...newExpense, expenseDate: text})}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={localStyles.inputContainer}>
            <Text style={expensesStyles.formLabel}>Payment Method</Text>
            <View style={expensesStyles.paymentButtons}>
              {['Cash', 'Online'].map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    expensesStyles.paymentButton,
                    newExpense.paymentMethod === method && expensesStyles.paymentButtonActive
                  ]}
                  onPress={() => setNewExpense({...newExpense, paymentMethod: method})}
                >
                  <Text style={[
                    expensesStyles.paymentButtonText,
                    newExpense.paymentMethod === method && expensesStyles.paymentButtonTextActive
                  ]}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={localStyles.inputContainer}>
            <Text style={expensesStyles.formLabel}>Description</Text>
            <TextInput
              style={[expensesStyles.formInput, expensesStyles.textArea]}
              placeholder="Enter expense description"
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({...newExpense, description: text})}
              multiline
            />
          </View>

          <TouchableOpacity style={localStyles.saveButton} onPress={handleSaveExpense} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#1a1a1a" />
            ) : (
              <Text style={localStyles.saveButtonText}>Save Expense</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.cancelButton} onPress={handleCancel}>
            <Text style={localStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showNameDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNameDropdown(false)}
      >
        <TouchableOpacity
          style={localStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNameDropdown(false)}
        >
          <View style={localStyles.modalContent}>
            <Text style={localStyles.modalTitle}>Select Expense Name</Text>
            <ScrollView style={localStyles.dropdownScroll}>
              {EXPENSE_NAMES.map((name) => (
                <TouchableOpacity
                  key={name}
                  style={localStyles.dropdownItem}
                  onPress={() => {
                    if (name === 'Other') {
                      setIsCustomName(true);
                      setNewExpense({ ...newExpense, name: '', category: EXPENSE_CATEGORY_MAP[name] });
                    } else {
                      setIsCustomName(false);
                      setNewExpense({ ...newExpense, name, category: EXPENSE_CATEGORY_MAP[name] });
                    }
                    setShowNameDropdown(false);
                  }}
                >
                  <Text style={localStyles.dropdownItemText}>{name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={localStyles.modalCancelButton}
              onPress={() => setShowNameDropdown(false)}
            >
              <Text style={localStyles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Alert Modal */}
      {showAlert && (
        <View style={{
          position: 'absolute' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          zIndex: 1000,
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
            marginHorizontal: 20,
            alignItems: 'center' as const,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: alertType === 'success' ? '#10B981' : '#EF4444',
              justifyContent: 'center' as const,
              alignItems: 'center' as const,
              marginBottom: 12,
            }}>
              <Ionicons 
                name={alertType === 'success' ? 'checkmark' : 'close'} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <Text style={{
              fontSize: 16,
              fontWeight: '600' as const,
              color: '#1F2937',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              {alertMessage}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#F3F4F6',
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 8,
              }}
              onPress={() => setShowAlert(false)}
            >
              <Text style={{ fontSize: 14, fontWeight: '500' as const, color: '#666666' }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
