import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyStateProps } from '../types/dashboard.types';
import { colors } from '../../../../shared/theme/colors';
import { EMPTY_STATE_CONFIG } from '../config/dashboardConfig';

const EmptyState: React.FC<EmptyStateProps> = ({ icon = EMPTY_STATE_CONFIG.DEFAULT_ICON, title, subtitle }) => {
  return (
    <View style={styles.container} accessible accessibilityRole="text">
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={48} color={EMPTY_STATE_CONFIG.ICON_COLOR ?? colors.neutral[400]} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: EMPTY_STATE_CONFIG.BACKGROUND_COLOR,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default React.memo(EmptyState);
