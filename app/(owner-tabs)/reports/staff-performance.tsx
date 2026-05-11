import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StaffPerformanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Performance Report</Text>
      <Text style={styles.subtitle}>View staff performance metrics and analytics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
