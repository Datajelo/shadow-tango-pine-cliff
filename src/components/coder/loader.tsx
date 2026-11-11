import { useState } from "react";
import { buildProject } from "@/lib/coding/build";
import { guessHeader, guessIdColumn, guessTextColumn, linesToRows, parseTable, rowsFromGrid } from "@/lib/coding/io";
import { sampleMayo, sampleOpinions } from "@/lib/coding/sample";
import type { Project, Settings } from "@/lib/coding/types";
import { SettingsFields } from "./settings";

export function Loader({
  question,
  onQuestion,
  settings,
  onSettings,
  onReady,
  onCancel,
}: {
  question: string;
  onQuestion: (value: string) => void;
  settings: Settings;
  onSettings: (settings: Settings) => void;
  onReady: (project: Project) => void;
  onCancel?: () => void;
}) {
  const [paste, setPaste] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<{
    filename: string;
    grid: string[][];
    header: boolean;
    textCol: number;
    idCol: number | null;
  } | null>(null);

  function adopt(project: Project) {
    setError("");
    onReady(project);
  }

  function codePaste() {
    const rows = linesToRows(paste.split(/\r?\n/));
    if (!rows.some((row) => row.text.trim())) {
      setError("Pegue al menos una respuesta. Una por línea; las marcas van separadas por coma.");
      return;
    }
    adopt(
      buildProject({
        question: question.trim() || "Pregunta abierta",
        settings,
        columns: ["respuesta"],
        textColumn: "respuesta",
        rows,
      }),
    );
  }

  async function onFile(file: File) {
    const text = await file.text();
    const grid = parseTable(text);
    if (!grid.length) {
      setError("El archivo está vacío.");
      return;
    }
    const width = Math.max(...grid.map((row) => row.length));
    if (width <= 1) {
      const lines = grid.map((row) => row[0] ?? "");
      const header = /^(respuesta|texto|verbatim|comentario)$/i.test(lines[0]?.trim() ?? "");
      adopt(
        buildProject({
          question: question.trim() || "Pregunta abierta",
          settings,
          columns: ["respuesta"],
          textColumn: "respuesta",
          rows: linesToRows(header ? lines.slice(1) : lines),
        }),
      );
      return;
    }
    const header = guessHeader(grid);
    const columns = header
      ? grid[0]!.map((cell, index) => cell.trim() || `columna_${index + 1}`)
      : grid[0]!.map((_, index) => `columna_${index + 1}`);
    setPending({
      filename: file.name,
      grid,
      header,
      textCol: guessTextColumn(columns),
      idCol: guessIdColumn(columns),
    });
    setError("");
  }

  function codeGrid() {
    if (!pending) return;
    const shaped = rowsFromGrid(pending.grid, pending.header, pending.textCol, pending.idCol);
    if (!shaped.rows.length) {
      setError("No quedaron filas para codificar.");
      return;
    }
    adopt(
      buildProject({
        question: question.trim() || "Pregunta abierta",
        settings,
        ...shaped,
      }),
    );
  }

  const previewColumns = pending
    ? pending.header
      ? pending.grid[0]!.map((cell, index) => cell.trim() || `columna_${index + 1}`)
      : pending.grid[0]!.map((_, index) => `columna_${index + 1}`)
    : [];

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-6">
      <header className="grid gap-3">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="size-10" />
          <p className="font-serif text-2xl italic">Libreto</p>
        </div>
        <h1 className="max-w-xl font-serif text-4xl font-medium tracking-tight">Del verbatim al diccionario</h1>
        <p className="max-w-2xl text-muted-foreground">
          Separe cada marca u opinión, una las que están mal escritas y devuelva la base con códigos. 97 es no
          sabe / no recuerda, 98 otros y 99 no aplica.
        </p>
      </header>

      <section className="panel grid gap-3">
        <h2 className="font-serif text-xl">Así queda la biblioteca</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Respuesta</th>
                <th>Códigos</th>
                <th>1_Kraft</th>
                <th>2_Mavesa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kraft</td>
                <td className="tabular-nums font-medium">1</td>
                <td className="tabular-nums">1</td>
                <td />
              </tr>
              <tr>
                <td>Mavesa, Kraft.</td>
                <td className="tabular-nums font-medium">2;1</td>
                <td className="tabular-nums">1</td>
                <td className="tabular-nums">1</td>
              </tr>
              <tr>
                <td>no sé</td>
                <td className="tabular-nums font-medium">97</td>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Los números van en el orden en que la persona escribió. Kraf, Craft o Krfat entran al código de Kraft.
        </p>
      </section>

      <section className="panel grid gap-4">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Pregunta</span>
          <input className="field" value={question} onChange={(event) => onQuestion(event.target.value)} />
        </label>
        <SettingsFields settings={settings} onChange={onSettings} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel grid gap-3">
          <h2 className="font-medium">Pegar respuestas</h2>
          <p className="text-sm text-muted-foreground">Una respuesta por línea. Dentro de la línea, coma entre marcas.</p>
          <textarea
            className="field font-sans"
            value={paste}
            placeholder={"Kraft\nMavesa, Kraft\nno sé"}
            onChange={(event) => setPaste(event.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={codePaste}>
            Codificar pegado
          </button>
        </div>
        <div
          className="panel grid content-start gap-3"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) void onFile(file);
          }}
        >
          <h2 className="font-medium">Subir la base</h2>
          <p className="text-sm text-muted-foreground">
            CSV o texto separado por coma, punto y coma o tabulador. Se conservan las demás columnas.
          </p>
          <label className="btn btn-outline">
            Elegir archivo
            <input
              className="sr-only"
              type="file"
              accept=".csv,.txt,.tsv,text/csv,text/plain"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onFile(file);
                event.target.value = "";
              }}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary btn-tiny" onClick={() => adopt(sampleMayo())}>
              Ejemplo de marcas
            </button>
            <button type="button" className="btn btn-secondary btn-tiny" onClick={() => adopt(sampleOpinions())}>
              Ejemplo de opiniones
            </button>
          </div>
        </div>
      </section>

      {pending ? (
        <section className="panel grid gap-4">
          <h2 className="font-medium">Qué columna es la abierta</h2>
          <p className="text-sm text-muted-foreground">
            {pending.filename} · {pending.grid.length - (pending.header ? 1 : 0)} filas
          </p>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-4"
              checked={pending.header}
              onChange={(event) => setPending({ ...pending, header: event.target.checked })}
            />
            La primera fila es encabezado
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Columna de respuestas</span>
              <select
                className="field"
                value={pending.textCol}
                onChange={(event) => setPending({ ...pending, textCol: Number(event.target.value) })}
              >
                {previewColumns.map((column, index) => (
                  <option key={`${column}-${index}`} value={index}>
                    {column}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Columna de ID</span>
              <select
                className="field"
                value={pending.idCol ?? ""}
                onChange={(event) =>
                  setPending({
                    ...pending,
                    idCol: event.target.value === "" ? null : Number(event.target.value),
                  })
                }
              >
                <option value="">Consecutivo R1, R2…</option>
                {previewColumns.map((column, index) => (
                  <option key={`${column}-id-${index}`} value={index}>
                    {column}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" className="btn btn-primary w-fit" onClick={codeGrid}>
            Codificar base
          </button>
        </section>
      ) : null}

      {error ? <p className="text-sm text-warn">{error}</p> : null}
      {onCancel ? (
        <button type="button" className="btn btn-ghost w-fit" onClick={onCancel}>
          Volver a la codificación
        </button>
      ) : null}
    </div>
  );
}
