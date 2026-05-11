import React from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense } from '../../../services/expenseService';
import { formatExpenseDate, formatCurrency, getCategoryColor, getCategoryIcon } from '../mappers/expenseMapper';
import { expensesStyles } from '../styles/expenses.styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CategoryModalProps {
  visible: boolean;
  category: string;
  expenses: Expense[];
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ visible, category, expenses, onClose }) => {
  const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const categoryIcon = getCategoryIcon(category) as any;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={expensesStyles.modalOverlay}>
        <View style={[expensesStyles.modalContent, { maxHeight: SCREEN_HEIGHT * 0.85 }]}>
          {/* Header with gradient background */}
          <View style={[expensesStyles.modalHeader, { backgroundColor: getCategoryColor(category) }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={expensesStyles.modalHeaderIcon}>
                <Ionicons name={categoryIcon} size={28} color="#FFFFFF" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={expensesStyles.modalTitle}>{category}</Text>
                <Text style={expensesStyles.modalSubtitle}>{expenses.length} expenses</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={expensesStyles.modalCloseButton}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Total amount card */}
          <View style={expensesStyles.modalTotalCard}>
            <Text style={expensesStyles.modalTotalLabel}>Total Amount</Text>
            <Text style={expensesStyles.modalTotalAmount}>{formatCurrency(totalAmount)}</Text>
          </View>

          {/* Expense list */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {expenses.map((expense, index) => (
              <View key={expense.id} style={[expensesStyles.expenseListItem, index === expenses.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={expensesStyles.expenseListItemIcon}>
                  <Ionicons name="receipt-outline" size={20} color="#64748B" />
                </View>
                <View style={expensesStyles.expenseListItemContent}>
                  <Text style={expensesStyles.expenseListItemName}>{expense.name || 'Unnamed Expense'}</Text>
                  <Text style={expensesStyles.expenseListItemDate}>{formatExpenseDate(expense.expenseDate)}</Text>
                  {expense.description && (
                    <Text style={expensesStyles.expenseListItemDescription} numberOfLines={1}>
                      {expense.description}
                    </Text>
                  )}
                </View>
                <Text style={expensesStyles.expenseListItemAmount}>{formatCurrency(expense.amount)}</Text>
              </View>
            ))}
            {expenses.length === 0 && (
              <View style={expensesStyles.modalEmptyState}>
                <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
                <Text style={expensesStyles.modalEmptyText}>No expenses in this category</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
