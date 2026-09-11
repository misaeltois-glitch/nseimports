export interface Stat {
  label: string;
  value: string;
}

/** Faixa de credibilidade da Home (BRIEF.md, seção 06, bloco 2). */
export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <div className="border-y border-ouro/60 bg-marinho">
      <div className="nse-container grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <div className="font-mono text-2xl text-marfim sm:text-3xl">
              {stat.value}
            </div>
            <div className="kicker mt-2 text-marfim/50">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
