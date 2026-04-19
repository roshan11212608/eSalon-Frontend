export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: 'owner' | 'staff' | 'admin';
  avatar?: string;
  phone?: string;
  shopId?: string;
  shopName?: string;
  shopAddress?: string;
  employeeId?: string;
}
