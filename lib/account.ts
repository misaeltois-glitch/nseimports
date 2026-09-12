"use client";

/**
 * Sessão local por e-mail — placeholder honesto até existir backend/
 * autenticação real. "Entrada por e-mail com link mágico ou senha" (BRIEF.md,
 * seção 06 — Conta): como não há servidor de e-mail aqui, o "link mágico" é
 * simulado e a confirmação é imediata, deixando isso explícito na tela.
 */
import { createLocalStore } from "./local-store";

export interface Account {
  email: string;
}

const accountStore = createLocalStore<Account | null>("nse-account", null);

export function useAccount(): Account | null {
  return accountStore.useValue();
}

export function signIn(email: string) {
  accountStore.set({ email });
}

export function signOut() {
  accountStore.clear();
}
