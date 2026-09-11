import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/commerce/CatalogBrowser";

export const metadata: Metadata = {
  title: "Arquivo — NSEImports",
  description: "Navegue pelo arquivo curado por categoria, raridade e preço.",
};

/** O Arquivo (BRIEF.md, seção 05 — /arquivo): navegar sem sensação de marketplace. */
export default function ArquivoPage() {
  return (
    <main className="pt-16">
      <div className="nse-container pb-2 pt-10">
        <p className="kicker text-ouro-claro">Arquivo</p>
        <h1 className="mt-3 text-[32px] tracking-tight text-marfim">O arquivo curado</h1>
        <p className="mt-2 max-w-lg text-[14px] text-marfim/60">
          Cada peça tem dossiê, não descrição. Filtre por categoria, origem, raridade e preço.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="nse-container py-20 text-[13px] text-marfim/40">Carregando arquivo…</div>
        }
      >
        <CatalogBrowser />
      </Suspense>
    </main>
  );
}
