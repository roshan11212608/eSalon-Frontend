import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/staffReports.styles';

export default function StaffReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const getPeriodData = () => {
    const commissionRate = 50;

    switch (selectedPeriod) {
      case 'today':
        const serviceValueToday = 3000;
        const commissionToday = (serviceValueToday * commissionRate) / 100;
        const tipsToday = 700;
        const totalEarningsToday = commissionToday + tipsToday;
        const receivedToday = 1800;
        const pendingToday = totalEarningsToday - receivedToday;

        return {
          staffStats: [
            { label: 'Service Value', value: `₹${serviceValueToday.toLocaleString('en-IN')}`, icon: 'cash', color: '#10B981' },
            { label: 'Commission (50%)', value: `₹${commissionToday.toLocaleString('en-IN')}`, icon: 'trending-up', color: '#6366F1' },
            { label: 'Tips', value: `₹${tipsToday.toLocaleString('en-IN')}`, icon: 'gift', color: '#F59E0B' },
            { label: 'Total Earnings', value: `₹${totalEarningsToday.toLocaleString('en-IN')}`, icon: 'wallet', color: '#EF4444' },
          ],
          earningsBreakdown: [
            { category: 'Commission', amount: `₹${commissionToday.toLocaleString('en-IN')}`, percentage: `${commissionRate}%`, color: '#6366F1' },
            { category: 'Tips', amount: `₹${tipsToday.toLocaleString('en-IN')}`, percentage: `${((tipsToday / totalEarningsToday) * 100).toFixed(0)}%`, color: '#F59E0B' },
          ],
          paymentsSummary: [
            { label: 'Total Received', value: `₹${receivedToday.toLocaleString('en-IN')}`, icon: 'card', color: '#10B981' },
            { label: 'Pending', value: `₹${pendingToday.toLocaleString('en-IN')}`, icon: 'time', color: '#F59E0B' },
          ],
          monthlyTrends: [
            { month: 'W1 (Apr 1-7)', earnings: '₹2,400', activities: 10 },
            { month: 'W2 (Apr 8-14)', earnings: '₹2,700', activities: 11 },
            { month: 'W3 (Apr 15-21)', earnings: '₹2,800', activities: 11 },
            { month: 'W4 (Apr 22-28)', earnings: '₹2,900', activities: 12 },
            { month: 'W5 (Apr 29-30)', earnings: '₹3,000', activities: 12 },
          ],
          yearlyTrends: [
            { year: '2021', earnings: '₹6,00,000', activities: 2400 },
            { year: '2022', earnings: '₹7,00,000', activities: 2800 },
            { year: '2023', earnings: '₹8,00,000', activities: 3200 },
            { year: '2024', earnings: '₹8,40,000', activities: 3360 },
          ],
        };
      case 'week':
        const serviceValueWeek = 17000;
        const commissionWeek = (serviceValueWeek * commissionRate) / 100;
        const tipsWeek = 4000;
        const totalEarningsWeek = commissionWeek + tipsWeek;
        const receivedWeek = 10500;
        const pendingWeek = totalEarningsWeek - receivedWeek;

        return {
          staffStats: [
            { label: 'Service Value', value: `₹${serviceValueWeek.toLocaleString('en-IN')}`, icon: 'cash', color: '#10B981' },
            { label: 'Commission (50%)', value: `₹${commissionWeek.toLocaleString('en-IN')}`, icon: 'trending-up', color: '#6366F1' },
            { label: 'Tips', value: `₹${tipsWeek.toLocaleString('en-IN')}`, icon: 'gift', color: '#F59E0B' },
            { label: 'Total Earnings', value: `₹${totalEarningsWeek.toLocaleString('en-IN')}`, icon: 'wallet', color: '#EF4444' },
          ],
          earningsBreakdown: [
            { category: 'Commission', amount: `₹${commissionWeek.toLocaleString('en-IN')}`, percentage: `${commissionRate}%`, color: '#6366F1' },
            { category: 'Tips', amount: `₹${tipsWeek.toLocaleString('en-IN')}`, percentage: `${((tipsWeek / totalEarningsWeek) * 100).toFixed(0)}%`, color: '#F59E0B' },
          ],
          paymentsSummary: [
            { label: 'Total Received', value: `₹${receivedWeek.toLocaleString('en-IN')}`, icon: 'card', color: '#10B981' },
            { label: 'Pending', value: `₹${pendingWeek.toLocaleString('en-IN')}`, icon: 'time', color: '#F59E0B' },
          ],
          monthlyTrends: [
            { month: 'W1 (Apr 1-7)', earnings: '₹15,000', activities: 60 },
            { month: 'W2 (Apr 8-14)', earnings: '₹16,000', activities: 64 },
            { month: 'W3 (Apr 15-21)', earnings: '₹16,400', activities: 66 },
            { month: 'W4 (Apr 22-28)', earnings: '₹16,800', activities: 67 },
            { month: 'W5 (Apr 29-30)', earnings: '₹17,000', activities: 68 },
          ],
          yearlyTrends: [
            { year: '2021', earnings: '₹6,00,000', activities: 2400 },
            { year: '2022', earnings: '₹7,00,000', activities: 2800 },
            { year: '2023', earnings: '₹8,00,000', activities: 3200 },
            { year: '2024', earnings: '₹8,40,000', activities: 3360 },
          ],
        };
      case 'month':
      default:
        const serviceValueMonth = 70000;
        const commissionMonth = (serviceValueMonth * commissionRate) / 100;
        const tipsMonth = 16500;
        const totalEarningsMonth = commissionMonth + tipsMonth;
        const receivedMonth = 45000;
        const pendingMonth = totalEarningsMonth - receivedMonth;

        return {
          staffStats: [
            { label: 'Service Value', value: `₹${serviceValueMonth.toLocaleString('en-IN')}`, icon: 'cash', color: '#10B981' },
            { label: 'Commission (50%)', value: `₹${commissionMonth.toLocaleString('en-IN')}`, icon: 'trending-up', color: '#6366F1' },
            { label: 'Tips', value: `₹${tipsMonth.toLocaleString('en-IN')}`, icon: 'gift', color: '#F59E0B' },
            { label: 'Total Earnings', value: `₹${totalEarningsMonth.toLocaleString('en-IN')}`, icon: 'wallet', color: '#EF4444' },
          ],
          earningsBreakdown: [
            { category: 'Commission', amount: `₹${commissionMonth.toLocaleString('en-IN')}`, percentage: `${commissionRate}%`, color: '#6366F1' },
            { category: 'Tips', amount: `₹${tipsMonth.toLocaleString('en-IN')}`, percentage: `${((tipsMonth / totalEarningsMonth) * 100).toFixed(0)}%`, color: '#F59E0B' },
          ],
          paymentsSummary: [
            { label: 'Total Received', value: `₹${receivedMonth.toLocaleString('en-IN')}`, icon: 'card', color: '#10B981' },
            { label: 'Pending', value: `₹${pendingMonth.toLocaleString('en-IN')}`, icon: 'time', color: '#F59E0B' },
          ],
          monthlyTrends: [
            { month: 'Jan', earnings: '₹60,000', activities: 240 },
            { month: 'Feb', earnings: '₹64,000', activities: 255 },
            { month: 'Mar', earnings: '₹67,000', activities: 265 },
            { month: 'Apr', earnings: '₹70,000', activities: 280 },
            { month: 'May', earnings: '₹72,000', activities: 290 },
            { month: 'Jun', earnings: '₹74,000', activities: 295 },
            { month: 'Jul', earnings: '₹76,000', activities: 300 },
            { month: 'Aug', earnings: '₹78,000', activities: 305 },
            { month: 'Sep', earnings: '₹77,000', activities: 300 },
            { month: 'Oct', earnings: '₹80,000', activities: 310 },
            { month: 'Nov', earnings: '₹82,000', activities: 315 },
            { month: 'Dec', earnings: '₹84,000', activities: 320 },
          ],
          yearlyTrends: [
            { year: '2021', earnings: '₹6,00,000', activities: 2400 },
            { year: '2022', earnings: '₹7,00,000', activities: 2800 },
            { year: '2023', earnings: '₹8,00,000', activities: 3200 },
            { year: '2024', earnings: '₹8,40,000', activities: 3360 },
          ],
        };
    }
  };

  const { staffStats, earningsBreakdown, paymentsSummary, monthlyTrends, yearlyTrends } = getPeriodData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My <Text style={styles.highlightText}>Reports</Text></Text>
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
          {staffStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Earnings Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          {earningsBreakdown.map((item, index) => (
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

        {/* Payments Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments Summary</Text>
          <View style={styles.statsContainer}>
            {paymentsSummary.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Trends Graph */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Trends</Text>
          <View style={styles.chartContainer}>
            {monthlyTrends.map((trend, index) => {
              const maxEarnings = Math.max(...monthlyTrends.map(t => parseFloat(t.earnings.replace('₹', '').replace(',', ''))));
              const barWidth = (parseFloat(trend.earnings.replace('₹', '').replace(',', '')) / maxEarnings) * 150;
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
                  <Text style={styles.chartBarValue}>{trend.earnings}</Text>
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
              const maxEarnings = Math.max(...yearlyTrends.map(t => parseFloat(t.earnings.replace('₹', '').replace(',', ''))));
              const barWidth = (parseFloat(trend.earnings.replace('₹', '').replace(',', '')) / maxEarnings) * 150;
              return (
                <View key={index} style={styles.chartBarContainer}>
                  <Text style={styles.chartBarLabel}>{trend.year}</Text>
                  <View style={styles.chartBarWrapper}>
                    <View style={[styles.chartBar, { width: barWidth, backgroundColor: '#6366F1' }]} />
                  </View>
                  <Text style={styles.chartBarValue}>{trend.earnings}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
