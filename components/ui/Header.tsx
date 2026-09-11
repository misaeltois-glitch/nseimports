"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Arquivo", href: "/arquivo" },
  { label: "Drops", href: "/drops" },
  { label: "Sobre", href: "/sobre" },
  { label: "Dúvidas", href: "/duvidas" },
];

/** Header transparente no topo, sólido ao rolar (BRIEF.md, seções 06 e 09). */
export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-[400ms] ease-[var(--ease-nse)] ${
        scrolled ? "border-b border-marfim/10 bg-onix/95" : "bg-transparent"
      }`}
    >
      <div className="nse-container flex h-16 items-center justify-between">
        <Link href="/" className="text-[15px] tracking-tight text-marfim">
          NSEImports
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] text-marfim/70 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-marfim">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Abrir sacola"
          className="flex items-center gap-2 text-[13px] text-marfim/80 hover:text-marfim"
        >
          Sacola
          <span className="font-mono text-[11px] text-marfim/50">({cartCount})</span>
        </button>
      </div>
    </header>
  );
}
