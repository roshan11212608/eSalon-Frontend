import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export default function SkeletonLoader({ width, height, style }: SkeletonLoaderProps) {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={[
        (colors.card || '#ffffff'),
        (colors.card || '#ffffff'),
        (colors.text || '#1a1a1a').replace(')', ', 0.05)').replace('rgb', 'rgba'),
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.skeleton,
        { width: width || '100%', height: height || 40 },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonLoader width={40} height={40} style={styles.iconSkeleton} />
      <View style={styles.content}>
        <SkeletonLoader width={100} height={16} style={styles.labelSkeleton} />
        <SkeletonLoader width={80} height={24} style={styles.valueSkeleton} />
        <SkeletonLoader width={60} height={12} style={styles.changeSkeleton} />
      </View>
    </View>
  );
}

export function SkeletonChart() {
  return (
    <View style={styles.chartContainer}>
      <SkeletonLoader width="100%" height={200} style={styles.chartSkeleton} />
    </View>
  );
}

export function SkeletonListItem() {
  return (
    <View style={styles.listItem}>
      <SkeletonLoader width={32} height={32} style={styles.rankSkeleton} />
      <View style={styles.listContent}>
        <SkeletonLoader width={120} height={15} style={styles.nameSkeleton} />
        <SkeletonLoader width={80} height={12} style={styles.ownerSkeleton} />
      </View>
      <SkeletonLoader width={60} height={16} style={styles.revenueSkeleton} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  iconSkeleton: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  labelSkeleton: {
    marginBottom: 8,
  },
  valueSkeleton: {
    marginBottom: 4,
  },
  changeSkeleton: {
    width: 80,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  chartSkeleton: {
    borderRadius: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rankSkeleton: {
    marginRight: 12,
    borderRadius: 16,
  },
  listContent: {
    flex: 1,
  },
  nameSkeleton: {
    marginBottom: 4,
  },
  ownerSkeleton: {
    width: 100,
  },
  revenueSkeleton: {
    width: 60,
  },
});
