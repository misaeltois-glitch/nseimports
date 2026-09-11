import type { OrderStage } from "@/types/product";

/** As cinco etapas dos 45 dias úteis (BRIEF.md, seção 07). */
const STAGE_TEXT = [
  {
    id: "aquisicao",
    label: "Aquisição na origem",
    duration: "5–10 dias úteis",
    description: "Compra confirmada na filial ou no fornecedor autorizado do país de origem.",
  },
  {
    id: "conferencia",
    label: "Conferência internacional",
    duration: "3–5 dias úteis",
    description: "Autenticidade, numeração, estado e acessórios verificados e fotografados.",
  },
  {
    id: "transito",
    label: "Trânsito internacional",
    duration: "10–18 dias úteis",
    description: "Consolidação e voo até o Brasil.",
  },
  {
    id: "alfandega",
    label: "Liberação alfandegária",
    duration: "5–15 dias úteis",
    description: "A etapa que não controlamos — e por isso a que mais precisa ser explicada.",
  },
  {
    id: "entrega",
    label: "Embalagem e entrega",
    duration: "2–5 dias úteis",
    description: "Embalagem no nível escolhido, foto final enviada ao cliente, despacho nacional.",
  },
];

export const MOCK_ORDER_STAGES: OrderStage[] = STAGE_TEXT.map((stage, index) => ({
  ...stage,
  order: index + 1,
  status: index < 2 ? "concluida" : index === 2 ? "atual" : "futura",
  dateLabel: index < 2 ? "concluída" : index === 2 ? "em andamento" : undefined,
}));
