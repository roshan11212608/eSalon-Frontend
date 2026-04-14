import React, { useEffect } from 'react';
import OwnerDashboard from '@/src/modules/dashboard/owner/screens/DashboardScreen';
import { authStore } from '@/src/store';

export default function OwnerHomeScreen() {
  console.log('OwnerHomeScreen: Component rendering...');
  
  useEffect(() => {
    console.log('OwnerHomeScreen: Setting up authentication...');
    // Mock authentication for development
    authStore.login('mock-token', 'owner', {
      id: '1',
      name: 'Owner',
      email: 'owner@esalon.com',
      role: 'owner'
    });
    
    console.log('OwnerHomeScreen: Authentication setup complete');
  }, []);

  console.log('OwnerHomeScreen: About to render OwnerDashboard');
  
  return <OwnerDashboard />;
}
