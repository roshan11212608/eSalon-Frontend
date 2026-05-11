import { Dimensions } from 'react-native';

// Greeting configuration
export const GREETING_CONFIG = {
  MORNING_END_HOUR: 12,
  AFTERNOON_END_HOUR: 17,
  EVENING_END_HOUR: 21,
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < GREETING_CONFIG.MORNING_END_HOUR) return 'Good Morning';
  if (hour < GREETING_CONFIG.AFTERNOON_END_HOUR) return 'Good Afternoon';
  if (hour < GREETING_CONFIG.EVENING_END_HOUR) return 'Good Evening';
  return 'Good Night';
};

// Period selector configuration
export const PERIOD_OPTIONS = ['today', 'week', 'month'] as const;
export type PeriodType = typeof PERIOD_OPTIONS[number];

export const PERIOD_LABELS: Record<PeriodType, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

// Activity pagination configuration
export const ACTIVITY_PAGINATION = {
  FILTER: 'all',
  PAGE: 0,
  SIZE: 100,
};

// Summary card configuration
export const SUMMARY_CARDS = {
  colors: {
    today: {
      background: '#EEF2FF',
      text: '#6366F1',
    },
    yesterday: {
      background: '#ECFDF5',
      text: '#10B981',
    },
    week: {
      background: '#FFFBEB',
      text: '#F59E0B',
    },
    month: {
      background: '#FDF2F8',
      text: '#EC4899',
    },
  },
  labels: {
    today: 'Today',
    yesterday: 'Yesterday',
    week: 'This Week',
    month: 'Monthly',
  },
} as const;

// Notification configuration
export const NOTIFICATION_CONFIG = {
  ICON_MAPPING: {
    appointment: 'calendar',
    payment: 'cash',
    default: 'information-circle',
  } as const,
  ICON_COLOR: '#2563EB',
  EMPTY_STATE: {
    ICON: 'notifications-off-outline',
    ICON_COLOR: '#9CA3AF',
    TITLE: 'No Notifications',
    SUBTITLE: "You're all caught up!\nNew activity and payment alerts will appear here.",
  },
};

// Chart configuration
export const CHART_CONFIG = {
  width: Dimensions.get('window').width - 64,
  height: 240,
  padding: '20',
  colors: {
    monthly: {
      line: (opacity: number = 1) => `rgba(247, 182, 56, ${opacity})`,
      dot: '#f7b638',
    },
    yearly: {
      line: (opacity: number = 1) => `rgba(229, 169, 46, ${opacity})`,
      dot: '#e5a92e',
    },
    background: 'transparent',
    label: (opacity: number = 1) => `rgba(0, 0, 0, ${opacity})`,
    legendFontColor: '#000000',
  },
  props: {
    dotRadius: 6,
    dotStrokeWidth: 3,
    backgroundLineStroke: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
    decimalPlaces: 0,
  },
};

// Dashboard screen configuration
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

// Error state configuration
export const ERROR_STATE_CONFIG = {
  TITLE: 'Something went wrong',
  ICON: 'alert-circle-outline',
  RETRY_BUTTON_TEXT: 'Retry',
  ICON_COLOR: undefined, // Uses theme colors.status.error
  BACKGROUND_COLOR: '#FFFFFF',
  TITLE_COLOR: '#1F2937',
  MESSAGE_COLOR: '#6B7280',
  RETRY_BUTTON_BACKGROUND_COLOR: undefined, // Uses theme colors.primary.main
  RETRY_BUTTON_TEXT_COLOR: '#FFFFFF',
  RETRY_ICON_COLOR: '#FFFFFF',
} as const;

// Empty state configuration
export const EMPTY_STATE_CONFIG = {
  BACKGROUND_COLOR: '#FFFFFF',
  DEFAULT_ICON: 'cube-outline',
  ICON_COLOR: undefined, // Uses theme colors.neutral[400]
} as const;

// Skeleton loader configuration
export const SKELETON_CONFIG = {
  BASE_COLOR: '#E5E7EB',
  CONTAINER_BACKGROUND: '#FFFFFF',
  BORDER_RADIUS: 4,
  SHIMMER_DURATION: 1000,
  AVATAR_BORDER_RADIUS: 24,
  ICON_BORDER_RADIUS: 20,
  CARD_BORDER_RADIUS: 12,
  CHART_PLACEHOLDER_BORDER_RADIUS: 8,
} as const;

// Currency configuration for amount parsing
export const CURRENCY_CONFIG = {
  SYMBOLS_TO_STRIP: '₹$,',
  DEFAULT_DECIMAL_PLACES: 2,
} as const;

// Date grouping configuration for notifications
export const DATE_GROUPING_CONFIG = {
  LABELS: {
    TODAY: 'Today',
    YESTERDAY: 'Yesterday',
    EARLIER: 'Earlier',
  },
  RELATIVE_TIME_THRESHOLDS: {
    JUST_NOW_SECONDS: 60,
    MINUTE_THRESHOLD: 60,
    HOUR_THRESHOLD: 24,
    DAY_THRESHOLD: 7,
  },
} as const;

// Default values
export const DEFAULT_VALUES = {
  DISPLAY_NAME: 'Owner',
  INITIAL_PERIOD: 'month' as PeriodType,
  INITIAL_LOADING: true,
  INITIAL_ERROR: null,
};

// Animation configuration
export const ANIMATION_CONFIG = {
  HEADER: {
    duration: 600,
    initialOpacity: 0,
    initialTranslateY: -30,
  },
  SUMMARY: {
    duration: 500,
    delay: 200,
    initialOpacity: 0,
  },
  CARDS: {
    duration: 400,
    delayStart: 300,
    delayIncrement: 100,
    initialTranslateY: 20,
    initialOpacity: 0,
  },
  PERFORMANCE: {
    duration: 500,
    delay: 600,
    initialOpacity: 0,
    initialTranslateY: 20,
  },
  TIMELINE: {
    duration: 600,
    delay: 800,
    initialOpacity: 0,
  },
  NUMBER_ANIMATION: {
    duration: 800,
    startValue: 0,
  },
  ACTIVE_OPACITY: 1,
};
