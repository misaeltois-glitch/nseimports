import { DropCard } from "@/components/commerce/DropCard";
import { MOCK_DROPS } from "@/content/mock-drops";

export const revalidate = 3600;

/** Drops e diário (BRIEF.md, seção 05 — /drops). */
export default function DropsPage() {
  const posts = [...MOCK_DROPS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <main className="pt-16">
      <div className="nse-container py-10">
        <p className="kicker text-ouro-claro">Drops e diário</p>
        <h1 className="mt-3 text-[32px] tracking-tight text-marfim">O que está chegando</h1>
        <p className="mt-2 max-w-lg text-[14px] text-marfim/60">
          Lotes com data marcada e bastidores de como as peças foram encontradas.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
          {posts.map((post) => (
            <DropCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
