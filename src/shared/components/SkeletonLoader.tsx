import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SkeletonLoaderProps {
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar} />
            <View style={styles.headerInfo}>
              <View style={styles.title} />
              <View style={styles.subtitle} />
            </View>
            <View style={styles.amount} />
          </View>
          <View style={styles.content}>
            <View style={styles.line} />
            <View style={styles.lineShort} />
            <View style={styles.line} />
          </View>
          <View style={styles.footer}>
            <View style={styles.status} />
            <View style={styles.button} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    width: '60%',
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitle: {
    width: '40%',
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  amount: {
    width: 80,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  content: {
    marginBottom: 12,
  },
  line: {
    width: '100%',
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 6,
  },
  lineShort: {
    width: '70%',
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    width: 120,
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  button: {
    width: 32,
    height: 32,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
});

export default SkeletonLoader;
