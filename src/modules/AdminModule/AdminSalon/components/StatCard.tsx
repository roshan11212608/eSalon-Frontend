import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatCard as StatCardType } from '../types/salon.types';

interface StatCardProps {
  data: StatCardType;
}

export const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { title, value, growth, color } = data;

  const getGradientColors = (): readonly [string, string] => {
    const gradients: { [key: string]: readonly [string, string] } = {
      '#780115': ['#780115', '#A31F2B'] as const,
      '#059669': ['#059669', '#10B981'] as const,
      '#3B82F6': ['#3B82F6', '#60A5FA'] as const,
      '#F59E0B': ['#F59E0B', '#FCD34D'] as const,
      '#8B5CF6': ['#8B5CF6', '#A78BFA'] as const,
      '#EF4444': ['#EF4444', '#F87171'] as const,
    };
    return gradients[color] || ['#6B7280', '#9CA3AF'] as const;
  };

  const gradientColors = getGradientColors();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />
      
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.title}>{title}</Text>
          {growth !== undefined && (
            <View style={[
              styles.growthIndicator,
              { backgroundColor: growth >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }
            ]}>
              <Text style={[
                styles.growthText,
                { color: growth >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {growth >= 0 ? '↗' : '↘'} {Math.abs(growth)}%
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.value}>{value}</Text>
        
        <View style={[styles.bottomAccent, { backgroundColor: color }]} />
      </View>
      
      {/* Decorative corner dots */}
      <View style={styles.cornerDot1} />
      <View style={styles.cornerDot2} />
      <View style={styles.cornerDot3} />
      <View style={styles.cornerDot4} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 0,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0,
    width: 100,
    height: 70,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  title: {
    fontSize: 9,
    color: '#374151',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  growthIndicator: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  growthText: {
    fontSize: 8,
    fontWeight: '700',
  },
  value: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  cornerDot1: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    top: 4,
    left: 4,
  },
  cornerDot2: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    top: 4,
    right: 4,
  },
  cornerDot3: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    bottom: 4,
    left: 4,
  },
  cornerDot4: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    bottom: 4,
    right: 4,
  },
});
