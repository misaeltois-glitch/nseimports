"use client";

import { CheckoutFlow } from "@/components/commerce/CheckoutFlow";

/** Checkout em 3 passos (BRIEF.md, seção 05 — /checkout). */
export default function CheckoutPage() {
  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <p className="kicker text-ouro-claro">Checkout</p>
        <h1 className="mt-3 text-[32px] tracking-tight text-marfim">Fechar pedido</h1>

        <div className="mt-10">
          <CheckoutFlow />
        </div>
      </div>
    </main>
  );
}
