import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthService } from '../../services/authService';
import { styles } from './styles/forgotPassword.styles';

interface ForgotPasswordProps {
  onSave: (data: { email: string; otp: string; newPassword: string }) => void;
  onCancel: () => void;
}

export default function ForgotPassword({ onSave, onCancel }: ForgotPasswordProps) {
  const [step, setStep] = useState(1); // Step 1: Email & OTP, Step 2: Password Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
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
      alert('OTP sent to your email');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message 
        || error?.message 
        || 'Failed to send OTP';
      setErrorMessage(errorMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage('Please enter OTP');
      return;
    }

    setErrorMessage('');
    setIsVerifyingOtp(true);
    try {
      await AuthService.verifyOtp({ email, otp });
      setStep(2);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message 
        || error?.message 
        || 'Invalid OTP';
      setErrorMessage(errorMsg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSave = () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setErrorMessage('');
    onSave({ email, otp, newPassword });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </Text>
          <View style={styles.titleUnderline} />
        </View>

      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Step 1: Email & OTP */}
      {step === 1 && (
        <>
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
        </>
      )}

      {/* Step 2: Password Reset */}
      {step === 2 && (
        <>
          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, newPasswordFocused && styles.inputWrapperFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={18} 
                  color={newPasswordFocused ? '#f7b638' : '#999999'} 
                />
              </View>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
                onFocus={() => setNewPasswordFocused(true)}
                onBlur={() => setNewPasswordFocused(false)}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={18} 
                  color="#999999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, confirmPasswordFocused && styles.inputWrapperFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={18} 
                  color={confirmPasswordFocused ? '#f7b638' : '#999999'} 
                />
              </View>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm New Password"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={18} 
                  color="#999999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

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
