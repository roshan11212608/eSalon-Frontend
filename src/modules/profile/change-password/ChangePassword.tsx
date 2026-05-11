import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ChangePassword.styles';

interface ChangePasswordProps {
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export default function ChangePassword({ onSave, onCancel }: ChangePasswordProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSave = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <View style={styles.content}>
        {/* Current Password */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChangeText={(value) => handleChange('currentPassword', value)}
              secureTextEntry={!showPasswords.current}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999999"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => togglePasswordVisibility('current')}>
              <Ionicons 
                name={showPasswords.current ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#999999" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChangeText={(value) => handleChange('newPassword', value)}
              secureTextEntry={!showPasswords.new}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999999"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => togglePasswordVisibility('new')}>
              <Ionicons 
                name={showPasswords.new ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#999999" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry={!showPasswords.confirm}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999999"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => togglePasswordVisibility('confirm')}>
              <Ionicons 
                name={showPasswords.confirm ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#999999" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Update Password</Text>
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
