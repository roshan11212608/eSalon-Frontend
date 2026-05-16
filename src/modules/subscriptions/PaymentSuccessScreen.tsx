import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { planName, endDate, amount } = useLocalSearchParams();

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        {/* Animated Success Icon */}
        <View style={s.iconWrapper}>
          <View style={s.iconContainer}>
            <Ionicons name="checkmark-circle" size={90} color="#10B981" />
          </View>
          <View style={s.iconRing} />
        </View>

        <Text style={s.title}>Payment Successful!</Text>
        <Text style={s.subtitle}>Your subscription has been activated successfully</Text>

        {/* Success Details Card */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="receipt" size={24} color="#F59E0B" />
            <Text style={s.cardTitle}>Payment Details</Text>
          </View>

          <View style={s.divider} />

          <View style={s.row}>
            <View style={s.labelContainer}>
              <Ionicons name="diamond" size={16} color="#6B7280" />
              <Text style={s.label}>Plan</Text>
            </View>
            <Text style={s.value}>{planName || 'Premium Plan'}</Text>
          </View>

          <View style={s.row}>
            <View style={s.labelContainer}>
              <Ionicons name="cash" size={16} color="#6B7280" />
              <Text style={s.label}>Amount Paid</Text>
            </View>
            <Text style={s.value}>₹{amount || '0'}</Text>
          </View>

          <View style={s.row}>
            <View style={s.labelContainer}>
              <Ionicons name="calendar" size={16} color="#6B7280" />
              <Text style={s.label}>Valid Until</Text>
            </View>
            <Text style={s.value}>{endDate || '30 days'}</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={s.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text style={s.infoText}>You can now enjoy all premium features</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={s.primaryButton}
          onPress={() => router.replace('/(owner-tabs)/subscriptions')}
        >
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
          <Text style={s.primaryButtonText}>Go to Subscriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryButton}
          onPress={() => router.replace('/(owner-tabs)')}
        >
          <Text style={s.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F3',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconWrapper: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#10B981',
    opacity: 0.2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
    flex: 1,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
});
