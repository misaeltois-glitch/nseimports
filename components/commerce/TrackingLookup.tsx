"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Timeline } from "@/components/ui/Timeline";
import { formatOrderCode } from "@/lib/format";
import { getOrder, type Order } from "@/lib/orders";
import { buildTrackingInfo } from "@/lib/tracking";

function noopSubscribe() {
  return () => {};
}

/**
 * Rastreio público (BRIEF.md, seção 06 — Rastreio): por código do pedido,
 * sem login. Esta tela será aberta dez vezes durante a espera — precisa
 * ser bonita o bastante para o cliente mandar print no grupo.
 */
export function TrackingLookup({ initialCode }: { initialCode?: string }) {
  const [submittedCode, setSubmittedCode] = useState<string | null>(
    initialCode ? initialCode.toUpperCase() : null
  );
  const [inputValue, setInputValue] = useState(initialCode ?? "");

  // getOrder faz JSON.parse a cada chamada (novo objeto sempre) — sem
  // cache, useSyncExternalStore vê um snapshot "novo" a cada checagem e
  // entra em loop. O ref guarda o resultado por código para manter a
  // referência estável entre chamadas.
  const cache = useRef<{ code: string | null; value: Order | null } | null>(null);
  function getSnapshot() {
    if (cache.current?.code !== submittedCode) {
      cache.current = {
        code: submittedCode,
        value: submittedCode ? (getOrder(submittedCode) ?? null) : null,
      };
    }
    return cache.current.value;
  }

  const order = useSyncExternalStore<Order | null | undefined>(
    noopSubscribe,
    getSnapshot,
    () => (submittedCode ? undefined : null)
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedCode(inputValue.trim().toUpperCase());
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="kicker text-marfim/50">Código do pedido</span>
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Ex.: BFPEZU"
            className="h-11 rounded-control border border-marfim/20 bg-transparent px-3 font-mono text-[13px] uppercase text-marfim placeholder:text-marfim/40 focus:border-ouro"
          />
        </label>
        <Button type="submit" variant="solido">
          Rastrear
        </Button>
      </form>

      {submittedCode && order === null && (
        <p className="mt-6 text-[13px] text-marfim/60">
          Não encontramos o pedido {formatOrderCode(submittedCode)} neste navegador. Confira o
          código e tente novamente.
        </p>
      )}

      {order && <TrackingResult order={order} />}
    </div>
  );
}

function TrackingResult({ order }: { order: Order }) {
  const info = useMemo(() => buildTrackingInfo(order), [order]);

  return (
    <div className="mt-10 flex flex-col gap-8">
      <div>
        <p className="kicker text-ouro-claro">Pedido {formatOrderCode(order.id)}</p>
        <div className="mt-4 flex items-center justify-between text-[12px] text-marfim/50">
          <span className="font-mono">{info.elapsedBusinessDays} dias úteis decorridos</span>
          <span className="font-mono">{info.remainingBusinessDays} dias úteis restantes</span>
        </div>
        <div className="mt-2 h-[2px] w-full bg-marfim/10">
          <div
            className="h-full bg-ouro transition-[width] duration-[600ms] ease-[var(--ease-nse)]"
            style={{ width: `${info.progressPercent}%` }}
          />
        </div>
      </div>

      <Timeline stages={info.stages} orientation="vertical" />

      <div className="border-t border-marfim/10 pt-6">
        <p className="kicker mb-3 text-marfim/50">Registro</p>
        <ul className="flex flex-col gap-2">
          {info.log.map((entry) => (
            <li key={entry.text} className="font-mono text-[12px] text-marfim/60">
              {entry.dateLabel} · {entry.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
