import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Background decoration
  backgroundDecoration: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  backgroundDecoration2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Logo Section with glassmorphism
  logoSection: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  
  tagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginTop: 5,
  },
  
  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 30,
    letterSpacing: 0.2,
  },
  
  // Form Section with glassmorphism cards
  formSection: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  
  inputContainer: {
    marginBottom: 18,
    position: 'relative',
  },
  
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  inputPlaceholder: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  
  forgotPasswordButton: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  
  forgotPasswordText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
  },
  
  // Modern button design
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  loginButtonDisabled: {
    opacity: 0.6,
  },
  
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#764ba2',
    letterSpacing: 0.5,
  },
  
  // Create account with modern styling
  createAccountContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  
  createAccountText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.2,
  },
  
  createAccountLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
  },
});