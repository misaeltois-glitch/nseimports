"use client";

import Link from "next/link";
import { formatPriceBRL, formatStockLabel } from "@/lib/format";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";
import type { ProductSummary } from "@/types/product";
import { ArrivalEstimate } from "./ArrivalEstimate";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { RarityTag } from "./RarityTag";

/**
 * Card de catálogo/arquivo recente (BRIEF.md, seções 06 e 09). Esgotados
 * continuam visíveis a 40% de opacidade com "avisar quando voltar" — o
 * arquivo também é vitrine de reputação.
 */
export function ProductCard({ product }: { product: ProductSummary }) {
  const isSoldOut = product.stockAvailable === 0;
  const wishlist = useWishlist();
  const wishlisted = wishlist.includes(product.slug);

  return (
    <div className={`group relative ${isSoldOut ? "opacity-40" : ""}`}>
      <Link href={`/arquivo/${product.slug}`} className="block">
        <div className="relative">
          <ImagePlaceholder label="Estúdio" referencia={product.referencia} ratio="4/5" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-nse)] group-hover:opacity-100">
            <ImagePlaceholder
              label="Unidade recebida"
              referencia={product.referencia}
              ratio="4/5"
            />
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] text-marfim">
              {product.brand} · {product.name}
            </p>
            <p className="mt-1 font-mono text-[13px] text-marfim/85">
              {formatPriceBRL(product.priceCents)}
            </p>
          </div>
          <RarityTag rarity={product.rarity} />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          {isSoldOut ? (
            <span className="kicker text-marfim/60">Avisar quando voltar</span>
          ) : (
            <>
              <ArrivalEstimate variant="compacta" />
              <span className="font-mono text-[11px] text-marfim/0 transition-colors duration-[400ms] group-hover:text-marfim/45">
                {product.origin} · {formatStockLabel(product.stockAvailable, product.stockTotal)}
              </span>
            </>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.slug)}
        aria-label={wishlisted ? "Remover dos desejos" : "Salvar nos desejos"}
        aria-pressed={wishlisted}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-onix/60 text-marfim transition-colors duration-[400ms] ease-[var(--ease-nse)] hover:bg-onix/80"
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill={wishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M12 21s-7.5-4.6-10-9.1C.6 8.6 2 4.8 5.6 4.1c2-.4 3.9.5 5 2.1 1.1-1.6 3-2.5 5-2.1 3.6.7 5 4.5 3.6 7.8-2.5 4.5-10 9.1-10 9.1Z" />
        </svg>
      </button>
    </div>
  );
}
