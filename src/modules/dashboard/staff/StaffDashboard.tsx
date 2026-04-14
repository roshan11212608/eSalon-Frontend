import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/staffDashboard.styles';

export default function StaffDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Staff Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, Jimmy!</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Todays Appointments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.scheduleItem}>
          <View style={styles.scheduleTime}>
            <Text style={styles.timeText}>10:00 AM</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.customerName}>Sarah Johnson</Text>
            <Text style={styles.serviceText}>Haircut & Style</Text>
          </View>
        </View>
        
        <View style={styles.scheduleItem}>
          <View style={styles.scheduleTime}>
            <Text style={styles.timeText}>11:30 AM</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.customerName}>Mike Chen</Text>
            <Text style={styles.serviceText}>Beard Trim</Text>
          </View>
        </View>
        
        <View style={styles.scheduleItem}>
          <View style={styles.scheduleTime}>
            <Text style={styles.timeText}>2:00 PM</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.customerName}>Emma Wilson</Text>
            <Text style={styles.serviceText}>Hair Coloring</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    marginBottom: 24,
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
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  scheduleItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleTime: {
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  scheduleDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
