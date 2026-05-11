import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ChangePassword from '../../../src/modules/profile/change-password/ChangePassword';
import { routeStyles } from '../../../src/modules/profile/change-password/ChangePassword.styles';
import { ProfileService } from '../../../src/services/profileService';
import SuccessModal from '../../../src/components/SuccessModal';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = async (data: any) => {
    console.log('Changing password:', data);
    try {
      await ProfileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please check your current password and try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  return (
    <>
      <View style={routeStyles.container}>
        <ScrollView style={routeStyles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={routeStyles.content}>
            <ChangePassword onSave={handleSave} onCancel={handleCancel} />
          </View>
        </ScrollView>
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title="Password Changed"
        message="Your password has been changed successfully."
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />
    </>
  );
}
