/**
 * "Enquanto não houver fotos reais, use placeholders em cinza-carvão com a
 * referência da peça em mono no centro. Placeholder honesto é melhor que
 * imagem de banco." — BRIEF.md, seção 04.
 */
export function ImagePlaceholder({
  label,
  referencia,
  ratio = "4/5",
  className = "",
}: {
  label?: string;
  referencia?: string;
  ratio?: "4/5" | "1/1";
  className?: string;
}) {
  return (
    <div
      className={`nse-noise relative flex items-center justify-center overflow-hidden bg-grafite ${
        ratio === "4/5" ? "aspect-[4/5]" : "aspect-square"
      } ${className}`}
    >
      <div className="relative z-10 flex flex-col items-center gap-1 px-4 text-center">
        {label && <span className="kicker text-marfim/40">{label}</span>}
        {referencia && (
          <span className="font-mono text-[11px] text-marfim/60">
            {referencia}
          </span>
        )}
      </div>
    </div>
  );
}
