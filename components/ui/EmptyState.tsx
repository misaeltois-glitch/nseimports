import type { ReactNode } from "react";

/**
 * Ex.: "Nenhuma peça com esses filtros. Entre na lista e avisamos quando
 * entrar uma." (BRIEF.md, seção 06, Arquivo — estado vazio).
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="text-[15px] text-marfim">{title}</p>
      {description && (
        <p className="max-w-sm text-[13px] text-marfim/60">{description}</p>
      )}
      {action}
    </div>
  );
}
