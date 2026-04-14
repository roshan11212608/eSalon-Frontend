// Shop module types
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: {
    [key: string]: string;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export interface ShopSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
}
