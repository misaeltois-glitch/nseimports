"use client";

import { useMemo, useState, type ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}

/** Base do admin: busca, ordenação, ações por linha (BRIEF.md, seções 06 e 09). */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  renderActions,
  searchPlaceholder = "Buscar",
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  renderActions?: (row: T) => ReactNode;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      columns.some((column) => String(column.render(row) ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return filtered;
    const withSort = [...filtered].sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      return av < bv ? -1 : av > bv ? 1 : 0;
    });
    return sort.direction === "desc" ? withSort.reverse() : withSort;
  }, [filtered, sort, columns]);

  function toggleSort(key: string) {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        className="h-10 w-full max-w-xs rounded-control border border-marfim/20 bg-transparent px-3 text-[13px] text-marfim placeholder:text-marfim/40 focus:border-ouro sm:w-64"
      />

      <div className="overflow-x-auto rounded-card border border-marfim/10">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-marfim/10 text-marfim/50">
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-4 py-3 font-normal">
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="kicker flex items-center gap-1 hover:text-marfim"
                    >
                      {column.header}
                      {sort?.key === column.key ? (sort.direction === "asc" ? "↑" : "↓") : null}
                    </button>
                  ) : (
                    <span className="kicker">{column.header}</span>
                  )}
                </th>
              ))}
              {renderActions && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} className="border-b border-marfim/5 last:border-0 hover:bg-marinho/40">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3 text-marfim/85">
                    {column.render(row)}
                  </td>
                ))}
                {renderActions && <td className="px-4 py-3 text-right">{renderActions(row)}</td>}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-marfim/40"
                >
                  Nenhum resultado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
