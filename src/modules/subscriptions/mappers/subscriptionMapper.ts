import { Subscription } from '../types';

/**
 * Mapper utility for subscription data transformations
 */

export interface GroupedSubscriptions {
  [status: string]: Subscription[];
}

/**
 * Groups subscriptions by status
 */
export const groupSubscriptionsByStatus = (subscriptions: Subscription[]): GroupedSubscriptions => {
  return subscriptions.reduce((acc, subscription) => {
    const status = subscription.status || 'Other';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(subscription);
    return acc;
  }, {} as GroupedSubscriptions);
};

/**
 * Filters subscriptions by search text and status
 */
export const filterSubscriptions = (
  subscriptions: Subscription[],
  searchText: string,
  selectedStatus: string
): Subscription[] => {
  return subscriptions.filter(subscription => {
    const matchesSearch = (subscription.planName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                         (subscription.ownerName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                         (subscription.shopName?.toLowerCase() || '').includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || subscription.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
};

/**
 * Formats subscription date for display
 */
export const formatSubscriptionDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
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
 * Gets status color
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Active': '#10B981',
    'Inactive': '#64748B',
    'Pending': '#F59E0B',
    'Expired': '#EF4444',
  };
  return colors[status] || '#64748B';
};

/**
 * Gets status icon
 */
export const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    'Active': 'checkmark-circle',
    'Inactive': 'pause-circle',
    'Pending': 'time',
    'Expired': 'close-circle',
  };
  return icons[status] || 'ellipse';
};

/**
 * Calculates total revenue from active subscriptions
 */
export const calculateTotalRevenue = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter(sub => sub.status === 'Active')
    .reduce((sum, sub) => sum + sub.amount, 0);
};
