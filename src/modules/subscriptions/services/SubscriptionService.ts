/**
 * SubscriptionService — owner-facing plan browsing.
 *
 * Calls GET /api/plans/active  (@PreAuthorize OWNER | ADMIN)
 *
 * Intentionally separate from AdminPlanService.
 * Does NOT use /api/admin/plans — that endpoint is ADMIN-only.
 */
import { API_ENDPOINTS } from '@/src/config/api';
import { apiService } from '@/src/services/apiService';
import type { OwnerPlan } from '../types';

interface PublicPlanDto {
  id?: number;
  name?: string;
  description?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  currency?: string;
  employeeLimit?: number | null;
  durationInDays?: number;
  features?: string[];
  isPopular?: boolean;
  color?: string;
  tier?: string;
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
}

function mapDto(dto: PublicPlanDto): OwnerPlan {
  return {
    id: dto.id ?? 0,
    name: dto.name ?? '',
    description: dto.description ?? '',
    monthlyPrice: dto.monthlyPrice ?? 0,
    yearlyPrice: dto.yearlyPrice ?? 0,
    currency: dto.currency ?? 'INR',
    employeeLimit: dto.employeeLimit ?? null,
    durationInDays: dto.durationInDays ?? 30,
    features: Array.isArray(dto.features) ? dto.features : [],
    isPopular: dto.isPopular ?? false,
    color: dto.color ?? '#059669',
    tier: dto.tier ?? 'basic',
  };
}

function unwrap(body: unknown): PublicPlanDto[] {
  if (Array.isArray(body)) return body as PublicPlanDto[];
  if (body && typeof body === 'object' && 'data' in body) {
    const d = (body as Envelope<unknown>).data;
    if (Array.isArray(d)) return d as PublicPlanDto[];
  }
  return [];
}

export const SubscriptionService = {
  async getActivePlans(): Promise<OwnerPlan[]> {
    const response = await apiService.get<Envelope<PublicPlanDto[]> | PublicPlanDto[]>(
      API_ENDPOINTS.PLANS.ACTIVE
    );
    return unwrap(response.data)
      .map(mapDto)
      .filter(p => p.id > 0);
  },
};
