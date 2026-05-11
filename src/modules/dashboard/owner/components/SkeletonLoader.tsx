import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { SkeletonProps } from '../types/dashboard.types';
import { SKELETON_CONFIG } from '../config/dashboardConfig';

const AnimatedView = Animated.createAnimatedComponent(View);

const SkeletonLoader: React.FC<SkeletonProps> = ({ width = '100%', height = 20, style }) => {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: SKELETON_CONFIG.SHIMMER_DURATION }),
      -1,
      true
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.3 + shimmer.value * 0.4,
    };
  });

  return (
    <AnimatedView
      style={[
        styles.skeleton,
        { width, height },
        animatedStyle,
        style,
      ]}
      accessible
      accessibilityRole="none"
    />
  );
};

// Specialized skeleton components for dashboard
export const HeaderSkeleton: React.FC = () => (
  <View style={styles.headerSkeleton}>
    <SkeletonLoader width={48} height={48} style={styles.avatarSkeleton} />
    <View style={styles.textContainer}>
      <SkeletonLoader width={120} height={16} style={styles.textSkeleton} />
      <SkeletonLoader width={80} height={14} style={styles.textSkeleton} />
    </View>
    <SkeletonLoader width={40} height={40} style={styles.iconSkeleton} />
  </View>
);

export const SummaryCardSkeleton: React.FC = () => (
  <View style={styles.summaryCardSkeleton}>
    <SkeletonLoader width={40} height={40} style={styles.iconSkeleton} />
    <SkeletonLoader width={30} height={24} style={styles.textSkeleton} />
    <SkeletonLoader width={50} height={12} style={styles.textSkeleton} />
  </View>
);

export const StatCardSkeleton: React.FC = () => (
  <View style={styles.statCardSkeleton}>
    <SkeletonLoader width={32} height={32} style={styles.iconSkeleton} />
    <SkeletonLoader width={60} height={20} style={styles.textSkeleton} />
    <SkeletonLoader width={40} height={12} style={styles.textSkeleton} />
  </View>
);

export const ChartSkeleton: React.FC = () => (
  <View style={styles.chartSkeleton}>
    <SkeletonLoader width={150} height={20} style={styles.textSkeleton} />
    <SkeletonLoader width="100%" height={200} style={styles.chartPlaceholder} />
  </View>
);

export const NotificationItemSkeleton: React.FC = () => (
  <View style={styles.notificationItemSkeleton}>
    <SkeletonLoader width={36} height={36} style={styles.iconSkeleton} />
    <View style={styles.notificationTextContainer}>
      <SkeletonLoader width={150} height={14} style={styles.textSkeleton} />
      <SkeletonLoader width={200} height={12} style={styles.textSkeleton} />
      <SkeletonLoader width={80} height={10} style={styles.textSkeleton} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: SKELETON_CONFIG.BASE_COLOR,
    borderRadius: SKELETON_CONFIG.BORDER_RADIUS,
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: SKELETON_CONFIG.CONTAINER_BACKGROUND,
  },
  avatarSkeleton: {
    borderRadius: SKELETON_CONFIG.AVATAR_BORDER_RADIUS,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  textSkeleton: {
    marginBottom: 4,
  },
  iconSkeleton: {
    borderRadius: SKELETON_CONFIG.ICON_BORDER_RADIUS,
  },
  summaryCardSkeleton: {
    flex: 1,
    padding: 16,
    backgroundColor: SKELETON_CONFIG.CONTAINER_BACKGROUND,
    borderRadius: SKELETON_CONFIG.CARD_BORDER_RADIUS,
    alignItems: 'center',
    gap: 8,
  },
  statCardSkeleton: {
    flex: 1,
    padding: 16,
    backgroundColor: SKELETON_CONFIG.CONTAINER_BACKGROUND,
    borderRadius: SKELETON_CONFIG.CARD_BORDER_RADIUS,
    alignItems: 'center',
    gap: 8,
  },
  chartSkeleton: {
    padding: 16,
    backgroundColor: SKELETON_CONFIG.CONTAINER_BACKGROUND,
    borderRadius: SKELETON_CONFIG.CARD_BORDER_RADIUS,
    gap: 16,
  },
  chartPlaceholder: {
    borderRadius: SKELETON_CONFIG.CHART_PLACEHOLDER_BORDER_RADIUS,
  },
  notificationItemSkeleton: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: SKELETON_CONFIG.CONTAINER_BACKGROUND,
    gap: 12,
  },
  notificationTextContainer: {
    flex: 1,
    gap: 4,
  },
});

export default React.memo(SkeletonLoader);
