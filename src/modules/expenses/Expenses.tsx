import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { expensesStyles } from './styles/expenses.styles';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseCard } from './components/ExpenseCard';
import { CategoryModal } from './components/CategoryModal';
import {
  filterCurrentMonthExpenses,
  filterExpenses,
  groupExpensesByCategory,
  formatCurrency,
} from './mappers/expenseMapper';

export default function Expenses() {
  const { expenses, expenseReportData, loading, error, refreshExpenses } = useExpenses();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<string | null>(null);

  const categories = ['All', 'Utilities', 'Rent', 'Supplies', 'Marketing', 'Equipment', 'Other'];

  // Filter and group expenses
  const currentMonthExpenses = filterCurrentMonthExpenses(expenses);
  const filteredExpenses = filterExpenses(currentMonthExpenses, searchText, selectedCategory);
  const groupedExpenses = groupExpensesByCategory(filteredExpenses);

  const handleAddExpense = () => {
    router.push('/(owner-tabs)/expenses/add' as any);
  };

  const handleViewReport = () => {
    router.push('/(owner-tabs)/reports/expense-report' as any);
  };

  const handleRetry = () => {
    refreshExpenses();
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategoryForModal(category);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCategoryForModal(null);
  };

  return (
    <>
      <View style={expensesStyles.fixedHeaderContainer}>
        <View style={expensesStyles.header}>
          <Text style={expensesStyles.title}>Expe<Text style={expensesStyles.titleAccent}>nses</Text></Text>
          <View style={expensesStyles.headerButtons}>
            <TouchableOpacity style={expensesStyles.reportButton} onPress={handleViewReport}>
              <Ionicons name="bar-chart" size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={expensesStyles.addButton} onPress={handleAddExpense}>
              <Ionicons name="add" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
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
      </View>

      <ScrollView
        style={expensesStyles.mainContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={expensesStyles.scrollContent}
      >

        {loading ? (
          <View style={expensesStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={expensesStyles.loadingText}>Loading expenses...</Text>
          </View>
        ) : error ? (
          <View style={expensesStyles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={expensesStyles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={expensesStyles.retryButton}
              onPress={handleRetry}
            >
              <Text style={expensesStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredExpenses.length === 0 ? (
          <View style={expensesStyles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#CBD5E1" style={expensesStyles.emptyStateIcon} />
            <Text style={expensesStyles.emptyStateTitle}>No Expenses Yet</Text>
            <Text style={expensesStyles.emptyStateText}>Tap the + button to add your first expense</Text>
          </View>
        ) : (
          <>
            <View style={expensesStyles.expensesList}>
              {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => (
                <ExpenseCard
                  key={category}
                  category={category}
                  expenses={categoryExpenses}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}
            </View>

            {/* Monthly Trend Graph */}
            {expenseReportData && expenseReportData.expenseTrends && expenseReportData.expenseTrends.length > 0 && (
              <View style={expensesStyles.trendSection}>
                <View style={expensesStyles.trendHeader}>
                  <View>
                    <Text style={expensesStyles.trendTitle}>Monthly Expense Trends</Text>
                    <Text style={expensesStyles.trendSubtitle}>Last 6 months overview</Text>
                  </View>
                  <View style={expensesStyles.trendTotalBadge}>
                    <Text style={expensesStyles.trendTotalLabel}>Total</Text>
                    <Text style={expensesStyles.trendTotalValue}>
                      {formatCurrency(expenseReportData.expenseTrends.reduce((sum: number, t: any) => sum + (t.amount || 0), 0))}
                    </Text>
                  </View>
                </View>

                <View style={expensesStyles.trendChart}>
                  {expenseReportData.expenseTrends.map((trend: any, index: number) => {
                    const amounts = expenseReportData.expenseTrends.map((t: any) => t.amount || 0);
                    const maxAmount = Math.max(...amounts);
                    const trendAmount = trend.amount || 0;
                    const barHeight = maxAmount > 0 ? (trendAmount / maxAmount) * 100 : 0;

                    const isHighest = barHeight === 100;
                    const pixelHeight = Math.max((barHeight / 100) * 100, 4);

                    // Dynamic color based on bar height
                    let backgroundColor = '#6366F1';
                    if (barHeight >= 80) backgroundColor = '#EF4444';
                    else if (barHeight >= 50) backgroundColor = '#F59E0B';
                    else if (barHeight >= 30) backgroundColor = '#10B981';

                    return (
                      <View key={index} style={expensesStyles.trendBarContainer}>
                        <View style={expensesStyles.trendBarWrapper}>
                          <View style={{
                            width: 40,
                            borderRadius: 8,
                            height: pixelHeight,
                            backgroundColor,
                            minHeight: 4,
                          }}>
                            {isHighest && (
                              <View style={[expensesStyles.trendBarHighlight, { backgroundColor }]} />
                            )}
                          </View>
                        </View>
                        <View style={expensesStyles.trendInfo}>
                          <Text style={[expensesStyles.trendLabel, isHighest && expensesStyles.trendLabelActive]}>{trend.period}</Text>
                          <Text style={[expensesStyles.trendAmount, isHighest && expensesStyles.trendAmountActive]}>{formatCurrency(trendAmount)}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <CategoryModal
        visible={modalVisible}
        category={selectedCategoryForModal || ''}
        expenses={selectedCategoryForModal ? groupedExpenses[selectedCategoryForModal] || [] : []}
        onClose={handleCloseModal}
      />
    </>
  );
}
