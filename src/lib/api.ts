interface ImportMeta Env {...}, interface ImportMeta { env: ImportMetaEnv },
/// <reference types="vite/client" />
import type { Order, Product } from '../types';

const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || payload.message || `Request failed (${response.status})`);
  return payload as T;
}

export const api = {
  catalog: () => request<Product[]>('/api/catalog'),
  product: (id: string) => request<{ product: Product; related: Product[] }>(`/api/catalog/${encodeURIComponent(id)}`),
  createOrder: (body: Record<string, unknown>) => request<{ order_ref: string; otp_sent?: boolean; demo_otp?: string }>('/api/order', { method: 'POST', body: JSON.stringify(body) }),
  verify: (order_ref: string, otp: string) => request<{ ok: boolean; order: Order }>('/api/order/verify', { method: 'POST', body: JSON.stringify({ order_ref, otp }) }),
  resendOtp: (order_ref: string) => request<{ ok: boolean; demo_otp?: string }>('/api/order/resend-otp', { method: 'POST', body: JSON.stringify({ order_ref }) }),
  track: (reference: string) => request<Order>(`/api/track/${encodeURIComponent(reference)}`),
  pay: (order_ref: string) => request<Order>('/api/order/payment', { method: 'POST', body: JSON.stringify({ order_ref }) }),
};
