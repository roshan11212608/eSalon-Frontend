import React from 'react';
import Expenses from '@/src/modules/expenses/Expenses';
import { authStore } from '@/src/store';

export default function ExpensesScreen() {
  const { isAuthenticated } = authStore.getState();
  
  if (!isAuthenticated) {
    // Handle not authenticated
    return null;
  }

  return <Expenses expenses={[]} onAddExpense={() => {}} onToggleExpenseStatus={() => {}} />;
}
