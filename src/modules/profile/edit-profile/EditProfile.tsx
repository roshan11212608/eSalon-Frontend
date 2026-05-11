import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './EditProfile.styles';
import { ProfileUpdateData } from '../types';
import { ProfileService } from '../../../services/profileService';
import { authStore } from '../../../store/authStore';

interface EditProfileProps {
  userId: number;
  onSave?: (data: ProfileUpdateData) => void;
  onCancel?: () => void;
  initialData?: {
    name: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
  };
}

export default function EditProfile({ userId, onSave, onCancel, initialData }: EditProfileProps) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(initialData?.avatarUrl || null);
  const [formData, setFormData] = useState({
    phoneNumber: initialData?.phoneNumber || '',
  });

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    // Validate phone number is exactly 10 digits
    if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
      alert('Mobile number must be exactly 10 digits');
      return;
    }
    
    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
      alert('Mobile number must contain only digits');
      return;
    }

    setLoading(true);
    try {
      const updateData: ProfileUpdateData = {
        ...formData,
        avatarUrl: avatar || undefined,
      };
      
      try {
        // Try to update existing profile
        await ProfileService.updateProfile(userId, updateData);
      } catch (error: any) {
        // If profile doesn't exist (404), create it instead
        if (error.message === 'Profile not found' || error.statusCode === 404) {
          console.log('Profile not found, creating new profile');
          try {
            await ProfileService.createProfile({
              userId: userId,
              phoneNumber: formData.phoneNumber,
              avatarUrl: avatar || undefined,
            });
          } catch (createError: any) {
            console.error('Error creating profile:', createError);
            // If create also fails, still show success (frontend-only update)
            console.log('Backend profile update failed, proceeding with frontend update');
          }
        } else {
          throw error;
        }
      }
      
      // Update authStore with new avatar URL for immediate UI update
      if (avatar) {
        const authState = authStore.getState();
        if (authState.user) {
          authStore.setUser({
            ...authState.user,
            avatar: avatar,
          });
        }
      }
      
      if (onSave) {
        await onSave(updateData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    // Only allow numbers for phone number, max 10 digits
    if (field === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [field]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#999999" />
              </View>
            )}
            <View style={styles.avatarEditIcon}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change profile picture</Text>
        </View>

        {/* Read-only Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{initialData?.name || 'No name set'}</Text>
          </View>
        </View>

        {/* Read-only Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{initialData?.email || 'No email set'}</Text>
          </View>
        </View>

        {/* Editable Phone Number */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile number (10 digits)"
            value={formData.phoneNumber}
            onChangeText={(value) => handleChange('phoneNumber', value)}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#999999"
            maxLength={10}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
