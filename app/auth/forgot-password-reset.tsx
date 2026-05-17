import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthService } from '../../src/services/authService';
import { styles } from '../../src/modules/auth/styles/forgotPassword.styles';
import SuccessModal from '../../src/components/SuccessModal';

export default function ForgotPasswordReset() {
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleReset = async () => {
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
    try {
      await AuthService.resetPassword({
        email: email || '',
        otp: otp || '',
        newPassword,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message 
        || error?.message 
        || 'Failed to reset password';
      setErrorMessage(errorMsg);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.replace('/auth/login');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

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
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
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

      <SuccessModal
        visible={showSuccessModal}
        title="Password Reset"
        message="Your password has been reset successfully. Please login with your new password."
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />
    </>
  );
}
