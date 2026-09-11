import { PACKAGING_LEVELS } from "@/content/mock-packaging";
import type { CartItem, ShippingMode } from "./cart-store";

export const SPLIT_SHIPPING_FEE_CENTS = 4500;

export function packagingPriceCents(packagingId: CartItem["packagingId"]): number {
  const level = PACKAGING_LEVELS.find((l) => l.id === packagingId);
  return typeof level?.priceCents === "number" ? level.priceCents : 0;
}

export function hasMixedDeadlines(items: CartItem[]): boolean {
  return new Set(items.map((item) => item.diasRestantes)).size > 1;
}

export interface CartTotals {
  itemsSubtotal: number;
  shippingFee: number;
  total: number;
  mixedDeadlines: boolean;
}

/** Mesma conta usada na Sacola e no Checkout — nunca duplicar. */
export function computeCartTotals(items: CartItem[], shippingMode: ShippingMode): CartTotals {
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.priceCents + packagingPriceCents(item.packagingId),
    0
  );
  const mixedDeadlines = hasMixedDeadlines(items);
  const shippingFee = mixedDeadlines && shippingMode === "partes" ? SPLIT_SHIPPING_FEE_CENTS : 0;

  return { itemsSubtotal, shippingFee, total: itemsSubtotal + shippingFee, mixedDeadlines };
}

/** Maior prazo restante entre os itens — usado para a data estimada do pedido como um todo. */
export function maxDiasRestantes(items: CartItem[]): number {
  return Math.max(...items.map((item) => item.diasRestantes));
}
