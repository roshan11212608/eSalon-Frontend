import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ForgotPassword from '../../src/modules/auth/ForgotPassword';
import { styles } from '../../src/modules/auth/styles/forgotPassword.styles';
import { AuthService } from '../../src/services/authService';
import SuccessModal from '../../src/components/SuccessModal';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = async (data: { email: string; otp: string; newPassword: string }) => {
    console.log('Resetting password for:', data.email);
    try {
      await AuthService.resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please check your OTP and try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.replace('/auth/login');
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ForgotPassword onSave={handleSave} onCancel={handleCancel} />
        </ScrollView>
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
