// Greeting configuration
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

// Period selector
export const PERIOD_OPTIONS = ['today', 'week', 'month'] as const;
export type PeriodType = typeof PERIOD_OPTIONS[number];

export const PERIOD_LABELS: Record<PeriodType, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

// Summary card colors
export const SUMMARY_CARDS = {
  colors: {
    salons: { background: '#EEF2FF', text: '#6366F1' },
    users: { background: '#ECFDF5', text: '#10B981' },
    subscriptions: { background: '#FFFBEB', text: '#F59E0B' },
    revenue: { background: '#FDF2F8', text: '#EC4899' },
  },
  labels: {
    salons: 'Salons',
    users: 'Users',
    subscriptions: 'Active Subs',
    revenue: 'Revenue',
  },
} as const;

// Dashboard config
export const DASHBOARD_SCREEN = {
  LOADING_INDICATOR_COLOR: '#f7b638',
  FALLBACK_ERROR_MESSAGE: 'Failed to load dashboard',
  EMPTY_STATES: {
    FINANCIAL: {
      ICON: 'pie-chart',
      TITLE: 'No Financial Data',
      SUBTITLE: 'Financial data will appear here once available',
    },
    CHARTS: {
      ICON: 'trending-up',
      TITLE: 'No Chart Data',
      SUBTITLE: 'Chart data will appear here once available',
    },
  },
} as const;

// Default values
export const DEFAULT_VALUES = {
  DISPLAY_NAME: 'Admin',
  INITIAL_PERIOD: 'month' as PeriodType,
};

// Animation config
export const ANIMATION_CONFIG = {
  CARDS: {
    duration: 400,
    delayStart: 300,
    delayIncrement: 100,
    initialOpacity: 0,
  },
};
