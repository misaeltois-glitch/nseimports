"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";
import {
  addAdminProduct,
  removeAdminProduct,
  updateAdminProduct,
  useAdminProducts,
} from "@/lib/admin-products";
import { formatOrderCode, formatPriceBRL } from "@/lib/format";
import { advanceOrderStage, useAllOrders, type Order } from "@/lib/orders";
import { buildTrackingInfo, isOrderDelivered } from "@/lib/tracking";
import { markWaitlistResponded, useWaitlistEntries, type WaitlistEntry } from "@/lib/waitlist";
import { MOCK_PRODUCTS } from "@/content/mock-products";
import {
  CATEGORY_LABEL,
  RARITY_LABEL,
  type Category,
  type ProductSummary,
  type Rarity,
} from "@/types/product";

const inputClass =
  "h-10 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro";

const DIACRITICS_PATTERN = new RegExp("[̀-ͯ]", "g");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCurrentStageIndex(order: Order): number {
  if (order.currentStageIndex !== undefined) return order.currentStageIndex;
  const info = buildTrackingInfo(order);
  const atualIndex = info.stages.findIndex((stage) => stage.status === "atual");
  if (atualIndex !== -1) return atualIndex;
  return isOrderDelivered(order) ? 4 : 0;
}

/**
 * Admin (BRIEF.md, seção 06): deliberadamente simples e denso — é
 * ferramenta, não vitrine. Três telas: Peças, Pedidos, Lista de espera.
 */
export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-14">
      <ProductsSection />
      <OrdersSection />
      <WaitlistSection />
    </div>
  );
}

function ProductsSection() {
  const adminProducts = useAdminProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    brand: "",
    name: "",
    category: "tenis" as Category,
    rarity: "comum" as Rarity,
    origin: "",
    priceCents: "",
    stockTotal: "",
  });

  const rows: (ProductSummary & { readOnly: boolean })[] = [
    ...MOCK_PRODUCTS.map((product) => ({ ...product, readOnly: true })),
    ...adminProducts.map((product) => ({ ...product, readOnly: false })),
  ];

  const columns: DataTableColumn<ProductSummary & { readOnly: boolean }>[] = [
    {
      key: "nome",
      header: "Peça",
      render: (row) => `${row.brand} · ${row.name}`,
      sortValue: (row) => row.name,
    },
    { key: "categoria", header: "Categoria", render: (row) => CATEGORY_LABEL[row.category] },
    {
      key: "preco",
      header: "Preço",
      render: (row) => formatPriceBRL(row.priceCents),
      sortValue: (row) => row.priceCents,
    },
    { key: "estoque", header: "Estoque", render: (row) => `${row.stockAvailable}/${row.stockTotal}` },
  ];

  function resetForm() {
    setForm({ brand: "", name: "", category: "tenis", rarity: "comum", origin: "", priceCents: "", stockTotal: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(product: ProductSummary) {
    setForm({
      brand: product.brand,
      name: product.name,
      category: product.category,
      rarity: product.rarity,
      origin: product.origin,
      priceCents: String(product.priceCents / 100),
      stockTotal: String(product.stockTotal),
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const stockTotal = Number(form.stockTotal) || 0;
    const priceCents = Math.round(Number(form.priceCents.replace(",", ".")) * 100) || 0;
    const payload: Omit<ProductSummary, "id"> = {
      slug: slugify(`${form.brand}-${form.name}`),
      brand: form.brand,
      name: form.name,
      referencia: `NSE-${Math.floor(1000 + Math.random() * 9000)}`,
      priceCents,
      rarity: form.rarity,
      category: form.category,
      images: { primary: "" },
      origin: form.origin,
      stockAvailable: stockTotal,
      stockTotal,
      diasRestantes: 30,
    };
    if (editingId) updateAdminProduct(editingId, payload);
    else addAdminProduct(payload);
    resetForm();
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="kicker text-ouro-claro">Peças</p>
        <Button variant="contornado" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? "Cancelar" : "Adicionar peça"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-2 gap-3 rounded-card border border-marfim/10 p-4 sm:grid-cols-3"
        >
          <input
            required
            placeholder="Marca"
            value={form.brand}
            onChange={(event) => setForm((f) => ({ ...f, brand: event.target.value }))}
            className={inputClass}
          />
          <input
            required
            placeholder="Nome"
            value={form.name}
            onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
            className={inputClass}
          />
          <input
            required
            placeholder="Origem"
            value={form.origin}
            onChange={(event) => setForm((f) => ({ ...f, origin: event.target.value }))}
            className={inputClass}
          />
          <select
            value={form.category}
            onChange={(event) => setForm((f) => ({ ...f, category: event.target.value as Category }))}
            className={inputClass}
          >
            {Object.entries(CATEGORY_LABEL).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={form.rarity}
            onChange={(event) => setForm((f) => ({ ...f, rarity: event.target.value as Rarity }))}
            className={inputClass}
          >
            {Object.entries(RARITY_LABEL).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
            value={form.priceCents}
            onChange={(event) => setForm((f) => ({ ...f, priceCents: event.target.value }))}
            className={inputClass}
          />
          <input
            required
            type="number"
            placeholder="Estoque"
            value={form.stockTotal}
            onChange={(event) => setForm((f) => ({ ...f, stockTotal: event.target.value }))}
            className={inputClass}
          />
          <p className="col-span-full text-[11px] text-marfim/40">
            Upload de fotos exige backend — não disponível neste protótipo.
          </p>
          <div className="col-span-full">
            <Button type="submit" variant="solido">
              {editingId ? "Salvar alterações" : "Cadastrar peça"}
            </Button>
          </div>
        </form>
      )}

      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Buscar peça"
        renderActions={(row) =>
          row.readOnly ? (
            <span className="kicker text-marfim/30">Catálogo</span>
          ) : (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleEdit(row)}
                className="kicker text-marfim/50 hover:text-marfim/80"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => removeAdminProduct(row.id)}
                className="kicker text-marfim/50 hover:text-marfim/80"
              >
                Remover
              </button>
            </div>
          )
        }
      />
    </section>
  );
}

function OrdersSection() {
  const orders = useAllOrders();
  const { show } = useToast();

  const columns: DataTableColumn<Order>[] = [
    { key: "codigo", header: "Pedido", render: (order) => formatOrderCode(order.id) },
    { key: "pecas", header: "Peças", render: (order) => order.items.length },
    {
      key: "valor",
      header: "Valor",
      render: (order) => formatPriceBRL(order.subtotalCents),
      sortValue: (order) => order.subtotalCents,
    },
    {
      key: "etapa",
      header: "Etapa atual",
      render: (order) => {
        const info = buildTrackingInfo(order);
        const current = info.stages.find((stage) => stage.status === "atual") ?? info.stages.at(-1);
        return current?.label ?? "—";
      },
    },
  ];

  function handleAdvance(order: Order) {
    advanceOrderStage(order.id, getCurrentStageIndex(order));
    show(`Notificação enviada (simulada) para o cliente do pedido ${formatOrderCode(order.id)}.`);
  }

  return (
    <section>
      <p className="kicker mb-4 text-ouro-claro">Pedidos</p>
      <DataTable
        columns={columns}
        rows={orders}
        searchPlaceholder="Buscar pedido"
        renderActions={(order) => (
          <Button
            variant="fantasma"
            className="h-8 px-3 text-[12px]"
            disabled={isOrderDelivered(order)}
            onClick={() => handleAdvance(order)}
          >
            Avançar etapa
          </Button>
        )}
      />
    </section>
  );
}

function WaitlistSection() {
  const entries = useWaitlistEntries();
  const rows = entries.map((entry) => ({ ...entry, id: entry.submittedAt }));

  const columns: DataTableColumn<WaitlistEntry & { id: string }>[] = [
    { key: "peca", header: "Peça", render: (entry) => entry.peca || "—" },
    { key: "tamanho", header: "Tamanho", render: (entry) => entry.tamanho || "—" },
    { key: "contato", header: "Contato", render: (entry) => `${entry.email} · ${entry.whatsapp}` },
    { key: "status", header: "Status", render: (entry) => (entry.responded ? "Respondida" : "Pendente") },
  ];

  return (
    <section>
      <p className="kicker mb-4 text-ouro-claro">Lista de espera</p>
      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Buscar por peça ou e-mail"
        renderActions={(entry) => (
          <Button
            variant="fantasma"
            className="h-8 px-3 text-[12px]"
            disabled={entry.responded}
            onClick={() => markWaitlistResponded(entry.submittedAt)}
          >
            Marcar como respondida
          </Button>
        )}
      />
    </section>
  );
}
