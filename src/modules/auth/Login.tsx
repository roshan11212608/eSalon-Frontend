import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/src/shared/components/themed-text';
import { ThemedView } from '@/src/shared/components/themed-view';
import { AuthService } from '../../services/authService';
import { styles } from './styles/login.styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // For demo purposes, check if using demo credentials
      if (email === 'owner@esalon.com' && password === 'demo123') {
        console.log('Demo owner login detected');
        // Store demo owner data with shop (for testing)
        await AuthService.login({
          email,
          password
        });
        console.log('Owner data stored, redirecting to tabs');
        router.replace('/home');
        return;
      }
      
      if (email === 'staff@esalon.com' && password === 'demo123') {
        console.log('Demo staff login detected');
        // Store demo staff data with shop (for testing)
        await AuthService.login({
          email,
          password
        });
        console.log('Staff data stored, redirecting to tabs');
        router.replace('/home');
        return;
      }

      // If not demo credentials, show error
      Alert.alert('Login Failed', 'Invalid credentials. Use demo credentials: owner@esalon.com/demo123 or staff@esalon.com/demo123');
      
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Background Decorations */}
      <View style={styles.backgroundDecoration} />
      <View style={styles.backgroundDecoration2} />
      
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="cut-outline" size={50} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.logoText}>eSalon</ThemedText>
          <ThemedText style={styles.tagline}>Beauty Meets Technology</ThemedText>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>
            Transform your salon business with smart management
          </ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={styles.inputPlaceholder.color}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={styles.inputPlaceholder.color}
            />
          </View>

          <TouchableOpacity style={styles.forgotPasswordButton}>
            <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ThemedText style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.createAccountContainer}>
            <ThemedText style={styles.createAccountText}>New to eSalon? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
              <ThemedText style={styles.createAccountLink}>Create Account</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Temporary test button for onboarding */}
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: '#FF6B6B', marginTop: 10 }]}
            onPress={() => router.replace('/auth/login' as any)}
          >
            <ThemedText style={styles.loginButtonText}>
              Test Onboarding Screen
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
