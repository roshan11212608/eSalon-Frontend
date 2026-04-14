import React from 'react';
import Activity from '@/src/modules/activity/Activity';
import { authStore } from '@/src/store';

export default function OwnerActivityScreen() {
  const { isAuthenticated } = authStore.getState();
  
  if (!isAuthenticated) {
    // Handle not authenticated
    return null;
  }

  return <Activity />;
}
