import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ScrollView, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './styles/register.styles';
import { AuthService, type RegisterData } from '../../services/authService';

export default function Register() {
  const { email: emailParam } = useLocalSearchParams<{ email: string }>();
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Check if user is coming from verified OTP flow
  useEffect(() => {
    console.log('Register.tsx - emailParam:', emailParam);
    if (emailParam) {
      console.log('Register.tsx - Setting verified email and showing registration form');
      setVerifiedEmail(emailParam);
      setShowEmailVerification(false);
      setShowRegistrationForm(true);
    }
  }, [emailParam]);

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
      const message = await AuthService.sendOtp({ email });
      setIsOtpSent(true);
      Alert.alert('Success', message);
    } catch (error: any) {
      console.error('Send OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    if (otp.length !== 4) {
      Alert.alert('Error', 'OTP must be 4 digits');
      return;
    }

    setIsLoading(true);
    try {
      const message = await AuthService.verifyOtp({ email, otp });
      setVerifiedEmail(email);
      setShowEmailVerification(false);
      setShowRegistrationForm(true);
      Alert.alert('Success', message);
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    // Prevent multiple registration attempts
    if (isRegistered) {
      console.log('Registration already in progress or completed');
      return;
    }

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
    setIsRegistered(true);

    try {
      const registerData: RegisterData = {
        name: fullName.trim(),
        email: verifiedEmail,
        password: password,
        phoneNumber: mobileNumber.trim(),
        role: 'OWNER' as any,
        shopName: shopName.trim(),
        shopAddress: shopAddress.trim()
      };

      const response = await AuthService.register(registerData);

      // Reset UI state and show success screen
      setIsRegistered(false);
      setIsLoading(false);
      setRegistrationSuccess(true);
      setUserData(response);
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsRegistered(false); // Reset on error to allow retry
      setIsLoading(false);
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    }
  };

  // Show success screen after successful registration
  if (registrationSuccess && userData) {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="checkmark-circle" size={40} color="#10B981" />
            </View>
            <Text style={styles.logoText}>Success!</Text>
            <Text style={styles.tagline}>Account Created</Text>
          </View>

          {/* Success Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Account Created Successfully!</Text>
            <Text style={styles.subtitle}>
              Welcome {userData?.name}! Your shop &quot;{shopName}&quot; has been registered successfully.
            </Text>

            <View style={styles.successDetails}>
              <Text style={styles.successDetailText}>Email: {userData?.email}</Text>
              <Text style={styles.successDetailText}>Shop: {shopName}</Text>
              <Text style={styles.successDetailText}>Role: {userData?.role}</Text>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: '#10B981' }]}
              onPress={() => router.replace('/auth/login')}
            >
              <Text style={styles.registerButtonText}>
                Go to Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Show email verification screen (first screen)
  if (showEmailVerification) {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="cut" size={40} color="#f7b638" />
            </View>
            <Text style={styles.logoText}>eSalon</Text>
            <Text style={styles.tagline}>Premium Salon Management</Text>
          </View>

          {/* Email Verification Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Register Your Shop</Text>
            <Text style={styles.subtitle}>
              Create your salon account and start managing your business
            </Text>

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
                placeholderTextColor="#999999"
              />
            </View>

            {!isOtpSent ? (
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* OTP Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter 4-digit OTP"
                    keyboardType="number-pad"
                    maxLength={4}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999999"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.registerButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.backButton]}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.backButtonText}>Resend OTP</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[styles.backButton]}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Show registration form after email verification
  if (showRegistrationForm) {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="cut" size={40} color="#f7b638" />
            </View>
            <Text style={styles.logoText}>eSalon</Text>
            <Text style={styles.tagline}>Premium Salon Management</Text>
          </View>

          {/* Registration Form Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Register Your Shop</Text>
            <Text style={styles.subtitle}>
              Create your salon account and start managing your business
            </Text>
            <Text style={styles.verifiedEmail}>
              ✅ Email: {verifiedEmail}
            </Text>

            {/* Personal Information */}
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full name"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={verifiedEmail}
                editable={false}
                placeholder="Email address"
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Mobile number"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            {/* Shop Information */}
            <Text style={styles.sectionTitle}>Shop Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Shop Name</Text>
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder="Shop name"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Shop Address</Text>
              <TextInput
                style={styles.input}
                value={shopAddress}
                onChangeText={setShopAddress}
                placeholder="Shop address"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, (isLoading || isRegistered) && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading || isRegistered}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : isRegistered ? 'Processing...' : 'Create Account'}
              </Text>
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
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}
