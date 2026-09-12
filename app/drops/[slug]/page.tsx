import { notFound } from "next/navigation";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProductCard } from "@/components/ui/ProductCard";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { DropCountdown } from "@/components/commerce/DropCountdown";
import { formatDayMonth } from "@/lib/format";
import { getDropBySlug, MOCK_DROPS } from "@/content/mock-drops";
import { MOCK_PRODUCTS } from "@/content/mock-products";

export const revalidate = 3600;

export function generateStaticParams() {
  return MOCK_DROPS.map((post) => ({ slug: post.slug }));
}

/** Post do drop (BRIEF.md, seção 06 — Drops e diário). */
export default async function DropPostPage(props: PageProps<"/drops/[slug]">) {
  const { slug } = await props.params;
  const post = getDropBySlug(slug);

  if (!post) {
    notFound();
  }

  const isDrop = post.kind === "drop";
  const related = MOCK_PRODUCTS.filter((product) => post.productSlugs.includes(product.slug)).slice(
    0,
    3
  );

  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <div className="mx-auto max-w-[68ch]">
          <div className="flex items-center gap-2">
            <span
              className={`kicker rounded-control px-2 py-1 ${
                isDrop
                  ? "border border-ouro text-ouro-claro"
                  : "border border-marfim/20 text-marfim/70"
              }`}
            >
              {isDrop ? "Drop" : "Diário"}
            </span>
            <span className="font-mono text-[11px] text-marfim/40">
              {formatDayMonth(new Date(post.publishedAt))}
            </span>
          </div>

          <h1 className="mt-4 text-[32px] leading-tight tracking-tight text-marfim">
            {post.title}
          </h1>

          {isDrop && post.opensAt && (
            <div className="mt-4 flex items-center gap-2 border-l-2 border-ouro pl-4">
              <span className="kicker text-marfim/50">Abre em</span>
              <DropCountdown opensAt={post.opensAt} />
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {post.body.map((block, index) => {
            if (block.type === "image") {
              return (
                <div key={index} className="mx-auto w-full max-w-3xl">
                  <ImagePlaceholder label={block.label} ratio="4/5" />
                </div>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={index}
                  className="mx-auto max-w-[68ch] border-l-2 border-ouro pl-4 text-[17px] italic leading-relaxed text-marfim/90"
                >
                  {block.text}
                </blockquote>
              );
            }
            return (
              <p key={index} className="mx-auto max-w-[68ch] text-[15px] leading-relaxed text-marfim/80">
                {block.text}
              </p>
            );
          })}
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-marfim/10 pt-10">
            <p className="kicker mb-4 text-ouro-claro">Peças relacionadas</p>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {related.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-marfim/10 pt-10">
          <div className="max-w-md">
            <p className="kicker text-ouro-claro">Avisos de drop</p>
            <h2 className="mt-3 text-[20px] tracking-tight text-marfim">
              Entre na lista para saber quando a próxima chegar
            </h2>
            <div className="mt-6">
              <WaitlistForm variant="compacto" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
