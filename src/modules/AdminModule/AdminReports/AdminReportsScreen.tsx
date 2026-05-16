import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ReportCard from './components/ReportCard';
import ReportFilter from './components/ReportFilter';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'revenue' | 'subscription' | 'payment' | 'salon' | 'transaction';
  format: 'csv' | 'pdf';
  lastGenerated?: string;
  icon: string;
}

export default function AdminReportsScreen() {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedType, setSelectedType] = useState('all');

  const reports: Report[] = [
    {
      id: 'revenue-daily',
      name: 'Daily Revenue Report',
      description: 'Detailed breakdown of daily revenue including platform fees and transactions',
      type: 'revenue',
      format: 'csv',
      lastGenerated: 'Today',
      icon: 'cash-outline',
    },
    {
      id: 'revenue-monthly',
      name: 'Monthly Revenue Report',
      description: 'Comprehensive monthly revenue analysis with trends and comparisons',
      type: 'revenue',
      format: 'pdf',
      lastGenerated: 'Yesterday',
      icon: 'bar-chart-outline',
    },
    {
      id: 'subscription-summary',
      name: 'Subscription Summary',
      description: 'Overview of subscription plans, active subscriptions, and renewal rates',
      type: 'subscription',
      format: 'csv',
      lastGenerated: '2 days ago',
      icon: 'card-outline',
    },
    {
      id: 'payment-analytics',
      name: 'Payment Analytics',
      description: 'Payment success rates, failed transactions, and method breakdown',
      type: 'payment',
      format: 'pdf',
      lastGenerated: '3 days ago',
      icon: 'analytics-outline',
    },
    {
      id: 'salon-performance',
      name: 'Salon Performance Report',
      description: 'Individual salon performance metrics, rankings, and contribution analysis',
      type: 'salon',
      format: 'csv',
      lastGenerated: '1 week ago',
      icon: 'storefront-outline',
    },
    {
      id: 'transaction-log',
      name: 'Transaction Log',
      description: 'Complete transaction history with status and payment method details',
      type: 'transaction',
      format: 'csv',
      lastGenerated: '1 week ago',
      icon: 'list-outline',
    },
    {
      id: 'churn-analysis',
      name: 'Churn Analysis',
      description: 'Detailed analysis of salon churn rates and retention metrics',
      type: 'salon',
      format: 'pdf',
      lastGenerated: '2 weeks ago',
      icon: 'trending-down-outline',
    },
    {
      id: 'yearly-summary',
      name: 'Yearly Revenue Summary',
      description: 'Annual revenue overview with month-by-month breakdown and growth analysis',
      type: 'revenue',
      format: 'pdf',
      lastGenerated: '1 month ago',
      icon: 'calendar-outline',
    },
  ];

  const filteredReports = reports.filter((report) => {
    if (selectedType === 'all') return true;
    return report.type === selectedType;
  });

  const handleDownloadReport = (report: Report) => {
    Alert.alert(
      'Generate Report',
      `Generate ${report.name} (${report.format.toUpperCase()}) for ${selectedPeriod}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            // TODO: Implement report generation
            Alert.alert('Success', `${report.name} will be generated and downloaded shortly.`);
          },
        },
      ]
    );
  };

  const handleScheduleReport = (report: Report) => {
    Alert.alert(
      'Schedule Report',
      `Schedule ${report.name} to be generated automatically?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Schedule',
          onPress: () => {
            // TODO: Implement report scheduling
            Alert.alert('Success', `${report.name} has been scheduled.`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Generate and download detailed analytics reports
        </Text>
      </View>

      <ReportFilter
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <View style={styles.reportsGrid}>
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onDownload={() => handleDownloadReport(report)}
            onSchedule={() => handleScheduleReport(report)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  reportsGrid: {
    padding: 20,
    gap: 16,
  },
});
