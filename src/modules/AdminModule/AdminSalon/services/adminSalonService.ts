/**
 * Admin salon list/detail backed by owner registration + shop records.
 *
 * Expected backend (adjust paths in src/config/api.ts if yours differ):
 *   GET  /admin/shops           → { success, message, data: RegisteredShopApi[] }
 *   GET  /admin/shops/:id       → { success, message, data: RegisteredShopApi }
 *
 * Each item should reflect data saved when an owner completes Register (name, email,
 * phone, shopName, shopAddress) plus ids and optional subscription fields.
 */
import { apiService, ApiError } from '@/src/services/apiService';
import { API_ENDPOINTS } from '@/src/config/api';
import type {
  Salon,
  SalonStatus,
  SubscriptionPlan,
  StatCard,
} from '../types/salon.types';

/** Loose DTO so minor backend naming differences still map */
export interface RegisteredShopApi {
  id?: number;
  shopId?: number;
  name?: string;
  shopName?: string;
  shopAddress?: string;
  address?: string;
  ownerName?: string;
  ownerEmail?: string;
  email?: string;
  ownerPhone?: string;
  phoneNumber?: string;
  phone?: string;
  createdAt?: string;
  joinedDate?: string;
  updatedAt?: string;
  subscriptionPlan?: string;
  plan?: string;
  subscriptionStatus?: string;
  shopStatus?: string;
  status?: string;
  owner?: {
    name?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
  };
  monthlyFee?: string;
  subscriptionExpiry?: string;
  expiryDate?: string;
  /** Matches owner Employees screen: rows for this shop (`GET /employees/shop/:id`), incl. inactive */
  metrics?: {
    staffCount?: number;
    monthlyRevenue?: string;
    totalAppointments?: number;
    activeClients?: number;
  };
}

interface Envelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

function unwrapList(body: unknown): RegisteredShopApi[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object' && 'data' in body) {
    const d = (body as Envelope<unknown>).data;
    if (Array.isArray(d)) return d;
  }
  return [];
}

function unwrapOne(body: unknown): RegisteredShopApi | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  if ('data' in o && o.data && typeof o.data === 'object' && !Array.isArray(o.data)) {
    return o.data as RegisteredShopApi;
  }
  if ('shopId' in o || 'id' in o || 'shopName' in o) return body as RegisteredShopApi;
  return null;
}

function coalesceId(row: RegisteredShopApi): number {
  if (typeof row.id === 'number' && !Number.isNaN(row.id)) return row.id;
  const n = row.shopId;
  if (typeof n === 'number' && !Number.isNaN(n)) return n;
  return 0;
}

function pickShopName(row: RegisteredShopApi): string {
  return (row.shopName || row.name || 'Salon').trim();
}

function pickOwnerName(row: RegisteredShopApi): string {
  return (row.owner?.name || row.ownerName || 'Owner').trim();
}

function pickOwnerEmail(row: RegisteredShopApi): string {
  return (row.owner?.email || row.ownerEmail || row.email || '').trim();
}

function pickOwnerPhone(row: RegisteredShopApi): string {
  const p =
    row.owner?.phone ||
    row.owner?.phoneNumber ||
    row.ownerPhone ||
    row.phoneNumber ||
    row.phone ||
    '';
  return String(p).trim() || '—';
}

function pickAddress(row: RegisteredShopApi): string {
  return (row.shopAddress || row.address || '').trim() || '—';
}

function parseCityState(full: string): { city: string; state: string } {
  if (!full || full === '—') return { city: '—', state: '—' };
  const parts = full.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { state: parts[parts.length - 1]!, city: parts[parts.length - 2]! };
  }
  return { city: full, state: '—' };
}

function normalizePlan(raw?: string): SubscriptionPlan {
  const p = (raw || 'basic').toLowerCase();
  if (p === 'professional' || p === 'enterprise' || p === 'basic') return p;
  return 'basic';
}

function normalizeStatus(shopStatus?: string, subStatus?: string): SalonStatus {
  const s = (subStatus || shopStatus || 'active').toLowerCase();
  if (s === 'pending') return 'trial';
  if (
    s === 'active' ||
    s === 'trial' ||
    s === 'expired' ||
    s === 'inactive' ||
    s === 'suspended'
  ) {
    return s as SalonStatus;
  }
  return 'active';
}

function formatJoinedDate(iso?: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export function mapRegisteredShopToSalon(row: RegisteredShopApi): Salon {
  const id = coalesceId(row);
  const address = pickAddress(row);
  const { city, state } = parseCityState(address);
  const ownerEmail = pickOwnerEmail(row);
  const ownerPhone = pickOwnerPhone(row);

  const plan = normalizePlan(row.subscriptionPlan || row.plan);
  const status = normalizeStatus(row.shopStatus || row.status, row.subscriptionStatus);

  return {
    id,
    name: pickShopName(row),
    owner: {
      name: pickOwnerName(row),
      email: ownerEmail || '—',
      phone: ownerPhone,
    },
    subscription: {
      plan,
      status,
      expiryDate: row.expiryDate || row.subscriptionExpiry || '—',
      monthlyFee: row.monthlyFee || '—',
    },
    business: {
      email: ownerEmail || '—',
      phone: ownerPhone,
      address,
      city,
      state,
    },
    metrics: {
      staffCount: row.metrics?.staffCount ?? 0,
      monthlyRevenue: row.metrics?.monthlyRevenue ?? '—',
      totalAppointments: row.metrics?.totalAppointments ?? 0,
      activeClients: row.metrics?.activeClients ?? 0,
    },
    dates: {
      joinedDate: formatJoinedDate(row.createdAt || row.joinedDate),
      lastActive: formatJoinedDate(row.updatedAt || row.createdAt || row.joinedDate),
    },
    isVerified: status === 'active',
  };
}

export function buildStatCardsFromSalons(salons: Salon[]): StatCard[] {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const newThisMonth = salons.filter((s) => s.dates.joinedDate.startsWith(ym)).length;

  return [
    {
      id: 'total-salons',
      title: 'Total Salons',
      value: salons.length,
      icon: 'storefront',
      color: '#780115',
    },
    {
      id: 'active-salons',
      title: 'Active Salons',
      value: salons.filter((s) => s.subscription.status === 'active').length,
      icon: 'checkmark-circle',
      color: '#059669',
    },
    {
      id: 'trial-salons',
      title: 'Trial Salons',
      value: salons.filter((s) => s.subscription.status === 'trial').length,
      icon: 'time',
      color: '#3B82F6',
    },
    {
      id: 'expired-salons',
      title: 'Expired Salons',
      value: salons.filter((s) => s.subscription.status === 'expired').length,
      icon: 'warning',
      color: '#DC2626',
    },
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: '—',
      icon: 'cash',
      color: '#7C3AED',
    },
    {
      id: 'new-salons',
      title: 'New This Month',
      value: newThisMonth,
      icon: 'trending-up',
      color: '#F59E0B',
    },
  ];
}

export const AdminSalonService = {
  async listRegisteredShops(): Promise<Salon[]> {
    const response = await apiService.get<Envelope<RegisteredShopApi[]> | RegisteredShopApi[]>(
      API_ENDPOINTS.ADMIN.SHOPS
    );
    const rows = unwrapList(response.data);
    return rows.map(mapRegisteredShopToSalon).filter((s) => s.id > 0);
  },

  async getRegisteredShopById(id: number): Promise<Salon | null> {
    try {
      const response = await apiService.get<Envelope<RegisteredShopApi> | RegisteredShopApi>(
        API_ENDPOINTS.ADMIN.SHOP_BY_ID(id)
      );
      const row = unwrapOne(response.data);
      if (!row) return null;
      const salon = mapRegisteredShopToSalon(row);
      return salon.id === id ? salon : { ...salon, id };
    } catch (e: unknown) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },
};
