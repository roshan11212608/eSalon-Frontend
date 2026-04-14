// Shop-related types
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface ShopSettings {
  id: string;
  shopId: string;
  businessHours: BusinessHours;
  services: Service[];
  pricing: PricingTier[];
  staff: StaffMember[];
  notifications: NotificationSettings;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'haircut' | 'styling' | 'coloring' | 'treatment' | 'beard' | 'other';
  isActive: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  services: string[]; // service IDs
  basePrice: number;
  duration: number; // in minutes
}

export interface StaffMember {
  id: string;
  userId: string;
  shopId: string;
  role: 'stylist' | 'barber' | 'receptionist' | 'manager';
  commissionRate?: number;
  schedule: StaffSchedule;
  isActive: boolean;
}

export interface StaffSchedule {
  id: string;
  staffId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  lowInventoryAlerts: boolean;
  newBookingAlerts: boolean;
  staffScheduleAlerts: boolean;
}
