import type { DraftMention, How, Mode, Settings } from "./types.ts";

export type CompareResult = {
  level: "auto" | "suggest" | "no";
  how: How;
  reason: string;
};

const NO: CompareResult = { level: "no", how: "exacto", reason: "" };

const NS = new Set([
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

const NA = new Set([
  "no aplica",
  "noaplica",
  "n a",
  "na",
  "no consume",
  "no consumo",
  "no uso",
  "no utilizo",
  "no compro",
  "no compra",
  "no corresponde",
  "no contesta",
  "no respondo",
  "no responde",
  "nc",
  "ninguno",
  "ninguna",
  "nada",
  "ninguna marca",
  "ningun",
  "ninguna ninguna",
]);

const OTROS = new Set([
  "otro",
  "otros",
  "otra",
  "otras",
  "otra marca",
  "otras marcas",
  "otro producto",
  "otros productos",
  "otra opinion",
  "otras opiniones",
  "otros mas",
  "y otros",
  "y otras",
  "y otra",
  "etc",
  "etcetera",
]);

const AMBIGUOUS = new Set([
  "ninguno",
  "ninguna",
  "nada",
  "ninguna marca",
  "ningun",
  "no contesta",
  "no responde",
  "no respondo",
  "nc",
]);

const STOP = new Set(
  "a al algo como con contra de del desde donde e el ella ellas ellos en entre es esa esas ese eso esos esta estas este estos estan fue ha han hay la las le les lo los mas me mi mis mucha mucho muchas muchos muy o para por porque que se sobre su sus te tu tus un una unas unos y ya tambien fueron era ser tan".split(
    /\s+/,
  ),
);

const NEG = new Set([
  "no",
  "nunca",
  "jamas",
  "sin",
  "ninguno",
  "ninguna",
  "ningun",
  "nada",
  "malo",
  "mala",
  "mal",
  "pesimo",
  "pesima",
  "horrible",
  "peor",
]);

const WEAK = new Set([
  "sabe",
  "parecen",
  "parece",
  "queda",
  "quedan",
  "tiene",
  "tienen",
  "gusta",
  "gusto",
  "viene",
  "vienen",
  "da",
  "dan",
  "hace",
  "hacen",
  "resulta",
  "resultan",
]);

const PROTECTED = [
  "johnson y johnson",
  "johnson e johnson",
  "procter y gamble",
  "procter e gamble",
  "dolce y gabbana",
  "black y decker",
  "ben y jerry",
  "ben y jerrys",
];

export function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanRaw(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[\s"'“”‘’«»*\u2022\u00b7-]+/u, "")
    .replace(/^(?:\d+[\.\)\-:]|\(\d+\))\s*/, "")
    .replace(/[\s"'“”‘’«»]+$/g, "")
    .replace(/[\s.,;:!?]+$/g, "")
    .replace(/^[\s.,;:!?]+/g, "")
    .trim();
}

export function classifySpecial(norm: string): 97 | 98 | 99 | null {
  const s = norm.replace(/\s+/g, " ").trim();
  if (!s) return null;
  if (NS.has(s)) return 97;
  if (NA.has(s)) return 99;
  if (OTROS.has(s)) return 98;
  return null;
}

export function isAmbiguousSpecial(norm: string): boolean {
  return AMBIGUOUS.has(norm.replace(/\s+/g, " ").trim());
}

export function categoryList(input: string): string[] {
  const seen = new Set<string>();
  for (const part of input.split(/[,;\n]/)) {
    const n = normalize(part);
    if (n) seen.add(n);
  }
  return [...seen];
}

export function stripCategory(norm: string, words: string[]): string {
  const ban = new Set(words);
  const tokens = norm.split(" ").filter(Boolean);
  const filtered = tokens.filter((token, index) => {
    if (ban.has(token)) return false;
    if ((token === "marca" || token === "marcas") && (index === 0 || index === tokens.length - 1)) {
      return false;
    }
    return true;
  });
  if (!filtered.length) return norm;
  return filtered.join(" ");
}

export function phoneticKey(compact: string): string {
  let x = compact.toLowerCase().replace(/\s+/g, "");
  if (!x) return x;
  x = x.replace(/h/g, "");
  x = x.replace(/qu/g, "k");
  x = x.replace(/v/g, "b");
  x = x.replace(/z/g, "s");
  x = x.replace(/ce/g, "se").replace(/ci/g, "si");
  x = x.replace(/c/g, "k");
  x = x.replace(/ge/g, "je").replace(/gi/g, "ji");
  x = x.replace(/j/g, "x");
  x = x.replace(/y/g, "i");
  x = x.replace(/w/g, "u");
  x = x.replace(/(.)\1+/g, "$1");
  return x;
}

export function damerau(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (a === b) return 0;
  if (!al) return bl;
  if (!bl) return al;
  const dp: number[][] = Array.from({ length: al + 1 }, () => new Array<number>(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) dp[i]![0] = i;
  for (let j = 0; j <= bl; j++) dp[0]![j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let next = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        next = Math.min(next, dp[i - 2]![j - 2]! + 1);
      }
      dp[i]![j] = next;
    }
  }
  return dp[al]![bl]!;
}

function isEndExtension(a: string, b: string): boolean {
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  if (longer.length - shorter.length !== 1) return false;
  return longer.startsWith(shorter) || longer.endsWith(shorter);
}

export function compareBrand(candidate: string, leader: string): CompareResult {
  const c = candidate.replace(/\s+/g, "");
  const l = leader.replace(/\s+/g, "");
  if (!c || !l) return NO;
  if (c === l) return { level: "auto", how: "exacto", reason: "Igual" };
  if (c.length > 40 || l.length > 40) return NO;
  const minL = Math.min(c.length, l.length);
  const pc = phoneticKey(c);
  const pl = phoneticKey(l);
  if (minL < 4) {
    if (minL >= 3 && pc === pl && Math.abs(c.length - l.length) <= 1) {
      return { level: "auto", how: "fonetica", reason: "Suena igual" };
    }
    return NO;
  }
  if (pc === pl && Math.abs(c.length - l.length) <= 2) {
    return { level: "auto", how: "fonetica", reason: "Suena igual" };
  }
  if (l.startsWith(c) && l.length - c.length <= 2 && c.length >= 4) {
    return { level: "auto", how: "truncado", reason: "Parece una versión cortada" };
  }
  if (c.startsWith(l) && c.length - l.length <= 2 && l.length >= 4) {
    const extra = c.slice(l.length);
    if (extra === "s" || extra === "es" || extra === "ns" || (extra.length === 1 && l.endsWith(extra))) {
      return { level: "auto", how: "extension", reason: "Solo cambia la terminación" };
    }
    return { level: "suggest", how: "extension", reason: "Agrega una terminación distinta" };
  }
  const distance = damerau(c, l);
  if (distance === 1 && c.length === l.length && minL >= 4) {
    return { level: "auto", how: "typo", reason: "Cambia una letra o se transponen" };
  }
  if (distance === 1 && minL >= 4 && Math.abs(c.length - l.length) === 1 && !isEndExtension(c, l)) {
    return { level: "auto", how: "typo", reason: "Falta o sobra una letra" };
  }
  if (distance === 2 && minL >= 7 && c[0] === l[0]) {
    return { level: "suggest", how: "typo", reason: "Se parece, pero hay dos cambios" };
  }
  return NO;
}

function contentTokens(norm: string): string[] {
  return norm.split(" ").filter((token) => token && !STOP.has(token));
}

function compareOpinion(candidate: string, leader: string): CompareResult {
  const ct = contentTokens(candidate);
  const lt = contentTokens(leader);
  if (!ct.length || !lt.length) return NO;
  const negated = (tokens: string[]) => tokens.some((token) => NEG.has(token));
  if (negated(ct) !== negated(lt)) return NO;
  const sig = (tokens: string[]) => [...tokens].sort().join("|");
  if (sig(ct) === sig(lt)) {
    return { level: "auto", how: "opinion", reason: "Misma idea, otras palabras de relleno" };
  }
  if (ct.length === 1 && lt.length === 1) {
    const brand = compareBrand(ct[0]!, lt[0]!);
    if (brand.level === "no") return NO;
    return { ...brand, how: "opinion", reason: brand.reason || "Parecida" };
  }
  const setC = new Set(ct);
  const setL = new Set(lt);
  let shared = 0;
  for (const token of setC) if (setL.has(token)) shared++;
  const union = setC.size + setL.size - shared;
  const jaccard = union ? shared / union : 0;
  const subset = (small: string[], big: Set<string>) => small.every((token) => big.has(token));
  const extrasOf = (small: string[], big: string[]) => {
    const own = new Set(small);
    return big.filter((token) => !own.has(token));
  };
  if (subset(ct, setL) || subset(lt, setC)) {
    const extra = ct.length <= lt.length ? extrasOf(ct, lt) : extrasOf(lt, ct);
    if (extra.length > 0 && extra.length <= 2 && extra.every((token) => WEAK.has(token))) {
      return { level: "auto", how: "opinion", reason: "Misma idea" };
    }
    if (extra.length === 1 && jaccard >= 0.5) {
      return { level: "suggest", how: "opinion", reason: "Casi la misma idea" };
    }
  }
  if (jaccard >= 0.75 && shared >= 2) {
    return { level: "auto", how: "opinion", reason: "Palabras muy parecidas" };
  }
  if (jaccard >= 0.5 && shared >= 1 && ct.length <= 4 && lt.length <= 4) {
    return { level: "suggest", how: "opinion", reason: "Podría ser la misma idea" };
  }
  return NO;
}

export function compareMention(candidate: string, leader: string, mode: Mode): CompareResult {
  if (!candidate || !leader) return NO;
  if (candidate === leader) return { level: "auto", how: "exacto", reason: "Igual" };
  if (mode === "opinion") return compareOpinion(candidate, leader);
  return compareBrand(candidate, leader);
}

function escapeReg(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitParts(text: string, splitAnd: boolean): string[] {
  const slots: string[] = [];
  let working = text;
  for (const phrase of PROTECTED) {
    const pattern = phrase.split(/\s+/).map(escapeReg).join("\\s+");
    working = working.replace(new RegExp(pattern, "ig"), (match) => {
      slots.push(match);
      return `\u0001${slots.length - 1}\u0001`;
    });
  }
  const re = splitAnd
    ? /\s*(?:,|;|\/|\||\n+|\s+\by\b\s+|\s+\be\b\s+)\s*/i
    : /\s*(?:,|;|\/|\||\n+)\s*/;
  return working
    .split(re)
    .map((part) => part.replace(/\u0001(\d+)\u0001/g, (_, index: string) => slots[Number(index)] ?? ""))
    .map((part) => part.trim())
    .filter(Boolean);
}

export function explodeMentions(text: string, settings: Settings): DraftMention[] {
  const trimmed = text.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return [];
  const fullNorm = normalize(trimmed);
  const fullSpecial = classifySpecial(fullNorm);
  if (fullSpecial) {
    return [
      {
        raw: cleanRaw(trimmed) || trimmed,
        key: fullNorm,
        special: fullSpecial,
        ambiguous: isAmbiguousSpecial(fullNorm),
      },
    ];
  }
  const words = settings.mode === "marca" ? categoryList(settings.categoryWords) : [];
  const out: DraftMention[] = [];
  for (const part of splitParts(trimmed, settings.splitAnd)) {
    const raw = cleanRaw(part);
    if (!raw) continue;
    const norm = normalize(raw);
    if (!norm) continue;
    const direct = classifySpecial(norm);
    if (direct) {
      out.push({ raw, key: norm, special: direct, ambiguous: isAmbiguousSpecial(norm) });
      continue;
    }
    const key = words.length ? stripCategory(norm, words) : norm;
    const afterStrip = classifySpecial(key);
    if (afterStrip) {
      out.push({ raw, key, special: afterStrip, ambiguous: isAmbiguousSpecial(key) });
      continue;
    }
    out.push({ raw, key, special: null, ambiguous: false });
  }
  return out;
}

export function prettify(surface: string, mode: Mode): string {
  const text = surface.trim();
  if (!text) return text;
  if (mode === "opinion") {
    if (text === text.toLowerCase()) return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
    return text;
  }
  if (/\p{Lu}/u.test(text)) return text;
  const small = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "da", "do"]);
  return text.replace(/\p{L}[\p{L}\p{N}'’]*/gu, (word, offset: number) => {
    if (offset > 0 && small.has(word)) return word;
    return word.charAt(0).toLocaleUpperCase("es") + word.slice(1);
  });
}

export function bestSurface(surfaces: { text: string; count: number }[]): string {
  let best = surfaces[0]?.text ?? "";
  let score = -Infinity;
  for (const surface of surfaces) {
    const caps = (surface.text.match(/\p{Lu}/gu) || []).length;
    const letters = (surface.text.match(/\p{L}/gu) || []).length || 1;
    const marks = (surface.text.normalize("NFD").match(/\p{M}/gu) || []).length;
    const next =
      surface.count * 1000 +
      (caps / letters) * 20 +
      marks * 0.05 -
      (surface.text.includes(" ") ? 0.5 : 0) -
      surface.text.length * 0.01;
    if (next > score) {
      score = next;
      best = surface.text;
    }
  }
  return best;
}

export function surfacesToList(map: Map<string, number>): { text: string; count: number }[] {
  return [...map.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, "es"));
}
