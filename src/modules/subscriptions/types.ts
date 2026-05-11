export interface Subscription {
  id: string;
  planName: string;
  ownerName: string;
  shopName: string;
  amount: number;
  status: 'Active' | 'Inactive' | 'Pending' | 'Expired';
  startDate: string;
  endDate: string;
  duration: '1 Month' | '3 Months' | '6 Months' | '1 Year';
}

export interface PricingPlan {
  id: string;
  name: string;
  duration: '1 Month' | '3 Months' | '6 Months' | '1 Year';
  price: number;
  description: string;
}
