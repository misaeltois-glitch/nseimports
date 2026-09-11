"use client";

import { useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { formatDayMonth, formatOrderCode, formatPriceBRL } from "@/lib/format";
import { getOrder, type Order } from "@/lib/orders";

function noopSubscribe() {
  return () => {};
}

/** Confirmação de pedido (BRIEF.md, seção 06 — Sacola e checkout). */
export function OrderConfirmation({ orderId }: { orderId: string }) {
  // getOrder faz JSON.parse a cada chamada (novo objeto sempre) — sem cache,
  // useSyncExternalStore vê um snapshot "novo" a cada checagem e entra em
  // loop. O ref guarda o resultado por orderId para manter a referência
  // estável entre chamadas.
  const cache = useRef<{ orderId: string; value: Order | null } | null>(null);
  function getSnapshot() {
    if (cache.current?.orderId !== orderId) {
      cache.current = { orderId, value: getOrder(orderId) ?? null };
    }
    return cache.current.value;
  }

  // O pedido só existe em localStorage — no servidor e na primeira pintura
  // do cliente não há como saber ainda, por isso o snapshot do servidor é
  // "undefined" (carregando), nunca o valor real.
  const order = useSyncExternalStore<Order | null | undefined>(
    noopSubscribe,
    getSnapshot,
    () => undefined
  );

  if (order === undefined) return null;

  if (order === null) {
    return (
      <div className="max-w-md">
        <p className="text-[15px] text-marfim">Não encontramos esse pedido neste navegador.</p>
        <p className="mt-2 text-[13px] text-marfim/60">
          Pedidos ficam salvos só no dispositivo onde foram feitos, por enquanto.
        </p>
        <Button href="/arquivo" variant="contornado" className="mt-6">
          Voltar ao arquivo
        </Button>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(`Olá! Quero acompanhar o pedido ${formatOrderCode(order.id)}.`);

  return (
    <div className="max-w-lg">
      <p className="kicker text-ouro-claro">Pedido confirmado</p>
      <p className="mt-3 font-mono text-[36px] text-marfim">{formatOrderCode(order.id)}</p>
      <p className="mt-2 text-[14px] text-marfim/70">
        Chega entre{" "}
        <span className="font-mono">{formatDayMonth(new Date(order.arrivalWindowStart))}</span> e{" "}
        <span className="font-mono">{formatDayMonth(new Date(order.arrivalWindowEnd))}</span>
      </p>
      <p className="mt-1 font-mono text-[13px] text-marfim/50">
        {formatPriceBRL(order.subtotalCents)} · {order.items.length} peça
        {order.items.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          href={`https://wa.me/?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="solido"
        >
          Acompanhar no WhatsApp
        </Button>
        <Button href={`/rastrear?pedido=${order.id}`} variant="contornado">
          Ir para o rastreio
        </Button>
      </div>
    </div>
  );
}
