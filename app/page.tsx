import Link from "next/link";
import { ArrivalEstimate } from "@/components/ui/ArrivalEstimate";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProductCard } from "@/components/ui/ProductCard";
import { StatBand } from "@/components/ui/StatBand";
import { Timeline } from "@/components/ui/Timeline";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { MOCK_ORDER_STAGES } from "@/content/mock-order-stages";
import { PACKAGING_LEVELS } from "@/content/mock-packaging";
import { MOCK_PRODUCTS } from "@/content/mock-products";

const RECENT_PRODUCTS = MOCK_PRODUCTS;

/**
 * Home (BRIEF.md, seção 06): sete blocos, nesta ordem exata. Convencer em
 * 8 segundos de que isto não é uma loja comum.
 */
export default function Home() {
  return (
    <main>
      {/* 1. Abertura em tela cheia — sem carrossel, uma peça só. */}
      <section className="nse-noise relative flex min-h-screen flex-col justify-end overflow-hidden bg-grafite">
        <div className="nse-container relative z-10 pb-20 pt-32">
          <p className="kicker text-marfim/50">Tóquio → São Paulo · Lote 12</p>
          <h1 className="mt-4 max-w-2xl text-[52px] font-light leading-[0.98] tracking-tight text-marfim sm:text-[84px]">
            Air Jordan 1
            <br />
            Retro High OG
          </h1>
          <div className="mt-6">
            <ArrivalEstimate variant="destaque" />
          </div>
        </div>
      </section>

      {/* 2. Faixa de credibilidade */}
      <StatBand
        stats={[
          { label: "Peças entregues", value: "1.204" },
          { label: "Países de origem", value: "14" },
          { label: "Conferência aprovada", value: "99,2%" },
          { label: "Avaliação média", value: "4,9" },
        ]}
      />

      {/* 3. Arquivo recente — grade 3×2, hover revela origem e estoque real. */}
      <section className="nse-container py-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-[26px] tracking-tight text-marfim">Arquivo recente</h2>
          <Link href="/arquivo" className="kicker text-marfim/50 hover:text-marfim">
            Ver tudo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {RECENT_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. O prazo, explicado — não é letra miúda. */}
      <section className="nse-container border-t border-marfim/10 py-20">
        <div className="mb-10 max-w-xl">
          <p className="kicker text-ouro-claro">O prazo, explicado</p>
          <h2 className="mt-3 text-[26px] tracking-tight text-marfim">
            45 dias úteis, do jeito que realmente acontecem
          </h2>
          <p className="mt-3 text-[14px] text-marfim/60">
            Cada etapa tem duração declarada e é acompanhada pedido a pedido em{" "}
            <Link href="/rastrear" className="text-ouro-claro hover:underline">
              /rastrear
            </Link>
            .
          </p>
        </div>
        <Timeline stages={MOCK_ORDER_STAGES} orientation="horizontal" />
        <Link
          href="/processo"
          className="kicker mt-8 inline-block text-marfim/50 hover:text-marfim"
        >
          Ver processo completo →
        </Link>
      </section>

      {/* 5. Embalagem — três cards, upgrade natural. */}
      <section className="nse-container border-t border-marfim/10 py-20">
        <p className="kicker text-ouro-claro">Embalagem</p>
        <h2 className="mt-3 max-w-lg text-[26px] tracking-tight text-marfim">
          Três níveis, cada um pensado para um jeito de guardar a peça
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PACKAGING_LEVELS.map((level) => (
            <div
              key={level.id}
              className={`rounded-card border p-5 ${
                level.id === "avancada" ? "border-ouro/40 bg-ouro/5" : "border-marfim/15"
              }`}
            >
              <ImagePlaceholder label={level.name} ratio="4/5" className="mb-4" />
              <span className="kicker text-marfim/40">{level.label}</span>
              <p className="mt-2 text-[16px] text-marfim">{level.name}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-marfim/60">
                {level.description}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/embalagem"
          className="kicker mt-8 inline-block text-marfim/50 hover:text-marfim"
        >
          Ver todos os níveis →
        </Link>
      </section>

      {/* 6. Chegou assim — prova social sem depoimento genérico. */}
      <section className="nse-container border-t border-marfim/10 py-20">
        <p className="kicker text-ouro-claro">Chegou assim</p>
        <h2 className="mt-3 text-[26px] tracking-tight text-marfim">
          Fotos de clientes recebendo a peça
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ImagePlaceholder key={index} label="Cliente" ratio="1/1" />
          ))}
        </div>
      </section>

      {/* 7. Avisos de drop — sem pop-up, nunca. */}
      <section className="nse-container border-t border-marfim/10 py-20">
        <div className="max-w-md">
          <p className="kicker text-ouro-claro">Avisos de drop</p>
          <h2 className="mt-3 text-[22px] tracking-tight text-marfim">
            Saiba antes de todo mundo quando uma peça nova entrar no arquivo
          </h2>
          <div className="mt-6">
            <WaitlistForm variant="compacto" />
          </div>
        </div>
      </section>
    </main>
  );
}
