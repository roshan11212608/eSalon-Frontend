import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Subscription, PricingPlan } from '../types';

// Mock current subscription for the logged-in owner
const mockCurrentSubscription: Subscription | null = {
  id: '1',
  planName: 'eSalon Basic',
  ownerName: 'Current Owner',
  shopName: 'My Salon',
  amount: 99,
  status: 'Active',
  startDate: '2024-01-15',
  endDate: '2024-02-15',
  duration: '1 Month',
};

// Available pricing plans
const pricingPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'eSalon Basic',
    duration: '1 Month',
    price: 99,
    description: 'Perfect for small salons',
  },
  {
    id: '2',
    name: 'eSalon Standard',
    duration: '3 Months',
    price: 250,
    description: 'Save 16% with quarterly plan',
  },
  {
    id: '3',
    name: 'eSalon Premium',
    duration: '6 Months',
    price: 499,
    description: 'Save 17% with half-yearly plan',
  },
  {
    id: '4',
    name: 'eSalon Enterprise',
    duration: '1 Year',
    price: 999,
    description: 'Best value - Save 17%',
  },
];

export const useSubscriptions = () => {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentSubscription(mockCurrentSubscription);
      setPlans(pricingPlans);
    } catch (err: any) {
      setError('Failed to load subscription data');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshSubscriptions();
    }, [refreshSubscriptions])
  );

  return {
    currentSubscription,
    plans,
    loading,
    error,
    refreshSubscriptions,
  };
};
