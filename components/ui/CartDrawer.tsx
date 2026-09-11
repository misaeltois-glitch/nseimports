"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { formatPriceBRL } from "@/lib/format";
import { Button } from "./Button";

export interface CartLine {
  id: string;
  name: string;
  sizeLabel: string;
  packagingLabel: string;
  priceCents: number;
  arrivalLabel: string;
}

/** Sacola em painel lateral (BRIEF.md, seções 06 e 09). */
export function CartDrawer({
  open,
  onOpenChange,
  lines,
  subtotalCents,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  subtotalCents: number;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-onix/80" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-marfim/10 bg-onix p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-[15px] text-marfim">Sacola</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="font-mono text-[12px] text-marfim/60 hover:text-marfim"
              >
                Fechar
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto">
            {lines.length === 0 ? (
              <p className="text-[13px] text-marfim/50">Sua sacola está vazia.</p>
            ) : (
              <ul className="flex flex-col gap-5">
                {lines.map((line) => (
                  <li key={line.id} className="flex flex-col gap-1 border-b border-marfim/10 pb-4">
                    <p className="text-[13px] text-marfim">{line.name}</p>
                    <p className="text-[12px] text-marfim/50">
                      {line.sizeLabel} · {line.packagingLabel}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-marfim/50">
                        {line.arrivalLabel}
                      </span>
                      <span className="font-mono text-[13px] text-marfim">
                        {formatPriceBRL(line.priceCents)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 border-t border-ouro/40 pt-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-marfim/70">Subtotal</span>
              <span className="font-mono text-marfim">{formatPriceBRL(subtotalCents)}</span>
            </div>
            <Button variant="solido" className="mt-4 w-full" disabled={lines.length === 0}>
              Fechar pedido
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
