import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/src/shared/components/themed-text';

interface HeaderProps {
  title: string;
  showNotification?: boolean;
  showBack?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
}

export default function Header({
  title,
  showNotification = false,
  showBack = false,
  onBackPress,
  onNotificationPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBack && (
          <View style={styles.leftContainer}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color="#1F2937" 
              onPress={onBackPress}
              style={styles.backButton}
            />
          </View>
        )}
        
        <View style={styles.centerContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>
        
        <View style={styles.rightContainer}>
          {showNotification && (
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color="#1F2937" 
              onPress={onNotificationPress}
              style={styles.notificationButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    position: 'relative',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60, // Status bar height
    paddingBottom: 20,
    minHeight: 100,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  notificationButton: {
    padding: 4,
  },
});
