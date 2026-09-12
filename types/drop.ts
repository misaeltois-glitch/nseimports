/** Drops e diário (BRIEF.md, seção 06). */
export type DropKind = "drop" | "diario";

export type DropBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; label: string };

export interface DropPost {
  id: string;
  slug: string;
  kind: DropKind;
  title: string;
  excerpt: string;
  publishedAt: string;
  /** Só para kind "drop": quando o lote abre. */
  opensAt?: string;
  productSlugs: string[];
  body: DropBodyBlock[];
}
