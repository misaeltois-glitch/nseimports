/**
 * Persistência de pedidos em localStorage — placeholder até existir um
 * backend real. Cada pedido guarda uma cópia dos itens no momento da
 * confirmação, já que a sacola é limpa logo em seguida.
 */
import type { CartItem, ShippingMode } from "./cart-store";

export interface Order {
  id: string;
  items: CartItem[];
  shippingMode: ShippingMode;
  subtotalCents: number;
  arrivalWindowStart: string;
  arrivalWindowEnd: string;
  createdAt: string;
}

const STORAGE_KEY = "nse-orders";

function readOrders(): Record<string, Order> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Order>) : {};
  } catch {
    return {};
  }
}

function writeOrders(orders: Record<string, Order>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function createOrder(data: Omit<Order, "id" | "createdAt">): Order {
  const orders = readOrders();
  const order: Order = {
    ...data,
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
  };
  orders[order.id] = order;
  writeOrders(orders);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return readOrders()[id];
}
