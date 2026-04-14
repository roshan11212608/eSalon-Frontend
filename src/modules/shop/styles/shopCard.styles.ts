import { StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { borderRadius } from '../../../shared/theme/borderRadius';
import { shadows } from '../../../shared/theme/shadows';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
});
