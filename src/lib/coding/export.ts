import { codeColumns, codeRows, columnHeader, mentionCount } from "./build.ts";
import type { CodedRow, Project } from "./types.ts";

function safeCell(value: string | number): string | number {
  if (typeof value === "number") return value;
  if (/^[=+\-@]/.test(value)) return `'${value}`;
  return value;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function codedOf(project: Project): CodedRow[] {
  return codeRows(project.rows, project.entries, project.settings);
}

function bibliotecaMatrix(project: Project, coded: CodedRow[]): (string | number)[][] {
  const codes = codeColumns(project.entries);
  const baseColumns = project.columns.length ? project.columns : ["respuesta"];
  const header = [...baseColumns, "codigos", "revisar", "nota", ...codes.map((column) => column.header)];
  const body = coded.map((row) => {
    const present = new Set(row.codes);
    return [
      ...baseColumns.map((column) => safeCell(row.cells[column] ?? (column === project.textColumn ? row.text : ""))),
      safeCell(row.codeString),
      row.review ? "Sí" : "No",
      safeCell(row.note),
      ...codes.map((column) => (present.has(column.code) ? 1 : "")),
    ];
  });
  return [header, ...body];
}

function diccionarioMatrix(project: Project, coded: CodedRow[]): (string | number)[][] {
  const responses = new Map<string, number>();
  for (const entry of project.entries) responses.set(entry.id, 0);
  const keyOwner = new Map<string, string>();
  for (const entry of project.entries) {
    for (const variant of entry.variants) keyOwner.set(variant.key, entry.id);
  }
  for (const row of coded) {
    const seen = new Set<string>();
    for (const mention of row.mentions) {
      const owner = keyOwner.get(mention.key);
      if (owner) seen.add(owner);
    }
    for (const id of seen) responses.set(id, (responses.get(id) ?? 0) + 1);
  }
  const total = project.rows.length || 1;
  const header = [
    "codigo",
    "etiqueta",
    "tipo",
    "menciones",
    "respuestas",
    "porcentaje_respuestas",
    "variantes",
    "notas",
  ];
  const propios = project.entries
    .filter((entry) => entry.kind === "item")
    .sort((a, b) => a.code - b.code || mentionCount(b) - mentionCount(a) || a.label.localeCompare(b.label, "es"));
  const specials = project.entries.filter((entry) => entry.kind !== "item");
  const rows = [...propios, ...specials].map((entry) => {
    const resp = responses.get(entry.id) ?? 0;
    const variants = entry.variants
      .map((variant) => `${variant.label} (${variant.count}${variant.review ? ", revisar" : ""})`)
      .join(" | ");
    const tipo = entry.residual ? "98 por baja frecuencia" : entry.kind === "item" ? "codigo propio" : "reservado";
    const notas = [
      entry.suggest ? entry.suggest.reason : "",
      entry.residual ? "Subir de frecuencia o asignar código propio si debe separarse de Otros" : "",
    ]
      .filter(Boolean)
      .join(". ");
    return [
      entry.code,
      entry.label,
      tipo,
      mentionCount(entry),
      resp,
      Math.round((resp / total) * 1000) / 10,
      variants,
      notas,
    ];
  });
  return [header, ...rows];
}

function mencionesMatrix(project: Project, coded: CodedRow[]): (string | number)[][] {
  const header = ["id", "respuesta", "mencion", "canonica", "codigo", "etiqueta", "metodo", "revisar"];
  const body: (string | number)[][] = [];
  for (const row of coded) {
    if (!row.mentions.length) {
      body.push([row.id, safeCell(row.text), "", "", "", "", "", row.empty ? "Sí" : "No"]);
      continue;
    }
    for (const mention of row.mentions) {
      body.push([
        row.id,
        safeCell(row.text),
        safeCell(mention.raw),
        safeCell(mention.label),
        mention.code,
        mention.label,
        mention.how,
        mention.review ? "Sí" : "No",
      ]);
    }
  }
  return [header, ...body];
}

function criteriosMatrix(project: Project): (string | number)[][] {
  const s = project.settings;
  return [
    ["parametro", "valor"],
    ["pregunta", project.question],
    ["modo", s.mode === "marca" ? "marcas" : "opiniones"],
    ["palabras_de_categoria", s.categoryWords],
    ["separar_por_y", s.splitAnd ? "si" : "no"],
    ["frecuencia_minima", s.minFrequency],
    ["vacios_como_99", s.emptyAs99 ? "si" : "no"],
    ["separador_de_codigos", ";"],
    ["orden_de_codigos", "orden de mencion, sin repetir"],
    ["97", "No sabe / No recuerda"],
    ["98", "Otros, explícito o bajo la frecuencia mínima"],
    ["99", "No aplica / no consume"],
    ["columna_abierta", project.textColumn],
    ["regla_mixta", "Si hay menciones sustantivas, 97 y 99 no se agregan"],
  ];
}

export async function downloadWorkbook(project: Project) {
  const coded = codedOf(project);
  const xlsx = (await import("xlsx")) as {
    utils: {
      aoa_to_sheet: (data: (string | number)[][]) => unknown;
      book_new: () => unknown;
      book_append_sheet: (book: unknown, sheet: unknown, name: string) => void;
    };
    write: (book: unknown, options: { bookType: "xlsx"; type: "array" }) => ArrayBuffer;
  };
  const book = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(bibliotecaMatrix(project, coded)), "Biblioteca");
  xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(diccionarioMatrix(project, coded)), "Diccionario");
  xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(mencionesMatrix(project, coded)), "Menciones");
  xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(criteriosMatrix(project)), "Criterios");
  const buffer = xlsx.write(book, { bookType: "xlsx", type: "array" });
  downloadBlob(
    "libreto-biblioteca.xlsx",
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
  );
}

function toCsv(matrix: (string | number)[][]): string {
  const lines = matrix.map((row) =>
    row
      .map((cell) => {
        const text = String(cell ?? "");
        return `"${text.replace(/"/g, '""')}"`;
      })
      .join(";"),
  );
  return `\uFEFF${lines.join("\r\n")}`;
}

export function downloadCsv(project: Project) {
  const coded = codedOf(project);
  downloadBlob(
    "libreto-biblioteca.csv",
    new Blob([toCsv(bibliotecaMatrix(project, coded))], { type: "text/csv;charset=utf-8" }),
  );
}

export function copyCodes(project: Project): string {
  const coded = codedOf(project);
  return ["id\tcodigos", ...coded.map((row) => `${row.id}\t${row.codeString}`)].join("\n");
}

export function dictionaryPreview(project: Project): string {
  return project.entries
    .filter((entry) => entry.kind === "item" && !entry.residual)
    .sort((a, b) => a.code - b.code)
    .map((entry) => `${entry.code} ${entry.label}`)
    .concat(["97 No sabe / No recuerda", "98 Otros", "99 No aplica"])
    .join("\n");
}

export { columnHeader };
