import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { FinancialStatsProps } from '../types/dashboard.types';
import { styles as dashboardStyles } from '../styles/ownerDashboard.styles';

const AnimatedView = Animated.createAnimatedComponent(View);

const FinancialStats: React.FC<FinancialStatsProps> = ({ financialStats }) => {
  if (!financialStats || financialStats.length === 0) {
    return null;
  }

  return (
    <AnimatedView entering={FadeIn.duration(500).delay(400)} style={dashboardStyles.statsContainer}>
      {financialStats.map((stat, index) => (
        <AnimatedView
          key={index}
          entering={FadeIn.duration(400).delay(400 + index * 100)}
          style={dashboardStyles.statCard}
          accessibilityLabel={`${stat.label}: ${stat.value}`}
          accessibilityRole="text"
        >
          <View style={[dashboardStyles.statIcon, { backgroundColor: `${stat.color}20` }]}>
            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
          </View>
          <Text style={dashboardStyles.statValue}>{stat.value}</Text>
          <Text style={dashboardStyles.statLabel}>{stat.label}</Text>
        </AnimatedView>
      ))}
    </AnimatedView>
  );
};

export default React.memo(FinancialStats);
