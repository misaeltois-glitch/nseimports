import { OrderConfirmation } from "@/components/commerce/OrderConfirmation";

/** Confirmação de pedido (BRIEF.md, seção 05 — /pedido/[id]). */
export default async function PedidoPage(props: PageProps<"/pedido/[id]">) {
  const { id } = await props.params;

  return (
    <main className="pt-16">
      <div className="nse-container py-16">
        <OrderConfirmation orderId={id} />
      </div>
    </main>
  );
}
