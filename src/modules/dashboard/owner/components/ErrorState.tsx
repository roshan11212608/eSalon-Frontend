import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ErrorStateProps } from '../types/dashboard.types';
import { colors } from '../../../../shared/theme/colors';
import { ERROR_STATE_CONFIG } from '../config/dashboardConfig';

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.container} accessible accessibilityRole="alert">
      <View style={styles.iconContainer}>
        <Ionicons
          name={ERROR_STATE_CONFIG.ICON as any}
          size={48}
          color={ERROR_STATE_CONFIG.ICON_COLOR ?? colors.status.error}
        />
      </View>
      <Text style={styles.title}>{ERROR_STATE_CONFIG.TITLE}</Text>
      <Text style={styles.message}>{error}</Text>
      <TouchableOpacity
        style={[
          styles.retryButton,
          { backgroundColor: ERROR_STATE_CONFIG.RETRY_BUTTON_BACKGROUND_COLOR ?? colors.primary.main },
        ]}
        onPress={onRetry}
        accessibilityLabel="Retry loading"
        accessibilityRole="button"
      >
        <Ionicons
          name="refresh-outline"
          size={18}
          color={ERROR_STATE_CONFIG.RETRY_ICON_COLOR}
          style={styles.retryIcon}
        />
        <Text style={styles.retryText}>{ERROR_STATE_CONFIG.RETRY_BUTTON_TEXT}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: ERROR_STATE_CONFIG.BACKGROUND_COLOR,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: ERROR_STATE_CONFIG.TITLE_COLOR,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: ERROR_STATE_CONFIG.MESSAGE_COLOR,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    color: ERROR_STATE_CONFIG.RETRY_BUTTON_TEXT_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo(ErrorState);
