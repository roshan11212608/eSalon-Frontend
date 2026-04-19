import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    minHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#780115',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
});
