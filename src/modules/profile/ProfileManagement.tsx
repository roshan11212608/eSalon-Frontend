import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StorageService } from '../../services/storage/storageService';
import { authStore } from '../../store';
import { useAuthStore } from '../../shared/hooks/useAuthStore';
import { useProfileData } from './hooks/useProfileData';
import ConfirmationModal from '@/components/ConfirmationModal';
import { styles } from './styles/ProfileManagement.styles';

export default function ProfileManagement() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const authState = useAuthStore();
  const userId = authState.user?.id ? Number(authState.user.id) : 0;
  const { profile, loading, error } = useProfileData(userId);

  const handleLogout = async () => {
    Haptics.notificationAsync();
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    
    try {
      await StorageService.clearAuthData();
      await authStore.logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const cancelLogout = () => {
    Haptics.notificationAsync();
    setShowLogoutModal(false);
  };

  const handleEditProfile = () => {
    Haptics.impactAsync();
    router.push('/profile/edit');
  };

  const handlePrivacySecurity = () => {
    Haptics.impactAsync();
    router.push('/profile/privacy');
  };

  const handleHelpSupport = () => {
    Haptics.impactAsync();
    router.push('/profile/help');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b638" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#f7b638" />
        <Text style={styles.errorText}>Error loading profile</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const MenuItem = ({ icon, title, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemContent}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={18} color="#f7b638" />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pro<Text style={styles.titleAccent}>file</Text></Text>
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                {profile?.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(profile?.name || 'U')}</Text>
                  </View>
                )}
              </View>
              <View style={styles.profileDetails}>
              <Text style={styles.name}>{profile?.name || 'Unknown User'}</Text>
              <Text style={styles.email}>{profile?.email || 'No email'}</Text>
              
              <View style={styles.badgesRow}>
                {profile?.shopId && (
                  <View style={styles.shopIdBadge}>
                    <Ionicons name="pricetag" size={12} color="#f7b638" />
                    <Text style={styles.shopIdText}>Shop ID: {profile.shopId}</Text>
                  </View>
                )}

                {authState.role && (
                  <View style={styles.roleBadge}>
                    <Ionicons name="person" size={12} color="#ffffff" />
                    <Text style={styles.roleText}>{authState.role.charAt(0).toUpperCase() + authState.role.slice(1)}</Text>
                  </View>
                )}

                {(profile?.customUserId || authState.user?.userId) && (
                  <View style={styles.userIdBadge}>
                    <Ionicons name="id-card" size={12} color="#6366f1" />
                    <Text style={styles.userIdText}>User ID: {profile?.customUserId || authState.user?.userId}</Text>
                  </View>
                )}

                {profile?.shopName && (
                  <View style={styles.shopBadge}>
                    <Ionicons name="storefront" size={14} color="#ec4899" />
                    <Text style={styles.shopBadgeText}>{profile.shopName}</Text>
                  </View>
                )}
              </View>
              
              {profile?.shopAddress && (
                <View style={styles.shopAddressContainer}>
                  <Ionicons name="location" size={12} color="#f7b638" />
                  <Text style={styles.shopAddressText}>{profile.shopAddress}</Text>
                </View>
              )}
              
              {profile?.bio && (
                <View style={styles.bioContainer}>
                  <Text style={styles.bio}>{profile.bio}</Text>
                </View>
              )}
              </View>
            </View>
          
          {/* Menu Section */}
          <View style={styles.menuSection}>
              <MenuItem icon="person-outline" title="Edit Profile" onPress={handleEditProfile} />
              <MenuItem icon="shield-checkmark-outline" title="Privacy & Security" onPress={handlePrivacySecurity} />
              <MenuItem icon="help-circle-outline" title="Help & Support" onPress={handleHelpSupport} />
              
              {/* Logout Button */}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
                  <View style={styles.logoutIcon}>
                    <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                  </View>
                  <Text style={styles.logoutText}>Sign Out</Text>
                  <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
                </TouchableOpacity>
            </View>
        </View>
        
      </ScrollView>
      
      <ConfirmationModal
        visible={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </View>
  );
}
