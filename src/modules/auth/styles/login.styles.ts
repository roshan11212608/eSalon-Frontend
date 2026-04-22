import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    flexGrow: 1,
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

  // Remember me and forgot password
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#dddddd',
    borderRadius: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#f7b638',
    borderColor: '#f7b638',
  },

  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },

  rememberMeText: {
    fontSize: 14,
    color: '#666666',
  },

  forgotPasswordButton: {
    paddingVertical: 4,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: '#f7b638',
    fontWeight: '500',
  },

  // Login Button
  loginButton: {
    backgroundColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 52,
    justifyContent: 'center',
  },

  loginButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },

  // Create account
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },

  createAccountText: {
    fontSize: 15,
    color: '#666666',
  },

  createAccountLink: {
    fontSize: 15,
    color: '#f7b638',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  createAccountButton: {
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  createAccountButtonText: {
    fontSize: 16,
    color: '#f7b638',
    fontWeight: '600',
  },
});