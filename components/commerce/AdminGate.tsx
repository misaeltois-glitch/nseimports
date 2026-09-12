"use client";

import { Button } from "@/components/ui/Button";
import { useAccount } from "@/lib/account";
import { AdminDashboard } from "./AdminDashboard";

/**
 * Área protegida do Admin (BRIEF.md, seção 06). Sem autenticação real
 * neste protótipo: qualquer sessão local da Conta (Fase 7) libera o
 * acesso — não há distinção de papel (admin vs. cliente) ainda.
 */
export function AdminGate() {
  const account = useAccount();

  if (!account) {
    return (
      <div className="max-w-sm">
        <p className="text-[14px] text-marfim">Área protegida.</p>
        <p className="mt-2 text-[13px] text-marfim/60">
          Entre com sua conta para continuar. Este protótipo não tem autenticação real — qualquer
          sessão local libera o acesso, sem distinção de papel.
        </p>
        <Button href="/conta" variant="solido" className="mt-4">
          Entrar
        </Button>
      </div>
    );
  }

  return <AdminDashboard />;
}
