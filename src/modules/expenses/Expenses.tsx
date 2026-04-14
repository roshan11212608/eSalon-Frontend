import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { expensesStyles } from './styles/expenses.styles';

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'paid' | 'pending';
  paymentMethod: string;
}

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'status'>) => void;
  onToggleExpenseStatus: (id: string) => void;
}

export default function Expenses({ expenses, onAddExpense, onToggleExpenseStatus }: ExpensesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    category: 'Utilities',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'Cash'
  });

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Utilities', 'Rent', 'Supplies', 'Salaries', 'Marketing', 'Equipment', 'Other'];

  const handleAddExpense = () => {
    Haptics.notificationAsync();
    setShowAddModal(true);
  };

  const handleSaveExpense = () => {
    Haptics.notificationAsync();
    if (!newExpense.name || !newExpense.amount || !newExpense.date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const expenseToAdd = {
      name: newExpense.name,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      description: newExpense.description,
      paymentMethod: newExpense.paymentMethod,
    };

    onAddExpense(expenseToAdd);
    setNewExpense({
      name: '',
      category: 'Utilities',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: 'Cash'
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Expense added successfully!');
  };

  const handleCancelAdd = () => {
    Haptics.notificationAsync();
    setShowAddModal(false);
  };

  return (
    <>
      <ScrollView 
        style={expensesStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={expensesStyles.scrollContent}
      >
        <View style={expensesStyles.header}>
          <Text style={expensesStyles.title}>Expenses</Text>
          <TouchableOpacity style={expensesStyles.addButton} onPress={handleAddExpense}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={expensesStyles.searchSection}>
          <View style={expensesStyles.searchBar}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              style={expensesStyles.searchInput}
              placeholder="Search expenses..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={expensesStyles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  expensesStyles.categoryChip,
                  selectedCategory === category && expensesStyles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  expensesStyles.categoryChipText,
                  selectedCategory === category && expensesStyles.categoryChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={expensesStyles.expensesList}>
          {filteredExpenses.map(expense => (
            <View key={expense.id} style={expensesStyles.expenseCard}>
              <View style={expensesStyles.expenseHeader}>
                <View style={expensesStyles.expenseInfo}>
                  <Text style={expensesStyles.expenseName}>{expense.name}</Text>
                  <Text style={expensesStyles.expenseCategory}>{expense.category}</Text>
                  <Text style={expensesStyles.expenseDescription}>{expense.description}</Text>
                </View>
                <View style={expensesStyles.expenseAmount}>
                  <Text style={expensesStyles.amountText}>Rs {expense.amount}</Text>
                  <Text style={expensesStyles.dateText}>{expense.date}</Text>
                </View>
              </View>
              
              <View style={expensesStyles.expenseFooter}>
                <View style={expensesStyles.statusContainer}>
                  <View style={[
                    expensesStyles.statusIndicator,
                    { backgroundColor: expense.status === 'paid' ? '#10B981' : '#F59E0B' }
                  ]} />
                  <Text style={expensesStyles.statusText}>
                    {expense.status === 'paid' ? 'Paid' : 'Pending'}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={expensesStyles.toggleButton}
                  onPress={() => onToggleExpenseStatus(expense.id)}
                >
                  <Ionicons 
                    name={expense.status === 'paid' ? 'close-circle' : 'checkmark-circle'} 
                    size={16} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={expensesStyles.expenseDetails}>
                <View style={expensesStyles.detailRow}>
                  <Ionicons name="card" size={16} color="#6B7280" />
                  <Text style={expensesStyles.detailText}>{expense.paymentMethod}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={expensesStyles.modalContainer}>
          <View style={expensesStyles.modalHeader}>
            <TouchableOpacity onPress={handleCancelAdd}>
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={expensesStyles.modalTitle}>Add New Expense</Text>
          </View>
          <View style={expensesStyles.modalContent}>
            <Text style={expensesStyles.formLabel}>Expense Name</Text>
            <TextInput
              style={expensesStyles.formInput}
              placeholder="Enter expense name"
              value={newExpense.name}
              onChangeText={(text) => setNewExpense({...newExpense, name: text})}
            />

            <Text style={expensesStyles.formLabel}>Category</Text>
            <View style={expensesStyles.categoryButtons}>
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
            </View>

            <Text style={expensesStyles.formLabel}>Amount (Rs)</Text>
            <TextInput
              style={expensesStyles.formInput}
              placeholder="Enter amount"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
              keyboardType="numeric"
            />

            <Text style={expensesStyles.formLabel}>Date</Text>
            <TextInput
              style={expensesStyles.formInput}
              value={newExpense.date}
              onChangeText={(text) => setNewExpense({...newExpense, date: text})}
              placeholder="YYYY-MM-DD"
            />

            <Text style={expensesStyles.formLabel}>Payment Method</Text>
            <View style={expensesStyles.paymentButtons}>
              {['Cash', 'Card', 'Bank Transfer', 'UPI'].map(method => (
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
          </View>
        </View>
      </Modal>
    </>
  );
}
