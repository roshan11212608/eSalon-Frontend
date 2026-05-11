// Profile module types - aligned with backend ProfileDto
export interface UserProfile {
  id: number;
  userId: number;
  customUserId?: string;
  shopId?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  shopName?: string;
  shopAddress?: string;
}

export interface ProfileUpdateData {
  phoneNumber?: string;
  avatarUrl?: string;
}
