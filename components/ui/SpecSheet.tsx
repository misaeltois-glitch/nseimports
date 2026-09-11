export interface SpecRow {
  label: string;
  value: string;
}

/** Ficha de procedência (BRIEF.md, seção 06 — Produto). */
export function SpecSheet({ rows }: { rows: SpecRow[] }) {
  return (
    <dl className="divide-y divide-ouro/25">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
          <dt className="kicker text-marfim/50">{row.label}</dt>
          <dd className="text-right font-mono text-[13px] text-marfim">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
