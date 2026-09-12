"use client";

/**
 * Persistência de pedidos em localStorage — placeholder até existir um
 * backend real. Cada pedido guarda uma cópia dos itens no momento da
 * confirmação, já que a sacola é limpa logo em seguida.
 */
import { createLocalStore } from "./local-store";
import type { CartItem, ShippingMode } from "./cart-store";

export interface Order {
  id: string;
  items: CartItem[];
  shippingMode: ShippingMode;
  subtotalCents: number;
  arrivalWindowStart: string;
  arrivalWindowEnd: string;
  createdAt: string;
  /**
   * Etapa (0-4) definida manualmente pelo admin — quando presente, tem
   * prioridade sobre a etapa calculada a partir dos dias úteis decorridos
   * (BRIEF.md, seção 06 — Admin: "botão para avançar etapa").
   */
  currentStageIndex?: number;
}

const ordersStore = createLocalStore<Record<string, Order>>("nse-orders", {});

function generateOrderId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function createOrder(data: Omit<Order, "id" | "createdAt">): Order {
  const orders = ordersStore.get();
  const order: Order = {
    ...data,
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
  };
  ordersStore.set({ ...orders, [order.id]: order });
  return order;
}

export function getOrder(id: string): Order | undefined {
  return ordersStore.get()[id];
}

/** Avança o pedido para a próxima etapa (admin) — no mundo real, dispara a notificação ao cliente. */
export function advanceOrderStage(id: string, currentIndex: number): void {
  const orders = ordersStore.get();
  const order = orders[id];
  if (!order) return;
  const nextIndex = Math.min(4, currentIndex + 1);
  ordersStore.set({ ...orders, [id]: { ...order, currentStageIndex: nextIndex } });
}

/** Todos os pedidos deste navegador, mais recentes primeiro (BRIEF.md, seção 06 — Conta). */
export function useAllOrders(): Order[] {
  const orders = ordersStore.useValue();
  return Object.values(orders).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
