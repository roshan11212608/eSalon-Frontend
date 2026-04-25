import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { expensesStyles } from './styles/expenses.styles';
import { addExpensesStyles } from './styles/addExpenses.style';
import expenseService, { CreateExpenseRequest } from '../../services/expenseService';
import { StorageService } from '@/src/services/storage/storageService';
import SuccessModal from '@/src/shared/components/SuccessModal';

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

export default function AddExpense() {
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [isCustomName, setIsCustomName] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const resetForm = useCallback(() => {
    setNewExpense({
      name: '',
      category: 'Utilities',
      amount: '',
      expenseDate: getCurrentLocalDateTime(),
      description: '',
      paymentMethod: 'Cash'
    });
    setShowNameDropdown(false);
    setIsCustomName(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm])
  );

  const handleSaveExpense = async () => {
    Haptics.notificationAsync();
    if (!newExpense.name || !newExpense.amount || !newExpense.expenseDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const storedShopId = await StorageService.getShopId();
      if (!storedShopId || parseInt(storedShopId) === 1) {
        Alert.alert('Error', 'Shop ID not available');
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
      setShowSuccessModal(true);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to add expense');
      console.error('Error creating expense:', err);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.replace('/(owner-tabs)/expenses?refresh=true' as any);
  };

  const handleCancel = () => {
    Haptics.notificationAsync();
    router.back();
  };

  return (
    <View style={expensesStyles.modalContainer}>
      <View style={expensesStyles.modalHeader}>
        <Text style={expensesStyles.modalTitle}>Add New <Text style={expensesStyles.titleAccent}>Expense</Text></Text>
        <TouchableOpacity 
          style={addExpensesStyles.closeButton} 
          onPress={handleCancel}
        >
          <Ionicons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={expensesStyles.modalContent}>
        <Text style={expensesStyles.formLabel}>Expense Name <Text style={expensesStyles.requiredAsterisk}>*</Text></Text>
        <TouchableOpacity
          style={expensesStyles.formInput}
          onPress={() => setShowNameDropdown(true)}
        >
          <Text style={[newExpense.name ? addExpensesStyles.dropdownTriggerText : addExpensesStyles.dropdownTriggerTextPlaceholder]}>
            {newExpense.name || 'Select expense name'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" style={addExpensesStyles.chevronIcon} />
        </TouchableOpacity>

        {isCustomName && (
          <TextInput
            style={expensesStyles.formInput}
            placeholder="Enter custom expense name"
            value={newExpense.name === 'Other' ? '' : newExpense.name}
            onChangeText={(text) => setNewExpense({...newExpense, name: text})}
          />
        )}

        <Modal
          visible={showNameDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowNameDropdown(false)}
        >
          <TouchableOpacity
            style={addExpensesStyles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowNameDropdown(false)}
          >
            <View style={addExpensesStyles.modalContent}>
              <Text style={addExpensesStyles.modalTitle}>Select Expense Name</Text>
              <ScrollView style={addExpensesStyles.dropdownList}>
                {EXPENSE_NAMES.map((name) => (
                  <TouchableOpacity
                    key={name}
                    style={addExpensesStyles.dropdownItem}
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
                    <Text style={addExpensesStyles.dropdownItemText}>{name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={addExpensesStyles.cancelButton}
                onPress={() => setShowNameDropdown(false)}
              >
                <Text style={addExpensesStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

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

        <Text style={expensesStyles.formLabel}>Amount <Text style={expensesStyles.requiredAsterisk}>*</Text></Text>
        <TextInput
          style={expensesStyles.formInput}
          placeholder="Enter amount"
          value={newExpense.amount}
          onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
          keyboardType="numeric"
        />

        <Text style={expensesStyles.formLabel}>Date <Text style={expensesStyles.requiredAsterisk}>*</Text></Text>
        <TextInput
          style={expensesStyles.formInput}
          value={newExpense.expenseDate}
          onChangeText={(text) => setNewExpense({...newExpense, expenseDate: text})}
          placeholder="YYYY-MM-DD"
        />

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

        <Text style={expensesStyles.formLabel}>Description</Text>
        <TextInput
          style={[expensesStyles.formInput, expensesStyles.textArea]}
          placeholder="Enter expense description"
          value={newExpense.description}
          onChangeText={(text) => setNewExpense({...newExpense, description: text})}
          multiline
        />

        <TouchableOpacity style={expensesStyles.saveButton} onPress={handleSaveExpense}>
          <Text style={expensesStyles.saveButtonText}>Save Expense</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <SuccessModal
        visible={showSuccessModal}
        title="Success"
        message="Expense added successfully!"
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />
    </View>
  );
}
