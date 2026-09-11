"use client";

import Link from "next/link";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

export type ButtonVariant = "solido" | "contornado" | "fantasma" | "icone";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Borda dourada de 1px — reservada para a única CTA principal da tela (BRIEF.md, seção 09). */
  primary?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  /**
   * Quando presente, renderiza como link de navegação em vez de <button>.
   * Nunca envolver Button num <Link> por fora — <a><button></button></a> é
   * aninhamento de elementos interativos inválido e quebra o hit-testing.
   */
  href?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-control text-[13px] font-medium tracking-wide transition-colors duration-[400ms] ease-[var(--ease-nse)] disabled:cursor-not-allowed disabled:opacity-40";

function variantClasses(variant: ButtonVariant, primary: boolean): string {
  switch (variant) {
    case "solido":
      return "h-11 px-6 bg-marfim text-onix hover:bg-white active:bg-marfim/90";
    case "contornado":
      return `h-11 px-6 bg-transparent text-marfim border active:bg-marfim/5 ${
        primary
          ? "border-ouro hover:border-ouro-claro"
          : "border-marfim/30 hover:border-marfim/60"
      }`;
    case "fantasma":
      return "h-11 px-4 bg-transparent text-marfim hover:bg-marfim/5 active:bg-marfim/10";
    case "icone":
      return `h-11 w-11 bg-transparent text-marfim hover:bg-marfim/5 active:bg-marfim/10 ${
        primary ? "border border-ouro" : ""
      }`;
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "contornado",
      primary = false,
      loading = false,
      icon,
      href,
      target,
      rel,
      onClick,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) {
    const classes = `${base} ${variantClasses(variant, primary)} ${className}`;

    if (href) {
      if (disabled || loading) {
        return (
          <span className={`${classes} cursor-not-allowed opacity-40`} aria-disabled="true">
            {icon}
            {children}
          </span>
        );
      }
      return (
        <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
          {icon}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
            aria-hidden
          />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);
