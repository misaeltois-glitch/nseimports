"use client";

/** Endereços salvos (BRIEF.md, seção 06 — Conta). */
import { createLocalStore } from "./local-store";

export interface Address {
  id: string;
  label: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}

const addressesStore = createLocalStore<Address[]>("nse-addresses", []);

export function useAddresses(): Address[] {
  return addressesStore.useValue();
}

export function addAddress(address: Omit<Address, "id">) {
  addressesStore.set([...addressesStore.get(), { ...address, id: crypto.randomUUID() }]);
}

export function removeAddress(id: string) {
  addressesStore.set(addressesStore.get().filter((a) => a.id !== id));
}
