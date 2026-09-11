"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getArrivalWindow } from "@/lib/business-days";
import { useCartHydrated, useCartStore } from "@/lib/cart-store";
import { formatArrivalUntilLabel } from "@/lib/format";
import { PACKAGING_LEVELS } from "@/content/mock-packaging";
import { CartDrawer, type CartLine } from "./CartDrawer";

const NAV_LINKS = [
  { label: "Arquivo", href: "/arquivo" },
  { label: "Drops", href: "/drops" },
  { label: "Sobre", href: "/sobre" },
  { label: "Dúvidas", href: "/duvidas" },
];

/** Header transparente no topo, sólido ao rolar (BRIEF.md, seções 06 e 09). */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItems = hydrated ? items : [];

  const lines: CartLine[] = cartItems.map((item) => {
    const level = PACKAGING_LEVELS.find((l) => l.id === item.packagingId);
    const itemArrivalWindow = getArrivalWindow(new Date(), {
      minBusinessDays: item.diasRestantes,
      maxBusinessDays: item.diasRestantes + 7,
    });
    return {
      id: item.id,
      name: `${item.brand} · ${item.name}`,
      sizeLabel: item.sizeLabel ?? "Único",
      packagingLabel: level?.name ?? "Padrão",
      priceCents: item.priceCents + (typeof level?.priceCents === "number" ? level.priceCents : 0),
      arrivalLabel: formatArrivalUntilLabel(itemArrivalWindow),
    };
  });

  const subtotalCents = lines.reduce((sum, line) => sum + line.priceCents, 0);

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
          onClick={() => setCartOpen(true)}
          className="flex items-center gap-2 text-[13px] text-marfim/80 hover:text-marfim"
        >
          Sacola
          <span className="font-mono text-[11px] text-marfim/50">({cartItems.length})</span>
        </button>
      </div>

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        lines={lines}
        subtotalCents={subtotalCents}
      />
    </header>
  );
}
