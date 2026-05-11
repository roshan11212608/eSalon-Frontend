import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 1,
  },

  // Content
  content: {
    flex: 1,
  },

  // Form Group
  formGroup: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },

  eyeIcon: {
    marginLeft: 8,
    padding: 4,
  },

  // Button
  saveButton: {
    backgroundColor: '#f7b638',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Cancel Button
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
});

// Route-specific styles
export const routeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 0,
  },
});
