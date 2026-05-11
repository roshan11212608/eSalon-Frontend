import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import EditProfile from '@/src/modules/profile/edit-profile/EditProfile';
import { routeStyles } from '@/src/modules/profile/edit-profile/EditProfile.styles';
import { authStore } from '@/src/store/authStore';
import { ProfileService } from '@/src/services/profileService';
import SuccessModal from '@/src/components/SuccessModal';

export default function StaffEditProfileScreen() {
  const router = useRouter();
  const [initialData, setInitialData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
  });
  const [userId, setUserId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const authState = authStore.getState();
      const user = authState.user;
      
      if (user) {
        setInitialData({
          name: user.name || '',
          email: user.email || '',
          phoneNumber: '',
          avatarUrl: '',
        });
        setUserId(parseInt(user.id) || 1);
        
        // Fetch profile data for avatar
        try {
          const profile = await ProfileService.getProfileData(parseInt(user.id) || 1);
          
          if (profile) {
            setInitialData(prev => ({
              ...prev,
              avatarUrl: profile.avatarUrl || '',
            }));
          }
        } catch {
          console.log('Profile not found, will create on save');
          // Continue without profile data
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    console.log('Saving staff profile:', data);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  if (loading) {
    return (
      <View style={routeStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={routeStyles.container}>
        <ScrollView style={routeStyles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={routeStyles.content}>
            <EditProfile
              userId={userId}
              onSave={handleSave}
              onCancel={handleCancel}
              initialData={initialData}
            />
          </View>
        </ScrollView>
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title="Profile Updated"
        message="Your profile has been updated successfully."
        buttonText="OK"
        onButtonPress={handleSuccessModalClose}
      />
    </>
  );
}
