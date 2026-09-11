import { TrackingLookup } from "@/components/commerce/TrackingLookup";

/** Rastreio público (BRIEF.md, seção 05 — /rastrear): por código, sem login. */
export default async function RastrearPage(props: PageProps<"/rastrear">) {
  const searchParams = await props.searchParams;
  const pedido = typeof searchParams.pedido === "string" ? searchParams.pedido : undefined;

  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <p className="kicker text-ouro-claro">Rastreio</p>
        <h1 className="mt-3 text-[32px] tracking-tight text-marfim">Acompanhe seu pedido</h1>
        <p className="mt-2 max-w-lg text-[14px] text-marfim/60">
          Consulte pelo código do pedido, sem precisar entrar na conta.
        </p>

        <div className="mt-10">
          <TrackingLookup initialCode={pedido} />
        </div>
      </div>
    </main>
  );
}
