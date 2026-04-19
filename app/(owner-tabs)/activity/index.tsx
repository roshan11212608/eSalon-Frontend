import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Activity from '@/src/modules/activity/Activity';
import { StorageService } from '@/src/services/storage/storageService';

export default function OwnerActivityScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log('Activity screen - checking auth state...');
        const authenticated = await StorageService.isAuthenticated();
        console.log('Activity screen - authenticated:', authenticated);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Activity screen - error checking auth state:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    // Handle not authenticated
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Not authenticated - isAuthenticated: {isAuthenticated}</Text>
      </View>
    );
  }

  return <Activity />;
}
