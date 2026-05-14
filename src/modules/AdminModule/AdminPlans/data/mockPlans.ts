import {
  PlanFeature,
  PlanStatCard,
  SubscriptionPlan,
  SubscriberSalon,
  RevenueAnalytics,
} from '../types/plan.types';

export const ALL_FEATURES: PlanFeature[] = [
  { id: 'appointment-booking', name: 'Appointment Booking', icon: 'calendar', included: false },
  { id: 'staff-management', name: 'Staff Management', icon: 'people', included: false },
  { id: 'payment-tracking', name: 'Payment Tracking', icon: 'card', included: false },
  { id: 'basic-reports', name: 'Basic Reports', icon: 'document-text', included: false },
  { id: 'analytics-dashboard', name: 'Analytics Dashboard', icon: 'analytics', included: false },
  { id: 'sms-notifications', name: 'SMS Notifications', icon: 'chatbubble', included: false },
  { id: 'custom-branding', name: 'Custom Branding', icon: 'color-palette', included: false },
  { id: 'priority-support', name: 'Priority Support', icon: 'headset', included: false },
  { id: 'reports-export', name: 'Reports Export', icon: 'download', included: false },
  { id: 'whatsapp-notifications', name: 'WhatsApp Notifications', icon: 'logo-whatsapp', included: false },
  { id: 'inventory-management', name: 'Inventory Management', icon: 'cube', included: false },
  { id: 'multi-location', name: 'Multi-location Support', icon: 'location', included: false },
  { id: 'api-access', name: 'API Access', icon: 'code-slash', included: false },
  { id: 'white-label', name: 'White-label Options', icon: 'brush', included: false },
  { id: 'dedicated-manager', name: 'Dedicated Account Manager', icon: 'person', included: false },
];

function withFeatures(ids: string[]): PlanFeature[] {
  return ALL_FEATURES.map((f) => ({ ...f, included: ids.includes(f.id) }));
}

const analytics6M: RevenueAnalytics[] = [
  { month: 'Jan', revenue: 45000, subscribers: 8 },
  { month: 'Feb', revenue: 52000, subscribers: 9 },
  { month: 'Mar', revenue: 49000, subscribers: 9 },
  { month: 'Apr', revenue: 61000, subscribers: 11 },
  { month: 'May', revenue: 74000, subscribers: 13 },
  { month: 'Jun', revenue: 89000, subscribers: 15 },
];

const basicSubscribers: SubscriberSalon[] = [
  { id: 1, salonName: 'Glamour Studio', ownerName: 'Priya Sharma', activeSince: '2024-01-15', renewalDate: '2024-07-15', paymentStatus: 'paid', revenueContribution: 999, currency: 'INR' },
  { id: 2, salonName: 'Style Hub', ownerName: 'Rahul Mehta', activeSince: '2024-02-01', renewalDate: '2024-08-01', paymentStatus: 'paid', revenueContribution: 999, currency: 'INR' },
  { id: 3, salonName: 'Beauty Corner', ownerName: 'Neha Verma', activeSince: '2024-03-10', renewalDate: '2024-09-10', paymentStatus: 'pending', revenueContribution: 999, currency: 'INR' },
  { id: 4, salonName: 'The Cut Zone', ownerName: 'Amit Patel', activeSince: '2024-04-05', renewalDate: '2024-10-05', paymentStatus: 'paid', revenueContribution: 999, currency: 'INR' },
  { id: 5, salonName: 'Glow & Go', ownerName: 'Sita Rao', activeSince: '2024-04-20', renewalDate: '2024-10-20', paymentStatus: 'overdue', revenueContribution: 999, currency: 'INR' },
  { id: 6, salonName: 'Snip & Clip', ownerName: 'Deepa Iyer', activeSince: '2024-05-01', renewalDate: '2024-11-01', paymentStatus: 'paid', revenueContribution: 999, currency: 'INR' },
];

const proSubscribers: SubscriberSalon[] = [
  { id: 7, salonName: 'Luxe Cuts', ownerName: 'Vikram Singh', activeSince: '2023-11-01', renewalDate: '2024-11-01', paymentStatus: 'paid', revenueContribution: 2499, currency: 'INR' },
  { id: 8, salonName: 'Elite Salon', ownerName: 'Pooja Nair', activeSince: '2023-12-15', renewalDate: '2024-12-15', paymentStatus: 'paid', revenueContribution: 2499, currency: 'INR' },
  { id: 9, salonName: 'Prestige Cuts', ownerName: 'Arjun Kumar', activeSince: '2024-01-20', renewalDate: '2025-01-20', paymentStatus: 'pending', revenueContribution: 2499, currency: 'INR' },
  { id: 10, salonName: 'Urban Glow', ownerName: 'Meena Pillai', activeSince: '2024-02-10', renewalDate: '2025-02-10', paymentStatus: 'paid', revenueContribution: 2499, currency: 'INR' },
];

const enterpriseSubscribers: SubscriberSalon[] = [
  { id: 11, salonName: 'Salon Chain Co.', ownerName: 'Deepak Joshi', activeSince: '2023-06-01', renewalDate: '2024-12-01', paymentStatus: 'paid', revenueContribution: 4999, currency: 'INR' },
  { id: 12, salonName: 'Mega Style Group', ownerName: 'Kavita Reddy', activeSince: '2023-09-15', renewalDate: '2025-03-15', paymentStatus: 'paid', revenueContribution: 4999, currency: 'INR' },
];

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: 'Basic Plan',
    tier: 'basic',
    description: 'Perfect for small salons just getting started with digital management.',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    currency: 'INR',
    billingCycle: 'both',
    status: 'active',
    isPopular: false,
    color: '#6B7280',
    employeeLimit: 5,
    trialDays: 14,
    durationInDays: 30,
    features: withFeatures(['appointment-booking', 'staff-management', 'payment-tracking', 'basic-reports']),
    activeSubscribers: 6,
    trialUsers: 3,
    monthlyRevenue: 5994,
    annualRevenue: 71928,
    subscribers: basicSubscribers,
    analytics: analytics6M.map((a) => ({ ...a, revenue: Math.floor(a.revenue * 0.25), subscribers: Math.floor(a.subscribers * 0.45) })),
    createdAt: '2023-01-01',
    updatedAt: '2024-04-01',
  },
  {
    id: 2,
    name: 'Professional Plan',
    tier: 'professional',
    description: 'For growing businesses that need advanced tools and priority support.',
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    currency: 'INR',
    billingCycle: 'both',
    status: 'active',
    isPopular: true,
    color: '#D97706',
    employeeLimit: 20,
    trialDays: 14,
    durationInDays: 30,
    features: withFeatures([
      'appointment-booking', 'staff-management', 'payment-tracking', 'basic-reports',
      'analytics-dashboard', 'sms-notifications', 'custom-branding', 'priority-support', 'reports-export',
    ]),
    activeSubscribers: 4,
    trialUsers: 5,
    monthlyRevenue: 9996,
    annualRevenue: 119952,
    subscribers: proSubscribers,
    analytics: analytics6M.map((a) => ({ ...a, revenue: Math.floor(a.revenue * 0.55), subscribers: Math.floor(a.subscribers * 0.35) })),
    createdAt: '2023-01-01',
    updatedAt: '2024-04-15',
  },
  {
    id: 3,
    name: 'Enterprise Plan',
    tier: 'enterprise',
    description: 'For large salon chains requiring unlimited scale and dedicated support.',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    currency: 'INR',
    billingCycle: 'both',
    status: 'active',
    isPopular: false,
    color: '#780115',
    employeeLimit: null,
    trialDays: 30,
    durationInDays: 30,
    features: withFeatures(ALL_FEATURES.map((f) => f.id)),
    activeSubscribers: 2,
    trialUsers: 1,
    monthlyRevenue: 9998,
    annualRevenue: 119976,
    subscribers: enterpriseSubscribers,
    analytics: analytics6M.map((a) => ({ ...a, revenue: Math.floor(a.revenue * 0.8), subscribers: Math.floor(a.subscribers * 0.15) })),
    createdAt: '2023-01-01',
    updatedAt: '2024-05-01',
  },
];

export function computeStatCards(plans: SubscriptionPlan[]): PlanStatCard[] {
  const totalSubs = plans.reduce((s, p) => s + p.activeSubscribers, 0);
  const totalTrials = plans.reduce((s, p) => s + p.trialUsers, 0);
  const mrr = plans.reduce((s, p) => s + p.monthlyRevenue, 0);
  const arr = plans.reduce((s, p) => s + p.annualRevenue, 0);

  const fmt = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
  };

  return [
    { id: 'total-plans', title: 'Total Plans', value: plans.length, icon: 'layers', color: '#780115', growth: 0 },
    { id: 'active-subs', title: 'Active Subscribers', value: totalSubs, icon: 'people', color: '#3B82F6', growth: 12 },
    { id: 'mrr', title: 'Monthly Revenue', value: fmt(mrr), icon: 'cash', color: '#059669', growth: 18 },
    { id: 'arr', title: 'Annual Revenue', value: fmt(arr), icon: 'trending-up', color: '#7C3AED', growth: 22 },
    { id: 'trials', title: 'Trial Users', value: totalTrials, icon: 'time', color: '#D97706', growth: 5 },
    { id: 'expiring', title: 'Expiring Soon', value: 4, icon: 'warning', color: '#DC2626', growth: -2 },
  ];
}

export const PLAN_COLORS = [
  '#6B7280', '#D97706', '#780115',
  '#3B82F6', '#7C3AED', '#059669',
];
