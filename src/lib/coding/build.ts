import type {
  CodedMention,
  CodedRow,
  Entry,
  How,
  Project,
  Settings,
  SourceRow,
  Variant,
} from "./types.ts";
import {
  bestSurface,
  compareMention,
  explodeMentions,
  phoneticKey,
  prettify,
  surfacesToList,
} from "./text.ts";

type Bucket = {
  norm: string;
  count: number;
  surfaces: Map<string, number>;
};

type Working = {
  id: string;
  leader: string;
  compact: string;
  phone: string;
  members: { norm: string; how: How; review: boolean }[];
  suggest?: { targetId: string; reason: string };
};

function variantFrom(
  norm: string,
  bucket: Bucket,
  how: How,
  review: boolean,
): Variant {
  const surfaces = surfacesToList(bucket.surfaces);
  return {
    key: norm,
    label: bestSurface(surfaces) || norm,
    count: bucket.count,
    review,
    how,
    surfaces,
  };
}

function labelFromVariants(variants: Variant[], mode: Settings["mode"]): string {
  const surfaces = variants.flatMap((variant) => variant.surfaces);
  const surface = bestSurface(surfaces) || variants[0]?.label || "";
  return prettify(surface, mode);
}

export function mentionCount(entry: Entry): number {
  return entry.variants.reduce((sum, variant) => sum + variant.count, 0);
}

export function buildEntries(rows: SourceRow[], settings: Settings): Entry[] {
  const specials = new Map<string, Bucket>();
  const substantive = new Map<string, Bucket>();

  const bump = (map: Map<string, Bucket>, key: string, raw: string) => {
    const bucket = map.get(key) ?? { norm: key, count: 0, surfaces: new Map() };
    bucket.count += 1;
    bucket.surfaces.set(raw, (bucket.surfaces.get(raw) ?? 0) + 1);
    map.set(key, bucket);
  };

  for (const row of rows) {
    for (const mention of explodeMentions(row.text, settings)) {
      if (mention.special) bump(specials, mention.key, mention.raw);
      else bump(substantive, mention.key, mention.raw);
    }
  }

  const buckets = [...substantive.values()].sort(
    (a, b) => b.count - a.count || a.norm.localeCompare(b.norm, "es"),
  );

  const clusters: Working[] = [];
  let seq = 1;
  for (const bucket of buckets) {
    const compact = bucket.norm.replace(/\s+/g, "");
    const phone = phoneticKey(compact);
    let joined: Working | null = null;
    let joinedHow: How = "exacto";
    let suggestion: { targetId: string; reason: string } | undefined;
    for (const cluster of clusters) {
      if (settings.mode === "marca") {
        if (cluster.phone[0] !== phone[0] && cluster.compact[0] !== compact[0]) continue;
        if (Math.abs(cluster.compact.length - compact.length) > 3) continue;
      }
      const match = compareMention(bucket.norm, cluster.leader, settings.mode);
      if (match.level === "auto") {
        joined = cluster;
        joinedHow = match.how;
        break;
      }
      if (match.level === "suggest" && !suggestion) {
        suggestion = { targetId: cluster.id, reason: match.reason };
      }
    }
    if (joined) {
      joined.members.push({ norm: bucket.norm, how: joinedHow, review: true });
    } else {
      clusters.push({
        id: `c${seq++}`,
        leader: bucket.norm,
        compact,
        phone,
        members: [{ norm: bucket.norm, how: "exacto", review: false }],
        suggest: suggestion,
      });
    }
  }

  const ranked = clusters
    .map((cluster) => ({
      cluster,
      count: cluster.members.reduce((sum, member) => sum + (substantive.get(member.norm)?.count ?? 0), 0),
    }))
    .sort((a, b) => b.count - a.count || a.cluster.leader.localeCompare(b.cluster.leader, "es"));

  let nextCode = 1;
  const items: Entry[] = ranked.map(({ cluster, count }) => {
    const variants = cluster.members.map((member) => {
      const bucket = substantive.get(member.norm)!;
      return variantFrom(member.norm, bucket, member.how, member.review);
    });
    const ownsCode = count >= settings.minFrequency && nextCode < 97;
    const code = ownsCode ? nextCode++ : 98;
    return {
      id: cluster.id,
      code,
      label: labelFromVariants(variants, settings.mode),
      kind: "item",
      residual: !ownsCode,
      labelLocked: false,
      variants,
      suggest: cluster.suggest,
    };
  });

  const specialEntry = (
    id: string,
    code: 97 | 98 | 99,
    label: string,
    kind: Entry["kind"],
    keys: string[],
  ): Entry => ({
    id,
    code,
    label,
    kind,
    residual: false,
    labelLocked: true,
    variants: keys.map((key) => {
      const bucket = specials.get(key)!;
      const ambiguous = bucket.norm === key && isAmbiguousKey(key);
      return variantFrom(key, bucket, "exacto", ambiguous);
    }),
  });

  const keysOf = (code: 97 | 98 | 99) =>
    [...specials.keys()].filter((key) => specialCode(key) === code).sort((a, b) => a.localeCompare(b, "es"));

  return [
    ...items,
    specialEntry("sp97", 97, "No sabe / No recuerda", "ns", keysOf(97)),
    specialEntry("sp98", 98, "Otros", "otros", keysOf(98)),
    specialEntry("sp99", 99, "No aplica", "na", keysOf(99)),
  ];
}

function isAmbiguousKey(key: string): boolean {
  return (
    key === "ninguno" ||
    key === "ninguna" ||
    key === "nada" ||
    key === "ninguna marca" ||
    key === "ningun" ||
    key === "no contesta" ||
    key === "no responde" ||
    key === "no respondo" ||
    key === "nc"
  );
}

function specialCode(key: string): 97 | 98 | 99 | null {
  const entryNs = new Set([
    "no se",
    "nose",
    "no lo se",
    "nolose",
    "no sabe",
    "no saben",
    "no recuerdo",
    "no recuerda",
    "no me acuerdo",
    "no lo recuerdo",
    "no se acuerda",
    "ni idea",
    "no tengo idea",
    "no se decir",
    "no sabria decir",
    "no sabria",
    "ns nr",
    "nsnr",
    "ns",
    "nr",
    "n s",
    "n r",
    "no se no recuerda",
    "no se o no recuerda",
    "no recuerda o no se",
    "no se ni recuerda",
    "no se ni me acuerdo",
    "no recuerdo no se",
    "no se nada",
    "no me acuerdo de nada",
    "no me acuerdo de ninguna",
    "no conozco",
    "no conozco ninguna",
    "no conozco ninguna marca",
    "no conozco marcas",
    "no me se",
    "no c",
  ]);
  if (entryNs.has(key)) return 97;
  if (
    key === "otro" ||
    key === "otros" ||
    key === "otra" ||
    key === "otras" ||
    key === "otra marca" ||
    key === "otras marcas" ||
    key === "otro producto" ||
    key === "otros productos" ||
    key === "otra opinion" ||
    key === "otras opiniones" ||
    key === "otros mas" ||
    key === "y otros" ||
    key === "y otras" ||
    key === "y otra" ||
    key === "etc" ||
    key === "etcetera"
  ) {
    return 98;
  }
  return 99;
}

export function codeRows(rows: SourceRow[], entries: Entry[], settings: Settings): CodedRow[] {
  const lookup = new Map<string, CodedMention>();
  for (const entry of entries) {
    for (const variant of entry.variants) {
      lookup.set(variant.key, {
        raw: variant.label,
        key: variant.key,
        code: entry.code,
        label: entry.label,
        review: variant.review || Boolean(entry.suggest),
        how: variant.how,
        entryId: entry.id,
      });
    }
  }

  return rows.map((row) => {
    const text = row.text ?? "";
    const trimmed = text.trim();
    if (!trimmed) {
      if (settings.emptyAs99) {
        return {
          id: row.id,
          text,
          cells: row.cells,
          mentions: [
            {
              raw: "(vacío)",
              key: "",
              code: 99,
              label: "No aplica",
              review: false,
              how: "exacto",
              entryId: "sp99",
            },
          ],
          codes: [99],
          codeString: "99",
          review: false,
          empty: true,
          note: "Respuesta vacía codificada como 99",
        };
      }
      return {
        id: row.id,
        text,
        cells: row.cells,
        mentions: [],
        codes: [],
        codeString: "",
        review: true,
        empty: true,
        note: "Respuesta vacía, sin código",
      };
    }

    const drafts = explodeMentions(text, settings);
    const mentions: CodedMention[] = drafts.map((draft) => {
      if (draft.special) {
        const entryId = draft.special === 97 ? "sp97" : draft.special === 98 ? "sp98" : "sp99";
        const known = lookup.get(draft.key);
        const label = draft.special === 97 ? "No sabe / No recuerda" : draft.special === 98 ? "Otros" : "No aplica";
        return {
          raw: draft.raw,
          key: draft.key,
          code: draft.special,
          label: known?.label || label,
          review: draft.ambiguous || Boolean(known?.review),
          how: "exacto",
          entryId,
        };
      }
      const known = lookup.get(draft.key);
      if (!known) {
        return {
          raw: draft.raw,
          key: draft.key,
          code: 98,
          label: "Otros",
          review: true,
          how: "manual",
          entryId: "sp98",
        };
      }
      return { ...known, raw: draft.raw };
    });

    const substantive = mentions.filter((mention) => mention.code < 97);
    const codes: number[] = [];
    const notes: string[] = [];
    if (substantive.length === 0) {
      for (const mention of mentions) {
        if (!codes.includes(mention.code)) codes.push(mention.code);
      }
    } else {
      let dropped97 = false;
      let dropped99 = false;
      for (const mention of mentions) {
        if (mention.code === 97) {
          dropped97 = true;
          continue;
        }
        if (mention.code === 99) {
          dropped99 = true;
          continue;
        }
        if (!codes.includes(mention.code)) codes.push(mention.code);
      }
      if (dropped97) notes.push("Se omitió 97 porque también nombró marcas u opiniones");
      if (dropped99) notes.push("Se omitió 99 porque también nombró marcas u opiniones");
    }

    return {
      id: row.id,
      text,
      cells: row.cells,
      mentions,
      codes,
      codeString: codes.join(";"),
      review: mentions.some((mention) => mention.review) || codes.length === 0,
      empty: false,
      note: notes.join(". "),
    };
  });
}

export function buildProject(input: {
  question: string;
  settings: Settings;
  columns: string[];
  textColumn: string;
  rows: SourceRow[];
}): Project {
  return {
    question: input.question,
    settings: input.settings,
    columns: input.columns,
    textColumn: input.textColumn,
    rows: input.rows,
    entries: buildEntries(input.rows, input.settings),
    edited: false,
  };
}

export function codeColumns(entries: Entry[]): { code: number; label: string; header: string }[] {
  const propios = entries
    .filter((entry) => entry.kind === "item" && !entry.residual)
    .sort((a, b) => a.code - b.code || a.label.localeCompare(b.label, "es"));
  const specials = [97, 98, 99].map((code) => {
    const entry = entries.find((item) => item.kind !== "item" && item.code === code);
    return { code, label: entry?.label ?? String(code) };
  });
  return [...propios.map((entry) => ({ code: entry.code, label: entry.label })), ...specials].map((column) => ({
    ...column,
    header: columnHeader(column.code, column.label),
  }));
}

export function columnHeader(code: number, label: string): string {
  const clean = label
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 40);
  return `${code}_${clean || "codigo"}`;
}

export function settingsSignature(settings: Settings): string {
  return JSON.stringify([
    settings.mode,
    settings.categoryWords.trim(),
    settings.splitAnd,
    settings.minFrequency,
    settings.emptyAs99,
  ]);
}
