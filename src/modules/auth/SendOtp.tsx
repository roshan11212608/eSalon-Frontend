import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/src/shared/components/themed-text';
import { ThemedView } from '@/src/shared/components/themed-view';
import { AuthService } from '../../services/authService';
import { styles } from './styles/auth.styles';

export default function SendOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 Sending OTP to:', email);
      const message = await AuthService.sendOtp({ email });
      console.log('✅ OTP sent response:', message);
      setIsOtpSent(true);
      Alert.alert('OTP Sent', message);
    } catch (error: any) {
      console.error('Send OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter all 4 digits of the OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const message = await AuthService.verifyOtp({ email, otp: otpString });
      Alert.alert(
        'Success',
        message,
        [
          { 
            text: 'Continue', 
            onPress: () => {
              router.push({
                pathname: '/auth/register',
                params: { email, isVerified: 'true' }
              });
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const message = await AuthService.sendOtp({ email });
      Alert.alert('OTP Resent', message);
      setOtp(['', '', '', '', '', '']);
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
      
      {/* Debug Info */}
      <View style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 5 }}>
        <ThemedText style={{ color: 'white', fontSize: 12 }}>
          Debug: isOtpSent={String(isOtpSent)}, otp=&quot;{otp.join('')}&quot;
        </ThemedText>
      </View>
      
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="mail-outline" size={50} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.logoText}>eSalon</ThemedText>
          <ThemedText style={styles.tagline}>Verify Your Email</ThemedText>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.title}>Email Verification</ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter your email address to receive a verification code
          </ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {!isOtpSent ? (
            <>
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

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                <ThemedText style={styles.loginButtonText}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ThemedText style={styles.subtitle}>
                Enter the 4-digit code sent to {email}
              </ThemedText>

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
                style={[styles.loginButton, isVerifying && styles.loginButtonDisabled]}
                onPress={handleVerifyOtp}
                disabled={isVerifying}
              >
                <ThemedText style={styles.loginButtonText}>
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.resendButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleResendOtp}
                disabled={isLoading}
              >
                <ThemedText style={styles.resendButtonText}>
                  {isLoading ? 'Resending...' : 'Resend OTP'}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.createAccountContainer}>
            <ThemedText style={styles.createAccountText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
              <ThemedText style={styles.createAccountLink}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
