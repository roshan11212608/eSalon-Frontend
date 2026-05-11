import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PeriodSelectorProps, PeriodType } from '../types/dashboard.types';
import { PERIOD_LABELS } from '../config/dashboardConfig';
import { styles as dashboardStyles } from '../styles/ownerDashboard.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface PeriodButtonProps {
  period: PeriodType;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const PeriodButton: React.FC<PeriodButtonProps> = ({ period, label, isSelected, onPress }) => {
  const scale = useSharedValue(isSelected ? 1 : 0.95);

  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1 : 0.95, { damping: 15, stiffness: 150 });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        dashboardStyles.periodButton,
        isSelected && dashboardStyles.periodButtonActive,
        animatedStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={[
          dashboardStyles.periodButtonText,
          isSelected && dashboardStyles.periodButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  const periods: { period: PeriodType; label: string }[] = [
    { period: 'today', label: PERIOD_LABELS.today },
    { period: 'week', label: PERIOD_LABELS.week },
    { period: 'month', label: PERIOD_LABELS.month },
  ];

  return (
    <View style={dashboardStyles.periodSelector}>
      {periods.map(({ period, label }) => (
        <PeriodButton
          key={period}
          period={period}
          label={label}
          isSelected={selectedPeriod === period}
          onPress={() => onPeriodChange(period)}
        />
      ))}
    </View>
  );
};

export default React.memo(PeriodSelector);
