import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/adminDashboard.styles';
import { PERIOD_OPTIONS, PERIOD_LABELS } from '../config/dashboardConfig';
import { PeriodSelectorProps, PeriodType } from '../types/dashboard.types';

export default function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  return (
    <View style={styles.periodSelector}>
      {(PERIOD_OPTIONS as readonly string[]).map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive,
          ]}
          onPress={() => onPeriodChange(period as PeriodType)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive,
            ]}
          >
            {PERIOD_LABELS[period as PeriodType]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
