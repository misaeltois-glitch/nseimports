"use client";

/**
 * Peças cadastradas pelo admin (BRIEF.md, seção 06 — Admin). O catálogo
 * mock (`content/mock-products.ts`) é somente leitura aqui — sem CMS real,
 * "criar peça" grava numa lista local separada, exibida junto na tabela.
 */
import { createLocalStore } from "./local-store";
import type { ProductSummary } from "@/types/product";

const adminProductsStore = createLocalStore<ProductSummary[]>("nse-admin-products", []);

export function useAdminProducts(): ProductSummary[] {
  return adminProductsStore.useValue();
}

export function addAdminProduct(product: Omit<ProductSummary, "id">) {
  const next = [...adminProductsStore.get(), { ...product, id: crypto.randomUUID() }];
  adminProductsStore.set(next);
}

export function updateAdminProduct(id: string, product: Omit<ProductSummary, "id">) {
  const next = adminProductsStore.get().map((p) => (p.id === id ? { ...product, id } : p));
  adminProductsStore.set(next);
}

export function removeAdminProduct(id: string) {
  adminProductsStore.set(adminProductsStore.get().filter((p) => p.id !== id));
}
