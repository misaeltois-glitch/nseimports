"use client";

import { CartReview } from "@/components/commerce/CartReview";

/** A Sacola (BRIEF.md, seção 05 — /sacola): revisar itens e embalagem por item. */
export default function SacolaPage() {
  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <p className="kicker text-ouro-claro">Sacola</p>
        <h1 className="mt-3 text-[32px] tracking-tight text-marfim">Sua sacola</h1>

        <div className="mt-10">
          <CartReview />
        </div>
      </div>
    </main>
  );
}
