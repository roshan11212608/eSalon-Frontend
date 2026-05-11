import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming, runOnJS } from 'react-native-reanimated';
import { DashboardHeaderProps } from '../types/dashboard.types';
import { colors } from '../../../../shared/theme/colors';
import { styles as dashboardStyles } from '../styles/ownerDashboard.styles';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  displayName,
  initials,
  greeting,
  unreadCount,
  onNotificationPress,
}) => {
  const notificationScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: notificationScale.value }],
    };
  });

  const handleNotificationPress = () => {
    notificationScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    runOnJS(onNotificationPress)();
  };

  return (
    <AnimatedView
      entering={FadeInDown.duration(600)}
      style={dashboardStyles.headerCard}
    >
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={dashboardStyles.headerGradient}
      >
        <View style={dashboardStyles.headerTop}>
          <View style={dashboardStyles.headerLeft}>
            <View style={dashboardStyles.avatarRing}>
              <View style={dashboardStyles.avatarContainer}>
                <Text style={dashboardStyles.avatarText}>{initials}</Text>
              </View>
              <View style={dashboardStyles.onlinePulse}>
                <View style={dashboardStyles.onlineIndicator} />
              </View>
            </View>
            <View style={dashboardStyles.headerText}>
              <Text style={dashboardStyles.greeting}>{greeting}</Text>
              <Text style={dashboardStyles.profileName}>{displayName}</Text>
            </View>
          </View>
          <AnimatedTouchableOpacity
            style={[
              dashboardStyles.iconButton,
              animatedStyle,
            ]}
            activeOpacity={0.8}
            onPress={handleNotificationPress}
            accessibilityLabel={`Notifications${unreadCount > 0 ? `: ${unreadCount} unread` : ''}`}
            accessibilityRole="button"
          >
            <Ionicons name="notifications" size={22} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={dashboardStyles.notificationBadge}>
                <Text style={dashboardStyles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </AnimatedTouchableOpacity>
        </View>

        <View style={dashboardStyles.decorCircle1} />
        <View style={dashboardStyles.decorCircle2} />
      </LinearGradient>
    </AnimatedView>
  );
};

export default React.memo(DashboardHeader);
