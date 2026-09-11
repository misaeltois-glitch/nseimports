/**
 * Formatação em pt-BR para dados exibidos em fonte mono (BRIEF.md, regra 6):
 * preço, datas e código de pedido.
 */
import type { ArrivalWindow } from "./business-days";

export function formatPriceBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function formatDayMonth(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export interface ArrivalWindowLabels {
  startLabel: string;
  endLabel: string;
}

/**
 * Retorna os dois rótulos separados (não uma frase pronta) para que o
 * componente que os usa possa manter cada data em fonte mono (regra 6),
 * ex.: "12" / "26 de novembro" ou "28 de novembro" / "3 de dezembro" quando
 * a janela cruza o mês.
 */
export function getArrivalWindowLabels(window: ArrivalWindow): ArrivalWindowLabels {
  const sameMonth = window.start.getMonth() === window.end.getMonth();

  const startLabel = sameMonth
    ? new Intl.DateTimeFormat("pt-BR", { day: "numeric" }).format(
        window.start
      )
    : formatDayMonth(window.start);
  const endLabel = formatDayMonth(window.end);

  return { startLabel, endLabel };
}

export function formatOrderCode(id: string | number): string {
  return `#${String(id).toUpperCase()}`;
}

/** "em até 10x de R$ 18,90 sem juros" — usado no bloco de preço do Produto. */
export function formatInstallments(cents: number, times: number = 10): string {
  return `em até ${times}x de ${formatPriceBRL(cents / times)} sem juros`;
}

export function formatStockLabel(available: number, total: number): string {
  const plural = total !== 1;
  const unidade = plural ? "unidades" : "unidade";
  const disponivel = plural ? "disponíveis" : "disponível";
  return `${available} de ${total} ${unidade} ${disponivel}`;
}
