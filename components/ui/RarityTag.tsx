import { RARITY_LABEL, type Rarity } from "@/types/product";

export function RarityTag({
  rarity,
  className = "",
}: {
  rarity: Rarity;
  className?: string;
}) {
  const isUnique = rarity === "peca-unica";

  return (
    <span
      className={`kicker inline-flex items-center gap-1.5 rounded-control px-2 py-1 ${
        isUnique
          ? "border border-ouro text-ouro-claro"
          : "border border-marfim/20 text-marfim/70"
      } ${className}`}
    >
      {RARITY_LABEL[rarity]}
    </span>
  );
}
