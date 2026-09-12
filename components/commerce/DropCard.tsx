import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { formatDayMonth } from "@/lib/format";
import { MOCK_PRODUCTS } from "@/content/mock-products";
import type { DropPost } from "@/types/drop";
import { DropCountdown } from "./DropCountdown";

/** Card do índice de drops/diário (BRIEF.md, seção 06 — Drops e diário). */
export function DropCard({ post }: { post: DropPost }) {
  const isDrop = post.kind === "drop";
  const products = post.productSlugs
    .map((slug) => MOCK_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Link href={`/drops/${post.slug}`} className="group block">
      <ImagePlaceholder label={isDrop ? "Drop" : "Diário"} ratio="4/5" />

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`kicker rounded-control px-2 py-1 ${
            isDrop ? "border border-ouro text-ouro-claro" : "border border-marfim/20 text-marfim/70"
          }`}
        >
          {isDrop ? "Drop" : "Diário"}
        </span>
        <span className="font-mono text-[11px] text-marfim/40">
          {formatDayMonth(new Date(post.publishedAt))}
        </span>
      </div>

      <p className="mt-2 text-[15px] text-marfim group-hover:text-marfim/90">{post.title}</p>
      <p className="mt-1 text-[13px] text-marfim/60">{post.excerpt}</p>

      {isDrop && post.opensAt && (
        <div className="mt-3 flex items-center justify-between">
          <span className="kicker text-marfim/40">Abre em</span>
          <DropCountdown opensAt={post.opensAt} />
        </div>
      )}

      {products.length > 0 && (
        <p className="mt-2 font-mono text-[11px] text-marfim/40">
          {products.map((p) => p.name).join(" · ")}
        </p>
      )}
    </Link>
  );
}
