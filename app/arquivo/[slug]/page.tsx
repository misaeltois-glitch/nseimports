import { notFound } from "next/navigation";
import { Gallery } from "@/components/ui/Gallery";
import { ProductCard } from "@/components/ui/ProductCard";
import { RarityTag } from "@/components/ui/RarityTag";
import { SpecSheet } from "@/components/ui/SpecSheet";
import { ProductPurchasePanel } from "@/components/commerce/ProductPurchasePanel";
import { getArrivalWindow } from "@/lib/business-days";
import { MOCK_PRODUCT_DETAILS, getProductDetailBySlug } from "@/content/mock-product-details";
import { MOCK_PRODUCTS } from "@/content/mock-products";

export const revalidate = 3600;

export function generateStaticParams() {
  return MOCK_PRODUCT_DETAILS.map((product) => ({ slug: product.slug }));
}

/**
 * O dossiê de produto (BRIEF.md, seção 06 — Produto): a tela mais
 * importante do site. Galeria sticky à esquerda, painel de decisão à
 * direita que rola.
 */
export default async function ProdutoPage(props: PageProps<"/arquivo/[slug]">) {
  const { slug } = await props.params;
  const product = getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  const arrivalWindow = getArrivalWindow();
  const related = MOCK_PRODUCTS.filter(
    (item) => product.relatedSlugs.includes(item.slug) && item.slug !== product.slug
  ).slice(0, 3);

  return (
    <main className="pt-16">
      <div className="nse-container grid gap-10 py-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <Gallery
            referencia={product.referencia}
            images={product.galleryLabels.map((label) => ({ label }))}
          />
        </div>

        <div>
          <p className="text-[13px] text-marfim/60">{product.brand}</p>
          <h1 className="mt-1 text-[28px] tracking-tight text-marfim">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-mono text-[12px] text-marfim/50">{product.referencia}</span>
            <RarityTag rarity={product.rarity} />
          </div>

          <div className="mt-8">
            <ProductPurchasePanel product={product} arrivalWindow={arrivalWindow} />
          </div>

          <div className="mt-10 border-t border-marfim/10 pt-8">
            <p className="kicker mb-4 text-ouro-claro">Procedência</p>
            <SpecSheet
              rows={[
                { label: "Filial de origem", value: product.provenance.filial },
                { label: "País", value: product.provenance.pais },
                { label: "Data de aquisição", value: product.provenance.dataAquisicao },
                { label: "Condição", value: product.provenance.condicao },
              ]}
            />
          </div>

          <div className="mt-10 border-t border-marfim/10 pt-8">
            <p className="kicker mb-4 text-ouro-claro">Conferência</p>
            <ul className="flex flex-col gap-2 text-[13px] text-marfim/75">
              {product.conferencia.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ouro" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="nse-container border-t border-marfim/10 py-10">
          <p className="kicker mb-4 text-ouro-claro">Relacionados</p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
