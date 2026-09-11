"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "./Button";

export interface FilterGroup {
  id: string;
  label: string;
  options: { id: string; label: string }[];
}

export interface FilterOptionRef {
  groupId: string;
  optionId: string;
  label: string;
}

function FilterList({
  groups,
  activeIds,
  onToggle,
}: {
  groups: FilterGroup[];
  activeIds: string[];
  onToggle: (groupId: string, option: { id: string; label: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <fieldset key={group.id} className="flex flex-col gap-2">
          <legend className="kicker mb-1 text-marfim/50">{group.label}</legend>
          {group.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-[13px] text-marfim/80">
              <input
                type="checkbox"
                checked={activeIds.includes(option.id)}
                onChange={() => onToggle(group.id, option)}
                className="h-4 w-4 accent-ouro"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );
}

/** Filtros do Arquivo (BRIEF.md, seções 06 e 09): sidebar no desktop, gaveta no mobile. */
export function FilterPanel({
  groups,
  activeOptions,
  onToggle,
  onClear,
}: {
  groups: FilterGroup[];
  activeOptions: FilterOptionRef[];
  onToggle: (groupId: string, optionId: string, label: string) => void;
  onClear: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeIds = activeOptions.map((option) => option.optionId);

  function handleToggle(groupId: string, option: { id: string; label: string }) {
    onToggle(groupId, option.id, option.label);
  }

  return (
    <div>
      {activeOptions.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeOptions.map((option) => (
            <button
              key={option.optionId}
              type="button"
              onClick={() => onToggle(option.groupId, option.optionId, option.label)}
              className="kicker flex items-center gap-1.5 rounded-control border border-marfim/20 px-2 py-1 text-marfim/70 hover:border-marfim/40"
            >
              {option.label}
              <span aria-hidden>×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="kicker text-marfim/40 hover:text-marfim/70"
          >
            Limpar
          </button>
        </div>
      )}

      <div className="hidden sm:block">
        <FilterList groups={groups} activeIds={activeIds} onToggle={handleToggle} />
      </div>

      <div className="sm:hidden">
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <Button variant="contornado">Filtrar</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-onix/80" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-card border-t border-marfim/10 bg-onix p-6">
              <Dialog.Title className="mb-4 text-[15px] text-marfim">Filtros</Dialog.Title>
              <FilterList groups={groups} activeIds={activeIds} onToggle={handleToggle} />
              <Dialog.Close asChild>
                <Button variant="solido" className="mt-6 w-full">
                  Ver resultados
                </Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
