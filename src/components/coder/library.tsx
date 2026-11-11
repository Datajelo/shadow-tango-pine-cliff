import { useMemo, useState } from "react";
import { codeColumns } from "@/lib/coding/build";
import type { CodedRow, Project } from "@/lib/coding/types";

const PAGE = 20;

export function Library({ project, coded }: { project: Project; coded: CodedRow[] }) {
  const [query, setQuery] = useState("");
  const [onlyReview, setOnlyReview] = useState(false);
  const [page, setPage] = useState(0);
  const columns = useMemo(() => codeColumns(project.entries), [project.entries]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return coded.filter((row) => {
      if (onlyReview && !row.review) return false;
      if (!needle) return true;
      return (
        row.text.toLowerCase().includes(needle) ||
        row.id.toLowerCase().includes(needle) ||
        row.codeString.includes(needle)
      );
    });
  }, [coded, onlyReview, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);
  const reviewCount = coded.filter((row) => row.review).length;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="field max-w-xs"
          placeholder="Buscar respuesta o código"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
        />
        <button
          type="button"
          className={onlyReview ? "btn btn-primary btn-tiny" : "btn btn-outline btn-tiny"}
          aria-pressed={onlyReview}
          onClick={() => {
            setOnlyReview((value) => !value);
            setPage(0);
          }}
        >
          Por revisar ({reviewCount})
        </button>
        <p className="text-sm text-muted-foreground tabular-nums">
          {filtered.length} de {coded.length}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Códigos en el orden escrito, separados por punto y coma. Un 1 en la columna significa que esa respuesta lo
        mencionó.
      </p>
      <div className="panel p-0">
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sticky-col">Respuesta</th>
                <th>Códigos</th>
                {columns.map((column) => (
                  <th key={column.header} className="min-w-16">
                    <span className="block tabular-nums">{column.code}</span>
                    <span className="block max-w-24 truncate">{column.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((row, index) => {
                const present = new Set(row.codes);
                return (
                  <tr key={`${row.id}-${safePage}-${index}`}>
                    <td className={row.review ? "sticky-col border-l-2 border-warn" : "sticky-col"}>
                      <p className="text-xs text-muted-foreground tabular-nums">{row.id}</p>
                      <p>{row.text.trim() || "—"}</p>
                      {row.note ? <p className="mt-1 text-xs text-muted-foreground">{row.note}</p> : null}
                    </td>
                    <td className="tabular-nums font-medium">{row.codeString}</td>
                    {columns.map((column) => (
                      <td key={column.header} className="tabular-nums text-center">
                        {present.has(column.code) ? "1" : ""}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {!slice.length ? (
                <tr>
                  <td colSpan={2 + columns.length}>Nada coincide con el filtro.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-outline btn-tiny" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
          Anterior
        </button>
        <p className="text-sm tabular-nums text-muted-foreground">
          {safePage + 1} / {pages}
        </p>
        <button
          type="button"
          className="btn btn-outline btn-tiny"
          disabled={safePage >= pages - 1}
          onClick={() => setPage(safePage + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
