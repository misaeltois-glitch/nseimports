/**
 * Mock temporário do dossiê de produto, usado pela rota /arquivo/[slug]
 * enquanto não existe /content/products/*.json validado com Zod
 * (BRIEF.md, seção 10). Os campos comuns vêm de mock-products.ts — aqui só
 * o que é específico do dossiê (tamanhos, procedência, conferência, etc.).
 */
import type { ProductDetail, ProvenanceInfo, SizeOption } from "@/types/product";
import { MOCK_PRODUCTS } from "./mock-products";

const CONFERENCIA_PADRAO = [
  "Etiqueta original conferida",
  "Numeração de série verificada",
  "Costura e acabamento inspecionados",
  "Caixa original íntegra",
  "Acessórios completos",
];

const GALLERY_PADRAO = ["Estúdio", "Unidade recebida", "Detalhe", "Caixa"];

interface DetailExtras {
  sizes: SizeOption[];
  provenance: ProvenanceInfo;
  conferencia: string[];
  galleryLabels: string[];
  relatedSlugs: string[];
}

const DETAIL_EXTRAS: Record<string, DetailExtras> = {
  "air-jordan-1-tokyo": {
    sizes: [
      { label: "38", available: false },
      { label: "39", available: true },
      { label: "40", available: true },
      { label: "41", available: true },
      { label: "42", available: false },
      { label: "43", available: true },
    ],
    provenance: {
      filial: "Nike Tokyo Flagship",
      pais: "Japão",
      dataAquisicao: "03/10/2026",
      condicao: "Deadstock",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["bape-shark-hoodie", "kith-quilted-vest"],
  },
  "supreme-box-logo": {
    sizes: [
      { label: "P", available: false },
      { label: "M", available: false },
      { label: "G", available: false },
      { label: "GG", available: false },
    ],
    provenance: {
      filial: "Supreme New York",
      pais: "Estados Unidos",
      dataAquisicao: "22/09/2026",
      condicao: "Novo lacrado",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["kith-quilted-vest", "palace-tri-ferg-jacket"],
  },
  "bape-shark-hoodie": {
    sizes: [
      { label: "P", available: true },
      { label: "M", available: true },
      { label: "G", available: true },
      { label: "GG", available: false },
    ],
    provenance: {
      filial: "BAPE Osaka",
      pais: "Japão",
      dataAquisicao: "18/09/2026",
      condicao: "Novo lacrado",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["air-jordan-1-tokyo", "stone-island-shadow-jacket"],
  },
  "stone-island-shadow-jacket": {
    sizes: [
      { label: "M", available: true },
      { label: "G", available: false },
      { label: "GG", available: true },
    ],
    provenance: {
      filial: "Stone Island Milano",
      pais: "Itália",
      dataAquisicao: "29/09/2026",
      condicao: "Deadstock",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["bape-shark-hoodie", "palace-tri-ferg-jacket"],
  },
  "kith-quilted-vest": {
    sizes: [
      { label: "P", available: true },
      { label: "M", available: true },
      { label: "G", available: true },
      { label: "GG", available: true },
    ],
    provenance: {
      filial: "Kith Manhattan",
      pais: "Estados Unidos",
      dataAquisicao: "05/10/2026",
      condicao: "Novo lacrado",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["air-jordan-1-tokyo", "supreme-box-logo"],
  },
  "palace-tri-ferg-jacket": {
    sizes: [
      { label: "P", available: true },
      { label: "M", available: false },
      { label: "G", available: true },
      { label: "GG", available: true },
    ],
    provenance: {
      filial: "Palace Soho London",
      pais: "Reino Unido",
      dataAquisicao: "27/09/2026",
      condicao: "Deadstock",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["supreme-box-logo", "stone-island-shadow-jacket"],
  },
  "new-era-59fifty-japan": {
    sizes: [
      { label: "7", available: true },
      { label: "7 1/4", available: true },
      { label: "7 1/2", available: false },
      { label: "7 3/4", available: true },
    ],
    provenance: {
      filial: "New Era Los Angeles",
      pais: "Estados Unidos",
      dataAquisicao: "01/10/2026",
      condicao: "Novo lacrado",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["bape-shark-hoodie", "palace-tri-ferg-jacket"],
  },
  "chrome-hearts-cross-wallet": {
    sizes: [],
    provenance: {
      filial: "Chrome Hearts Miami",
      pais: "Estados Unidos",
      dataAquisicao: "20/09/2026",
      condicao: "Usado grau A",
    },
    conferencia: CONFERENCIA_PADRAO,
    galleryLabels: GALLERY_PADRAO,
    relatedSlugs: ["supreme-box-logo", "stone-island-shadow-jacket"],
  },
};

export const MOCK_PRODUCT_DETAILS: ProductDetail[] = MOCK_PRODUCTS.map((product) => ({
  ...product,
  ...DETAIL_EXTRAS[product.slug],
}));

export function getProductDetailBySlug(slug: string): ProductDetail | undefined {
  return MOCK_PRODUCT_DETAILS.find((product) => product.slug === slug);
}
