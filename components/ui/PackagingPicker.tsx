"use client";

import { formatPriceBRL } from "@/lib/format";
import type { PackagingLevel, PackagingLevelId } from "@/types/product";

/** Seletor de embalagem (BRIEF.md, seções 08 e 09). */
export function PackagingPicker({
  levels,
  value,
  onChange,
}: {
  levels: PackagingLevel[];
  value: PackagingLevelId;
  onChange: (id: PackagingLevelId) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Nível de embalagem" className="grid gap-3 sm:grid-cols-3">
      {levels.map((level) => {
        const selected = value === level.id;
        const featured = level.id === "avancada";

        return (
          <label
            key={level.id}
            className={`relative flex cursor-pointer flex-col gap-2 rounded-card border p-4 transition-colors duration-[400ms] ease-[var(--ease-nse)] ${
              selected
                ? "border-ouro"
                : featured
                  ? "border-ouro/40 bg-ouro/5"
                  : "border-marfim/15 hover:border-marfim/30"
            }`}
          >
            <input
              type="radio"
              name="embalagem"
              value={level.id}
              checked={selected}
              onChange={() => onChange(level.id)}
              className="absolute right-4 top-4 h-4 w-4 accent-ouro"
            />
            <span className="kicker text-marfim/40">
              {level.label}
              {featured && <span className="ml-2 text-ouro-claro">mais escolhido</span>}
            </span>
            <span className="text-[16px] text-marfim">{level.name}</span>
            <span className="text-[12.5px] leading-relaxed text-marfim/70">
              {level.description}
            </span>
            <span className="font-mono text-[13px] text-marfim">
              {level.priceCents === "consulta"
                ? "Sob consulta"
                : formatPriceBRL(level.priceCents)}
            </span>

            {selected && level.id === "personalizada" && (
              <div className="mt-2 flex flex-col gap-2 border-t border-ouro/25 pt-3">
                <input
                  type="text"
                  placeholder="Nome a gravar"
                  className="h-10 rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro"
                />
                <p className="font-mono text-[11px] text-marfim/50">
                  Pode somar {level.extraBusinessDays} dias úteis ao prazo.
                </p>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}
