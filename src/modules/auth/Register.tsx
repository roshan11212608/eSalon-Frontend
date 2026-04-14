import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/src/shared/components/themed-text';
import { ThemedView } from '@/src/shared/components/themed-view';
import { styles } from './styles/register.styles';
import { StorageService } from '../../services/storage/storageService';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsOtpSent(true);
      Alert.alert('Success', 'OTP has been sent to your email address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification (accept any 6-digit code for demo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp.length === 6) {
        setVerifiedEmail(email);
        setShowEmailVerification(false);
        setShowRegistrationForm(true);
        Alert.alert('Success', 'Email verified successfully!');
      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validate all fields
    if (!fullName || !verifiedEmail || !mobileNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    // Validate shop fields
    if (!shopName || !shopAddress) {
      Alert.alert('Error', 'Please fill in all shop details');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to register user
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user data as owner
      await StorageService.setAuthData({
        token: 'demo-token',
        role: 'owner' as any,
        isFirstTime: false,
      });

      Alert.alert(
        'Success!',
        `Your shop "${shopName}" has been registered successfully!`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)' as any),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show email verification screen (first screen)
  if (showEmailVerification) {
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
              <Ionicons name="cut-outline" size={45} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.logoText}>eSalon</ThemedText>
            <ThemedText style={styles.tagline}>Beauty Meets Technology</ThemedText>
          </View>

          {/* Email Verification Section */}
          <View style={styles.formSection}>
            <ThemedText style={styles.title}>Register Your Shop</ThemedText>
            <ThemedText style={styles.subtitle}>
              Create your salon account and start managing your business
            </ThemedText>

            {/* Email Input */}
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

            {!isOtpSent ? (
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                <ThemedText style={styles.registerButtonText}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <>
                {/* OTP Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter 6-digit OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={styles.inputPlaceholder.color}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  <ThemedText style={styles.registerButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.backButton]}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  <ThemedText style={styles.backButtonText}>Resend OTP</ThemedText>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.backButton]}
              onPress={() => {
                setShowEmailVerification(false);
                setEmail('');
                setOtp('');
                setIsOtpSent(false);
              }}
              disabled={isLoading}
            >
              <ThemedText style={styles.backButtonText}>Back</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  // Show registration form after email verification
  if (showRegistrationForm) {
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
              <Ionicons name="cut-outline" size={45} color="#FFFFFF" />
            </View>
            <ThemedText style={styles.logoText}>eSalon</ThemedText>
            <ThemedText style={styles.tagline}>Beauty Meets Technology</ThemedText>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <ThemedText style={styles.title}>Register Your Shop</ThemedText>
            <ThemedText style={styles.subtitle}>
              Create your salon account and start managing your business
            </ThemedText>
            <ThemedText style={styles.verifiedEmail}>
              ✅ Email: {verifiedEmail}
            </ThemedText>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Personal Information */}
            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full name"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor={styles.inputPlaceholder.color}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={verifiedEmail}
                editable={false}
                placeholder="Email address"
                placeholderTextColor={styles.inputPlaceholder.color}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Mobile number"
                keyboardType="phone-pad"
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

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={styles.inputPlaceholder.color}
              />
            </View>

            {/* Shop Information */}
            <ThemedText style={styles.sectionTitle}>Shop Information</ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder="Shop name"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor={styles.inputPlaceholder.color}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={shopAddress}
                onChangeText={setShopAddress}
                placeholder="Shop address"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor={styles.inputPlaceholder.color}
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <ThemedText style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.backButton]}
              onPress={() => {
                setShowRegistrationForm(false);
                setShowEmailVerification(true);
                setFullName('');
                setMobileNumber('');
                setPassword('');
                setConfirmPassword('');
                setShopName('');
                setShopAddress('');
              }}
              disabled={isLoading}
            >
              <ThemedText style={styles.backButtonText}>Back</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return null;
}
