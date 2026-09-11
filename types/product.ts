/**
 * Tipos mínimos para tipar os componentes de components/ui/ nesta fase.
 * A validação com Zod e o conteúdo real (/content/products/*.json) entram
 * na fase de Catálogo/Produto — aqui é só o suficiente para os mocks do /estilo.
 */

export type Rarity = "comum" | "limitado" | "raro" | "peca-unica";

export const RARITY_LABEL: Record<Rarity, string> = {
  comum: "Comum",
  limitado: "Limitado",
  raro: "Raro",
  "peca-unica": "Peça única",
};

export interface ProductImages {
  primary: string;
  secondary?: string;
}

export interface ProductSummary {
  id: string;
  slug: string;
  brand: string;
  name: string;
  referencia: string;
  priceCents: number;
  rarity: Rarity;
  images: ProductImages;
  origin: string;
  stockAvailable: number;
  stockTotal: number;
}

export type PackagingLevelId = "padrao" | "avancada" | "personalizada";

export interface PackagingLevel {
  id: PackagingLevelId;
  label: string;
  name: string;
  description: string;
  priceCents: number | "consulta";
  extraBusinessDays: number;
  image?: string;
}

export type OrderStageStatus = "concluida" | "atual" | "futura";

export interface OrderStage {
  id: string;
  order: number;
  label: string;
  duration: string;
  description: string;
  status: OrderStageStatus;
  dateLabel?: string;
}

export interface SizeOption {
  label: string;
  available: boolean;
}

export interface ProvenanceInfo {
  filial: string;
  pais: string;
  dataAquisicao: string;
  condicao: string;
}

/** Ficha completa do dossiê de produto (BRIEF.md, seção 06 — Produto). */
export interface ProductDetail extends ProductSummary {
  sizes: SizeOption[];
  provenance: ProvenanceInfo;
  conferencia: string[];
  galleryLabels: string[];
  relatedSlugs: string[];
}
