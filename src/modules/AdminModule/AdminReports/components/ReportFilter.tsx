import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface ReportFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function ReportFilter({
  selectedPeriod,
  onPeriodChange,
  selectedType,
  onTypeChange,
}: ReportFilterProps) {
  const { colors } = useTheme();

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const types = [
    { id: 'all', label: 'All Reports' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'payment', label: 'Payment' },
    { id: 'salon', label: 'Salon' },
    { id: 'transaction', label: 'Transaction' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>Period</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedPeriod === period.id ? colors.primary : colors.background,
                    borderColor: selectedPeriod === period.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => onPeriodChange(period.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: selectedPeriod === period.id ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>Report Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            {types.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedType === type.id ? colors.primary : colors.background,
                    borderColor: selectedType === type.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => onTypeChange(type.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: selectedType === type.id ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
