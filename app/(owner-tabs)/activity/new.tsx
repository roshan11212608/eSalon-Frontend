import React from 'react';
import NewAcitivity from '@/src/modules/activity/NewAcitivity';
import { authStore } from '@/src/store';

export default function NewActivityScreen() {
  const { isAuthenticated } = authStore.getState();
  
  if (!isAuthenticated) {
    // Handle not authenticated
    return null;
  }

  return <NewAcitivity />;
}
