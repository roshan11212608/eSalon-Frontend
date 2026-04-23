import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { styles } from './styles/reports.styles';
import ActivityStats from './activity-stats/ActivityStats';

export default function ReportsScreen() {

  const reportTypes = [
    {
      id: 4,
      title: 'Payment Report',
      description: 'Track all payments and transactions',
      icon: 'card-outline',
      color: '#10B981',
    },
    {
      id: 5,
      title: 'Expense Report',
      description: 'Monitor expenses and spending',
      icon: 'receipt-outline',
      color: '#F59E0B',
    },
    {
      id: 7,
      title: 'Service Analytics',
      description: 'Popular services and trends',
      icon: 'bar-chart-outline',
      color: '#F59E0B',
    },
    {
      id: 9,
      title: 'Financial Summary',
      description: 'Revenue, expenses, profit analysis',
      icon: 'wallet-outline',
      color: '#6366F1',
    },
  ];

  const handleReportPress = (report: any) => {
    Haptics.impactAsync();
    
    const routeMap: { [key: string]: string } = {
      'Payment Report': '/(owner-tabs)/reports/payment-report',
      'Expense Report': '/(owner-tabs)/reports/expense-report',
      'Service Analytics': '/(owner-tabs)/reports/service-analytics',
      'Financial Summary': '/(owner-tabs)/reports/financial-summary',
    };
    
    const route = routeMap[report.title];
    if (route) {
      router.push(route as any);
    } else {
      console.log('Report pressed:', report.title);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rep<Text style={styles.titleAccent}>orts</Text></Text>
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Activity Stats Section */}
          <ActivityStats />

          {/* Menu Section */}
          <View style={styles.menuSection}>
            {reportTypes.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.menuItem}
                onPress={() => handleReportPress(report)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={report.icon as any} size={18} style={styles.iconYellow} />
                  </View>
                  <Text style={styles.menuText}>{report.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} style={styles.iconGray} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
