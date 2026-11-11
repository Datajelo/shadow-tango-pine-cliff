export type Mode = "marca" | "opinion";

export type Settings = {
  mode: Mode;
  /** Palabras de la categoría que no distinguen marca: "mayonesa, mayo". */
  categoryWords: string;
  /** Además de coma, separar por "y" / "e". */
  splitAnd: boolean;
  /** Mínimo de menciones para un código propio. El resto va a 98. */
  minFrequency: number;
  /** Respuestas en blanco se codifican 99. */
  emptyAs99: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  mode: "marca",
  categoryWords: "",
  splitAnd: false,
  minFrequency: 2,
  emptyAs99: false,
};

export type How =
  | "exacto"
  | "fonetica"
  | "typo"
  | "truncado"
  | "extension"
  | "opinion"
  | "manual";

export type Variant = {
  key: string;
  /** Forma más repetida de esta grafía. */
  label: string;
  count: number;
  review: boolean;
  how: How;
  surfaces: { text: string; count: number }[];
};

export type Entry = {
  id: string;
  code: number;
  label: string;
  kind: "item" | "ns" | "otros" | "na";
  /** Agrupado dentro de 98 por baja frecuencia, no es la cubeta de «otros» explícito. */
  residual: boolean;
  labelLocked: boolean;
  variants: Variant[];
  suggest?: { targetId: string; reason: string };
};

export type SourceRow = {
  id: string;
  text: string;
  cells: Record<string, string>;
};

export type Project = {
  question: string;
  settings: Settings;
  columns: string[];
  textColumn: string;
  rows: SourceRow[];
  entries: Entry[];
  edited: boolean;
};

export type CodedMention = {
  raw: string;
  key: string;
  code: number;
  label: string;
  review: boolean;
  how: How | string;
  entryId: string;
};

export type CodedRow = {
  id: string;
  text: string;
  cells: Record<string, string>;
  mentions: CodedMention[];
  codes: number[];
  codeString: string;
  review: boolean;
  empty: boolean;
  note: string;
};

export type DraftMention = {
  raw: string;
  key: string;
  special: 97 | 98 | 99 | null;
  ambiguous: boolean;
};
