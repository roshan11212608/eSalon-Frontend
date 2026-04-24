import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from './styles/paymentReport.styles';
import { reportsService, PaymentReportResponse } from '../../../services/reports/reportsService';

export default function PaymentReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<PaymentReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timePeriods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const fetchPaymentReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getPaymentReport(undefined, selectedPeriod);
      console.log('Payment report data received:', data);
      setReportData(data);
    } catch (err: any) {
      setError('Failed to load payment report');
      console.error('Error fetching payment report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const getPeriodData = () => {
    if (!reportData) {
      return {
        payrollStats: [],
        staffPayroll: [],
      };
    }
    return {
      payrollStats: reportData.payrollStats || [],
      staffPayroll: reportData.staffPayroll || [],
    };
  };

  const { payrollStats, staffPayroll } = getPeriodData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10B981';
      case 'partial':
        return '#F59E0B';
      default:
        return '#EF4444';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Fully Paid';
      case 'partial':
        return 'Partial';
      default:
        return 'Pending';
    }
  };

  const isPayButtonDisabled = (staff: any) => {
    const remainingAmount = parseFloat(staff.remainingAmount.replace('₹', '').replace(',', ''));
    return staff.status === 'paid' || remainingAmount <= 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment <Text style={styles.highlightText}>Report</Text></Text>
      </View>
      <ScrollView style={styles.scrollView}>
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
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Loading payment data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchPaymentReport}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Payroll Statistics */}
            <View style={styles.statsContainer}>
              {payrollStats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Staff Payroll Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Staff Payroll</Text>
              {staffPayroll.map((staff) => (
                <View key={staff.id} style={styles.payrollCard}>
                  <View style={styles.payrollHeader}>
                    <View style={styles.staffInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{staff.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.staffDetails}>
                        <Text style={styles.staffName}>{staff.name}</Text>
                        <Text style={styles.staffRole}>{staff.role}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(staff.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(staff.status) }]}>
                        {getStatusText(staff.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.payrollDetails}>
                    <View style={styles.payrollRow}>
                      <View style={styles.payrollItem}>
                        <Text style={styles.payrollLabel}>Total Commission</Text>
                        <Text style={styles.payrollAmount}>{staff.totalEarnings}</Text>
                      </View>
                      <View style={styles.payrollItem}>
                        <Text style={styles.payrollLabel}>Paid</Text>
                        <Text style={[styles.payrollAmount, styles.paidAmount]}>{staff.paidAmount}</Text>
                      </View>
                      <View style={styles.payrollItem}>
                        <Text style={styles.payrollLabel}>Current Due</Text>
                        <Text style={[styles.payrollAmount, styles.currentDueAmount]}>{staff.currentMonthRemaining}</Text>
                      </View>
                    </View>

                    <View style={styles.previousMonthRow}>
                      <Text style={styles.previousMonthLabel}>Previous Month Commission</Text>
                      <Text style={styles.previousMonthAmount}>{staff.previousMonthCommission}</Text>
                    </View>

                    <View style={styles.totalRemainingRow}>
                      <Text style={styles.totalRemainingLabel}>Total Remaining</Text>
                      <Text style={styles.totalRemainingAmount}>{staff.remainingAmount}</Text>
                    </View>
                    
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${(parseFloat(staff.paidAmount.replace('₹', '').replace(',', '')) / parseFloat(staff.totalEarnings.replace('₹', '').replace(',', ''))) * 100}%`,
                              backgroundColor: getStatusColor(staff.status)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {Math.round((parseFloat(staff.paidAmount.replace('₹', '').replace(',', '')) / parseFloat(staff.totalEarnings.replace('₹', '').replace(',', ''))) * 100)}% Paid
                      </Text>
                    </View>
                    
                    <View style={styles.lastPaymentRow}>
                      <Ionicons name="calendar-outline" size={14} color="#64748b" />
                      <Text style={styles.lastPaymentText}>Last Payment: {staff.lastPaymentDate}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.payButton,
                        isPayButtonDisabled(staff) && styles.payButtonDisabled,
                      ]}
                      onPress={() => {
                        if (!isPayButtonDisabled(staff)) {
                          router.push({
                            pathname: '/(owner-tabs)/payments/addPayment',
                            params: {
                              employeeId: staff.id.toString(),
                              employeeName: staff.name,
                              amount: staff.remainingAmount.replace('₹', '').replace(',', ''),
                            }
                          } as any);
                        }
                      }}
                      disabled={isPayButtonDisabled(staff)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.payButtonText,
                        isPayButtonDisabled(staff) && styles.payButtonTextDisabled,
                      ]}>
                        {isPayButtonDisabled(staff) ? (staff.status === 'paid' ? 'Fully Paid' : 'No Due') : `Pay ₹${staff.remainingAmount}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
