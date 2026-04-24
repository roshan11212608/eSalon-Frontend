import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/expenseReport.styles';
import { reportsService, ExpenseReportResponse } from '../../../services/reports/reportsService';

export default function ExpenseReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<ExpenseReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const fetchExpenseReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getExpenseReport(undefined, selectedPeriod);
      setReportData(data);
    } catch (err: any) {
      setError('Failed to load expense report');
      console.error('Error fetching expense report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const getPeriodData = () => {
    if (!reportData) {
      return {
        expenseStats: [],
        expenseCategories: [],
        recentExpenses: [],
        expenseTrends: [],
      };
    }
    return reportData;
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
            disabled={loading}
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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Loading expense data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchExpenseReport}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
      )}
    </View>
  );
}
