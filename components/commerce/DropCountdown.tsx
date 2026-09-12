"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Aberto";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}min`;
}

/** Contagem regressiva até a abertura do lote (BRIEF.md, seção 06 — Drops). */
export function DropCountdown({ opensAt }: { opensAt: string }) {
  const target = new Date(opensAt).getTime();
  // Date.now() é seguro no servidor e no cliente (ao contrário de localStorage),
  // então não precisa do padrão "undefined até montar" — só atualiza a cada
  // minuto por uma assinatura no efeito, sem setState direto no corpo dele.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-mono text-[12px] text-ouro-claro">{formatRemaining(target - now)}</span>;
}
