"use client";

/** Peças salvas (BRIEF.md, seção 06 — Conta: "Desejos e avisos"). */
import { createLocalStore } from "./local-store";

const wishlistStore = createLocalStore<string[]>("nse-wishlist", []);

export function useWishlist(): string[] {
  return wishlistStore.useValue();
}

export function isWishlisted(slug: string): boolean {
  return wishlistStore.get().includes(slug);
}

export function toggleWishlist(slug: string) {
  const current = wishlistStore.get();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  wishlistStore.set(next);
}
