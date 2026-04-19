// Profile data hook
import { useState, useEffect } from 'react';
import { ProfileService } from '../../../services/profileService';

export const useProfileData = (userId: number) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('useProfileData - Loading profile for userId:', userId);
        const profileData = await ProfileService.getProfileData(userId);
        console.log('useProfileData - Profile data received:', profileData);
        setProfile(profileData);
      } catch (err) {
        console.error('useProfileData - Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const updateProfile = async (profileData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await ProfileService.updateProfile(userId, profileData);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await ProfileService.changePassword(passwordData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await ProfileService.deleteAccount(userId);
      setProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    deleteAccount,
  };
};
