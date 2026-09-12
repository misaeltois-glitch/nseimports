"use client";

/** Lista de espera / pré-venda (BRIEF.md, seção 06). */
import { createLocalStore } from "./local-store";

export interface WaitlistEntry {
  peca?: string;
  tamanho?: string;
  faixaPreco?: string;
  email: string;
  whatsapp: string;
  submittedAt: string;
}

const waitlistStore = createLocalStore<WaitlistEntry[]>("nse-waitlist", []);

/** Adiciona à lista (a partir dos dados brutos do formulário) e retorna a posição (1-indexada). */
export function addToWaitlist(data: Record<string, string>): number {
  const entry: WaitlistEntry = {
    peca: data.peca,
    tamanho: data.tamanho,
    faixaPreco: data.faixaPreco,
    email: data.email ?? "",
    whatsapp: data.whatsapp ?? "",
    submittedAt: new Date().toISOString(),
  };
  const next = [...waitlistStore.get(), entry];
  waitlistStore.set(next);
  return next.length;
}
