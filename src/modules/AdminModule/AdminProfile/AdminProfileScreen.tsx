import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StorageService } from '@/src/services/storage/storageService';
import { authStore } from '@/src/store/authStore';

export default function AdminProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      await StorageService.clearAuthData();
      await authStore.logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color="#f7b638" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pro<Text style={styles.headerTitleAccent}>file</Text></Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AD</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>System Administrator</Text>
            <Text style={styles.email}>admin@esalon.com</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>ADMIN</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={22} color="#f7b638" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#f7b638' }}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="moon-outline" size={22} color="#f7b638" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#f7b638' }}
            />
          </View>

          <MenuItem 
            icon="shield-checkmark-outline" 
            title="Security" 
            subtitle="Change password, 2FA"
          />
          
          <MenuItem 
            icon="language-outline" 
            title="Language" 
            subtitle="English"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <MenuItem 
            icon="help-circle-outline" 
            title="Help Center" 
          />
          
          <MenuItem 
            icon="mail-outline" 
            title="Contact Us" 
          />
          
          <MenuItem 
            icon="document-text-outline" 
            title="Terms & Privacy" 
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#780115" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>eSalon Admin v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  headerTitleAccent: {
    color: '#f7b638',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f7b638',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: '#fff9e6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff9e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#999999',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#780115',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 10,
    color: '#999999',
  },
});
