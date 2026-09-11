import { getArrivalWindow, type ArrivalWindow } from "@/lib/business-days";
import { formatArrivalUntilLabel, getArrivalWindowLabels } from "@/lib/format";

export type ArrivalEstimateVariant = "inline" | "destaque" | "compacta";

/**
 * Selo de data (BRIEF.md, seção 07, mecanismo 1). Nunca escrever "45 dias
 * úteis" sem a data real ao lado — por isso este componente sempre resolve
 * uma janela concreta, mesmo quando nenhuma é passada via props.
 */
export function ArrivalEstimate({
  window,
  variant = "inline",
  className = "",
}: {
  window?: ArrivalWindow;
  variant?: ArrivalEstimateVariant;
  className?: string;
}) {
  const resolved = window ?? getArrivalWindow();

  if (variant === "compacta") {
    return (
      <span className={`font-mono text-[11px] text-marfim/60 ${className}`}>
        {formatArrivalUntilLabel(resolved)}
      </span>
    );
  }

  const { startLabel, endLabel } = getArrivalWindowLabels(resolved);

  if (variant === "destaque") {
    return (
      <div className={`border-l-2 border-ouro pl-4 ${className}`}>
        <p className="text-[19px] text-marfim">
          Chega entre <span className="font-mono">{startLabel}</span> e{" "}
          <span className="font-mono">{endLabel}</span>
        </p>
        <p className="mt-1 font-mono text-[12px] text-marfim/50">
          45 dias úteis a partir da confirmação
        </p>
      </div>
    );
  }

  return (
    <p className={`text-[14px] text-marfim/80 ${className}`}>
      Chega entre <span className="font-mono">{startLabel}</span> e{" "}
      <span className="font-mono">{endLabel}</span>
    </p>
  );
}
