import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../shared/theme/colors';

export default function StaffDashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.title}>Staff Dashboard</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary.main} />
            </View>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Today&apos;s Appointments</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.status.success} />
            </View>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={24} color={colors.primary.main} />
            </View>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>

        {/* Schedule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
          
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTimeBadge}>
              <Text style={styles.timeText}>10:00</Text>
              <Text style={styles.ampmText}>AM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.customerName}>Sarah Johnson</Text>
              <Text style={styles.serviceText}>Haircut & Style</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Upcoming</Text>
            </View>
          </View>
          
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTimeBadge}>
              <Text style={styles.timeText}>11:30</Text>
              <Text style={styles.ampmText}>AM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.customerName}>Mike Chen</Text>
              <Text style={styles.serviceText}>Beard Trim</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Upcoming</Text>
            </View>
          </View>
          
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTimeBadge}>
              <Text style={styles.timeText}>2:00</Text>
              <Text style={styles.ampmText}>PM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.customerName}>Emma Wilson</Text>
              <Text style={styles.serviceText}>Hair Coloring</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <View style={styles.actionCard}>
              <Ionicons name="add-circle-outline" size={32} color={colors.primary.main} />
              <Text style={styles.actionText}>New Activity</Text>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="people-outline" size={32} color={colors.primary.main} />
              <Text style={styles.actionText}>Customers</Text>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="wallet-outline" size={32} color={colors.primary.main} />
              <Text style={styles.actionText}>Payments</Text>
            </View>
            <View style={styles.actionCard}>
              <Ionicons name="bar-chart-outline" size={32} color={colors.primary.main} />
              <Text style={styles.actionText}>Reports</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gold.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  scheduleItem: {
    backgroundColor: colors.background.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  scheduleTimeBadge: {
    backgroundColor: colors.gold.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary.main,
  },
  ampmText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary.main,
  },
  scheduleDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusBadge: {
    backgroundColor: colors.gold.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary.main,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.background.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
  },
});
