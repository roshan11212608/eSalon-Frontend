import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import expenseService, { Expense } from '../../../services/expenseService';
import { reportsService, ExpenseReportResponse } from '../../../services/reports/reportsService';
import { StorageService } from '@/src/services/storage/storageService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseReportData, setExpenseReportData] = useState<ExpenseReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshExpenses = useCallback(async () => {
    const storedShopId = await StorageService.getShopId();
    if (!storedShopId) {
      console.log('No stored shopId found');
      return;
    }

    if (storedShopId === '1') {
      console.log('Invalid shopId, skipping refresh');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch current month expenses from backend
      const expensesData = await expenseService.getCurrentMonthExpenses(parseInt(storedShopId));
      console.log('Fetched current month expenses:', expensesData);
      setExpenses(expensesData);

      // Fetch expense report for trend graph (includes historical data)
      const reportData = await reportsService.getExpenseReport(undefined, 'month');
      console.log('Fetched expense report:', reportData);
      setExpenseReportData(reportData);
    } catch (err: any) {
      setError('Failed to load expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshExpenses();
    }, [refreshExpenses])
  );

  return {
    expenses,
    expenseReportData,
    loading,
    error,
    refreshExpenses,
  };
};
