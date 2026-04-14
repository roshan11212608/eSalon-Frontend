// Shop types
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

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: 'haircut' | 'styling' | 'coloring' | 'treatment' | 'beard' | 'other';
  isActive: boolean;
}
