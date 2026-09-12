import { WaitlistForm } from "@/components/ui/WaitlistForm";

/** Lista de espera / pré-venda (BRIEF.md, seção 05 — /lista). */
export default function ListaPage() {
  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <div className="max-w-md">
          <p className="kicker text-ouro-claro">Lista de espera</p>
          <h1 className="mt-3 text-[32px] tracking-tight text-marfim">
            Ainda não achou a peça?
          </h1>
          <p className="mt-2 text-[14px] text-marfim/60">
            Conte o que procura. Procuramos na origem e respondemos em até 5 dias úteis com preço
            fechado e data.
          </p>

          <div className="mt-10">
            <WaitlistForm variant="completo" />
          </div>
        </div>
      </div>
    </main>
  );
}
