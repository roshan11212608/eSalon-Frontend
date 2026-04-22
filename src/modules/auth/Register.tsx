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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [registrationStep, setRegistrationStep] = useState<'personal' | 'shop'>('personal');

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
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
          <View style={styles.contentContainer}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Account Created!</Text>
              <View style={styles.titleUnderline} />
            </View>

            <Text style={styles.subtitle}>
              Welcome {userData?.name}! Your shop &quot;{shopName}&quot; has been registered successfully.
            </Text>

            <View style={styles.successDetails}>
              <Text style={styles.successDetailText}>Email: {userData?.email}</Text>
              <Text style={styles.successDetailText}>Shop: {shopName}</Text>
              <Text style={styles.successDetailText}>Role: {userData?.role}</Text>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
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
          <View style={styles.emailVerificationContentContainer}>
            {/* Title */}
            <View style={styles.emailVerificationTitleContainer}>
              <Text style={styles.emailVerificationTitle}>Register Your Shop</Text>
              <View style={styles.emailVerificationTitleUnderline} />
            </View>

            <Text style={styles.emailVerificationSubtitle}>
              Create your salon account and start managing your business
            </Text>

            {/* Email Input */}
            <View style={styles.emailVerificationInputContainer}>
              <View style={styles.emailVerificationInputWrapper}>
                <View style={styles.emailVerificationInputIcon}>
                  <Ionicons 
                    name={isOtpSent ? "checkmark-circle" : "mail-outline"} 
                    size={20} 
                    color={isOtpSent ? "#10B981" : "#999999"} 
                  />
                </View>
                {isOtpSent ? (
                  <Text style={styles.emailVerificationInput}>{email}</Text>
                ) : (
                  <TextInput
                    style={styles.emailVerificationInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999999"
                  />
                )}
              </View>
            </View>

            {showSuccessMessage && (
              <View style={styles.successMessageContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#f7b638" />
                <Text style={styles.successMessageText}>{successMessage}</Text>
              </View>
            )}

            {!isOtpSent ? (
              <TouchableOpacity
                style={[styles.emailVerificationRegisterButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                <Text style={styles.emailVerificationRegisterButtonText}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* OTP Input */}
                <View style={styles.emailVerificationOtpContainer}>
                  <View style={styles.otpDigitsContainer}>
                    {[0, 1, 2, 3].map((index) => (
                      <View key={index} style={styles.otpDigitBox}>
                        <Text style={styles.otpDigitText}>
                          {otp[index] ? '•' : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <TextInput
                    style={styles.hiddenOtpInput}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={4}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[styles.emailVerificationRegisterButton, isLoading && styles.registerButtonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.emailVerificationRegisterButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.emailVerificationResendButton}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.emailVerificationResendButtonText}>Resend OTP</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.emailVerificationBackButton}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.emailVerificationBackButtonText}>Back</Text>
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
          <View style={styles.contentContainer}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Register Your Shop</Text>
              <View style={styles.titleUnderline} />
            </View>

            <Text style={styles.subtitle}>
              Create your salon account and start managing your business
            </Text>
            <Text style={styles.verifiedEmail}>
              ✅ Email: {verifiedEmail}
            </Text>

            {/* Personal Information Screen */}
            {registrationStep === 'personal' && (
              <>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="person-outline" size={20} color="#999999" />
                    </View>
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
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="call-outline" size={20} color="#999999" />
                    </View>
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
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="lock-closed-outline" size={20} color="#999999" />
                    </View>
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
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="lock-closed-outline" size={20} color="#999999" />
                    </View>
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
                </View>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    if (!fullName || !mobileNumber || !password || !confirmPassword) {
                      Alert.alert('Error', 'Please fill in all fields');
                      return;
                    }
                    if (password !== confirmPassword) {
                      Alert.alert('Error', 'Passwords do not match');
                      return;
                    }
                    setRegistrationStep('shop');
                  }}
                >
                  <Text style={styles.registerButtonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setShowRegistrationForm(false);
                    setShowEmailVerification(true);
                    setFullName('');
                    setMobileNumber('');
                    setPassword('');
                    setConfirmPassword('');
                    setShopName('');
                    setShopAddress('');
                    setRegistrationStep('personal');
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Shop Information Screen */}
            {registrationStep === 'shop' && (
              <>
                <Text style={styles.sectionTitle}>Shop Information</Text>
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="storefront-outline" size={20} color="#999999" />
                    </View>
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
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="location-outline" size={20} color="#999999" />
                    </View>
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
                  onPress={() => setRegistrationStep('personal')}
                  disabled={isLoading}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.replace('/auth/login')}
                  disabled={isLoading}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}
