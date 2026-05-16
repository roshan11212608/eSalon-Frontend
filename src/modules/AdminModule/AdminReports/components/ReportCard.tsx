import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'revenue' | 'subscription' | 'payment' | 'salon' | 'transaction';
  format: 'csv' | 'pdf';
  lastGenerated?: string;
  icon: string;
}

interface ReportCardProps {
  report: Report;
  onDownload: () => void;
  onSchedule: () => void;
}

export default function ReportCard({ report, onDownload, onSchedule }: ReportCardProps) {
  const { colors } = useTheme();

  const getFormatColor = () => {
    return report.format === 'csv' ? '#10B981' : '#6366F1';
  };

  const getFormatBadge = () => {
    return report.format.toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getFormatColor() + '20' }]}>
          <Ionicons name={report.icon as any} size={24} color={getFormatColor()} />
        </View>
        <View style={[styles.formatBadge, { backgroundColor: getFormatColor() }]}>
          <Text style={styles.formatBadgeText}>{getFormatBadge()}</Text>
        </View>
      </View>

      <Text style={[styles.name, { color: colors.text }]}>{report.name}</Text>
      <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
        {report.description}
      </Text>

      {report.lastGenerated && (
        <Text style={[styles.lastGenerated, { color: colors.text }]}>
          Last generated: {report.lastGenerated}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onDownload}
        >
          <Ionicons name="download-outline" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.scheduleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={onSchedule}
        >
          <Ionicons name="time-outline" size={18} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  formatBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
    marginBottom: 8,
  },
  lastGenerated: {
    fontSize: 11,
    opacity: 0.5,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  scheduleButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
