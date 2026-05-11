import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { offlineStorageService } from '../../../../services/storage/offlineStorageService';

interface OfflineIndicatorProps {
  onRetry?: () => void;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onRetry }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineActionsCount, setOfflineActionsCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const slideAnimation = new Animated.Value(0);

  const animateBanner = useCallback((show: boolean) => {
    Animated.timing(slideAnimation, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnimation]);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const wasOffline = !isOnline;
      const nowOnline = state.isConnected ?? false;
      
      setIsOnline(nowOnline);
      offlineStorageService.setOnlineStatus(nowOnline);
      
      // Show banner when going offline or coming back online
      if (wasOffline !== !nowOnline) {
        setShowBanner(true);
        animateBanner(!nowOnline);
        
        // Hide banner after 3 seconds
        setTimeout(() => {
          animateBanner(false);
          setTimeout(() => setShowBanner(false), 300);
        }, 3000);
      }
    });

    // Update offline actions count periodically
    const interval = setInterval(() => {
      const stats = offlineStorageService.getStorageStats();
      setOfflineActionsCount(stats.offlineActionsCount);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOnline, animateBanner]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    // Also trigger sync of offline actions
    offlineStorageService.syncOfflineActions();
  };

  if (!showBanner) return null;

  const translateY = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={[styles.banner, isOnline ? styles.onlineBanner : styles.offlineBanner]}>
        <View style={styles.content}>
          <Ionicons
            name={isOnline ? 'wifi' : 'cloud-offline'}
            size={20}
            color="#FFFFFF"
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {isOnline ? 'Back Online' : 'Offline Mode'}
            </Text>
            <Text style={styles.subtitle}>
              {isOnline 
                ? 'Syncing your data...'
                : `You're offline. ${offlineActionsCount} actions pending sync.`
              }
            </Text>
          </View>
        </View>
        
        {!isOnline && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  onlineBanner: {
    backgroundColor: '#10B981',
  },
  offlineBanner: {
    backgroundColor: '#EF4444',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default React.memo(OfflineIndicator);
