export type SalonStatus = 'active' | 'trial' | 'expired' | 'inactive' | 'suspended';
export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';

export interface SalonStats {
  totalSalons: number;
  activeSalons: number;
  trialSalons: number;
  expiredSalons: number;
  totalRevenue: string;
  newSalonsThisMonth: number;
}

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  growth?: number;
  color: string;
}

export interface Salon {
  id: number;
  shopId: string;
  name: string;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  subscription: {
    plan: SubscriptionPlan;
    status: SalonStatus;
    expiryDate: string;
    monthlyFee: string;
  };
  business: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  metrics: {
    staffCount: number;
    monthlyRevenue: string;
    totalAppointments: number;
    activeClients: number;
  };
  dates: {
    joinedDate: string;
    lastActive: string;
  };
  logo?: string;
  isVerified: boolean;
}

export interface FilterOptions {
  status: SalonStatus | 'all';
  plan: SubscriptionPlan | 'all';
  searchQuery: string;
}

export interface SalonAction {
  id: string;
  label: string;
  icon: string;
  onPress: (salon: Salon) => void;
  color?: string;
  destructive?: boolean;
}

export interface SalonDetailsTab {
  key: string;
  title: string;
  component: React.ComponentType<{ salon: Salon }>;
}
