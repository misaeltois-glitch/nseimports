"use client";

import { useState, type ReactNode } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { ArrivalEstimate } from "@/components/ui/ArrivalEstimate";
import { Button } from "@/components/ui/Button";
import { CartDrawer, type CartLine } from "@/components/ui/CartDrawer";
import { CheckoutStepper } from "@/components/ui/CheckoutStepper";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterPanel, type FilterGroup, type FilterOptionRef } from "@/components/ui/FilterPanel";
import { Gallery } from "@/components/ui/Gallery";
import { PackagingPicker } from "@/components/ui/PackagingPicker";
import { ProductCard } from "@/components/ui/ProductCard";
import { RarityTag } from "@/components/ui/RarityTag";
import { Skeleton } from "@/components/ui/Skeleton";
import { SpecSheet } from "@/components/ui/SpecSheet";
import { StatBand } from "@/components/ui/StatBand";
import { Timeline } from "@/components/ui/Timeline";
import { useToast } from "@/components/ui/Toast";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { MOCK_ORDER_STAGES } from "@/content/mock-order-stages";
import { PACKAGING_LEVELS } from "@/content/mock-packaging";
import { MOCK_PRODUCTS } from "@/content/mock-products";
import type { PackagingLevelId, Rarity } from "@/types/product";

const PRODUCTS = MOCK_PRODUCTS.slice(0, 3);
const ORDER_STAGES = MOCK_ORDER_STAGES;

const RARITIES: Rarity[] = ["comum", "limitado", "raro", "peca-unica"];

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "categoria",
    label: "Categoria",
    options: [
      { id: "tenis", label: "Tênis" },
      { id: "moletom", label: "Moletom" },
      { id: "bone", label: "Boné" },
    ],
  },
  {
    id: "raridade",
    label: "Raridade",
    options: [
      { id: "limitado", label: "Limitado" },
      { id: "raro", label: "Raro" },
      { id: "peca-unica", label: "Peça única" },
    ],
  },
];

const CART_LINES: CartLine[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High OG",
    sizeLabel: "42 BR",
    packagingLabel: "Avançada",
    priceCents: 189000 + 8000,
    arrivalLabel: "Chega até 26 nov",
  },
];

interface AdminRow {
  id: string;
  nome: string;
  referencia: string;
  precoCents: number;
  status: string;
}

const ADMIN_ROWS: AdminRow[] = [
  { id: "1", nome: "Air Jordan 1 Retro High OG", referencia: "NSE-0142", precoCents: 189000, status: "Em trânsito" },
  { id: "2", nome: "Box Logo Hoodie", referencia: "NSE-0098", precoCents: 420000, status: "Conferência" },
  { id: "3", nome: "Shark Full Zip Hoodie", referencia: "NSE-0075", precoCents: 265000, status: "Entregue" },
];

const ADMIN_COLUMNS: DataTableColumn<AdminRow>[] = [
  { key: "nome", header: "Peça", render: (row) => row.nome, sortValue: (row) => row.nome },
  { key: "referencia", header: "Referência", render: (row) => row.referencia },
  {
    key: "preco",
    header: "Preço",
    render: (row) => (row.precoCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    sortValue: (row) => row.precoCents,
  },
  { key: "status", header: "Status", render: (row) => row.status },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-marfim/10 py-14">
      <p className="kicker mb-6 text-ouro-claro">{title}</p>
      {children}
    </section>
  );
}

function ToastDemo() {
  const { show } = useToast();
  return (
    <div className="flex gap-3">
      <Button variant="contornado" onClick={() => show("Peça reservada por 30 minutos.")}>
        Disparar toast padrão
      </Button>
      <Button variant="fantasma" onClick={() => show("Não foi possível concluir. Tente novamente.", "erro")}>
        Disparar toast de erro
      </Button>
    </div>
  );
}

export default function EstiloPage() {
  const [packagingValue, setPackagingValue] = useState<PackagingLevelId>("avancada");
  const [activeFilters, setActiveFilters] = useState<FilterOptionRef[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  function toggleFilter(groupId: string, optionId: string, label: string) {
    setActiveFilters((current) => {
      const exists = current.some((option) => option.optionId === optionId);
      if (exists) return current.filter((option) => option.optionId !== optionId);
      return [...current, { groupId, optionId, label }];
    });
  }

  return (
    <>
      <main className="nse-container pt-32">
        <h1 className="text-[40px] leading-tight tracking-tight text-marfim">
          Guia de estilo — NSEImports
        </h1>
        <p className="mt-3 max-w-xl text-[14px] text-marfim/60">
          Os 18 componentes de <span className="font-mono text-[13px]">components/ui/</span>{" "}
          da seção 09 do BRIEF.md, reunidos para revisão antes de começar a Home.
        </p>

        <Section id="button" title="Button">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="solido">Reservar peça</Button>
            <Button variant="contornado" primary>
              Contornado primário
            </Button>
            <Button variant="contornado">Contornado</Button>
            <Button variant="fantasma">Fantasma</Button>
            <Button variant="icone" aria-label="Ícone">
              +
            </Button>
            <Button variant="solido" loading>
              Carregando
            </Button>
            <Button variant="contornado" disabled>
              Desabilitado
            </Button>
          </div>
        </Section>

        <Section id="rarity-tag" title="RarityTag">
          <div className="flex flex-wrap gap-3">
            {RARITIES.map((rarity) => (
              <RarityTag key={rarity} rarity={rarity} />
            ))}
          </div>
        </Section>

        <Section id="arrival-estimate" title="ArrivalEstimate">
          <div className="flex flex-col gap-6">
            <ArrivalEstimate variant="inline" />
            <ArrivalEstimate variant="destaque" />
            <ArrivalEstimate variant="compacta" />
          </div>
        </Section>

        <Section id="product-card" title="ProductCard">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>

        <Section id="gallery" title="Gallery">
          <div className="max-w-2xl">
            <Gallery
              referencia="NSE-0142"
              images={[
                { label: "Estúdio" },
                { label: "Unidade recebida" },
                { label: "Detalhe" },
                { label: "Caixa" },
              ]}
            />
          </div>
        </Section>

        <Section id="spec-sheet" title="SpecSheet">
          <div className="max-w-md">
            <SpecSheet
              rows={[
                { label: "Filial de origem", value: "Nike Tokyo Flagship" },
                { label: "País", value: "Japão" },
                { label: "Data de aquisição", value: "03/10/2026" },
                { label: "Condição", value: "Deadstock" },
              ]}
            />
          </div>
        </Section>

        <Section id="timeline" title="Timeline">
          <div className="flex flex-col gap-10">
            <Timeline stages={ORDER_STAGES} orientation="horizontal" />
            <div className="max-w-md">
              <Timeline stages={ORDER_STAGES} orientation="vertical" />
            </div>
          </div>
        </Section>

        <Section id="packaging-picker" title="PackagingPicker">
          <PackagingPicker
            levels={PACKAGING_LEVELS}
            value={packagingValue}
            onChange={setPackagingValue}
          />
        </Section>

        <Section id="filter-panel" title="FilterPanel">
          <FilterPanel
            groups={FILTER_GROUPS}
            activeOptions={activeFilters}
            onToggle={toggleFilter}
            onClear={() => setActiveFilters([])}
          />
        </Section>

        <Section id="cart-drawer" title="CartDrawer">
          <Button variant="contornado" onClick={() => setCartOpen(true)}>
            Abrir sacola
          </Button>
          <CartDrawer
            open={cartOpen}
            onOpenChange={setCartOpen}
            lines={CART_LINES}
            subtotalCents={CART_LINES.reduce((sum, line) => sum + line.priceCents, 0)}
          />
        </Section>

        <Section id="checkout-stepper" title="CheckoutStepper">
          <CheckoutStepper
            steps={["Identificação", "Entrega e embalagem", "Pagamento"]}
            currentStep={2}
          />
        </Section>

        <Section id="stat-band" title="StatBand">
          <StatBand
            stats={[
              { label: "Peças entregues", value: "1.204" },
              { label: "Países de origem", value: "14" },
              { label: "Conferência aprovada", value: "99,2%" },
              { label: "Avaliação média", value: "4,9" },
            ]}
          />
        </Section>

        <Section id="waitlist-form" title="WaitlistForm">
          <div className="flex flex-col gap-10 sm:flex-row">
            <div className="max-w-sm flex-1">
              <p className="kicker mb-3 text-marfim/40">Completo</p>
              <WaitlistForm variant="completo" />
            </div>
            <div className="max-w-sm flex-1">
              <p className="kicker mb-3 text-marfim/40">Compacto</p>
              <WaitlistForm variant="compacto" />
            </div>
          </div>
        </Section>

        <Section id="accordion" title="Accordion">
          <div className="max-w-xl">
            <Accordion
              defaultOpenId="prazo"
              items={[
                {
                  id: "prazo",
                  question: "Por que 45 dias úteis?",
                  answer:
                    "Aquisição na origem, conferência internacional, trânsito, liberação alfandegária e embalagem — cada etapa tem data própria e é acompanhada em /rastrear.",
                },
                {
                  id: "autenticidade",
                  question: "Como sei que a peça é original?",
                  answer:
                    "Toda peça passa por conferência de etiqueta, numeração, costura e acessórios antes do despacho, com laudo fotográfico.",
                },
              ]}
            />
          </div>
        </Section>

        <Section id="data-table" title="DataTable">
          <DataTable
            columns={ADMIN_COLUMNS}
            rows={ADMIN_ROWS}
            searchPlaceholder="Buscar peça"
            renderActions={() => (
              <Button variant="fantasma" className="h-8 px-3 text-[12px]">
                Editar
              </Button>
            )}
          />
        </Section>

        <Section id="skeleton-empty-toast" title="Skeleton / EmptyState / Toast">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4">
              <Skeleton className="h-40 w-32" />
              <Skeleton className="h-40 w-32" />
              <Skeleton className="h-40 w-32" />
            </div>

            <EmptyState
              title="Nenhuma peça com esses filtros."
              description="Entre na lista e avisamos quando entrar uma."
              action={<Button variant="contornado">Entrar na lista</Button>}
            />

            <ToastDemo />
          </div>
        </Section>
      </main>
    </>
  );
}
