"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackagingPicker } from "@/components/ui/PackagingPicker";
import { getArrivalWindow } from "@/lib/business-days";
import { type CartItem, useCartStore } from "@/lib/cart-store";
import { SPLIT_SHIPPING_FEE_CENTS, computeCartTotals, packagingPriceCents } from "@/lib/cart-totals";
import { formatArrivalUntilLabel, formatPriceBRL } from "@/lib/format";
import { PACKAGING_LEVELS } from "@/content/mock-packaging";

function arrivalWindowFor(item: CartItem) {
  return getArrivalWindow(new Date(), {
    minBusinessDays: item.diasRestantes,
    maxBusinessDays: item.diasRestantes + 7,
  });
}

/** Revisão da sacola (BRIEF.md, seção 06 — Sacola e checkout). */
export function CartReview() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updatePackaging = useCartStore((state) => state.updatePackaging);
  const shippingMode = useCartStore((state) => state.shippingMode);
  const setShippingMode = useCartStore((state) => state.setShippingMode);

  const [openPackagingId, setOpenPackagingId] = useState<string | null>(null);

  const totals = useMemo(() => computeCartTotals(items, shippingMode), [items, shippingMode]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Sua sacola está vazia."
        description="Volte ao arquivo e encontre a próxima peça."
        action={
          <Button href="/arquivo" variant="contornado">
            Ver arquivo
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
      <div className="flex-1 flex flex-col gap-4">
        {items.map((item) => {
          const itemArrivalWindow = arrivalWindowFor(item);
          const level = PACKAGING_LEVELS.find((l) => l.id === item.packagingId);
          const packagingOpen = openPackagingId === item.id;

          return (
            <div key={item.id} className="rounded-card border border-marfim/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] text-marfim">
                    {item.brand} · {item.name}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-marfim/50">
                    {item.referencia}
                    {item.sizeLabel ? ` · Tamanho ${item.sizeLabel}` : ""}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-marfim/50">
                    {formatArrivalUntilLabel(itemArrivalWindow)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[14px] text-marfim">
                    {formatPriceBRL(item.priceCents + packagingPriceCents(item.packagingId))}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mt-2 font-mono text-[11px] text-marfim/40 hover:text-marfim/70"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <div className="mt-4 border-t border-marfim/10 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenPackagingId(packagingOpen ? null : item.id)}
                  className="kicker flex items-center gap-2 text-marfim/50 hover:text-marfim/70"
                >
                  Embalagem: {level?.name ?? "Padrão"}
                  <span aria-hidden>{packagingOpen ? "−" : "+"}</span>
                </button>

                {packagingOpen && (
                  <div className="mt-4">
                    <PackagingPicker
                      levels={PACKAGING_LEVELS}
                      value={item.packagingId}
                      onChange={(id) => updatePackaging(item.id, id)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-20 lg:w-80 lg:shrink-0">
        {totals.mixedDeadlines && (
          <div className="rounded-card border border-marfim/10 p-5">
            <p className="kicker mb-3 text-marfim/50">Suas peças chegam em datas diferentes</p>
            <div className="flex flex-col gap-3 text-[13px]">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="shipping-mode"
                  checked={shippingMode === "junto"}
                  onChange={() => setShippingMode("junto")}
                  className="mt-1 h-4 w-4 accent-ouro"
                />
                <span>
                  Enviar junto quando tudo chegar
                  <span className="block text-[12px] text-marfim/50">Sem custo extra.</span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="shipping-mode"
                  checked={shippingMode === "partes"}
                  onChange={() => setShippingMode("partes")}
                  className="mt-1 h-4 w-4 accent-ouro"
                />
                <span>
                  Enviar em partes, assim que cada uma chegar
                  <span className="block font-mono text-[12px] text-marfim/50">
                    + {formatPriceBRL(SPLIT_SHIPPING_FEE_CENTS)}
                  </span>
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="rounded-card border border-ouro/40 p-5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-marfim/70">Subtotal</span>
            <span className="font-mono text-marfim">{formatPriceBRL(totals.itemsSubtotal)}</span>
          </div>
          {totals.shippingFee > 0 && (
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-marfim/70">Envio em partes</span>
              <span className="font-mono text-marfim">{formatPriceBRL(totals.shippingFee)}</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-marfim/10 pt-3 text-[15px]">
            <span className="text-marfim">Total</span>
            <span className="font-mono text-marfim">{formatPriceBRL(totals.total)}</span>
          </div>

          <Button href="/checkout" variant="solido" className="mt-5 w-full">
            Ir para o checkout
          </Button>
        </div>
      </aside>
    </div>
  );
}
