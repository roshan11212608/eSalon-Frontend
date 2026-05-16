import { useQuery } from '@tanstack/react-query';
import { SubscriptionService } from '../services/SubscriptionService';
import { PaymentService } from '../services/PaymentService';
import type { OwnerPlan, SubscriptionStatus } from '../types';

export const useSubscriptions = () => {
  const {
    data: plans = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery<OwnerPlan[]>({
    queryKey: ['owner', 'subscription', 'active-plans'],
    queryFn: SubscriptionService.getActivePlans,
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: subscriptionStatus,
    isLoading: statusLoading,
  } = useQuery<SubscriptionStatus>({
    queryKey: ['owner', 'subscription', 'status'],
    queryFn: PaymentService.getOwnerSubscriptionStatus,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    subscriptionStatus,
    plans,
    loading: isLoading || statusLoading,
    isRefetching,
    error: error ? (error instanceof Error ? error.message : 'Failed to load plans') : null,
    refreshSubscriptions: refetch,
  };
};
