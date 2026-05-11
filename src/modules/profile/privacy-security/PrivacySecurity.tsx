import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './PrivacySecurity.styles';

interface PrivacySecurityProps {
  onBack?: () => void;
  onChangePassword?: () => void;
}

export default function PrivacySecurity({ onChangePassword }: PrivacySecurityProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy & Security</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="notifications-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.menuText}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive push notifications on your device</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#f7b638' }}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="mail-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.menuText}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive updates via email</Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#D1D5DB', true: '#f7b638' }}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="chatbubbles-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.menuText}>SMS Notifications</Text>
                <Text style={styles.settingDescription}>Receive SMS alerts</Text>
              </View>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{ false: '#D1D5DB', true: '#f7b638' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.menuText}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>Add an extra layer of security</Text>
              </View>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: '#D1D5DB', true: '#f7b638' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="eye-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.menuText}>Privacy Mode</Text>
                <Text style={styles.settingDescription}>Hide your profile from others</Text>
              </View>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              trackColor={{ false: '#D1D5DB', true: '#f7b638' }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={onChangePassword}>
          <View style={styles.menuItemContent}>
            <View style={styles.menuIcon}>
              <Ionicons name="lock-closed-outline" size={18} color="#f7b638" />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
