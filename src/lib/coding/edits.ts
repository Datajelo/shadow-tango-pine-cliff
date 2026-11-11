import type { Entry, Mode, Variant } from "./types.ts";
import { mentionCount } from "./build.ts";
import { prettify } from "./text.ts";

function manual(variant: Variant): Variant {
  return { ...variant, how: "manual", review: false };
}

export function nextFreeCode(entries: Entry[]): number {
  const used = new Set(
    entries.filter((entry) => entry.kind === "item" && !entry.residual).map((entry) => entry.code),
  );
  for (let code = 1; code < 97; code++) {
    if (!used.has(code)) return code;
  }
  return 96;
}

function nextId(entries: Entry[]): string {
  let max = 0;
  for (const entry of entries) {
    const match = /^c(\d+)$/.exec(entry.id);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `c${max + 1}`;
}

function withoutVariant(entry: Entry, key: string): Entry {
  return { ...entry, variants: entry.variants.filter((variant) => variant.key !== key) };
}

function dropEmptyItems(entries: Entry[]): Entry[] {
  return entries.filter((entry) => entry.kind !== "item" || entry.variants.length > 0);
}

export function renameEntry(entries: Entry[], id: string, label: string): Entry[] {
  const next = label.trim();
  if (!next) return entries;
  return entries.map((entry) =>
    entry.id === id ? { ...entry, label: next, labelLocked: true } : entry,
  );
}

export function rejectSuggestion(entries: Entry[], id: string): Entry[] {
  return entries.map((entry) => (entry.id === id ? { ...entry, suggest: undefined } : entry));
}

export function mergeEntries(entries: Entry[], fromId: string, toId: string): Entry[] {
  if (fromId === toId) return entries;
  const from = entries.find((entry) => entry.id === fromId);
  const to = entries.find((entry) => entry.id === toId);
  if (!from || !to || from.kind !== "item") return entries;
  const incoming = from.variants.map(manual);
  const keys = new Set(to.variants.map((variant) => variant.key));
  const merged: Entry = {
    ...to,
    variants: [...to.variants, ...incoming.filter((variant) => !keys.has(variant.key))],
    suggest: undefined,
  };
  return dropEmptyItems(
    entries
      .filter((entry) => entry.id !== fromId)
      .map((entry) => {
        if (entry.id === toId) return merged;
        if (entry.suggest?.targetId === fromId) {
          return { ...entry, suggest: { ...entry.suggest, targetId: toId } };
        }
        return entry;
      }),
  );
}

export function acceptAllSuggestions(entries: Entry[]): Entry[] {
  let current = entries;
  const pairs = current
    .filter((entry) => entry.suggest && entry.kind === "item")
    .map((entry) => [entry.id, entry.suggest!.targetId] as const);
  for (const [fromId, toId] of pairs) {
    if (!current.some((entry) => entry.id === fromId)) continue;
    if (!current.some((entry) => entry.id === toId)) continue;
    current = mergeEntries(current, fromId, toId);
  }
  return current;
}

export function moveVariant(entries: Entry[], fromId: string, key: string, toId: string): Entry[] {
  if (fromId === toId) return entries;
  const from = entries.find((entry) => entry.id === fromId);
  const to = entries.find((entry) => entry.id === toId);
  const variant = from?.variants.find((item) => item.key === key);
  if (!from || !to || !variant) return entries;
  const placed = manual(variant);
  const next = entries.map((entry) => {
    if (entry.id === fromId) return withoutVariant(entry, key);
    if (entry.id === toId) {
      if (entry.variants.some((item) => item.key === key)) return entry;
      return { ...entry, variants: [...entry.variants, placed] };
    }
    return entry;
  });
  return dropEmptyItems(next);
}

export function extractVariant(entries: Entry[], fromId: string, key: string, mode: Mode): Entry[] {
  const from = entries.find((entry) => entry.id === fromId);
  const variant = from?.variants.find((item) => item.key === key);
  if (!from || !variant) return entries;
  if (from.variants.length === 1 && from.kind === "item" && !from.residual) return entries;
  const created: Entry = {
    id: nextId(entries),
    code: nextFreeCode(entries),
    label: prettify(variant.label, mode),
    kind: "item",
    residual: false,
    labelLocked: false,
    variants: [manual(variant)],
  };
  return dropEmptyItems([
    ...entries.map((entry) => (entry.id === fromId ? withoutVariant(entry, key) : entry)),
    created,
  ]);
}

export function promoteEntry(entries: Entry[], id: string): Entry[] {
  const entry = entries.find((item) => item.id === id);
  if (!entry || entry.kind !== "item" || !entry.residual) return entries;
  const code = nextFreeCode(entries);
  return entries.map((item) =>
    item.id === id ? { ...item, code, residual: false, suggest: undefined } : item,
  );
}

export function sendToOtros(entries: Entry[], id: string): Entry[] {
  return entries.map((entry) =>
    entry.id === id && entry.kind === "item"
      ? { ...entry, code: 98, residual: true, suggest: undefined }
      : entry,
  );
}

export function renumber(entries: Entry[]): Entry[] {
  const ranked = entries
    .filter((entry) => entry.kind === "item" && !entry.residual)
    .sort((a, b) => mentionCount(b) - mentionCount(a) || a.label.localeCompare(b.label, "es"));
  const codes = new Map(ranked.map((entry, index) => [entry.id, index + 1]));
  return entries.map((entry) => {
    const code = codes.get(entry.id);
    return code ? { ...entry, code } : entry;
  });
}
