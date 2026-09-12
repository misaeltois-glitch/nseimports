import { AdminGate } from "@/components/commerce/AdminGate";

/** Admin (BRIEF.md, seção 05 — /admin): deliberadamente simples e denso. */
export default function AdminPage() {
  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <p className="kicker text-ouro-claro">Admin</p>
        <h1 className="mt-3 text-[28px] tracking-tight text-marfim">Painel</h1>

        <div className="mt-10">
          <AdminGate />
        </div>
      </div>
    </main>
  );
}
