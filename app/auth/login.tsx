import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { StorageService, type UserRole } from '../../src/services/storage/storageService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dummy credentials for testing
  const dummyUsers = {
    owner: {
      email: 'owner@esalon.com',
      password: 'owner123',
      role: 'owner' as UserRole,
      token: 'owner-token-12345'
    },
    staff: {
      email: 'staff@esalon.com',
      password: 'staff123',
      role: 'staff' as UserRole,
      token: 'staff-token-67890'
    },
    admin: {
      email: 'admin@esalon.com',
      password: 'admin123',
      role: 'admin' as UserRole,
      token: 'admin-token-11111'
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login with:', email);

      // Check dummy credentials
      let userData = null;
      
      if (email === dummyUsers.owner.email && password === dummyUsers.owner.password) {
        userData = dummyUsers.owner;
      } else if (email === dummyUsers.staff.email && password === dummyUsers.staff.password) {
        userData = dummyUsers.staff;
      } else if (email === dummyUsers.admin.email && password === dummyUsers.admin.password) {
        userData = dummyUsers.admin;
      }

      if (!userData) {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
        return;
      }

      // Save auth data to AsyncStorage
      await StorageService.setAuthData({
        token: userData.token,
        role: userData.role,
        isFirstTime: false // Set to false since we're removing onboarding
      });

      console.log('Login successful:', userData);

      // Navigate to index which will handle the routing logic
      router.replace('/');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDemoCredentials = () => {
    return (
      <View style={styles.demoContainer}>
        <Text style={styles.demoTitle}>Demo Credentials:</Text>
        <View style={styles.demoUser}>
          <Text style={styles.demoEmail}>Owner: owner@esalon.com / owner123</Text>
        </View>
        <View style={styles.demoUser}>
          <Text style={styles.demoEmail}>Staff: staff@esalon.com / staff123</Text>
        </View>
        <View style={styles.demoUser}>
          <Text style={styles.demoEmail}>Admin: admin@esalon.com / admin123</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>eSalon</Text>
          <Text style={styles.subtitle}>Salon Management System</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerButtonText}>Don&apos;t have an account? Register</Text>
          </TouchableOpacity>
        </View>

        {renderDemoCredentials()}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  demoContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  demoUser: {
    marginBottom: 4,
  },
  demoEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
});
