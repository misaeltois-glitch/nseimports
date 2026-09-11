/**
 * Progresso do pedido para o rastreio público (BRIEF.md, seção 06 —
 * Rastreio; seção 07 — os 45 dias úteis). Sem backend real ainda: a etapa
 * atual é derivada dos dias úteis decorridos desde a criação do pedido,
 * usando a duração representativa de cada etapa (seção 07).
 */
import { addBusinessDays, isBusinessDay } from "./business-days";
import { formatDayMonth } from "./format";
import type { Order } from "./orders";
import type { OrderStage } from "@/types/product";

const STAGE_DEFS = [
  {
    id: "aquisicao",
    label: "Aquisição na origem",
    duration: "5–10 dias úteis",
    days: 8,
    log: "Compra confirmada na filial de origem",
  },
  {
    id: "conferencia",
    label: "Conferência internacional",
    duration: "3–5 dias úteis",
    days: 4,
    log: "Conferência aprovada em Miami",
  },
  {
    id: "transito",
    label: "Trânsito internacional",
    duration: "10–18 dias úteis",
    days: 14,
    log: "Em trânsito para o Brasil",
  },
  {
    id: "alfandega",
    label: "Liberação alfandegária",
    duration: "5–15 dias úteis",
    days: 10,
    log: "Liberado pela alfândega em Viracopos",
  },
  {
    id: "entrega",
    label: "Embalagem e entrega",
    duration: "2–5 dias úteis",
    days: 4,
    log: "Embalagem despachada para entrega",
  },
] as const;

export interface TrackingLogEntry {
  dateLabel: string;
  text: string;
}

export interface TrackingInfo {
  stages: OrderStage[];
  log: TrackingLogEntry[];
  elapsedBusinessDays: number;
  totalBusinessDays: number;
  remainingBusinessDays: number;
  progressPercent: number;
}

function countElapsedBusinessDays(from: Date, to: Date): number {
  let count = 0;
  const cursor = new Date(from);
  while (cursor.getTime() < to.getTime()) {
    cursor.setDate(cursor.getDate() + 1);
    if (isBusinessDay(cursor)) count += 1;
  }
  return count;
}

export function buildTrackingInfo(order: Order): TrackingInfo {
  const createdAt = new Date(order.createdAt);
  const elapsed = countElapsedBusinessDays(createdAt, new Date());
  const totalDays = STAGE_DEFS.reduce((sum, def) => sum + def.days, 0);
  const remaining = Math.max(0, totalDays - elapsed);
  const progressPercent = Math.min(100, Math.round((elapsed / totalDays) * 100));

  let cumulative = 0;
  const stages: OrderStage[] = STAGE_DEFS.map((def, index) => {
    const startDay = cumulative;
    cumulative += def.days;
    const endDay = cumulative;
    const status = elapsed >= endDay ? "concluida" : elapsed >= startDay ? "atual" : "futura";
    const dateLabel =
      status === "futura" ? undefined : formatDayMonth(addBusinessDays(createdAt, endDay));

    return {
      id: def.id,
      order: index + 1,
      label: def.label,
      duration: def.duration,
      description: def.log,
      status,
      dateLabel,
    };
  });

  const log: TrackingLogEntry[] = stages
    .filter((stage) => stage.status !== "futura")
    .map((stage, index) => ({
      dateLabel: stage.dateLabel ?? "",
      text: STAGE_DEFS[index].log,
    }));

  return {
    stages,
    log,
    elapsedBusinessDays: elapsed,
    totalBusinessDays: totalDays,
    remainingBusinessDays: remaining,
    progressPercent,
  };
}
