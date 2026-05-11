import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import HelpSupport from '@/src/modules/profile/help-support/HelpSupport';
import { routeStyles } from '@/src/modules/profile/help-support/HelpSupport.styles';

export default function StaffHelpSupportScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={routeStyles.container}>
      <ScrollView style={routeStyles.scrollView} contentContainerStyle={routeStyles.content}>
        <HelpSupport onBack={handleBack} />
      </ScrollView>
    </View>
  );
}
