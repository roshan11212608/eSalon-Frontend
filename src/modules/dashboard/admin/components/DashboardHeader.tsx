import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/adminDashboard.styles';
import { DashboardHeaderProps } from '../types/dashboard.types';

export default function DashboardHeader({
  displayName,
  initials,
  greeting,
  unreadCount,
  onNotificationPress,
}: DashboardHeaderProps) {
  return (
    <View style={styles.headerCard}>
      <LinearGradient
        colors={['#FFD700', '#FFC107']}
        style={styles.headerGradient}
      >
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        {/* Header Top */}
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            {/* Avatar */}
            <View style={styles.avatarRing}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.onlinePulse}>
                <View style={styles.onlineIndicator} />
              </View>
            </View>

            {/* Greeting & Name */}
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.profileName}>{displayName}</Text>
            </View>
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
