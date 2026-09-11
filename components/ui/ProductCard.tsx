import Link from "next/link";
import { formatPriceBRL, formatStockLabel } from "@/lib/format";
import type { ProductSummary } from "@/types/product";
import { ArrivalEstimate } from "./ArrivalEstimate";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { RarityTag } from "./RarityTag";

/** Card de catálogo/arquivo recente (BRIEF.md, seções 06 e 09). */
export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link href={`/arquivo/${product.slug}`} className="group block">
      <div className="relative">
        <ImagePlaceholder
          label="Estúdio"
          referencia={product.referencia}
          ratio="4/5"
        />
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
        <ArrivalEstimate variant="compacta" />
        <span className="font-mono text-[11px] text-marfim/0 transition-colors duration-[400ms] group-hover:text-marfim/45">
          {product.origin} · {formatStockLabel(product.stockAvailable, product.stockTotal)}
        </span>
      </div>
    </Link>
  );
}
