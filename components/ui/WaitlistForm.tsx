"use client";

import { useState, type FormEvent } from "react";
import { addToWaitlist } from "@/lib/waitlist";
import { Button } from "./Button";

export type WaitlistFormVariant = "completo" | "compacto";

/** Lista de espera (BRIEF.md, seções 06 e 09), completa e compacta. */
export function WaitlistForm({
  variant = "completo",
  onSubmit,
}: {
  variant?: WaitlistFormVariant;
  onSubmit?: (data: Record<string, string>) => Promise<void> | void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "sucesso" | "erro">("idle");
  const [position, setPosition] = useState<number | null>(null);
  const isCompact = variant === "compacto";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        const nextPosition = addToWaitlist(data);
        setPosition(nextPosition);
      }
      setStatus("sucesso");
    } catch {
      setStatus("erro");
    }
  }

  if (status === "sucesso") {
    return (
      <div>
        <p className="text-[13px] text-marfim/80">
          Recebemos seu pedido. Procuramos na origem e respondemos em até 5 dias úteis com preço
          fechado e data.
        </p>
        {position !== null && position > 1 && (
          <p className="mt-2 font-mono text-[12px] text-marfim/50">
            Sua posição na fila: Nº {position}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {!isCompact && (
        <>
          <input
            name="peca"
            type="text"
            placeholder="Peça desejada (marca e modelo)"
            required
            className="h-11 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="tamanho"
              type="text"
              placeholder="Tamanho"
              className="h-11 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro"
            />
            <input
              name="faixaPreco"
              type="text"
              placeholder="Faixa de preço aceita"
              className="h-11 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro"
            />
          </div>
        </>
      )}

      <div className={`flex gap-3 ${isCompact ? "flex-col sm:flex-row" : "flex-col"}`}>
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="h-11 flex-1 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro"
        />
        <input
          name="whatsapp"
          type="tel"
          placeholder="WhatsApp"
          required
          className="h-11 flex-1 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro"
        />
      </div>

      {!isCompact && (
        <p className="text-[12px] text-marfim/50">
          Procuramos na origem e respondemos em até 5 dias úteis com preço fechado e data.
        </p>
      )}

      {status === "erro" && (
        <p className="text-[12px] text-ouro-claro">
          Não conseguimos enviar. Tente novamente em alguns minutos.
        </p>
      )}

      <Button type="submit" variant="contornado" primary loading={status === "loading"}>
        Entrar na lista
      </Button>
    </form>
  );
}
