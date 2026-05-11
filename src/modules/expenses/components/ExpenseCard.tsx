import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense } from '../../../services/expenseService';
import { getCategoryColor, getCategoryIcon, formatCurrency } from '../mappers/expenseMapper';
import { expensesStyles } from '../styles/expenses.styles';

interface ExpenseCardProps {
  category: string;
  expenses: Expense[];
  onPress: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ category, expenses, onPress }) => {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <TouchableOpacity
      style={expensesStyles.categoryCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={expensesStyles.categoryCardLeft}>
        <View style={[expensesStyles.categoryCardIcon, { backgroundColor: getCategoryColor(category) }]}>
          <Ionicons name={getCategoryIcon(category) as any} size={24} color="#FFFFFF" />
        </View>
        <View style={expensesStyles.categoryCardInfo}>
          <Text style={expensesStyles.categoryCardTitle}>{category}</Text>
          <Text style={expensesStyles.categoryCardCount}>{expenses.length} expenses</Text>
        </View>
      </View>
      <View style={expensesStyles.categoryCardRight}>
        <Text style={expensesStyles.categoryCardAmount}>{formatCurrency(totalAmount)}</Text>
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
};
