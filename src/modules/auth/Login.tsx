import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthService } from '../../services/authService';
import { authStore } from '../../store/authStore';
import { StorageService } from '../../services/storage/storageService';
import { styles } from './styles/login.styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        email,
        password,
      });

      console.log('Login response from backend:', response);
      console.log('employeeId in response:', response.employeeId);

      await StorageService.setToken(response.token);
      await StorageService.setRole(response.role.toLowerCase() as 'owner' | 'staff' | 'admin');
      
      const userData = {
        id: response.userId.toString(),
        userId: response.customUserId,
        name: response.name,
        email: response.email,
        role: response.role,
        phone: '',
        shopId: response.shopId?.toString(),
        employeeId: response.employeeId?.toString(),
      };
      await StorageService.setUserData(userData);

      if (response.shopId) {
        await StorageService.setShopId(response.shopId.toString());
      }

      authStore.login(response.token, response.role, userData);
      router.replace('/');

    } catch (error: any) {
      const errorMsg = error?.response?.data?.message 
        || error?.message 
        || 'Invalid credentials or server error';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Access Your Salon</Text>
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

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={18} 
                  color={passwordFocused ? '#f7b638' : '#999999'} 
                />
              </View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
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

          {/* Remember Me & Forgot Password */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          {/* Create Account */}
          <TouchableOpacity 
            style={styles.createAccountButton}
            onPress={() => router.push('/auth/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}
