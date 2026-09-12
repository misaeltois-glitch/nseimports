import type { DropPost } from "@/types/drop";

/**
 * Mock temporário de drops e diário, usado por /drops e /drops/[slug]
 * enquanto não existe um CMS real (BRIEF.md, seção 10).
 */
export const MOCK_DROPS: DropPost[] = [
  {
    id: "1",
    slug: "lote-toquio-novembro",
    kind: "drop",
    title: "Lote Tóquio, novembro",
    excerpt:
      "Seis peças direto da filial de Shibuya, incluindo o par que fechou a fila em outubro.",
    publishedAt: "2026-09-01T12:00:00.000Z",
    opensAt: "2026-09-20T10:00:00.000Z",
    productSlugs: ["air-jordan-1-tokyo", "new-era-59fifty-japan"],
    body: [
      {
        type: "paragraph",
        text: "Todo lote começa com uma lista maior do que cabe na mala. Desta vez, a filial de Shibuya confirmou seis peças — duas delas com fila própria na madrugada do lançamento japonês.",
      },
      { type: "image", label: "Fila em Shibuya, 5h da manhã" },
      {
        type: "paragraph",
        text: "A conferência acontece ainda no Japão, antes do trânsito: numeração, etiqueta e caixa original, uma a uma. Só o que passa nesse crivo entra na mala.",
      },
      {
        type: "quote",
        text: "Compramos o que a fila não deixou passar para o mercado de revenda.",
      },
      {
        type: "paragraph",
        text: "O lote abre para reserva na data marcada abaixo. Depois disso, é a rota de sempre: conferência, trânsito, alfândega, entrega.",
      },
    ],
  },
  {
    id: "2",
    slug: "lote-milao-inverno",
    kind: "drop",
    title: "Lote Milão, edição de inverno",
    excerpt: "Peças de inverno direto de Milão, com foco em outerwear técnico.",
    publishedAt: "2026-09-05T12:00:00.000Z",
    opensAt: "2026-10-05T10:00:00.000Z",
    productSlugs: ["stone-island-shadow-jacket"],
    body: [
      {
        type: "paragraph",
        text: "O inverno italiano concentra as peças técnicas mais difíceis de encontrar fora da Europa. Este lote foi negociado direto com um revendedor autorizado em Milão.",
      },
      { type: "image", label: "Depósito em Milão" },
      {
        type: "paragraph",
        text: "Cada jaqueta vem com o cartão de procedência assinado — quem comprou, onde, e quando saiu da loja de origem.",
      },
    ],
  },
  {
    id: "3",
    slug: "como-um-bone-vira-raridade",
    kind: "diario",
    title: "Como um boné vira raridade",
    excerpt: "O que separa um boné comum de uma peça de arquivo: numeração, lote e origem.",
    publishedAt: "2026-08-20T12:00:00.000Z",
    productSlugs: ["new-era-59fifty-japan"],
    body: [
      {
        type: "paragraph",
        text: "A maioria dos bonés que vendemos não é rara — é só difícil de achar fora do país de origem. A diferença entre os dois é a numeração do lote.",
      },
      {
        type: "quote",
        text: "Raridade se prova com fato — origem, quantidade, data — não com adjetivo.",
      },
      {
        type: "paragraph",
        text: "Esta edição japonesa saiu numa tiragem pequena, vendida só em três lojas físicas. Depois disso, virou exclusividade de arquivo — e é isso que rastreamos antes de comprar.",
      },
      { type: "image", label: "Etiqueta interna com o número do lote" },
    ],
  },
  {
    id: "4",
    slug: "a-caixa-que-quase-nao-chegou",
    kind: "diario",
    title: "A caixa que quase não chegou",
    excerpt: "Bastidor de uma liberação alfandegária que quase passou dos 45 dias úteis.",
    publishedAt: "2026-08-10T12:00:00.000Z",
    productSlugs: ["stone-island-shadow-jacket", "chrome-hearts-cross-wallet"],
    body: [
      {
        type: "paragraph",
        text: "Nem toda etapa dos 45 dias úteis corre no tempo esperado. Esta é a história de um lote que ficou retido oito dias a mais na alfândega — e o que fizemos enquanto isso.",
      },
      {
        type: "paragraph",
        text: "Assim que a liberação passou do prazo declarado, avisamos os clientes com a nova data, antes que perguntassem. Ninguém gosta de surpresa, principalmente numa espera de mês e meio.",
      },
      {
        type: "quote",
        text: "O prazo nunca é escondido e nunca é pedido de desculpas — é o preço da procedência.",
      },
      {
        type: "paragraph",
        text: "A caixa chegou, intacta, oito dias depois do previsto. O laudo de conferência acompanhou cada peça até a entrega final.",
      },
    ],
  },
];

export function getDropBySlug(slug: string): DropPost | undefined {
  return MOCK_DROPS.find((post) => post.slug === slug);
}
