"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterPanel, type FilterGroup, type FilterOptionRef } from "@/components/ui/FilterPanel";
import { ProductCard } from "@/components/ui/ProductCard";
import { MOCK_PRODUCTS } from "@/content/mock-products";
import { CATEGORY_LABEL, RARITY_LABEL, type Rarity } from "@/types/product";

const PAGE_SIZE = 6;

const PRICE_BRACKETS = [
  { id: "faixa-1", label: "Até R$ 1.500", min: 0, max: 150_000 },
  { id: "faixa-2", label: "R$ 1.500 – R$ 3.000", min: 150_000, max: 300_000 },
  { id: "faixa-3", label: "Acima de R$ 3.000", min: 300_000, max: Infinity },
];

const SORT_OPTIONS = [
  { id: "recentes", label: "Recentes" },
  { id: "preco", label: "Preço" },
  { id: "menor-prazo", label: "Menor prazo" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

function buildFilterGroups(): FilterGroup[] {
  const categories = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)));
  const origins = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.origin))).sort();
  const rarities: Rarity[] = ["comum", "limitado", "raro", "peca-unica"];

  return [
    {
      id: "categoria",
      label: "Categoria",
      options: categories.map((c) => ({ id: c, label: CATEGORY_LABEL[c] })),
    },
    {
      id: "origem",
      label: "Origem",
      options: origins.map((o) => ({ id: o, label: o })),
    },
    {
      id: "preco",
      label: "Faixa de preço",
      options: PRICE_BRACKETS.map(({ id, label }) => ({ id, label })),
    },
    {
      id: "raridade",
      label: "Raridade",
      options: rarities.map((r) => ({ id: r, label: RARITY_LABEL[r] })),
    },
    {
      id: "disponibilidade",
      label: "Disponibilidade",
      options: [
        { id: "em-estoque", label: "Em estoque" },
        { id: "esgotado", label: "Esgotado" },
      ],
    },
  ];
}

const FILTER_GROUPS = buildFilterGroups();

function parseActiveFilters(searchParams: URLSearchParams): FilterOptionRef[] {
  const refs: FilterOptionRef[] = [];
  for (const group of FILTER_GROUPS) {
    const raw = searchParams.get(group.id);
    if (!raw) continue;
    for (const optionId of raw.split(",")) {
      const option = group.options.find((o) => o.id === optionId);
      if (option) refs.push({ groupId: group.id, optionId: option.id, label: option.label });
    }
  }
  return refs;
}

/**
 * O Arquivo (BRIEF.md, seção 06 — Catálogo): filtros com estado na URL
 * (compartilhável e indexável), ordenação, e "carregar mais" — nunca
 * scroll infinito.
 */
export function CatalogBrowser() {
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeFilters = useMemo(() => parseActiveFilters(searchParams), [searchParams]);
  const sort = (searchParams.get("ordenar") as SortId | null) ?? "recentes";

  function updateUrl(nextFilters: FilterOptionRef[], nextSort: SortId) {
    const params = new URLSearchParams();
    for (const group of FILTER_GROUPS) {
      const ids = nextFilters.filter((f) => f.groupId === group.id).map((f) => f.optionId);
      if (ids.length > 0) params.set(group.id, ids.join(","));
    }
    if (nextSort !== "recentes") params.set("ordenar", nextSort);

    const query = params.toString();
    const target = query ? `/arquivo?${query}` : "/arquivo";
    // router.push/replace (next/navigation) silently no-ops here on search-param-only
    // navigations in this Next.js build — verified by manual testing. Raw pushState
    // updates the URL and useSearchParams() still picks it up reactively.
    window.history.pushState(null, "", target);
    setVisibleCount(PAGE_SIZE);
  }

  function toggleFilter(groupId: string, optionId: string, label: string) {
    const exists = activeFilters.some((f) => f.groupId === groupId && f.optionId === optionId);
    const next = exists
      ? activeFilters.filter((f) => !(f.groupId === groupId && f.optionId === optionId))
      : [...activeFilters, { groupId, optionId, label }];
    updateUrl(next, sort);
  }

  const filtered = useMemo(() => {
    let items = MOCK_PRODUCTS;

    const idsFor = (groupId: string) =>
      activeFilters.filter((f) => f.groupId === groupId).map((f) => f.optionId);

    const categoriaIds = idsFor("categoria");
    if (categoriaIds.length > 0) items = items.filter((p) => categoriaIds.includes(p.category));

    const origemIds = idsFor("origem");
    if (origemIds.length > 0) items = items.filter((p) => origemIds.includes(p.origin));

    const precoIds = idsFor("preco");
    if (precoIds.length > 0) {
      const brackets = PRICE_BRACKETS.filter((b) => precoIds.includes(b.id));
      items = items.filter((p) => brackets.some((b) => p.priceCents >= b.min && p.priceCents < b.max));
    }

    const raridadeIds = idsFor("raridade");
    if (raridadeIds.length > 0) items = items.filter((p) => raridadeIds.includes(p.rarity));

    const disponibilidadeIds = idsFor("disponibilidade");
    if (disponibilidadeIds.length > 0) {
      items = items.filter((p) => {
        const emEstoque = p.stockAvailable > 0;
        return (
          (emEstoque && disponibilidadeIds.includes("em-estoque")) ||
          (!emEstoque && disponibilidadeIds.includes("esgotado"))
        );
      });
    }

    const sorted = [...items];
    if (sort === "preco") sorted.sort((a, b) => a.priceCents - b.priceCents);
    else if (sort === "menor-prazo") sorted.sort((a, b) => a.diasRestantes - b.diasRestantes);

    return sorted;
  }, [activeFilters, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="nse-container flex flex-col gap-8 py-10 lg:flex-row lg:gap-12">
      <aside className="lg:sticky lg:top-20 lg:h-fit lg:w-64 lg:shrink-0">
        <FilterPanel
          groups={FILTER_GROUPS}
          activeOptions={activeFilters}
          onToggle={toggleFilter}
          onClear={() => updateUrl([], sort)}
        />
      </aside>

      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-[12px] text-marfim/50">
            {filtered.length} peça{filtered.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateUrl(activeFilters, option.id)}
                className={`kicker rounded-control px-2 py-1 ${
                  sort === option.id ? "text-ouro-claro" : "text-marfim/40 hover:text-marfim/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="Nenhuma peça com esses filtros."
            description="Entre na lista e avisamos quando entrar uma."
            action={
              <Link href="/lista">
                <Button variant="contornado">Entrar na lista</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="contornado"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
