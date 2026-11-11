import type { SourceRow } from "./types.ts";

export function detectDelimiter(text: string): "," | ";" | "\t" {
  const line = text.split(/\r?\n/, 1)[0] ?? "";
  const commas = (line.match(/,/g) || []).length;
  const semis = (line.match(/;/g) || []).length;
  const tabs = (line.match(/\t/g) || []).length;
  if (tabs >= commas && tabs >= semis && tabs > 0) return "\t";
  if (semis > commas) return ";";
  return ",";
}

export function parseTable(text: string): string[][] {
  const cleaned = text.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(cleaned);
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]!;
    if (quoted) {
      if (char === '"') {
        if (cleaned[i + 1] === '"') {
          current += '"';
          i++;
        } else quoted = false;
      } else current += char;
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === delimiter) {
      row.push(current);
      current = "";
      continue;
    }
    if (char === "\n") {
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }
    if (char !== "\r") current += char;
  }
  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }
  while (rows.length > 0 && rows[rows.length - 1]!.every((cell) => cell.trim() === "")) rows.pop();
  return rows;
}

export function guessHeader(grid: string[][]): boolean {
  if (grid.length < 2) return false;
  const head = grid[0] ?? [];
  if (head.length < 2) return false;
  const joined = head.join(" ").toLowerCase();
  if (/(respuesta|marca|opinion|opini[oó]n|abierta|texto|comentario|pregunta|verbatim|id\b|folio|entrevista)/.test(joined)) {
    return true;
  }
  return head.every((cell) => cell.trim().length > 0 && cell.trim().length <= 32);
}

export function linesToRows(lines: string[]): SourceRow[] {
  const copy = [...lines];
  while (copy.length > 0 && copy[copy.length - 1]!.trim() === "") copy.pop();
  return copy.map((text, index) => ({
    id: `R${index + 1}`,
    text,
    cells: { respuesta: text },
  }));
}

function uniqueNames(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const base = name.trim() || "columna";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });
}

export function rowsFromGrid(
  grid: string[][],
  header: boolean,
  textCol: number,
  idCol: number | null,
): { columns: string[]; textColumn: string; rows: SourceRow[] } {
  if (!grid.length) return { columns: ["respuesta"], textColumn: "respuesta", rows: [] };
  const width = Math.max(...grid.map((row) => row.length));
  const head = header
    ? Array.from({ length: width }, (_, index) => grid[0]?.[index]?.trim() || `columna_${index + 1}`)
    : Array.from({ length: width }, (_, index) => `columna_${index + 1}`);
  const columns = uniqueNames(head);
  const body = header ? grid.slice(1) : grid;
  const textColumn = columns[Math.min(textCol, columns.length - 1)] ?? columns[0]!;
  const rows = body.map((cells, index) => {
    const record: Record<string, string> = {};
    columns.forEach((column, columnIndex) => {
      record[column] = cells[columnIndex] ?? "";
    });
    const idValue = idCol != null ? (record[columns[idCol] ?? ""] ?? "").trim() : "";
    return {
      id: idValue || `R${index + 1}`,
      text: record[textColumn] ?? "",
      cells: record,
    };
  });
  return { columns, textColumn, rows };
}

export function guessTextColumn(columns: string[]): number {
  const hit = columns.findIndex((column) =>
    /(respuesta|marca|opinion|opini[oó]n|abierta|texto|comentario|verbatim|pregunta)/i.test(column),
  );
  return hit >= 0 ? hit : columns.length === 1 ? 0 : Math.min(1, columns.length - 1);
}

export function guessIdColumn(columns: string[]): number | null {
  const hit = columns.findIndex((column) => /^(id|folio|entrevista|resp|caso|codigo|código)$/i.test(column.trim()));
  return hit >= 0 ? hit : null;
}
