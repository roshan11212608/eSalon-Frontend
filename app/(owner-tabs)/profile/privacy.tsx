import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PrivacySecurity from '../../../src/modules/profile/privacy-security/PrivacySecurity';
import { routeStyles } from '../../../src/modules/profile/privacy-security/PrivacySecurity.styles';

export default function PrivacySecurityScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };

  return (
    <View style={routeStyles.container}>
      <ScrollView style={routeStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={routeStyles.content}>
          <PrivacySecurity
            onBack={handleBack}
            onChangePassword={handleChangePassword}
          />
        </View>
      </ScrollView>
    </View>
  );
}
