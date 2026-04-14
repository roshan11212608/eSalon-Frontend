// Profile module types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'owner' | 'staff' | 'admin';
  shopId?: string;
  shopName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showPhone: boolean;
    showEmail: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  avatar?: string;
  settings?: Partial<ProfileSettings>;
}
