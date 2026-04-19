import React, { useEffect } from 'react';
import OwnerDashboard from '@/src/modules/dashboard/owner/screens/DashboardScreen';

export default function OwnerHomeScreen() {
  console.log('OwnerHomeScreen: Component rendering...');
  
  useEffect(() => {
    console.log('OwnerHomeScreen: Component mounted');
    // Real authentication is handled by AuthService and StorageService
    // No mock authentication needed
  }, []);

  console.log('OwnerHomeScreen: About to render OwnerDashboard');
  
  return <OwnerDashboard />;
}
