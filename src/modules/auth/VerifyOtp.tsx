import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/src/shared/components/themed-text';
import { ThemedView } from '@/src/shared/components/themed-view';
import { AuthService } from '../../services/authService';
import { styles } from './styles/auth.styles';

export default function VerifyOtp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please restart the process.');
      return;
    }

    setIsLoading(true);
    try {
      const message = await AuthService.verifyOtp({ email, otp: otpCode });
      Alert.alert(
        'Success',
        message,
        [
          { 
            text: 'Continue', 
            onPress: () => {
              console.log('VerifyOtp.tsx - Navigating to register with email:', email);
              router.replace({
                pathname: '/auth/register',
                params: { email }
              });
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please restart the process.');
      return;
    }

    setIsLoading(true);
    try {
      const message = await AuthService.sendOtp({ email });
      Alert.alert('OTP Resent', message);
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to resend OTP');
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
            <Ionicons name="shield-checkmark-outline" size={50} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.logoText}>eSalon</ThemedText>
          <ThemedText style={styles.tagline}>Verify OTP</ThemedText>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.title}>Enter Verification Code</ThemedText>
          <ThemedText style={styles.subtitle}>
            We&apos;ve sent a 4-digit code to {email}
          </ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent: { key } }) => handleOtpKeyPress(key, index)}
                keyboardType="number-pad"
                maxLength={1}
                secureTextEntry={false}
                textAlign="center"
                placeholderTextColor={styles.inputPlaceholder.color}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleVerifyOtp}
            disabled={isLoading}
          >
            <ThemedText style={styles.loginButtonText}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOtp}
            disabled={isLoading}
          >
            <ThemedText style={styles.resendButtonText}>
              {isLoading ? 'Sending...' : 'Resend OTP'}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.createAccountContainer}>
            <ThemedText style={styles.createAccountText}>Wrong email? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/send-otp' as any)}>
              <ThemedText style={styles.createAccountLink}>Change Email</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
