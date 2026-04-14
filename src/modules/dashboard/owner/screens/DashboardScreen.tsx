import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function OwnerDashboardScreen() {
  console.log('OwnerDashboardScreen: Component rendering...');
  
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  
  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Add haptic feedback
    Haptics.notificationAsync();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  try {
    return (
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
      >
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Owner Dashboard</Text>
              <Text style={styles.subtitle}>Welcome back!</Text>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Today&apos;s Appointments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Active Staff</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>$2,450</Text>
            <Text style={styles.statLabel}>Today&apos;s Revenue</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton} 
              onPress={() => handleQuickAction('new-appointment')}
            >
              <Ionicons name="calendar" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>New Appointment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton} 
              onPress={() => handleQuickAction('manage-staff')}
            >
              <Ionicons name="people" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>Manage Staff</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton} 
              onPress={() => handleQuickAction('view-reports')}
            >
              <Ionicons name="bar-chart" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>View Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton} 
              onPress={() => handleQuickAction('settings')}
            >
              <Ionicons name="settings" size={24} color="#007AFF" />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Appointments</Text>
          <View style={styles.appointmentItem}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentName}>Sarah Johnson</Text>
              <Text style={styles.appointmentService}>Haircut & Styling</Text>
              <Text style={styles.appointmentTime}>10:30 AM</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
          
          <View style={styles.appointmentItem}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentName}>Mike Davis</Text>
              <Text style={styles.appointmentService}>Beard Trim</Text>
              <Text style={styles.appointmentTime}>11:00 AM</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={[styles.statusText, styles.statusPending]}>Pending</Text>
            </View>
          </View>
          
          <View style={styles.appointmentItem}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentName}>Emma Wilson</Text>
              <Text style={styles.appointmentService}>Full Color</Text>
              <Text style={styles.appointmentTime}>2:00 PM</Text>
            </View>
            <View style={styles.appointmentStatus}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Staff Status</Text>
          <View style={styles.staffItem}>
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>John Smith</Text>
              <Text style={styles.staffRole}>Senior Stylist</Text>
            </View>
            <View style={styles.staffStatus}>
              <View style={[styles.statusDot, styles.statusActive]} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
          
          <View style={styles.staffItem}>
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>Lisa Chen</Text>
              <Text style={styles.staffRole}>Color Specialist</Text>
            </View>
            <View style={styles.staffStatus}>
              <View style={[styles.statusDot, styles.statusActive]} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
          
          <View style={styles.staffItem}>
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>Tom Brown</Text>
              <Text style={styles.staffRole}>Junior Stylist</Text>
            </View>
            <View style={styles.staffStatus}>
              <View style={[styles.statusDot, styles.statusInactive]} />
              <Text style={styles.statusText}>Off Duty</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New appointment booked</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Ionicons name="calendar" size={16} color="#6B7280" />
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Staff member checked in</Text>
              <Text style={styles.activityTime}>3 hours ago</Text>
            </View>
            <Ionicons name="person-add" size={16} color="#6B7280" />
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Payment received</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
            <Ionicons name="card" size={16} color="#6B7280" />
          </View>
        </View>
      </ScrollView>
    );
  } catch (error) {
    console.error('OwnerDashboardScreen: Error rendering component:', error);
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Error Loading Dashboard</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 12,
    marginBottom: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
    title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  appointmentItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  appointmentService: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  appointmentStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  statusPending: {
    color: '#F59E0B',
  },
  staffItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  staffRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  staffStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusActive: {
    backgroundColor: '#10B981',
  },
  statusInactive: {
    backgroundColor: '#EF4444',
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});
