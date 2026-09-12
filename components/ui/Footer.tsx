import Link from "next/link";

const SITEMAP = [
  { label: "Arquivo", href: "/arquivo" },
  { label: "Drops", href: "/drops" },
  { label: "Processo", href: "/processo" },
  { label: "Embalagem", href: "/embalagem" },
  { label: "Rastrear", href: "/rastrear" },
  { label: "Conta", href: "/conta" },
  { label: "Sobre", href: "/sobre" },
  { label: "Dúvidas", href: "/duvidas" },
  { label: "Lista de espera", href: "/lista" },
];

const PAYMENT_BADGES = ["Pix", "Visa", "Mastercard", "Boleto"];

/** Rodapé com gradiente sutil para marinho (BRIEF.md, seções 06 e 09). */
export function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-b from-onix to-marinho">
      <div className="nse-container flex flex-col gap-10 py-16">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <p className="text-[15px] text-marfim">NSEImports</p>
            <p className="mt-2 max-w-xs text-[13px] text-marfim/50">
              Curadoria, logística internacional e garantia de estado.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-3 text-[13px] text-marfim/60 sm:grid-cols-4">
            {SITEMAP.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-marfim">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-marfim/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-marfim/40">
            © {new Date().getFullYear()} NSEImports
          </p>
          <div className="flex gap-2">
            {PAYMENT_BADGES.map((badge) => (
              <span
                key={badge}
                className="kicker rounded-control border border-marfim/15 px-2 py-1 text-marfim/50"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
