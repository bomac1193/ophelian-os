/**
 * Shared in-memory storage for character merchandise
 * In production, this would be replaced with database queries
 */

import type { MerchDesign, MerchProduct, MerchOrder } from '@lcos/shared';

// In-memory storage shared across all merch API routes
export const merchDesigns: MerchDesign[] = [];
export const merchProducts: MerchProduct[] = [];
export const merchOrders: MerchOrder[] = [];

export let nextDesignId = 1;
export let nextProductId = 1;
export let nextOrderId = 1;

export function getNextDesignId(): string {
  return `design_${nextDesignId++}`;
}

export function getNextProductId(): string {
  return `product_${nextProductId++}`;
}

export function getNextOrderId(): string {
  return `order_${nextOrderId++}`;
}
