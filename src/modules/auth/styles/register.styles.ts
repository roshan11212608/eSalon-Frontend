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
    padding: 16,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },

  // Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },

  titleUnderline: {
    width: 50,
    height: 3,
    backgroundColor: '#f7b638',
    borderRadius: 2,
  },

  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 18,
    textAlign: 'center',
  },

  // Success Message
  successMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    borderWidth: 1,
    borderColor: '#f7b638',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  successMessageText: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 8,
    flex: 1,
  },

  verifiedEmail: {
    fontSize: 12,
    color: '#f7b638',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    backgroundColor: '#fff9e6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f7b638',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 10,
  },

  // Input Container
  inputContainer: {
    marginBottom: 10,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
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

  inputFocused: {
    borderColor: '#f7b638',
  },

  // OTP Input - Unique Design
  otpContainer: {
    marginBottom: 24,
  },

  otpInput: {
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 16,
    backgroundColor: '#fff9e6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 8,
  },

  inputPlaceholder: {
    color: '#999999',
  },

  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#1a1a1a',
  },

  // Button
  registerButton: {
    backgroundColor: '#f7b638',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 42,
    justifyContent: 'center',
  },

  registerButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },

  registerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },

  // Back Button
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 0,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },

  // Resend OTP Button - Unique Design
  resendButton: {
    backgroundColor: '#fff9e6',
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },

  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7b638',
  },

  // Login Link Button
  loginButton: {
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 4,
  },

  loginButtonText: {
    fontSize: 14,
    color: '#f7b638',
    fontWeight: '600',
  },

  // Success Screen
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
  },

  // Email Verification Screen - Larger Styles
  emailVerificationContentContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  emailVerificationTitleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  emailVerificationTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },

  emailVerificationTitleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#f7b638',
    borderRadius: 2,
  },

  emailVerificationSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 32,
    lineHeight: 20,
    textAlign: 'center',
  },

  emailVerificationVerifiedEmail: {
    fontSize: 14,
    color: '#f7b638',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: '#fff9e6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f7b638',
    marginBottom: 32,
  },

  emailVerificationInputContainer: {
    marginBottom: 32,
  },

  emailVerificationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 12,
    minHeight: 50,
  },

  emailVerificationInputIcon: {
    marginRight: 12,
    backgroundColor: '#fff9e6',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emailVerificationInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 0,
  },

  emailVerificationRegisterButton: {
    backgroundColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 52,
    justifyContent: 'center',
  },

  emailVerificationRegisterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },

  emailVerificationBackButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },

  emailVerificationBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },

  emailVerificationOtpContainer: {
    marginBottom: 16,
  },

  otpDigitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  otpDigitBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 12,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  otpDigitText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    height: 50,
    width: '100%',
    zIndex: 1,
  },

  emailVerificationOtpInput: {
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 12,
    backgroundColor: '#fff9e6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 6,
  },

  emailVerificationResendButton: {
    backgroundColor: '#fff9e6',
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },

  emailVerificationResendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7b638',
  },

  emailVerificationLoginButton: {
    borderWidth: 2,
    borderColor: '#f7b638',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 8,
  },

  emailVerificationLoginButtonText: {
    fontSize: 16,
    color: '#f7b638',
    fontWeight: '600',
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
