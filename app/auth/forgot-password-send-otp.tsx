import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthService } from '../../src/services/authService';
import { styles } from '../../src/modules/auth/styles/forgotPassword.styles';

export default function ForgotPasswordSendOtp() {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter your email');
      return;
    }

    setErrorMessage('');
    setIsSendingOtp(true);
    try {
      await AuthService.sendOtp({ email });
      router.push({ pathname: '/auth/forgot-password-verify-otp', params: { email } });
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message 
        || error?.message 
        || 'Failed to send OTP';
      setErrorMessage(errorMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Error Message */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
            <View style={styles.inputIcon}>
              <Ionicons 
                name="mail-outline" 
                size={18} 
                color={emailFocused ? '#f7b638' : '#999999'} 
              />
            </View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999999"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          style={[styles.sendOtpButton, isSendingOtp && styles.sendOtpButtonDisabled]}
          onPress={handleSendOtp}
          disabled={isSendingOtp}
          activeOpacity={0.8}
        >
          <Text style={styles.sendOtpButtonText}>
            {isSendingOtp ? 'Sending...' : 'Send OTP'}
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
