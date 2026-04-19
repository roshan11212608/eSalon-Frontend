// Profile module types - aligned with backend ProfileDto
export interface UserProfile {
  id: number;
  userId: number;
  shopId?: number;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface ProfileUpdateData {
  bio?: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}
