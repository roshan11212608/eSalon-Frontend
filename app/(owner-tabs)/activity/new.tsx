import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import NewAcitivity from '@/src/modules/activity/NewAcitivity';
import { StorageService } from '@/src/services/storage/storageService';

export default function NewActivityScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authenticated = await StorageService.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Not authenticated</Text>
      </View>
    );
  }

  return <NewAcitivity />;
}
