// Profile data hook
import { useState, useEffect } from 'react';
import { ProfileService } from '../../../services/profileService';

export const useProfileData = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileData = await ProfileService.getProfileData();
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = async (profileData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await ProfileService.updateProfile(profileData);
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
      
      await ProfileService.deleteAccount();
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
