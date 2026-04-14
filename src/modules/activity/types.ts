// Activity module types
export interface Activity {
  id: string;
  type: 'appointment' | 'booking' | 'cancellation' | 'payment' | 'review';
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
  userId?: string;
  customerId?: string;
  amount?: number;
}

export interface ActivityFilter {
  type?: Activity['type'];
  status?: Activity['status'];
  dateFrom?: string;
  dateTo?: string;
}

export interface ActivityStats {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  revenue: number;
}
