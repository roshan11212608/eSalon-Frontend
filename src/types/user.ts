export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff' | 'admin';
  avatar?: string;
  phone?: string;
}
