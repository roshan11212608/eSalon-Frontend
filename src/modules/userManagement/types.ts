export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'staff' | 'admin';
  shopName?: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'staff' | 'admin';
  shopName?: string;
  joinDate: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'owner' | 'staff' | 'admin';
  shopName?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
