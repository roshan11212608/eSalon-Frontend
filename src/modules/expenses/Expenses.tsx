import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { expensesStyles } from './styles/expenses.styles';
import expenseService, { Expense } from '../../services/expenseService';
import { StorageService } from '@/src/services/storage/storageService';
import { reportsService, PaymentReportResponse, StaffPayroll } from '../../services/reports/reportsService';

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentReportResponse | null>(null);
  const [expenseReportData, setExpenseReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<string | null>(null);

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.refresh === 'true') {
      refreshExpenses();
      router.setParams({ refresh: undefined });
    }
  }, [params.refresh]);

  const refreshExpenses = async () => {
    const storedShopId = await StorageService.getShopId();
    if (!storedShopId) {
      console.log('No stored shopId found');
      return;
    }

    if (storedShopId === '1') {
      console.log('Invalid shopId, skipping refresh');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [expensesData, paymentReportData, reportData] = await Promise.all([
        expenseService.getExpensesByShop(parseInt(storedShopId)),
        reportsService.getPaymentReport(undefined, 'month'),
        reportsService.getExpenseReport(undefined, 'month')
      ]);
      console.log('Fetched expenses:', expensesData);
      console.log('Fetched payment report:', paymentReportData);
      console.log('Fetched expense report:', reportData);
      setExpenses(expensesData);
      setPaymentData(paymentReportData);
      setExpenseReportData(reportData);
    } catch (err: any) {
      setError('Failed to load expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshExpenses();
    }, [])
  );

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = (expense.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                         (expense.description?.toLowerCase() || '').includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory;
    
    // Filter to show only current month expenses
    const now = new Date();
    const expenseDate = new Date(expense.expenseDate);
    const isCurrentMonth = expenseDate.getMonth() === now.getMonth() && 
                          expenseDate.getFullYear() === now.getFullYear();
    
    return matchesSearch && matchesCategory && isCurrentMonth;
  });

  // Group expenses by category
  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Add Salaries category from payment data
  if (paymentData && paymentData.staffPayroll && paymentData.staffPayroll.length > 0) {
    const salaryExpenses: Expense[] = paymentData.staffPayroll.map((staff: StaffPayroll) => ({
      id: staff.id,
      name: staff.name,
      category: 'Salaries',
      amount: parseFloat(staff.paidAmount.replace('₹', '').replace(',', '')),
      expenseDate: staff.lastPaymentDate || new Date().toISOString(),
      description: `Salary payment - ${staff.role}`,
      shopId: 0,
      shopName: '',
      createdById: 0,
      createdByName: ''
    }));
    groupedExpenses['Salaries'] = salaryExpenses;
  }

  console.log('Total expenses:', expenses.length);
  console.log('Filtered expenses:', filteredExpenses.length);
  console.log('Search text:', searchText);
  console.log('Selected category:', selectedCategory);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      };
      return date.toLocaleString('en-US', options);
    } catch {
      return 'N/A';
    }
  };

  const categories = ['All', 'Utilities', 'Rent', 'Supplies', 'Salaries', 'Marketing', 'Equipment', 'Other'];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Utilities': '#3B82F6',
      'Rent': '#8B5CF6',
      'Supplies': '#10B981',
      'Salaries': '#F59E0B',
      'Marketing': '#EC4899',
      'Equipment': '#6366F1',
      'Other': '#64748B',
    };
    return colors[category] || '#64748B';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Utilities': 'flash',
      'Rent': 'home',
      'Supplies': 'cube',
      'Salaries': 'people',
      'Marketing': 'megaphone',
      'Equipment': 'build',
      'Other': 'ellipse',
    };
    return icons[category] || 'ellipse';
  };

  const handleAddExpense = () => {
    router.push('/(owner-tabs)/expenses/addExpenses' as any);
  };

  const handleViewReport = () => {
    router.push('/(owner-tabs)/reports/expense-report' as any);
  };

  const handleRetry = async () => {
    const storedShopId = await StorageService.getShopId();
    if (!storedShopId || parseInt(storedShopId) === 1) {
      setError('Shop ID not available');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpensesByShop(parseInt(storedShopId));
      setExpenses(data);
    } catch (err: any) {
      setError('Failed to load expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
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
              {Object.entries(groupedExpenses).map(([category, categoryExpenses]) => {
                const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                return (
                  <TouchableOpacity
                    key={category}
                    style={expensesStyles.categoryCard}
                    onPress={() => handleCategoryPress(category)}
                    activeOpacity={0.7}
                  >
                    <View style={expensesStyles.categoryCardLeft}>
                      <View style={[expensesStyles.categoryCardIcon, { backgroundColor: getCategoryColor(category) }]}>
                        <Ionicons name={getCategoryIcon(category)} size={24} color="#FFFFFF" />
                      </View>
                      <View style={expensesStyles.categoryCardInfo}>
                        <Text style={expensesStyles.categoryCardTitle}>{category}</Text>
                        <Text style={expensesStyles.categoryCardCount}>{categoryExpenses.length} expenses</Text>
                      </View>
                    </View>
                    <View style={expensesStyles.categoryCardRight}>
                      <Text style={expensesStyles.categoryCardAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Monthly Trend Graph */}
            {expenseReportData && expenseReportData.expenseTrends && expenseReportData.expenseTrends.length > 0 && (
              <View style={expensesStyles.trendSection}>
                <Text style={expensesStyles.trendTitle}>Monthly Expense Trends</Text>
                <View style={expensesStyles.trendChart}>
                  {expenseReportData.expenseTrends.map((trend: any, index: number) => {
                    const maxAmount = Math.max(...expenseReportData.expenseTrends.map((t: any) => t.amount));
                    const barHeight = maxAmount > 0 ? (trend.amount / maxAmount) * 100 : 0;
                    return (
                      <View key={index} style={expensesStyles.trendBarContainer}>
                        <View style={expensesStyles.trendBarWrapper}>
                          <View style={[expensesStyles.trendBar, { height: `${barHeight}%` }]} />
                        </View>
                        <Text style={expensesStyles.trendLabel}>{trend.period}</Text>
                        <Text style={expensesStyles.trendAmount}>₹{trend.amount.toLocaleString('en-IN')}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={expensesStyles.modalOverlay}>
          <View style={expensesStyles.modalContainer}>
            <View style={expensesStyles.modalHeader}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
              <Text style={expensesStyles.modalTitle}>{selectedCategoryForModal}</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView style={expensesStyles.modalContent}>
              <View style={expensesStyles.tableContainer}>
                <View style={expensesStyles.tableHeader}>
                  <Text style={expensesStyles.tableHeaderText}>Expense Name</Text>
                  <Text style={expensesStyles.tableHeaderText}>Date</Text>
                  <Text style={expensesStyles.tableHeaderText}>Amount</Text>
                </View>
                {selectedCategoryForModal && groupedExpenses[selectedCategoryForModal]?.map(expense => (
                  <View key={expense.id} style={expensesStyles.tableRow}>
                    <Text style={expensesStyles.tableCell}>{expense.name}</Text>
                    <Text style={expensesStyles.tableCell}>{formatDate(expense.expenseDate)}</Text>
                    <Text style={[expensesStyles.tableCell, expensesStyles.tableCellAmount]}>₹{expense.amount.toLocaleString('en-IN')}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
