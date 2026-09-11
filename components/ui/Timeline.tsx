import type { OrderStage } from "@/types/product";

export type TimelineOrientation = "horizontal" | "vertical";

/**
 * A linha do tempo dos 45 dias úteis (BRIEF.md, seção 07, mecanismo 2).
 * Horizontal na Home e em /processo; vertical no rastreio.
 */
export function Timeline({
  stages,
  orientation = "horizontal",
}: {
  stages: OrderStage[];
  orientation?: TimelineOrientation;
}) {
  if (orientation === "vertical") {
    return (
      <ol className="flex flex-col">
        {stages.map((stage, index) => (
          <li key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
            {index < stages.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[7px] top-4 h-full w-px ${
                  stage.status === "futura" ? "bg-marfim/15" : "bg-ouro/60"
                }`}
              />
            )}
            <span
              aria-hidden
              className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                stage.status === "futura"
                  ? "border-marfim/25 bg-onix"
                  : stage.status === "atual"
                    ? "border-ouro bg-ouro"
                    : "border-ouro bg-transparent"
              }`}
            />
            <div>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-[14px] ${
                    stage.status === "futura" ? "text-marfim/40" : "text-marfim"
                  }`}
                >
                  {stage.label}
                </p>
                {stage.dateLabel && (
                  <span className="font-mono text-[11px] text-marfim/50">
                    {stage.dateLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 max-w-md text-[13px] text-marfim/60">
                {stage.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="grid grid-cols-1 gap-6 sm:grid-cols-5">
      {stages.map((stage) => (
        <li key={stage.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={`h-2.5 w-2.5 rounded-full ${
                stage.status === "futura" ? "bg-marfim/20" : "bg-ouro"
              }`}
            />
            <span className="font-mono text-[11px] text-marfim/40">
              {String(stage.order).padStart(2, "0")}
            </span>
          </div>
          <p
            className={`text-[13px] ${
              stage.status === "futura" ? "text-marfim/40" : "text-marfim"
            }`}
          >
            {stage.label}
          </p>
          <p className="font-mono text-[11px] text-marfim/40">{stage.duration}</p>
        </li>
      ))}
    </ol>
  );
}
