import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/paymentReport.styles';

export default function PaymentReport() {
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
          payrollStats: [
            { label: 'Total Payroll', value: '₹1,500', icon: 'wallet', color: '#10B981' },
            { label: 'Paid', value: '₹800', icon: 'checkmark-circle', color: '#6366F1' },
            { label: 'Pending', value: '₹700', icon: 'time', color: '#F59E0B' },
          ],
          staffPayroll: [
            {
              id: 1,
              name: 'John Doe',
              role: 'Hair Stylist',
              totalEarnings: '₹500',
              paidAmount: '₹300',
              currentMonthRemaining: '₹200',
              previousMonthCommission: '₹12,000',
              remainingAmount: '₹12,200',
              lastPaymentDate: 'Today',
              status: 'partial',
            },
            {
              id: 2,
              name: 'Jane Smith',
              role: 'Color Specialist',
              totalEarnings: '₹600',
              paidAmount: '₹300',
              currentMonthRemaining: '₹300',
              previousMonthCommission: '₹14,500',
              remainingAmount: '₹14,800',
              lastPaymentDate: 'Today',
              status: 'partial',
            },
            {
              id: 3,
              name: 'Mike Johnson',
              role: 'Barber',
              totalEarnings: '₹400',
              paidAmount: '₹200',
              currentMonthRemaining: '₹200',
              previousMonthCommission: '₹7,500',
              remainingAmount: '₹7,700',
              lastPaymentDate: 'Today',
              status: 'partial',
            },
          ],
        };
      case 'week':
        return {
          payrollStats: [
            { label: 'Total Payroll', value: '₹12,000', icon: 'wallet', color: '#10B981' },
            { label: 'Paid', value: '₹8,500', icon: 'checkmark-circle', color: '#6366F1' },
            { label: 'Pending', value: '₹3,500', icon: 'time', color: '#F59E0B' },
          ],
          staffPayroll: [
            {
              id: 1,
              name: 'John Doe',
              role: 'Hair Stylist',
              totalEarnings: '₹4,000',
              paidAmount: '₹3,000',
              currentMonthRemaining: '₹1,000',
              previousMonthCommission: '₹12,000',
              remainingAmount: '₹13,000',
              lastPaymentDate: '20 Apr 2026',
              status: 'partial',
            },
            {
              id: 2,
              name: 'Jane Smith',
              role: 'Color Specialist',
              totalEarnings: '₹5,000',
              paidAmount: '₹3,500',
              currentMonthRemaining: '₹1,500',
              previousMonthCommission: '₹14,500',
              remainingAmount: '₹16,000',
              lastPaymentDate: '19 Apr 2026',
              status: 'partial',
            },
            {
              id: 3,
              name: 'Mike Johnson',
              role: 'Barber',
              totalEarnings: '₹3,000',
              paidAmount: '₹2,000',
              currentMonthRemaining: '₹1,000',
              previousMonthCommission: '₹7,500',
              remainingAmount: '₹8,500',
              lastPaymentDate: '18 Apr 2026',
              status: 'partial',
            },
          ],
        };
      case 'month':
      default:
        return {
          payrollStats: [
            { label: 'Total Payroll', value: '₹45,000', icon: 'wallet', color: '#10B981' },
            { label: 'Paid', value: '₹32,500', icon: 'checkmark-circle', color: '#6366F1' },
            { label: 'Pending', value: '₹12,500', icon: 'time', color: '#F59E0B' },
          ],
          staffPayroll: [
            {
              id: 1,
              name: 'John Doe',
              role: 'Hair Stylist',
              totalEarnings: '₹15,000',
              paidAmount: '₹12,000',
              currentMonthRemaining: '₹3,000',
              previousMonthCommission: '₹12,000',
              remainingAmount: '₹15,000',
              lastPaymentDate: '15 Apr 2026',
              status: 'partial',
            },
            {
              id: 2,
              name: 'Jane Smith',
              role: 'Color Specialist',
              totalEarnings: '₹18,000',
              paidAmount: '₹10,500',
              currentMonthRemaining: '₹7,500',
              previousMonthCommission: '₹14,500',
              remainingAmount: '₹22,000',
              lastPaymentDate: '10 Apr 2026',
              status: 'partial',
            },
            {
              id: 3,
              name: 'Mike Johnson',
              role: 'Barber',
              totalEarnings: '₹8,000',
              paidAmount: '₹8,000',
              currentMonthRemaining: '₹0',
              previousMonthCommission: '₹7,500',
              remainingAmount: '₹7,500',
              lastPaymentDate: '20 Apr 2026',
              status: 'partial',
            },
            {
              id: 4,
              name: 'Sarah Wilson',
              role: 'Beautician',
              totalEarnings: '₹4,000',
              paidAmount: '₹2,000',
              currentMonthRemaining: '₹2,000',
              previousMonthCommission: '₹5,500',
              remainingAmount: '₹7,500',
              lastPaymentDate: '18 Apr 2026',
              status: 'partial',
            },
          ],
        };
    }
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
                    staff.status === 'paid' && styles.payButtonDisabled,
                  ]}
                  onPress={() => {
                    if (staff.status !== 'paid') {
                      console.log(`Pay ${staff.name}: ${staff.remainingAmount}`);
                    }
                  }}
                  disabled={staff.status === 'paid'}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.payButtonText,
                    staff.status === 'paid' && styles.payButtonTextDisabled,
                  ]}>
                    {staff.status === 'paid' ? 'Fully Paid' : `Pay ₹${staff.remainingAmount}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
