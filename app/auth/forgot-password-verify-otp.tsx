import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthService } from '../../src/services/authService';
import { styles } from '../../src/modules/auth/styles/forgotPassword.styles';

export default function ForgotPasswordVerifyOtp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [otpFocused, setOtpFocused] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage('Please enter OTP');
      return;
    }

    setErrorMessage('');
    setIsVerifyingOtp(true);
    try {
      await AuthService.verifyOtp({ email: email || '', otp });
      router.push({ pathname: '/auth/forgot-password-reset', params: { email, otp } });
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message 
        || error?.message 
        || 'Invalid OTP';
      setErrorMessage(errorMsg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Verify OTP</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Error Message */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* OTP Input */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, otpFocused && styles.inputWrapperFocused]}>
            <View style={styles.inputIcon}>
              <Ionicons 
                name="keypad-outline" 
                size={18} 
                color={otpFocused ? '#f7b638' : '#999999'} 
              />
            </View>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="OTP (4 digits)"
              keyboardType="number-pad"
              maxLength={4}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999999"
              onFocus={() => setOtpFocused(true)}
              onBlur={() => setOtpFocused(false)}
            />
          </View>
        </View>

        {/* Verify OTP Button */}
        <TouchableOpacity
          style={[styles.resetButton, isVerifyingOtp && styles.sendOtpButtonDisabled]}
          onPress={handleVerifyOtp}
          disabled={isVerifyingOtp}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>
            {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backToLoginButton}
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.backToLoginButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
