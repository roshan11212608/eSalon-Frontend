import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/expenseReport.styles';

export default function ExpenseReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'today':
        return {
          totalExpenses: 120,
          expenseStats: [
            { label: 'Total Expenses', value: '₹120', icon: 'wallet', color: '#F59E0B' },
            { label: 'Supplies', value: '₹45', icon: 'cart', color: '#6366F1' },
            { label: 'Utilities', value: '₹35', icon: 'flash', color: '#10B981' },
            { label: 'Other', value: '₹40', icon: 'ellipsis-horizontal', color: '#EF4444' },
          ],
          expenseCategories: [
            { category: 'Supplies', amount: 45, percentage: '38%', color: '#F59E0B' },
            { category: 'Utilities', amount: 35, percentage: '29%', color: '#6366F1' },
            { category: 'Equipment', amount: 20, percentage: '17%', color: '#10B981' },
            { category: 'Other', amount: 20, percentage: '16%', color: '#EF4444' },
          ],
          recentExpenses: [
            { id: 1, category: 'Supplies', description: 'Hair products', amount: 45, date: 'Today', vendor: 'Beauty Supply Co' },
            { id: 2, category: 'Utilities', description: 'Electricity', amount: 35, date: 'Today', vendor: 'City Power' },
            { id: 3, category: 'Other', amount: 20, date: 'Today', vendor: 'Local Store' },
            { id: 4, category: 'Equipment', amount: 20, date: 'Today', vendor: 'Salon Equipment' },
          ],
          expenseTrends: [
            { period: 'W1 (Apr 1-7)', amount: 100 },
            { period: 'W2 (Apr 8-14)', amount: 115 },
            { period: 'W3 (Apr 15-21)', amount: 120 },
            { period: 'W4 (Apr 22-28)', amount: 110 },
            { period: 'W5 (Apr 29-30)', amount: 120 },
          ],
        };
      case 'week':
        return {
          totalExpenses: 850,
          expenseStats: [
            { label: 'Total Expenses', value: '₹850', icon: 'wallet', color: '#F59E0B' },
            { label: 'Supplies', value: '₹350', icon: 'cart', color: '#6366F1' },
            { label: 'Utilities', value: '₹250', icon: 'flash', color: '#10B981' },
            { label: 'Other', value: '₹250', icon: 'ellipsis-horizontal', color: '#EF4444' },
          ],
          expenseCategories: [
            { category: 'Supplies', amount: 350, percentage: '41%', color: '#F59E0B' },
            { category: 'Utilities', amount: 250, percentage: '29%', color: '#6366F1' },
            { category: 'Equipment', amount: 150, percentage: '18%', color: '#10B981' },
            { category: 'Other', amount: 100, percentage: '12%', color: '#EF4444' },
          ],
          recentExpenses: [
            { id: 1, category: 'Supplies', description: 'Hair products', amount: 350, date: 'This Week', vendor: 'Beauty Supply Co' },
            { id: 2, category: 'Utilities', description: 'Electricity', amount: 250, date: 'This Week', vendor: 'City Power' },
            { id: 3, category: 'Equipment', description: 'Scissors', amount: 150, date: 'This Week', vendor: 'Salon Equipment' },
            { id: 4, category: 'Other', amount: 100, date: 'This Week', vendor: 'Local Store' },
          ],
          expenseTrends: [
            { period: 'W1 (Apr 1-7)', amount: 750 },
            { period: 'W2 (Apr 8-14)', amount: 800 },
            { period: 'W3 (Apr 15-21)', amount: 850 },
            { period: 'W4 (Apr 22-28)', amount: 820 },
            { period: 'W5 (Apr 29-30)', amount: 850 },
          ],
        };
      case 'month':
      default:
        return {
          totalExpenses: 4280,
          expenseStats: [
            { label: 'Total Expenses', value: '₹4,280', icon: 'wallet', color: '#F59E0B' },
            { label: 'Supplies', value: '₹1,850', icon: 'cart', color: '#6366F1' },
            { label: 'Utilities', value: '₹1,200', icon: 'flash', color: '#10B981' },
            { label: 'Other', value: '₹1,230', icon: 'ellipsis-horizontal', color: '#EF4444' },
          ],
          expenseCategories: [
            { category: 'Supplies', amount: 1850, percentage: '43%', color: '#F59E0B' },
            { category: 'Utilities', amount: 1200, percentage: '28%', color: '#6366F1' },
            { category: 'Equipment', amount: 680, percentage: '16%', color: '#10B981' },
            { category: 'Other', amount: 550, percentage: '13%', color: '#EF4444' },
          ],
          recentExpenses: [
            { id: 1, category: 'Supplies', description: 'Hair products', amount: 150, date: 'Today', vendor: 'Beauty Supply Co' },
            { id: 2, category: 'Equipment', description: 'New scissors set', amount: 85, date: 'Yesterday', vendor: 'Salon Equipment' },
            { id: 3, category: 'Utilities', description: 'Electricity bill', amount: 220, date: '2 days ago', vendor: 'City Power' },
            { id: 4, category: 'Supplies', description: 'Hair dye supplies', amount: 320, date: '3 days ago', vendor: 'Color Pro' },
          ],
          expenseTrends: [
            { period: 'Jan', amount: 3800 },
            { period: 'Feb', amount: 4100 },
            { period: 'Mar', amount: 4200 },
            { period: 'Apr', amount: 4280 },
            { period: 'May', amount: 4350 },
            { period: 'Jun', amount: 4400 },
            { period: 'Jul', amount: 4500 },
            { period: 'Aug', amount: 4600 },
            { period: 'Sep', amount: 4550 },
            { period: 'Oct', amount: 4700 },
            { period: 'Nov', amount: 4800 },
            { period: 'Dec', amount: 5000 },
          ],
        };
    }
  };

  const { expenseStats, expenseCategories, recentExpenses, expenseTrends } = getPeriodData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense <Text style={styles.highlightText}>Report</Text></Text>
      </View>
      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        {timePeriods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          {expenseStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Expense Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Categories</Text>
          {expenseCategories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.category}</Text>
              </View>
              <View style={styles.categoryAmount}>
                <Text style={styles.categoryValue}>₹{category.amount.toLocaleString('en-IN')}</Text>
                <Text style={styles.categoryPercentage}>{category.percentage}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {recentExpenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseIcon}>
                <Ionicons name="receipt" size={20} color="#F59E0B" />
              </View>
              <View style={styles.expenseContent}>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseVendor}>{expense.vendor}</Text>
              </View>
              <View style={styles.expenseAmount}>
                <Text style={styles.expenseValue}>-₹{expense.amount.toLocaleString('en-IN')}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Expense Trends Graph */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Trends</Text>
          <View style={styles.chartContainer}>
            {expenseTrends.map((trend, index) => {
              const maxAmount = Math.max(...expenseTrends.map(t => t.amount));
              const barWidth = (trend.amount / maxAmount) * 150;
              const periodLabel = trend.period.split(' ')[0];
              const hasDateRange = trend.period.includes('(');
              const dateRange = hasDateRange ? trend.period.split(' (')[1].replace(')', '') : null;
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <Text style={styles.chartBarLabel}>{periodLabel}</Text>
                  <View style={styles.chartBarWrapper}>
                    <View style={[styles.chartBar, { width: barWidth, backgroundColor: '#F59E0B' }]} />
                    {hasDateRange && <Text style={styles.chartDateRange}>{dateRange}</Text>}
                  </View>
                  <Text style={styles.chartBarValue}>₹{trend.amount.toLocaleString('en-IN')}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
