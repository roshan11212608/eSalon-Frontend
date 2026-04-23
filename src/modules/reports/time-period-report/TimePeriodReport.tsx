import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/timePeriodReport.styles';

export default function TimePeriodReport() {
  const { period } = useLocalSearchParams<{ period: string }>();
  const router = useRouter();

  const getPeriodTitle = () => {
    switch (period) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      default:
        return 'Report';
    }
  };

  const getPeriodDate = () => {
    const today = new Date();
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    switch (period) {
      case 'today':
        return formatDate(today);
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return formatDate(yesterday);
      case 'weekly':
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
      case 'monthly':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return `${formatDate(startOfMonth)} - ${formatDate(endOfMonth)}`;
      default:
        return formatDate(today);
    }
  };

  // Helper function to format numbers in Indian comma notation
  const formatIndianCurrency = (amount: number) => {
    const amountStr = amount.toString();
    let lastThree = amountStr.substring(amountStr.length - 3);
    const otherNumbers = amountStr.substring(0, amountStr.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return result;
  };

  const staffActivities = [
    {
      id: 1,
      staffName: 'John Doe',
      service: 'Haircut',
      customer: 'Alice Smith',
      amount: '₹25.00',
      time: '10:30 AM',
      earnings: '₹20',
      commission: '₹5.00',
    },
    {
      id: 2,
      staffName: 'Jane Smith',
      service: 'Hair Coloring',
      customer: 'Bob Johnson',
      amount: '₹80.00',
      time: '11:15 AM',
      earnings: '₹640000.00',
      commission: '₹16.00',
    },
    {
      id: 3,
      staffName: 'John Doe',
      service: 'Beard Trim',
      customer: 'Charlie Brown',
      amount: '₹15.00',
      time: '12:00 PM',
      earnings: '₹12.00',
      commission: '₹3.00',
    },
    {
      id: 4,
      staffName: 'Sarah Wilson',
      service: 'Facial',
      customer: 'Diana Prince',
      amount: '₹60.00',
      time: '2:30 PM',
      earnings: '₹48.00',
      commission: '₹12.00',
    },
  ];

  // Group activities by staff
  const groupedActivities = staffActivities.reduce((acc, activity) => {
    if (!acc[activity.staffName]) {
      acc[activity.staffName] = {
        activities: [],
        totalActivities: 0,
        totalEarnings: 0,
        totalCommission: 0,
      };
    }
    acc[activity.staffName].activities.push(activity);
    acc[activity.staffName].totalActivities += 1;
    acc[activity.staffName].totalEarnings += parseFloat(activity.earnings.replace('₹', ''));
    acc[activity.staffName].totalCommission += parseFloat(activity.commission.replace('₹', ''));
    return acc;
  }, {} as any);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{getPeriodTitle()} <Text style={styles.highlightText}>Report</Text></Text>
          <Text style={styles.dateText}>{getPeriodDate()}</Text>
        </View>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.activitiesCard]}>
            <Text style={styles.summaryLabel}>Total Activities</Text>
            <Text style={styles.summaryValue}>{staffActivities.length}</Text>
          </View>
          <View style={[styles.summaryCard, styles.earningsCard]}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={styles.summaryValue}>₹{formatIndianCurrency(staffActivities.reduce((sum, a) => sum + parseFloat(a.earnings.replace('₹', '')), 0))}</Text>
          </View>
          <View style={[styles.summaryCard, styles.staffCard]}>
            <Text style={styles.summaryLabel}>Staff Earnings</Text>
            <Text style={styles.summaryValue}>₹{formatIndianCurrency(staffActivities.reduce((sum, a) => sum + parseFloat(a.commission.replace('₹', '')), 0))}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.profitCard]}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="trending-up" size={24} color="#ffffff" />
            </View>
            <Text style={styles.profitCardLabel}>Shop Profit</Text>
            <Text style={styles.profitCardValue}>₹{formatIndianCurrency(staffActivities.reduce((sum, a) => sum + parseFloat(a.earnings.replace('₹', '')), 0) - staffActivities.reduce((sum, a) => sum + parseFloat(a.commission.replace('₹', '')), 0))}</Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Net Profit</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Staff Report</Text>
          
          {Object.entries(groupedActivities).map(([staffName, data]: [string, any]) => (
            <View key={staffName} style={styles.staffActivityCard}>
              <View style={styles.activityRow}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{staffName.charAt(0)}</Text>
                  </View>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.staffName}>{staffName}</Text>
                </View>
                <View style={styles.activitiesCount}>
                  <Text style={styles.activitiesCountText}>{data.totalActivities}</Text>
                  <Text style={styles.activitiesCountLabel}>Activities</Text>
                </View>
              </View>
              <View style={styles.staffStatsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Earning</Text>
                  <Text style={styles.statValue}>₹{formatIndianCurrency(data.totalEarnings)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Commission</Text>
                  <Text style={styles.statValue}>₹{formatIndianCurrency(data.totalCommission)}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Staff Earnings Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Staff Earnings</Text>
            <View style={styles.chart}>
              {Object.entries(groupedActivities).map(([staffName, data]: [string, any], index: number) => {
                const maxEarning = Math.max(...Object.values(groupedActivities).map((d: any) => d.totalEarnings));
                const barHeight = (data.totalEarnings / maxEarning) * 150;
                const colors = ['#0554f0', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                return (
                  <View key={staffName} style={styles.chartBarContainer}>
                    <View style={styles.chartBarWrapper}>
                      <View style={[styles.chartBar, { height: barHeight, backgroundColor: colors[index % colors.length] }]} />
                    </View>
                    <Text style={styles.chartBarLabel}>{staffName.split(' ')[0]}</Text>
                    <Text style={styles.chartBarValue}>₹{formatIndianCurrency(data.totalEarnings)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
