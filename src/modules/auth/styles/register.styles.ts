import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#780115',
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    flexGrow: 1,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#f7b638',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#f7b638',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },

  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },

  // Card Section
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    marginBottom: 40,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#780115',
    marginBottom: 32,
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 32,
    lineHeight: 20,
    textAlign: 'center',
  },

  verifiedEmail: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#780115',
    marginTop: 24,
    marginBottom: 20,
    letterSpacing: 0.3,
  },

  // Input Container
  inputContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#780115',
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
    fontSize: 16,
    color: '#1a1a1a',
  },

  inputFocused: {
    borderColor: '#f7b638',
    borderWidth: 2,
  },

  inputPlaceholder: {
    color: '#999999',
  },

  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    color: '#999999',
  },

  // Button
  registerButton: {
    backgroundColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 52,
    justifyContent: 'center',
  },

  registerButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },

  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },

  // Back Button
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#dddddd',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#780115',
    letterSpacing: 0.3,
  },

  // Success Screen
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  successDetails: {
    marginBottom: 20,
  },

  successDetailText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
});
