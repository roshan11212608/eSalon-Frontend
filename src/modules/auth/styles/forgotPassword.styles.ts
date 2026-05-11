import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },

  // Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },

  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#f7b638',
    borderRadius: 2,
  },

  // Error Message
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },

  errorText: {
    fontSize: 14,
    color: '#780115',
    marginLeft: 8,
    flex: 1,
  },

  // Input Container
  inputContainer: {
    marginBottom: 24,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 8,
    minHeight: 36,
  },

  inputWrapperFocused: {
    borderColor: '#f7b638',
  },

  inputIcon: {
    marginRight: 10,
    backgroundColor: '#fff9e6',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 0,
  },

  passwordToggle: {
    padding: 6,
    marginLeft: 6,
    backgroundColor: '#fff9e6',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Send OTP Button
  sendOtpButton: {
    backgroundColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 52,
    justifyContent: 'center',
  },

  sendOtpButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },

  sendOtpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },

  // Reset Button
  resetButton: {
    backgroundColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 52,
    justifyContent: 'center',
  },

  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },

  // Back to Login Button
  backToLoginButton: {
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  backToLoginButtonText: {
    fontSize: 16,
    color: '#f7b638',
    fontWeight: '600',
  },
});
