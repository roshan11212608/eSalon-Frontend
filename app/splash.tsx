import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { authStore } from '../src/store/authStore';

export default function Splash() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // After 5 seconds, redirect to appropriate screen
    const timer = setTimeout(() => {
      const state = authStore.getState();
      const isAuthenticated = state.isAuthenticated;
      const role = state.role?.toLowerCase() as 'owner' | 'staff' | 'admin' | null;

      if (!isAuthenticated || !state.token) {
        router.replace('/auth/login');
      } else {
        switch (role) {
          case 'owner':
            router.replace('/(owner-tabs)/home');
            break;
          case 'staff':
            router.replace('/(staff-tabs)/home');
            break;
          case 'admin':
            router.replace('/(admin-tabs)/dashboard');
            break;
          default:
            router.replace('/auth/login');
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logoIcon}>✂️</Text>
        <Text style={styles.appName}>eSalon</Text>
        <Text style={styles.tagline}>Premium Salon Management</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f7b638',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    letterSpacing: 1,
  },
});
