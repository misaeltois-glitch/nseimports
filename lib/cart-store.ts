"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PackagingLevelId, Rarity } from "@/types/product";

export interface CartItem {
  /** Id único da linha no carrinho — não o id do produto, pois o mesmo produto pode entrar duas vezes com tamanhos diferentes. */
  id: string;
  productSlug: string;
  brand: string;
  name: string;
  referencia: string;
  rarity: Rarity;
  priceCents: number;
  sizeLabel: string | null;
  packagingId: PackagingLevelId;
  /** Dias úteis restantes no momento em que a peça entrou na sacola (usado para a janela de chegada por item). */
  diasRestantes: number;
}

export type ShippingMode = "junto" | "partes";

interface CartState {
  items: CartItem[];
  shippingMode: ShippingMode;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updatePackaging: (id: string, packagingId: PackagingLevelId) => void;
  setShippingMode: (mode: ShippingMode) => void;
  clear: () => void;
}

/**
 * Sacola em Zustand com persistência em localStorage (BRIEF.md, seção 10) —
 * nunca perder o carrinho ao recarregar.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      shippingMode: "junto",
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: crypto.randomUUID() }],
        })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updatePackaging: (id, packagingId) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, packagingId } : i)),
        })),
      setShippingMode: (mode) => set({ shippingMode: mode }),
      clear: () => set({ items: [], shippingMode: "junto" }),
    }),
    { name: "nse-cart" }
  )
);

/**
 * Se a sacola persistida já foi lida do localStorage. O servidor sempre
 * renderiza a sacola vazia; usar isso evita divergência de hidratação em vez
 * de um estado "mounted" com setState num efeito.
 */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (callback) => useCartStore.persist.onFinishHydration(callback),
    () => useCartStore.persist.hasHydrated(),
    () => false
  );
}
