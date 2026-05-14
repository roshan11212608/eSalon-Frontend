import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function PaymentFailedScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.iconContainer}>
          <Ionicons name="close-circle" size={80} color="#EF4444" />
        </View>

        <Text style={s.title}>Payment Failed</Text>
        <Text style={s.subtitle}>We couldn't process your payment</Text>

        <View style={s.card}>
          <Text style={s.cardText}>
            There was an issue processing your payment. Please try again or contact support if the problem persists.
          </Text>
        </View>

        <TouchableOpacity
          style={s.button}
          onPress={() => router.back()}
        >
          <Text style={s.buttonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryButton}
          onPress={() => router.replace('/(owner-tabs)/subscriptions')}
        >
          <Text style={s.secondaryButtonText}>Back to Subscriptions</Text>
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
    backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
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
  cardText: {
    fontSize: 14, color: '#6B7280', lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%', backgroundColor: '#f7b638',
    paddingVertical: 16, borderRadius: 12, alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16, fontWeight: '700', color: '#1a1a1a',
  },
  secondaryButton: {
    width: '100%', backgroundColor: 'transparent',
    paddingVertical: 16, borderRadius: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    fontSize: 16, fontWeight: '600', color: '#6B7280',
  },
});
