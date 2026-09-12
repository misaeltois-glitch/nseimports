import { AccountGate } from "@/components/commerce/AccountGate";

/** Conta (BRIEF.md, seção 05 — /conta). */
export default function ContaPage() {
  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <p className="kicker text-ouro-claro">Conta</p>
        <h1 className="mt-3 text-[32px] tracking-tight text-marfim">Sua conta</h1>
        <p className="mt-2 max-w-lg text-[14px] text-marfim/60">
          Pedidos, arquivo pessoal, desejos e endereços em um só lugar.
        </p>

        <div className="mt-10">
          <AccountGate />
        </div>
      </div>
    </main>
  );
}
