import type { PackagingLevel } from "@/types/product";

/** Os três níveis de embalagem (BRIEF.md, seção 08). */
export const PACKAGING_LEVELS: PackagingLevel[] = [
  {
    id: "padrao",
    label: "Nível 01",
    name: "Padrão",
    description:
      "Caixa original protegida, plástico bolha, lacre NSE. Incluso em todo pedido.",
    priceCents: 0,
    extraBusinessDays: 0,
  },
  {
    id: "avancada",
    label: "Nível 02",
    name: "Avançada",
    description:
      "Caixa externa rígida, espuma sob medida, papel seda, cartão de procedência assinado.",
    priceCents: 8000,
    extraBusinessDays: 0,
  },
  {
    id: "personalizada",
    label: "Nível 03",
    name: "Personalizada",
    description:
      "Caixa de colecionador, sílica, proteção UV, gravação do nome, certificado numerado.",
    priceCents: "consulta",
    extraBusinessDays: 3,
  },
];
