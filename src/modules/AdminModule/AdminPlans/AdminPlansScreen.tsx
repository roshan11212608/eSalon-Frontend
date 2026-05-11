import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminPlansScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Plans</Text>
          
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Basic Plan</Text>
              <Text style={styles.planPrice}>₹999/month</Text>
            </View>
            <Text style={styles.planDescription}>Perfect for small salons</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.feature}>• Up to 5 staff members</Text>
              <Text style={styles.feature}>• Basic reports</Text>
              <Text style={styles.feature}>• Email support</Text>
            </View>
          </View>

          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Professional</Text>
              <Text style={styles.planPrice}>₹2,499/month</Text>
            </View>
            <Text style={styles.planDescription}>For growing businesses</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.feature}>• Up to 20 staff members</Text>
              <Text style={styles.feature}>• Advanced analytics</Text>
              <Text style={styles.feature}>• Priority support</Text>
              <Text style={styles.feature}>• Custom branding</Text>
            </View>
          </View>

          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Enterprise</Text>
              <Text style={styles.planPrice}>₹4,999/month</Text>
            </View>
            <Text style={styles.planDescription}>For large salon chains</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.feature}>• Unlimited staff</Text>
              <Text style={styles.feature}>• Multi-location support</Text>
              <Text style={styles.feature}>• 24/7 phone support</Text>
              <Text style={styles.feature}>• API access</Text>
              <Text style={styles.feature}>• Dedicated manager</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#f7b638',
    borderRadius: 12,
    padding: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f7b638',
  },
  planDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  planFeatures: {
    marginTop: 8,
  },
  feature: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
});
