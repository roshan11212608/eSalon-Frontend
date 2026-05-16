import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AnimatedStatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  gradientColors?: readonly [string, string, ...string[]];
  onPress?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function AnimatedStatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  gradientColors = ['#6366F1', '#8B5CF6'],
  onPress,
}: AnimatedStatCardProps) {
  const Card = onPress ? TouchableOpacity : View;

  return (
    <AnimatedView entering={FadeIn.duration(600).delay(100)}>
      <Card
        style={styles.card}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon as any} size={24} color="#ffffff" />
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>

          <Text style={styles.value}>{value}</Text>

          {change && (
            <View style={styles.changeContainer}>
              <Ionicons
                name={changeType === 'positive' ? 'trending-up' : changeType === 'negative' ? 'trending-down' : 'remove'}
                size={16}
                color="#ffffff"
              />
              <Text style={[styles.change, { color: '#ffffff' }]}>{change}</Text>
            </View>
          )}
        </LinearGradient>
      </Card>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    opacity: 0.9,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
});
