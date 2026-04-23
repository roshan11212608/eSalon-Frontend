import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/financialSummary.styles';

export default function FinancialSummary() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'today':
        const revenueToday = 8500;
        const expensesToday = 2800;
        const profitToday = revenueToday - expensesToday;
        const profitMarginToday = ((profitToday / revenueToday) * 100).toFixed(2);

        return {
          financialStats: [
            { label: 'Total Revenue', value: `₹${revenueToday.toLocaleString('en-IN')}`, icon: 'cash', color: '#10B981' },
            { label: 'Total Expenses', value: `₹${expensesToday.toLocaleString('en-IN')}`, icon: 'wallet', color: '#EF4444' },
            { label: 'Net Profit', value: `₹${profitToday.toLocaleString('en-IN')}`, icon: 'trending-up', color: '#6366F1' },
            { label: 'Profit Margin', value: `${profitMarginToday}%`, icon: 'pie-chart', color: '#F59E0B' },
          ],
          financialBreakdown: [
            { category: 'Revenue', amount: `₹${revenueToday.toLocaleString('en-IN')}`, percentage: '100%', color: '#10B981' },
            { category: 'Expenses', amount: `₹${expensesToday.toLocaleString('en-IN')}`, percentage: `${((expensesToday / revenueToday) * 100).toFixed(0)}%`, color: '#EF4444' },
            { category: 'Profit', amount: `₹${profitToday.toLocaleString('en-IN')}`, percentage: `${profitMarginToday}%`, color: '#6366F1' },
          ],
          monthlyTrends: [
            { month: 'W1 (Apr 1-7)', revenue: '₹7,200', expenses: '₹2,500', profit: '₹4,700' },
            { month: 'W2 (Apr 8-14)', revenue: '₹8,000', expenses: '₹2,700', profit: '₹5,300' },
            { month: 'W3 (Apr 15-21)', revenue: '₹8,500', expenses: '₹2,800', profit: '₹5,700' },
            { month: 'W4 (Apr 22-28)', revenue: '₹8,200', expenses: '₹2,600', profit: '₹5,600' },
            { month: 'W5 (Apr 29-30)', revenue: '₹8,500', expenses: '₹2,800', profit: '₹5,700' },
          ],
          yearlyTrends: [
            { year: '2021', revenue: '₹18,00,000', expenses: '₹6,50,000', profit: '₹11,50,000' },
            { year: '2022', revenue: '₹21,00,000', expenses: '₹7,20,000', profit: '₹13,80,000' },
            { year: '2023', revenue: '₹24,00,000', expenses: '₹8,00,000', profit: '₹16,00,000' },
            { year: '2024', revenue: '₹25,20,000', expenses: '₹8,70,000', profit: '₹16,50,000' },
          ],
        };
      case 'week':
        const revenueWeek = 52000;
        const expensesWeek = 18500;
        const profitWeek = revenueWeek - expensesWeek;
        const profitMarginWeek = ((profitWeek / revenueWeek) * 100).toFixed(2);

        return {
          financialStats: [
            { label: 'Total Revenue', value: `₹${revenueWeek.toLocaleString('en-IN')}`, icon: 'cash', color: '#10B981' },
            { label: 'Total Expenses', value: `₹${expensesWeek.toLocaleString('en-IN')}`, icon: 'wallet', color: '#EF4444' },
            { label: 'Net Profit', value: `₹${profitWeek.toLocaleString('en-IN')}`, icon: 'trending-up', color: '#6366F1' },
            { label: 'Profit Margin', value: `${profitMarginWeek}%`, icon: 'pie-chart', color: '#F59E0B' },
          ],
          financialBreakdown: [
            { category: 'Revenue', amount: `₹${revenueWeek.toLocaleString('en-IN')}`, percentage: '100%', color: '#10B981' },
            { category: 'Expenses', amount: `₹${expensesWeek.toLocaleString('en-IN')}`, percentage: `${((expensesWeek / revenueWeek) * 100).toFixed(0)}%`, color: '#EF4444' },
            { category: 'Profit', amount: `₹${profitWeek.toLocaleString('en-IN')}`, percentage: `${profitMarginWeek}%`, color: '#6366F1' },
          ],
          monthlyTrends: [
            { month: 'W1 (Apr 1-7)', revenue: '₹45,000', expenses: '₹16,000', profit: '₹29,000' },
            { month: 'W2 (Apr 8-14)', revenue: '₹48,500', expenses: '₹17,200', profit: '₹31,300' },
            { month: 'W3 (Apr 15-21)', revenue: '₹52,000', expenses: '₹18,500', profit: '₹33,500' },
            { month: 'W4 (Apr 22-28)', revenue: '₹50,000', expenses: '₹17,500', profit: '₹32,500' },
            { month: 'W5 (Apr 29-30)', revenue: '₹52,000', expenses: '₹18,500', profit: '₹33,500' },
          ],
          yearlyTrends: [
            { year: '2021', revenue: '₹18,00,000', expenses: '₹6,50,000', profit: '₹11,50,000' },
            { year: '2022', revenue: '₹21,00,000', expenses: '₹7,20,000', profit: '₹13,80,000' },
            { year: '2023', revenue: '₹24,00,000', expenses: '₹8,00,000', profit: '₹16,00,000' },
            { year: '2024', revenue: '₹25,20,000', expenses: '₹8,70,000', profit: '₹16,50,000' },
          ],
        };
      case 'month':
      default:
        const revenueMonth = 210000;
        const expensesMonth = 72500;
        const profitMonth = revenueMonth - expensesMonth;
        const profitMarginMonth = ((profitMonth / revenueMonth) * 100).toFixed(2);

        return {
          financialStats: [
            { label: 'Total Revenue', value: `₹${revenueMonth.toLocaleString('en-IN')}`, icon: 'cash', color: '#10B981' },
            { label: 'Total Expenses', value: `₹${expensesMonth.toLocaleString('en-IN')}`, icon: 'wallet', color: '#EF4444' },
            { label: 'Net Profit', value: `₹${profitMonth.toLocaleString('en-IN')}`, icon: 'trending-up', color: '#6366F1' },
            { label: 'Profit Margin', value: `${profitMarginMonth}%`, icon: 'pie-chart', color: '#F59E0B' },
          ],
          financialBreakdown: [
            { category: 'Revenue', amount: `₹${revenueMonth.toLocaleString('en-IN')}`, percentage: '100%', color: '#10B981' },
            { category: 'Expenses', amount: `₹${expensesMonth.toLocaleString('en-IN')}`, percentage: `${((expensesMonth / revenueMonth) * 100).toFixed(0)}%`, color: '#EF4444' },
            { category: 'Profit', amount: `₹${profitMonth.toLocaleString('en-IN')}`, percentage: `${profitMarginMonth}%`, color: '#6366F1' },
          ],
          monthlyTrends: [
            { month: 'Jan', revenue: '₹1,55,000', expenses: '₹52,500', profit: '₹1,02,500' },
            { month: 'Feb', revenue: '₹1,77,500', expenses: '₹57,000', profit: '₹1,20,500' },
            { month: 'Mar', revenue: '₹2,00,000', expenses: '₹61,500', profit: '₹1,38,500' },
            { month: 'Apr', revenue: '₹2,10,000', expenses: '₹72,500', profit: '₹1,37,500' },
            { month: 'May', revenue: '₹2,15,000', expenses: '₹68,000', profit: '₹1,47,000' },
            { month: 'Jun', revenue: '₹2,20,000', expenses: '₹70,000', profit: '₹1,50,000' },
            { month: 'Jul', revenue: '₹2,30,000', expenses: '₹72,500', profit: '₹1,57,500' },
            { month: 'Aug', revenue: '₹2,40,000', expenses: '₹75,000', profit: '₹1,65,000' },
            { month: 'Sep', revenue: '₹2,35,000', expenses: '₹73,000', profit: '₹1,62,000' },
            { month: 'Oct', revenue: '₹2,45,000', expenses: '₹76,000', profit: '₹1,69,000' },
            { month: 'Nov', revenue: '₹2,50,000', expenses: '₹78,000', profit: '₹1,72,000' },
            { month: 'Dec', revenue: '₹2,60,000', expenses: '₹80,000', profit: '₹1,80,000' },
          ],
          yearlyTrends: [
            { year: '2021', revenue: '₹18,00,000', expenses: '₹6,50,000', profit: '₹11,50,000' },
            { year: '2022', revenue: '₹21,00,000', expenses: '₹7,20,000', profit: '₹13,80,000' },
            { year: '2023', revenue: '₹24,00,000', expenses: '₹8,00,000', profit: '₹16,00,000' },
            { year: '2024', revenue: '₹25,20,000', expenses: '₹8,70,000', profit: '₹16,50,000' },
          ],
        };
    }
  };

  const { financialStats, financialBreakdown, monthlyTrends, yearlyTrends } = getPeriodData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial <Text style={styles.highlightText}>Summary</Text></Text>
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
          {financialStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Financial Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Breakdown</Text>
          {financialBreakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownInfo}>
                <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
                <Text style={styles.breakdownCategory}>{item.category}</Text>
              </View>
              <View style={styles.breakdownAmount}>
                <Text style={styles.breakdownValue}>{item.amount}</Text>
                <Text style={styles.breakdownPercentage}>{item.percentage}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Trends Graph */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Trends</Text>
          <View style={styles.chartContainer}>
            {monthlyTrends.map((trend, index) => {
              const maxRevenue = Math.max(...monthlyTrends.map(t => parseFloat(t.revenue.replace('₹', '').replace(',', ''))));
              const barWidth = (parseFloat(trend.revenue.replace('₹', '').replace(',', '')) / maxRevenue) * 150;
              const weekLabel = trend.month.split(' ')[0];
              const hasDateRange = trend.month.includes('(');
              const dateRange = hasDateRange ? trend.month.split(' (')[1].replace(')', '') : null;
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <Text style={styles.chartBarLabel}>{weekLabel}</Text>
                  <View style={styles.chartBarWrapper}>
                    <View style={[styles.chartBar, { width: barWidth, backgroundColor: '#10B981' }]} />
                    {hasDateRange && <Text style={styles.chartDateRange}>{dateRange}</Text>}
                  </View>
                  <Text style={styles.chartBarValue}>{trend.revenue}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Yearly Trends Graph */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yearly Trends</Text>
          <View style={styles.chartContainer}>
            {yearlyTrends.map((trend, index) => {
              const maxRevenue = Math.max(...yearlyTrends.map(t => parseFloat(t.revenue.replace('₹', '').replace(',', ''))));
              const barWidth = (parseFloat(trend.revenue.replace('₹', '').replace(',', '')) / maxRevenue) * 150;
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <Text style={styles.chartBarLabel}>{trend.year}</Text>
                  <View style={styles.chartBarWrapper}>
                    <View style={[styles.chartBar, { width: barWidth, backgroundColor: '#6366F1' }]} />
                  </View>
                  <Text style={styles.chartBarValue}>{trend.revenue}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
