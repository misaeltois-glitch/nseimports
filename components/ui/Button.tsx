"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "solido" | "contornado" | "fantasma" | "icone";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Borda dourada de 1px — reservada para a única CTA principal da tela (BRIEF.md, seção 09). */
  primary?: boolean;
  loading?: boolean;
  icon?: ReactNode;
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
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={`${base} ${variantClasses(variant, primary)} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
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
