import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color="#f7b638" />
      <Text style={s.message}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
