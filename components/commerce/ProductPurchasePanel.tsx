"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import { ArrivalEstimate } from "@/components/ui/ArrivalEstimate";
import { Button } from "@/components/ui/Button";
import { PackagingPicker } from "@/components/ui/PackagingPicker";
import { useToast } from "@/components/ui/Toast";
import type { ArrivalWindow } from "@/lib/business-days";
import { formatInstallments, formatPriceBRL } from "@/lib/format";
import { PACKAGING_LEVELS } from "@/content/mock-packaging";
import type { PackagingLevelId, ProductDetail } from "@/types/product";

/**
 * Painel de decisão do dossiê de produto (BRIEF.md, seção 06 — Produto):
 * prazo antes do preço, tamanho, embalagem escolhida aqui (não só no
 * checkout), e a barra inferior fixa no mobile — a data nunca sai da tela.
 */
export function ProductPurchasePanel({
  product,
  arrivalWindow,
}: {
  product: ProductDetail;
  arrivalWindow: ArrivalWindow;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [packaging, setPackaging] = useState<PackagingLevelId>("padrao");
  const { show } = useToast();

  function handleReserve() {
    if (!size) {
      show("Escolha um tamanho antes de reservar.", "erro");
      return;
    }
    show("Peça reservada por 30 minutos.");
  }

  return (
    <div className="flex flex-col gap-8 pb-24 sm:pb-0">
      <div>
        <ArrivalEstimate window={arrivalWindow} variant="destaque" />
        <Link
          href="/processo"
          className="kicker mt-3 inline-block text-marfim/40 hover:text-marfim/70"
        >
          Como funciona o prazo →
        </Link>
      </div>

      <div>
        <p className="font-mono text-[26px] text-marfim">{formatPriceBRL(product.priceCents)}</p>
        <p className="mt-1 text-[12.5px] text-marfim/50">
          {formatInstallments(product.priceCents)} · impostos e frete internacional inclusos
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="kicker text-marfim/50">Tamanho</span>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button type="button" className="kicker text-marfim/40 hover:text-marfim/70">
                Tabela de medidas
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-onix/80" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-card border border-marfim/10 bg-grafite p-6">
                <Dialog.Title className="text-[15px] text-marfim">Tabela de medidas</Dialog.Title>
                <table className="mt-4 w-full text-left text-[13px]">
                  <thead>
                    <tr className="text-marfim/50">
                      <th className="pb-2 font-normal">Tamanho</th>
                      <th className="pb-2 font-normal">Disponibilidade</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-marfim/80">
                    {product.sizes.map((option) => (
                      <tr key={option.label} className="border-t border-marfim/10">
                        <td className="py-2">{option.label}</td>
                        <td className="py-2">{option.available ? "Em estoque" : "Esgotado"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="mt-4 font-mono text-[12px] text-marfim/60 hover:text-marfim"
                  >
                    Fechar
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              key={option.label}
              type="button"
              disabled={!option.available}
              aria-pressed={size === option.label}
              onClick={() => setSize(option.label)}
              className={`h-11 w-11 rounded-control border font-mono text-[13px] transition-colors duration-[400ms] ease-[var(--ease-nse)] ${
                !option.available
                  ? "cursor-not-allowed border-marfim/10 text-marfim/25 line-through"
                  : size === option.label
                    ? "border-ouro text-marfim"
                    : "border-marfim/25 text-marfim/80 hover:border-marfim/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="kicker mb-3 block text-marfim/50">Embalagem</span>
        <PackagingPicker levels={PACKAGING_LEVELS} value={packaging} onChange={setPackaging} />
      </div>

      <Button variant="solido" className="hidden w-full sm:inline-flex sm:w-auto" onClick={handleReserve}>
        Reservar peça
      </Button>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-marfim/10 bg-onix/95 px-4 py-3 backdrop-blur sm:hidden">
        <div>
          <p className="font-mono text-[13px] text-marfim">{formatPriceBRL(product.priceCents)}</p>
          <ArrivalEstimate window={arrivalWindow} variant="compacta" />
        </div>
        <Button variant="solido" onClick={handleReserve}>
          Reservar
        </Button>
      </div>
    </div>
  );
}
