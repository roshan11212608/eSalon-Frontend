import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { planName, endDate, amount } = useLocalSearchParams();

  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        </View>

        <Text style={s.title}>Payment Successful!</Text>
        <Text style={s.subtitle}>Your subscription has been activated</Text>

        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>Plan:</Text>
            <Text style={s.value}>{planName || 'Premium Plan'}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Amount Paid:</Text>
            <Text style={s.value}>₹{amount || '0'}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Valid Until:</Text>
            <Text style={s.value}>{endDate || '30 days'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={s.button}
          onPress={() => router.replace('/(owner-tabs)/subscriptions')}
        >
          <Text style={s.buttonText}>Go to Subscriptions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F3' },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, paddingVertical: 40,
  },
  iconContainer: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28, fontWeight: '800', color: '#1a1a1a',
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: 16, color: '#6B7280', textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    width: '100%', backgroundColor: '#FFF', borderRadius: 16,
    padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  label: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  value: { fontSize: 14, color: '#1a1a1a', fontWeight: '600' },
  button: {
    width: '100%', backgroundColor: '#f7b638',
    paddingVertical: 16, borderRadius: 12, alignItems: 'center',
  },
  buttonText: {
    fontSize: 16, fontWeight: '700', color: '#1a1a1a',
  },
});
