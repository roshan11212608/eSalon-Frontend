import { Expense } from '../../../services/expenseService';

/**
 * Mapper utility for expense data transformations
 * All data transformation logic should be centralized here
 */

export interface GroupedExpenses {
  [category: string]: Expense[];
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  count: number;
  color: string;
  icon: string;
}

/**
 * Groups expenses by category
 */
export const groupExpensesByCategory = (expenses: Expense[]): GroupedExpenses => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as GroupedExpenses);
};

/**
 * Filters expenses to current month only
 */
export const filterCurrentMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.expenseDate);
    const isCurrentMonth = expenseDate.getMonth() === now.getMonth() && 
                          expenseDate.getFullYear() === now.getFullYear();
    return isCurrentMonth;
  });
};

/**
 * Filters expenses by search text and category
 */
export const filterExpenses = (
  expenses: Expense[],
  searchText: string,
  selectedCategory: string
): Expense[] => {
  return expenses.filter(expense => {
    const matchesSearch = (expense.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                         (expense.description?.toLowerCase() || '').includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};

/**
 * Formats expense date for display in IST timezone
 */
export const formatExpenseDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    };
    return date.toLocaleString('en-US', options);
  } catch {
    return 'N/A';
  }
};

/**
 * Formats currency amount to Indian Rupee format
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Gets category color
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Utilities': '#3B82F6',
    'Rent': '#8B5CF6',
    'Supplies': '#10B981',
    'Marketing': '#EC4899',
    'Equipment': '#6366F1',
    'Other': '#64748B',
  };
  return colors[category] || '#64748B';
};

/**
 * Gets category icon
 */
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Utilities': 'flash',
    'Rent': 'home',
    'Supplies': 'cube',
    'Marketing': 'megaphone',
    'Equipment': 'build',
    'Other': 'ellipsis-horizontal',
  };
  return icons[category] || 'ellipse';
};

/**
 * Calculates category summary
 */
export const calculateCategorySummary = (expenses: Expense[]): CategorySummary[] => {
  const grouped = groupExpensesByCategory(expenses);
  return Object.entries(grouped).map(([category, categoryExpenses]) => ({
    category,
    totalAmount: categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    count: categoryExpenses.length,
    color: getCategoryColor(category),
    icon: getCategoryIcon(category),
  }));
};

/**
 * Parses currency string to number (for legacy data handling)
 * @deprecated Backend should return numeric amounts
 */
export const parseCurrencyString = (currencyString: string): number => {
  if (typeof currencyString === 'number') return currencyString;
  return parseFloat(currencyString.replace('₹', '').replace(',', '')) || 0;
};
