/**
 * Admin Dashboard Service
 * Handles all admin dashboard API calls
 */
import { DashboardResponse } from '../types/dashboard.types';

// Mock admin dashboard data
const mockDashboardData: DashboardResponse = {
  profile: {
    id: 'admin-1',
    name: 'System Administrator',
    email: 'admin@esalon.com',
    role: 'ADMIN',
  },
  stats: {
    totalSalons: 12,
    totalUsers: 156,
    activeSubscriptions: 8,
    totalRevenue: 285000,
    pendingApprovals: 3,
    supportTickets: 5,
  },
  financialStats: [
    { label: 'Total Revenue', value: '₹2,85,000', color: '#f7b638', icon: 'cash', change: '+12%' },
    { label: 'Subscriptions', value: '₹1,45,000', color: '#10B981', icon: 'card', change: '+8%' },
    { label: 'New Signups', value: '₹45,000', color: '#3B82F6', icon: 'people', change: '+15%' },
    { label: 'Pending', value: '₹95,000', color: '#F59E0B', icon: 'time', change: '-3%' },
  ],
  recentSalons: [
    { id: 1, name: 'Glamour Salon', owner: 'Priya Sharma', plan: 'Professional', status: 'active', revenue: '₹45,000', joinedDate: '2024-01-15' },
    { id: 2, name: 'Style Studio', owner: 'Rahul Mehta', plan: 'Basic', status: 'active', revenue: '₹28,000', joinedDate: '2024-02-20' },
    { id: 3, name: 'Beauty Hub', owner: 'Sneha Patel', plan: 'Enterprise', status: 'pending', revenue: '₹0', joinedDate: '2024-03-10' },
  ],
  plans: [
    { id: 1, name: 'Basic', price: '₹999/mo', subscribers: 4, revenue: '₹3,996' },
    { id: 2, name: 'Professional', price: '₹2,499/mo', subscribers: 6, revenue: '₹14,994' },
    { id: 3, name: 'Enterprise', price: '₹4,999/mo', subscribers: 2, revenue: '₹9,998' },
  ],
  revenueTrends: [
    { period: 'Jan', revenue: 45000, subscriptions: 5 },
    { period: 'Feb', revenue: 52000, subscriptions: 6 },
    { period: 'Mar', revenue: 48000, subscriptions: 5 },
    { period: 'Apr', revenue: 61000, subscriptions: 8 },
    { period: 'May', revenue: 55000, subscriptions: 7 },
    { period: 'Jun', revenue: 68000, subscriptions: 9 },
  ],
  notifications: [
    { id: 1, title: 'New Salon Registration', message: 'Beauty Hub has registered', type: 'salon', read: false, createdAt: '2 hours ago' },
    { id: 2, title: 'Subscription Upgraded', message: 'Glamour Salon upgraded to Enterprise', type: 'subscription', read: false, createdAt: '5 hours ago' },
    { id: 3, title: 'Payment Received', message: '₹2,499 received from Style Studio', type: 'payment', read: true, createdAt: '1 day ago' },
  ],
  unreadCount: 2,
};

export const AdminDashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    // In real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDashboardData), 500);
    });
  },
};
