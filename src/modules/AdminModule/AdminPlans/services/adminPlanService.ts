/**
 * Admin plan management backed by subscription plan records.
 *
 * Expected backend (adjust paths in src/config/api.ts if yours differ):
 *   GET  /admin/plans        → { success, message, data: PlanApi[] }
 *   GET  /admin/plans/:id    → { success, message, data: PlanApi }
 */
import { apiService, ApiError } from '@/src/services/apiService';
import { API_ENDPOINTS } from '@/src/config/api';
import type { CreatePlanForm, Plan, PlanStatus, PlanTier, PlanStatCard } from '../types/plan.types';
import { ALL_FEATURES } from '../data/mockPlans';

/** Loose DTO so minor backend naming differences still map */
export interface PlanApi {
  id?: number;
  name?: string;
  tier?: string;
  type?: string;
  monthlyPrice?: number;
  price?: number;
  monthly_price?: number;
  yearlyPrice?: number;
  yearly_price?: number;
  currency?: string;
  description?: string;
  features?: string[] | { label?: string; name?: string; text?: string }[];
  status?: string;
  isActive?: boolean;
  active?: boolean;
  subscriberCount?: number;
  subscriber_count?: number;
  subscribers?: number;
  maxStaff?: number;
  max_staff?: number;
  isPopular?: boolean;
  color?: string;
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

function unwrapList(body: unknown): PlanApi[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object' && 'data' in body) {
    const d = (body as Envelope<unknown>).data;
    if (Array.isArray(d)) return d;
  }
  return [];
}

function unwrapOne(body: unknown): PlanApi | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  if ('data' in o && o.data && typeof o.data === 'object' && !Array.isArray(o.data)) {
    return o.data as PlanApi;
  }
  if ('id' in o || 'name' in o || 'tier' in o || 'type' in o) return body as PlanApi;
  return null;
}

function normalizeTier(raw?: string): PlanTier {
  const t = (raw || 'basic').toLowerCase();
  if (t === 'professional' || t === 'enterprise' || t === 'basic') return t;
  return 'basic';
}

function normalizeStatus(raw?: string, isActive?: boolean): PlanStatus {
  if (typeof isActive === 'boolean') return isActive ? 'active' : 'inactive';
  const s = (raw || 'active').toLowerCase();
  return s === 'inactive' ? 'inactive' : 'active';
}

function normalizeFeatures(
  raw?: string[] | { label?: string; name?: string; text?: string }[]
): import('../types/plan.types').PlanFeature[] {
  if (!Array.isArray(raw)) return [];
  const names = raw
    .map((f) => (typeof f === 'string' ? f : (f.label || f.name || f.text || '').trim()))
    .filter(Boolean);
  return names.map((name, i) => ({ id: `f-${i}`, name, icon: 'checkmark-circle', included: true }));
}

export function mapPlanApiToPlan(row: PlanApi): Plan {
  const tier = normalizeTier(row.tier || row.type);
  const activeSubs = row.subscriberCount ?? row.subscriber_count ?? (typeof row.subscribers === 'number' ? row.subscribers : 0);
  return {
    id: row.id ?? 0,
    name: (row.name || tier.charAt(0).toUpperCase() + tier.slice(1) + ' Plan').trim(),
    tier,
    description: row.description ?? '',
    monthlyPrice: row.monthlyPrice ?? row.price ?? row.monthly_price ?? 0,
    yearlyPrice: row.yearlyPrice ?? row.yearly_price ?? 0,
    currency: row.currency ?? 'INR',
    billingCycle: 'both',
    status: normalizeStatus(row.status, row.isActive ?? row.active),
    isPopular: row.isPopular ?? false,
    color: row.color ?? '#6B7280',
    employeeLimit: row.maxStaff ?? row.max_staff ?? null,
    trialDays: 14,
    durationInDays: (row as any).durationInDays ?? 30,
    features: normalizeFeatures(row.features),
    activeSubscribers: activeSubs,
    trialUsers: 0,
    monthlyRevenue: 0,
    annualRevenue: 0,
    subscribers: [],
    analytics: [],
    createdAt: '',
    updatedAt: '',
  };
}

export function buildStatCardsFromPlans(plans: Plan[]): PlanStatCard[] {
  const totalSubs = plans.reduce((sum, p) => sum + p.activeSubscribers, 0);
  const monthlyRev = plans.reduce((sum, p) => sum + p.monthlyPrice * p.activeSubscribers, 0);

  const fmtRevenue = (n: number): string => {
    if (n <= 0) return '—';
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
  };

  const basicSubs = plans.filter((p) => p.tier === 'basic').reduce((s, p) => s + p.activeSubscribers, 0);
  const premiumSubs = plans
    .filter((p) => p.tier === 'professional' || p.tier === 'enterprise')
    .reduce((s, p) => s + p.activeSubscribers, 0);

  return [
    {
      id: 'total-plans',
      title: 'Total Plans',
      value: plans.length,
      icon: 'layers',
      color: '#780115',
    },
    {
      id: 'active-plans',
      title: 'Active Plans',
      value: plans.filter((p) => p.status === 'active').length,
      icon: 'checkmark-circle',
      color: '#059669',
    },
    {
      id: 'total-subscribers',
      title: 'Subscribers',
      value: totalSubs,
      icon: 'people',
      color: '#3B82F6',
    },
    {
      id: 'monthly-revenue',
      title: 'Monthly Revenue',
      value: fmtRevenue(monthlyRev),
      icon: 'cash',
      color: '#7C3AED',
    },
    {
      id: 'basic-subscribers',
      title: 'Basic Tier',
      value: basicSubs,
      icon: 'star-outline',
      color: '#6B7280',
    },
    {
      id: 'premium-subscribers',
      title: 'Pro & Enterprise',
      value: premiumSubs,
      icon: 'star',
      color: '#D97706',
    },
  ];
}

/** Build the comma-separated feature string from selected feature IDs */
function buildFeaturesString(featureIds: string[]): string {
  return ALL_FEATURES
    .filter(f => featureIds.includes(f.id))
    .map(f => f.name)
    .join(',');
}

/** Map CreatePlanForm → SavePlanRequest body */
function toSaveBody(form: CreatePlanForm, tier = 'basic', durationInDays = 30) {
  return {
    name: form.name.trim(),
    tier,
    monthlyPrice: parseFloat(form.monthlyPrice) || 0,
    yearlyPrice: parseFloat(form.yearlyPrice) || 0,
    currency: 'INR',
    description: form.description,
    features: buildFeaturesString(form.featureIds),
    status: form.status,
    maxStaff: form.employeeLimit ? parseInt(form.employeeLimit) : null,
    durationInDays,
    isPopular: form.isPopular,
    color: form.color,
  };
}

export const AdminPlanService = {
  async listPlans(): Promise<Plan[]> {
    const response = await apiService.get<Envelope<PlanApi[]> | PlanApi[]>(
      API_ENDPOINTS.ADMIN.PLANS
    );
    const rows = unwrapList(response.data);
    return rows.map(mapPlanApiToPlan).filter((p) => p.id > 0);
  },

  async getPlanById(id: number): Promise<Plan | null> {
    try {
      const response = await apiService.get<Envelope<PlanApi> | PlanApi>(
        API_ENDPOINTS.ADMIN.PLAN_BY_ID(id)
      );
      const row = unwrapOne(response.data);
      if (!row) return null;
      const plan = mapPlanApiToPlan(row);
      return plan.id === id ? plan : { ...plan, id };
    } catch (e: unknown) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },

  async createPlan(form: CreatePlanForm, durationInDays = 30): Promise<Plan> {
    const response = await apiService.post<Envelope<PlanApi> | PlanApi>(
      API_ENDPOINTS.ADMIN.PLAN_CREATE,
      toSaveBody(form, 'basic', durationInDays)
    );
    const row = unwrapOne(response.data);
    if (!row) throw new Error('Invalid response from server');
    return mapPlanApiToPlan(row);
  },

  async updatePlan(id: number, form: CreatePlanForm, tier?: string, durationInDays = 30): Promise<Plan> {
    const response = await apiService.put<Envelope<PlanApi> | PlanApi>(
      API_ENDPOINTS.ADMIN.PLAN_UPDATE(id),
      toSaveBody(form, tier ?? 'basic', durationInDays)
    );
    const row = unwrapOne(response.data);
    if (!row) throw new Error('Invalid response from server');
    const plan = mapPlanApiToPlan(row);
    return plan.id === id ? plan : { ...plan, id };
  },

  async deletePlan(id: number): Promise<void> {
    await apiService.delete(API_ENDPOINTS.ADMIN.PLAN_DELETE(id));
  },
};
