import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PlanFeature } from '../types/plan.types';

interface FeatureRowProps {
  feature: PlanFeature;
  accentColor: string;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({ feature, accentColor }) => {
  const included = feature.included;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.checkCircle,
          { backgroundColor: included ? `${accentColor}14` : '#F3F4F6' },
        ]}
      >
        <Ionicons
          name={included ? 'checkmark' : 'close'}
          size={11}
          color={included ? accentColor : '#D1D5DB'}
        />
      </View>
      <Text style={[styles.label, { color: included ? '#374151' : '#9CA3AF' }]}>
        {feature.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
