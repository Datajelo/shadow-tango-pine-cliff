import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as PopoverTrigger, i as PopoverPortal, n as PopoverClose, r as PopoverContent, t as Popover } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-cfb14rIV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NO = {
	level: "no",
	how: "exacto",
	reason: ""
};
var NS = /* @__PURE__ */ new Set([
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
	"no c"
]);
var NA = /* @__PURE__ */ new Set([
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
	"ninguna ninguna"
]);
var OTROS = /* @__PURE__ */ new Set([
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
	"etcetera"
]);
var AMBIGUOUS = /* @__PURE__ */ new Set([
	"ninguno",
	"ninguna",
	"nada",
	"ninguna marca",
	"ningun",
	"no contesta",
	"no responde",
	"no respondo",
	"nc"
]);
var STOP = new Set("a al algo como con contra de del desde donde e el ella ellas ellos en entre es esa esas ese eso esos esta estas este estos estan fue ha han hay la las le les lo los mas me mi mis mucha mucho muchas muchos muy o para por porque que se sobre su sus te tu tus un una unas unos y ya tambien fueron era ser tan".split(/\s+/));
var NEG = /* @__PURE__ */ new Set([
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
	"peor"
]);
var WEAK = /* @__PURE__ */ new Set([
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
	"resultan"
]);
var PROTECTED = [
	"johnson y johnson",
	"johnson e johnson",
	"procter y gamble",
	"procter e gamble",
	"dolce y gabbana",
	"black y decker",
	"ben y jerry",
	"ben y jerrys"
];
function normalize(input) {
	return input.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/&/g, " y ").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function cleanRaw(input) {
	return input.replace(/\s+/g, " ").trim().replace(/^[\s"'“”‘’«»*\u2022\u00b7-]+/u, "").replace(/^(?:\d+[\.\)\-:]|\(\d+\))\s*/, "").replace(/[\s"'“”‘’«»]+$/g, "").replace(/[\s.,;:!?]+$/g, "").replace(/^[\s.,;:!?]+/g, "").trim();
}
function classifySpecial(norm) {
	const s = norm.replace(/\s+/g, " ").trim();
	if (!s) return null;
	if (NS.has(s)) return 97;
	if (NA.has(s)) return 99;
	if (OTROS.has(s)) return 98;
	return null;
}
function isAmbiguousSpecial(norm) {
	return AMBIGUOUS.has(norm.replace(/\s+/g, " ").trim());
}
function categoryList(input) {
	const seen = /* @__PURE__ */ new Set();
	for (const part of input.split(/[,;\n]/)) {
		const n = normalize(part);
		if (n) seen.add(n);
	}
	return [...seen];
}
function stripCategory(norm, words) {
	const ban = new Set(words);
	const tokens = norm.split(" ").filter(Boolean);
	const filtered = tokens.filter((token, index) => {
		if (ban.has(token)) return false;
		if ((token === "marca" || token === "marcas") && (index === 0 || index === tokens.length - 1)) return false;
		return true;
	});
	if (!filtered.length) return norm;
	return filtered.join(" ");
}
function phoneticKey(compact) {
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
function damerau(a, b) {
	const al = a.length;
	const bl = b.length;
	if (a === b) return 0;
	if (!al) return bl;
	if (!bl) return al;
	const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
	for (let i = 0; i <= al; i++) dp[i][0] = i;
	for (let j = 0; j <= bl; j++) dp[0][j] = j;
	for (let i = 1; i <= al; i++) for (let j = 1; j <= bl; j++) {
		const cost = a[i - 1] === b[j - 1] ? 0 : 1;
		let next = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
		if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) next = Math.min(next, dp[i - 2][j - 2] + 1);
		dp[i][j] = next;
	}
	return dp[al][bl];
}
function isEndExtension(a, b) {
	const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
	if (longer.length - shorter.length !== 1) return false;
	return longer.startsWith(shorter) || longer.endsWith(shorter);
}
function compareBrand(candidate, leader) {
	const c = candidate.replace(/\s+/g, "");
	const l = leader.replace(/\s+/g, "");
	if (!c || !l) return NO;
	if (c === l) return {
		level: "auto",
		how: "exacto",
		reason: "Igual"
	};
	if (c.length > 40 || l.length > 40) return NO;
	const minL = Math.min(c.length, l.length);
	const pc = phoneticKey(c);
	const pl = phoneticKey(l);
	if (minL < 4) {
		if (minL >= 3 && pc === pl && Math.abs(c.length - l.length) <= 1) return {
			level: "auto",
			how: "fonetica",
			reason: "Suena igual"
		};
		return NO;
	}
	if (pc === pl && Math.abs(c.length - l.length) <= 2) return {
		level: "auto",
		how: "fonetica",
		reason: "Suena igual"
	};
	if (l.startsWith(c) && l.length - c.length <= 2 && c.length >= 4) return {
		level: "auto",
		how: "truncado",
		reason: "Parece una versión cortada"
	};
	if (c.startsWith(l) && c.length - l.length <= 2 && l.length >= 4) {
		const extra = c.slice(l.length);
		if (extra === "s" || extra === "es" || extra === "ns" || extra.length === 1 && l.endsWith(extra)) return {
			level: "auto",
			how: "extension",
			reason: "Solo cambia la terminación"
		};
		return {
			level: "suggest",
			how: "extension",
			reason: "Agrega una terminación distinta"
		};
	}
	const distance = damerau(c, l);
	if (distance === 1 && c.length === l.length && minL >= 4) return {
		level: "auto",
		how: "typo",
		reason: "Cambia una letra o se transponen"
	};
	if (distance === 1 && minL >= 4 && Math.abs(c.length - l.length) === 1 && !isEndExtension(c, l)) return {
		level: "auto",
		how: "typo",
		reason: "Falta o sobra una letra"
	};
	if (distance === 2 && minL >= 7 && c[0] === l[0]) return {
		level: "suggest",
		how: "typo",
		reason: "Se parece, pero hay dos cambios"
	};
	return NO;
}
function contentTokens(norm) {
	return norm.split(" ").filter((token) => token && !STOP.has(token));
}
function compareOpinion(candidate, leader) {
	const ct = contentTokens(candidate);
	const lt = contentTokens(leader);
	if (!ct.length || !lt.length) return NO;
	const negated = (tokens) => tokens.some((token) => NEG.has(token));
	if (negated(ct) !== negated(lt)) return NO;
	const sig = (tokens) => [...tokens].sort().join("|");
	if (sig(ct) === sig(lt)) return {
		level: "auto",
		how: "opinion",
		reason: "Misma idea, otras palabras de relleno"
	};
	if (ct.length === 1 && lt.length === 1) {
		const brand = compareBrand(ct[0], lt[0]);
		if (brand.level === "no") return NO;
		return {
			...brand,
			how: "opinion",
			reason: brand.reason || "Parecida"
		};
	}
	const setC = new Set(ct);
	const setL = new Set(lt);
	let shared = 0;
	for (const token of setC) if (setL.has(token)) shared++;
	const union = setC.size + setL.size - shared;
	const jaccard = union ? shared / union : 0;
	const subset = (small, big) => small.every((token) => big.has(token));
	const extrasOf = (small, big) => {
		const own = new Set(small);
		return big.filter((token) => !own.has(token));
	};
	if (subset(ct, setL) || subset(lt, setC)) {
		const extra = ct.length <= lt.length ? extrasOf(ct, lt) : extrasOf(lt, ct);
		if (extra.length > 0 && extra.length <= 2 && extra.every((token) => WEAK.has(token))) return {
			level: "auto",
			how: "opinion",
			reason: "Misma idea"
		};
		if (extra.length === 1 && jaccard >= .5) return {
			level: "suggest",
			how: "opinion",
			reason: "Casi la misma idea"
		};
	}
	if (jaccard >= .75 && shared >= 2) return {
		level: "auto",
		how: "opinion",
		reason: "Palabras muy parecidas"
	};
	if (jaccard >= .5 && shared >= 1 && ct.length <= 4 && lt.length <= 4) return {
		level: "suggest",
		how: "opinion",
		reason: "Podría ser la misma idea"
	};
	return NO;
}
function compareMention(candidate, leader, mode) {
	if (!candidate || !leader) return NO;
	if (candidate === leader) return {
		level: "auto",
		how: "exacto",
		reason: "Igual"
	};
	if (mode === "opinion") return compareOpinion(candidate, leader);
	return compareBrand(candidate, leader);
}
function escapeReg(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function splitParts(text, splitAnd) {
	const slots = [];
	let working = text;
	for (const phrase of PROTECTED) {
		const pattern = phrase.split(/\s+/).map(escapeReg).join("\\s+");
		working = working.replace(new RegExp(pattern, "ig"), (match) => {
			slots.push(match);
			return `\u0001${slots.length - 1}\u0001`;
		});
	}
	const re = splitAnd ? /\s*(?:,|;|\/|\||\n+|\s+\by\b\s+|\s+\be\b\s+)\s*/i : /\s*(?:,|;|\/|\||\n+)\s*/;
	return working.split(re).map((part) => part.replace(/\u0001(\d+)\u0001/g, (_, index) => slots[Number(index)] ?? "")).map((part) => part.trim()).filter(Boolean);
}
function explodeMentions(text, settings) {
	const trimmed = text.replace(/^\uFEFF/, "").trim();
	if (!trimmed) return [];
	const fullNorm = normalize(trimmed);
	const fullSpecial = classifySpecial(fullNorm);
	if (fullSpecial) return [{
		raw: cleanRaw(trimmed) || trimmed,
		key: fullNorm,
		special: fullSpecial,
		ambiguous: isAmbiguousSpecial(fullNorm)
	}];
	const words = settings.mode === "marca" ? categoryList(settings.categoryWords) : [];
	const out = [];
	for (const part of splitParts(trimmed, settings.splitAnd)) {
		const raw = cleanRaw(part);
		if (!raw) continue;
		const norm = normalize(raw);
		if (!norm) continue;
		const direct = classifySpecial(norm);
		if (direct) {
			out.push({
				raw,
				key: norm,
				special: direct,
				ambiguous: isAmbiguousSpecial(norm)
			});
			continue;
		}
		const key = words.length ? stripCategory(norm, words) : norm;
		const afterStrip = classifySpecial(key);
		if (afterStrip) {
			out.push({
				raw,
				key,
				special: afterStrip,
				ambiguous: isAmbiguousSpecial(key)
			});
			continue;
		}
		out.push({
			raw,
			key,
			special: null,
			ambiguous: false
		});
	}
	return out;
}
function prettify(surface, mode) {
	const text = surface.trim();
	if (!text) return text;
	if (mode === "opinion") {
		if (text === text.toLowerCase()) return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
		return text;
	}
	if (/\p{Lu}/u.test(text)) return text;
	const small = /* @__PURE__ */ new Set([
		"de",
		"del",
		"la",
		"las",
		"el",
		"los",
		"y",
		"e",
		"da",
		"do"
	]);
	return text.replace(/\p{L}[\p{L}\p{N}'’]*/gu, (word, offset) => {
		if (offset > 0 && small.has(word)) return word;
		return word.charAt(0).toLocaleUpperCase("es") + word.slice(1);
	});
}
function bestSurface(surfaces) {
	let best = surfaces[0]?.text ?? "";
	let score = -Infinity;
	for (const surface of surfaces) {
		const caps = (surface.text.match(/\p{Lu}/gu) || []).length;
		const letters = (surface.text.match(/\p{L}/gu) || []).length || 1;
		const marks = (surface.text.normalize("NFD").match(/\p{M}/gu) || []).length;
		const next = surface.count * 1e3 + caps / letters * 20 + marks * .05 - (surface.text.includes(" ") ? .5 : 0) - surface.text.length * .01;
		if (next > score) {
			score = next;
			best = surface.text;
		}
	}
	return best;
}
function surfacesToList(map) {
	return [...map.entries()].map(([text, count]) => ({
		text,
		count
	})).sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, "es"));
}
function variantFrom(norm, bucket, how, review) {
	const surfaces = surfacesToList(bucket.surfaces);
	return {
		key: norm,
		label: bestSurface(surfaces) || norm,
		count: bucket.count,
		review,
		how,
		surfaces
	};
}
function labelFromVariants(variants, mode) {
	return prettify(bestSurface(variants.flatMap((variant) => variant.surfaces)) || variants[0]?.label || "", mode);
}
function mentionCount(entry) {
	return entry.variants.reduce((sum, variant) => sum + variant.count, 0);
}
function buildEntries(rows, settings) {
	const specials = /* @__PURE__ */ new Map();
	const substantive = /* @__PURE__ */ new Map();
	const bump = (map, key, raw) => {
		const bucket = map.get(key) ?? {
			norm: key,
			count: 0,
			surfaces: /* @__PURE__ */ new Map()
		};
		bucket.count += 1;
		bucket.surfaces.set(raw, (bucket.surfaces.get(raw) ?? 0) + 1);
		map.set(key, bucket);
	};
	for (const row of rows) for (const mention of explodeMentions(row.text, settings)) if (mention.special) bump(specials, mention.key, mention.raw);
	else bump(substantive, mention.key, mention.raw);
	const buckets = [...substantive.values()].sort((a, b) => b.count - a.count || a.norm.localeCompare(b.norm, "es"));
	const clusters = [];
	let seq = 1;
	for (const bucket of buckets) {
		const compact = bucket.norm.replace(/\s+/g, "");
		const phone = phoneticKey(compact);
		let joined = null;
		let joinedHow = "exacto";
		let suggestion;
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
			if (match.level === "suggest" && !suggestion) suggestion = {
				targetId: cluster.id,
				reason: match.reason
			};
		}
		if (joined) joined.members.push({
			norm: bucket.norm,
			how: joinedHow,
			review: true
		});
		else clusters.push({
			id: `c${seq++}`,
			leader: bucket.norm,
			compact,
			phone,
			members: [{
				norm: bucket.norm,
				how: "exacto",
				review: false
			}],
			suggest: suggestion
		});
	}
	const ranked = clusters.map((cluster) => ({
		cluster,
		count: cluster.members.reduce((sum, member) => sum + (substantive.get(member.norm)?.count ?? 0), 0)
	})).sort((a, b) => b.count - a.count || a.cluster.leader.localeCompare(b.cluster.leader, "es"));
	let nextCode = 1;
	const items = ranked.map(({ cluster, count }) => {
		const variants = cluster.members.map((member) => {
			const bucket = substantive.get(member.norm);
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
			suggest: cluster.suggest
		};
	});
	const specialEntry = (id, code, label, kind, keys) => ({
		id,
		code,
		label,
		kind,
		residual: false,
		labelLocked: true,
		variants: keys.map((key) => {
			const bucket = specials.get(key);
			return variantFrom(key, bucket, "exacto", bucket.norm === key && isAmbiguousKey(key));
		})
	});
	const keysOf = (code) => [...specials.keys()].filter((key) => specialCode(key) === code).sort((a, b) => a.localeCompare(b, "es"));
	return [
		...items,
		specialEntry("sp97", 97, "No sabe / No recuerda", "ns", keysOf(97)),
		specialEntry("sp98", 98, "Otros", "otros", keysOf(98)),
		specialEntry("sp99", 99, "No aplica", "na", keysOf(99))
	];
}
function isAmbiguousKey(key) {
	return key === "ninguno" || key === "ninguna" || key === "nada" || key === "ninguna marca" || key === "ningun" || key === "no contesta" || key === "no responde" || key === "no respondo" || key === "nc";
}
function specialCode(key) {
	if ((/* @__PURE__ */ new Set([
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
		"no c"
	])).has(key)) return 97;
	if (key === "otro" || key === "otros" || key === "otra" || key === "otras" || key === "otra marca" || key === "otras marcas" || key === "otro producto" || key === "otros productos" || key === "otra opinion" || key === "otras opiniones" || key === "otros mas" || key === "y otros" || key === "y otras" || key === "y otra" || key === "etc" || key === "etcetera") return 98;
	return 99;
}
function codeRows(rows, entries, settings) {
	const lookup = /* @__PURE__ */ new Map();
	for (const entry of entries) for (const variant of entry.variants) lookup.set(variant.key, {
		raw: variant.label,
		key: variant.key,
		code: entry.code,
		label: entry.label,
		review: variant.review || Boolean(entry.suggest),
		how: variant.how,
		entryId: entry.id
	});
	return rows.map((row) => {
		const text = row.text ?? "";
		if (!text.trim()) {
			if (settings.emptyAs99) return {
				id: row.id,
				text,
				cells: row.cells,
				mentions: [{
					raw: "(vacío)",
					key: "",
					code: 99,
					label: "No aplica",
					review: false,
					how: "exacto",
					entryId: "sp99"
				}],
				codes: [99],
				codeString: "99",
				review: false,
				empty: true,
				note: "Respuesta vacía codificada como 99"
			};
			return {
				id: row.id,
				text,
				cells: row.cells,
				mentions: [],
				codes: [],
				codeString: "",
				review: true,
				empty: true,
				note: "Respuesta vacía, sin código"
			};
		}
		const mentions = explodeMentions(text, settings).map((draft) => {
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
					entryId
				};
			}
			const known = lookup.get(draft.key);
			if (!known) return {
				raw: draft.raw,
				key: draft.key,
				code: 98,
				label: "Otros",
				review: true,
				how: "manual",
				entryId: "sp98"
			};
			return {
				...known,
				raw: draft.raw
			};
		});
		const substantive = mentions.filter((mention) => mention.code < 97);
		const codes = [];
		const notes = [];
		if (substantive.length === 0) {
			for (const mention of mentions) if (!codes.includes(mention.code)) codes.push(mention.code);
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
			note: notes.join(". ")
		};
	});
}
function buildProject(input) {
	return {
		question: input.question,
		settings: input.settings,
		columns: input.columns,
		textColumn: input.textColumn,
		rows: input.rows,
		entries: buildEntries(input.rows, input.settings),
		edited: false
	};
}
function codeColumns(entries) {
	const propios = entries.filter((entry) => entry.kind === "item" && !entry.residual).sort((a, b) => a.code - b.code || a.label.localeCompare(b.label, "es"));
	const specials = [
		97,
		98,
		99
	].map((code) => {
		return {
			code,
			label: entries.find((item) => item.kind !== "item" && item.code === code)?.label ?? String(code)
		};
	});
	return [...propios.map((entry) => ({
		code: entry.code,
		label: entry.label
	})), ...specials].map((column) => ({
		...column,
		header: columnHeader(column.code, column.label)
	}));
}
function columnHeader(code, label) {
	return `${code}_${label.normalize("NFD").replace(/\p{M}/gu, "").replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 40) || "codigo"}`;
}
function settingsSignature(settings) {
	return JSON.stringify([
		settings.mode,
		settings.categoryWords.trim(),
		settings.splitAnd,
		settings.minFrequency,
		settings.emptyAs99
	]);
}
function manual(variant) {
	return {
		...variant,
		how: "manual",
		review: false
	};
}
function nextFreeCode(entries) {
	const used = new Set(entries.filter((entry) => entry.kind === "item" && !entry.residual).map((entry) => entry.code));
	for (let code = 1; code < 97; code++) if (!used.has(code)) return code;
	return 96;
}
function nextId(entries) {
	let max = 0;
	for (const entry of entries) {
		const match = /^c(\d+)$/.exec(entry.id);
		if (match) max = Math.max(max, Number(match[1]));
	}
	return `c${max + 1}`;
}
function withoutVariant(entry, key) {
	return {
		...entry,
		variants: entry.variants.filter((variant) => variant.key !== key)
	};
}
function dropEmptyItems(entries) {
	return entries.filter((entry) => entry.kind !== "item" || entry.variants.length > 0);
}
function renameEntry(entries, id, label) {
	const next = label.trim();
	if (!next) return entries;
	return entries.map((entry) => entry.id === id ? {
		...entry,
		label: next,
		labelLocked: true
	} : entry);
}
function rejectSuggestion(entries, id) {
	return entries.map((entry) => entry.id === id ? {
		...entry,
		suggest: void 0
	} : entry);
}
function mergeEntries(entries, fromId, toId) {
	if (fromId === toId) return entries;
	const from = entries.find((entry) => entry.id === fromId);
	const to = entries.find((entry) => entry.id === toId);
	if (!from || !to || from.kind !== "item") return entries;
	const incoming = from.variants.map(manual);
	const keys = new Set(to.variants.map((variant) => variant.key));
	const merged = {
		...to,
		variants: [...to.variants, ...incoming.filter((variant) => !keys.has(variant.key))],
		suggest: void 0
	};
	return dropEmptyItems(entries.filter((entry) => entry.id !== fromId).map((entry) => {
		if (entry.id === toId) return merged;
		if (entry.suggest?.targetId === fromId) return {
			...entry,
			suggest: {
				...entry.suggest,
				targetId: toId
			}
		};
		return entry;
	}));
}
function acceptAllSuggestions(entries) {
	let current = entries;
	const pairs = current.filter((entry) => entry.suggest && entry.kind === "item").map((entry) => [entry.id, entry.suggest.targetId]);
	for (const [fromId, toId] of pairs) {
		if (!current.some((entry) => entry.id === fromId)) continue;
		if (!current.some((entry) => entry.id === toId)) continue;
		current = mergeEntries(current, fromId, toId);
	}
	return current;
}
function moveVariant(entries, fromId, key, toId) {
	if (fromId === toId) return entries;
	const from = entries.find((entry) => entry.id === fromId);
	const to = entries.find((entry) => entry.id === toId);
	const variant = from?.variants.find((item) => item.key === key);
	if (!from || !to || !variant) return entries;
	const placed = manual(variant);
	return dropEmptyItems(entries.map((entry) => {
		if (entry.id === fromId) return withoutVariant(entry, key);
		if (entry.id === toId) {
			if (entry.variants.some((item) => item.key === key)) return entry;
			return {
				...entry,
				variants: [...entry.variants, placed]
			};
		}
		return entry;
	}));
}
function extractVariant(entries, fromId, key, mode) {
	const from = entries.find((entry) => entry.id === fromId);
	const variant = from?.variants.find((item) => item.key === key);
	if (!from || !variant) return entries;
	if (from.variants.length === 1 && from.kind === "item" && !from.residual) return entries;
	const created = {
		id: nextId(entries),
		code: nextFreeCode(entries),
		label: prettify(variant.label, mode),
		kind: "item",
		residual: false,
		labelLocked: false,
		variants: [manual(variant)]
	};
	return dropEmptyItems([...entries.map((entry) => entry.id === fromId ? withoutVariant(entry, key) : entry), created]);
}
function promoteEntry(entries, id) {
	const entry = entries.find((item) => item.id === id);
	if (!entry || entry.kind !== "item" || !entry.residual) return entries;
	const code = nextFreeCode(entries);
	return entries.map((item) => item.id === id ? {
		...item,
		code,
		residual: false,
		suggest: void 0
	} : item);
}
function sendToOtros(entries, id) {
	return entries.map((entry) => entry.id === id && entry.kind === "item" ? {
		...entry,
		code: 98,
		residual: true,
		suggest: void 0
	} : entry);
}
function renumber(entries) {
	const ranked = entries.filter((entry) => entry.kind === "item" && !entry.residual).sort((a, b) => mentionCount(b) - mentionCount(a) || a.label.localeCompare(b.label, "es"));
	const codes = new Map(ranked.map((entry, index) => [entry.id, index + 1]));
	return entries.map((entry) => {
		const code = codes.get(entry.id);
		return code ? {
			...entry,
			code
		} : entry;
	});
}
function safeCell(value) {
	if (typeof value === "number") return value;
	if (/^[=+\-@]/.test(value)) return `'${value}`;
	return value;
}
function downloadBlob(filename, blob) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}
function codedOf(project) {
	return codeRows(project.rows, project.entries, project.settings);
}
function bibliotecaMatrix(project, coded) {
	const codes = codeColumns(project.entries);
	const baseColumns = project.columns.length ? project.columns : ["respuesta"];
	return [[
		...baseColumns,
		"codigos",
		"revisar",
		"nota",
		...codes.map((column) => column.header)
	], ...coded.map((row) => {
		const present = new Set(row.codes);
		return [
			...baseColumns.map((column) => safeCell(row.cells[column] ?? (column === project.textColumn ? row.text : ""))),
			safeCell(row.codeString),
			row.review ? "Sí" : "No",
			safeCell(row.note),
			...codes.map((column) => present.has(column.code) ? 1 : "")
		];
	})];
}
function diccionarioMatrix(project, coded) {
	const responses = /* @__PURE__ */ new Map();
	for (const entry of project.entries) responses.set(entry.id, 0);
	const keyOwner = /* @__PURE__ */ new Map();
	for (const entry of project.entries) for (const variant of entry.variants) keyOwner.set(variant.key, entry.id);
	for (const row of coded) {
		const seen = /* @__PURE__ */ new Set();
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
		"notas"
	];
	const propios = project.entries.filter((entry) => entry.kind === "item").sort((a, b) => a.code - b.code || mentionCount(b) - mentionCount(a) || a.label.localeCompare(b.label, "es"));
	const specials = project.entries.filter((entry) => entry.kind !== "item");
	return [header, ...[...propios, ...specials].map((entry) => {
		const resp = responses.get(entry.id) ?? 0;
		const variants = entry.variants.map((variant) => `${variant.label} (${variant.count}${variant.review ? ", revisar" : ""})`).join(" | ");
		const tipo = entry.residual ? "98 por baja frecuencia" : entry.kind === "item" ? "codigo propio" : "reservado";
		const notas = [entry.suggest ? entry.suggest.reason : "", entry.residual ? "Subir de frecuencia o asignar código propio si debe separarse de Otros" : ""].filter(Boolean).join(". ");
		return [
			entry.code,
			entry.label,
			tipo,
			mentionCount(entry),
			resp,
			Math.round(resp / total * 1e3) / 10,
			variants,
			notas
		];
	})];
}
function mencionesMatrix(project, coded) {
	const header = [
		"id",
		"respuesta",
		"mencion",
		"canonica",
		"codigo",
		"etiqueta",
		"metodo",
		"revisar"
	];
	const body = [];
	for (const row of coded) {
		if (!row.mentions.length) {
			body.push([
				row.id,
				safeCell(row.text),
				"",
				"",
				"",
				"",
				"",
				row.empty ? "Sí" : "No"
			]);
			continue;
		}
		for (const mention of row.mentions) body.push([
			row.id,
			safeCell(row.text),
			safeCell(mention.raw),
			safeCell(mention.label),
			mention.code,
			mention.label,
			mention.how,
			mention.review ? "Sí" : "No"
		]);
	}
	return [header, ...body];
}
function criteriosMatrix(project) {
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
		["regla_mixta", "Si hay menciones sustantivas, 97 y 99 no se agregan"]
	];
}
async function downloadWorkbook(project) {
	const coded = codedOf(project);
	const xlsx = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const book = xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(bibliotecaMatrix(project, coded)), "Biblioteca");
	xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(diccionarioMatrix(project, coded)), "Diccionario");
	xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(mencionesMatrix(project, coded)), "Menciones");
	xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(criteriosMatrix(project)), "Criterios");
	const buffer = xlsx.write(book, {
		bookType: "xlsx",
		type: "array"
	});
	downloadBlob("libreto-biblioteca.xlsx", new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
}
function toCsv(matrix) {
	return `\uFEFF${matrix.map((row) => row.map((cell) => {
		return `"${String(cell ?? "").replace(/"/g, "\"\"")}"`;
	}).join(";")).join("\r\n")}`;
}
function downloadCsv(project) {
	const coded = codedOf(project);
	downloadBlob("libreto-biblioteca.csv", new Blob([toCsv(bibliotecaMatrix(project, coded))], { type: "text/csv;charset=utf-8" }));
}
function copyCodes(project) {
	return ["id	codigos", ...codedOf(project).map((row) => `${row.id}\t${row.codeString}`)].join("\n");
}
var DEFAULT_SETTINGS = {
	mode: "marca",
	categoryWords: "",
	splitAnd: false,
	minFrequency: 2,
	emptyAs99: false
};
var HOW = {
	exacto: "",
	fonetica: "suena igual",
	typo: "error de escritura",
	truncado: "cortada",
	extension: "terminación",
	opinion: "misma idea",
	manual: "ajustada a mano"
};
function responseCounts(project, coded) {
	const counts = /* @__PURE__ */ new Map();
	const owner = /* @__PURE__ */ new Map();
	for (const entry of project.entries) {
		counts.set(entry.id, 0);
		for (const variant of entry.variants) owner.set(variant.key, entry.id);
	}
	for (const row of coded) {
		const seen = /* @__PURE__ */ new Set();
		for (const mention of row.mentions) {
			const id = owner.get(mention.key);
			if (id) seen.add(id);
		}
		for (const id of seen) counts.set(id, (counts.get(id) ?? 0) + 1);
	}
	return counts;
}
function MoveMenu({ label, entries, currentId, allowNew, onPick }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const options = entries.filter((entry) => {
		if (entry.id === currentId) return false;
		return `${entry.code} ${entry.label}`.toLowerCase().includes(query.trim().toLowerCase());
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		className: "btn btn-ghost btn-tiny",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		className: "z-40 w-72 rounded-md border border-border bg-card p-2 shadow-sm",
		sideOffset: 6,
		align: "end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "field mb-2",
			placeholder: "Buscar código",
			value: query,
			onChange: (event) => setQuery(event.target.value)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-64 overflow-auto",
			children: [allowNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverClose, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "menu-row",
					onClick: () => onPick("new"),
					children: "Código nuevo"
				})
			}) : null, options.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverClose, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "menu-row",
					onClick: () => onPick(entry.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: entry.code
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: entry.label
					})]
				})
			}, entry.id))]
		})]
	}) })] });
}
function EntryCard({ entry, project, responses, total, onEntries }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(entry.label);
	const target = entry.suggest ? project.entries.find((item) => item.id === entry.suggest?.targetId) : void 0;
	const quiet = entry.kind !== "item" || entry.residual;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "panel grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: quiet ? "code-badge quiet" : "code-badge",
					children: entry.code
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							onEntries(renameEntry(project.entries, entry.id, draft));
							setEditing(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: draft,
							onChange: (event) => setDraft(event.target.value),
							autoFocus: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "btn btn-primary btn-tiny",
							children: "Guardar"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: entry.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground tabular-nums",
						children: [
							mentionCount(entry),
							" menciones · ",
							responses,
							" respuestas · ",
							total ? Math.round(responses / total * 100) : 0,
							"%"
						]
					})]
				})]
			}),
			entry.suggest && target ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-sm bg-warn-bg p-3 text-sm text-warn",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					entry.suggest.reason,
					". ¿La une con ",
					target.label,
					target.residual ? ", que hoy está en 98" : ` (código ${target.code})`,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-primary btn-tiny",
						onClick: () => onEntries(mergeEntries(project.entries, entry.id, target.id)),
						children: "Unir"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-outline btn-tiny",
						onClick: () => onEntries(rejectSuggestion(project.entries, entry.id)),
						children: "Dejar aparte"
					})]
				})]
			}) : null,
			entry.variants.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-1",
				children: entry.variants.map((variant) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 rounded-sm px-1 py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: variant.review ? "text-warn" : void 0,
							children: variant.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted-foreground tabular-nums",
							children: ["×", variant.count]
						}),
						HOW[variant.how] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: HOW[variant.how]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto flex flex-wrap gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveMenu, {
								label: "Mover",
								entries: project.entries,
								currentId: entry.id,
								allowNew: entry.variants.length > 1 || entry.kind !== "item" || entry.residual,
								onPick: (id) => {
									if (id === "new") onEntries(extractVariant(project.entries, entry.id, variant.key, project.settings.mode));
									else onEntries(moveVariant(project.entries, entry.id, variant.key, id));
								}
							})
						})
					]
				}, variant.key))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Sin menciones en esta base."
			}),
			entry.kind === "item" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					!editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost btn-tiny",
						onClick: () => {
							setDraft(entry.label);
							setEditing(true);
						},
						children: "Renombrar"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveMenu, {
						label: "Unir con",
						entries: project.entries.filter((item) => item.kind === "item"),
						currentId: entry.id,
						allowNew: false,
						onPick: (id) => onEntries(mergeEntries(project.entries, entry.id, id))
					}),
					entry.residual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-outline btn-tiny",
						onClick: () => onEntries(promoteEntry(project.entries, entry.id)),
						children: "Dar código propio"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost btn-tiny",
						onClick: () => onEntries(sendToOtros(project.entries, entry.id)),
						children: "Pasar a 98"
					})
				]
			}) : null
		]
	});
}
function Dictionary({ project, coded, onEntries }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const counts = (0, import_react.useMemo)(() => responseCounts(project, coded), [project, coded]);
	const needle = query.trim().toLowerCase();
	const matches = (entry) => {
		if (!needle) return true;
		return `${entry.code} ${entry.label} ${entry.variants.map((variant) => variant.label).join(" ")}`.toLowerCase().includes(needle);
	};
	const propios = project.entries.filter((entry) => entry.kind === "item" && !entry.residual).sort((a, b) => a.code - b.code).filter(matches);
	const residual = project.entries.filter((entry) => entry.kind === "item" && entry.residual).sort((a, b) => mentionCount(b) - mentionCount(a)).filter(matches);
	const specials = project.entries.filter((entry) => entry.kind !== "item").filter(matches);
	const suggestions = project.entries.filter((entry) => entry.suggest).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field max-w-xs",
					placeholder: "Buscar en el diccionario",
					value: query,
					onChange: (event) => setQuery(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn btn-outline btn-tiny",
					disabled: suggestions === 0,
					onClick: () => onEntries(acceptAllSuggestions(project.entries)),
					children: [
						"Aceptar parecidos (",
						suggestions,
						")"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: propios.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
					entry,
					project,
					responses: counts.get(entry.id) ?? 0,
					total: project.rows.length,
					onEntries
				}, entry.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "pt-2 text-sm font-medium text-muted-foreground",
				children: "Dentro de 98 — no llegaron a la frecuencia"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: residual.length ? residual.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
					entry,
					project,
					responses: counts.get(entry.id) ?? 0,
					total: project.rows.length,
					onEntries
				}, entry.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nada quedó por baja frecuencia."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "pt-2 text-sm font-medium text-muted-foreground",
				children: "Códigos reservados"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: specials.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
					entry,
					project,
					responses: counts.get(entry.id) ?? 0,
					total: project.rows.length,
					onEntries
				}, entry.id))
			})
		]
	});
}
var PAGE = 20;
function Library({ project, coded }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [onlyReview, setOnlyReview] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(0);
	const columns = (0, import_react.useMemo)(() => codeColumns(project.entries), [project.entries]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return coded.filter((row) => {
			if (onlyReview && !row.review) return false;
			if (!needle) return true;
			return row.text.toLowerCase().includes(needle) || row.id.toLowerCase().includes(needle) || row.codeString.includes(needle);
		});
	}, [
		coded,
		onlyReview,
		query
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
	const safePage = Math.min(page, pages - 1);
	const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);
	const reviewCount = coded.filter((row) => row.review).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field max-w-xs",
						placeholder: "Buscar respuesta o código",
						value: query,
						onChange: (event) => {
							setQuery(event.target.value);
							setPage(0);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: onlyReview ? "btn btn-primary btn-tiny" : "btn btn-outline btn-tiny",
						"aria-pressed": onlyReview,
						onClick: () => {
							setOnlyReview((value) => !value);
							setPage(0);
						},
						children: [
							"Por revisar (",
							reviewCount,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground tabular-nums",
						children: [
							filtered.length,
							" de ",
							coded.length
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Códigos en el orden escrito, separados por punto y coma. Un 1 en la columna significa que esa respuesta lo mencionó."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "data-scroll",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "data-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "sticky-col",
								children: "Respuesta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Códigos" }),
							columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
								className: "min-w-16",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block tabular-nums",
									children: column.code
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block max-w-24 truncate",
									children: column.label
								})]
							}, column.header))
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [slice.map((row, index) => {
							const present = new Set(row.codes);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: row.review ? "sticky-col border-l-2 border-warn" : "sticky-col",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground tabular-nums",
											children: row.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: row.text.trim() || "—" }),
										row.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: row.note
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular-nums font-medium",
									children: row.codeString
								}),
								columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular-nums text-center",
									children: present.has(column.code) ? "1" : ""
								}, column.header))
							] }, `${row.id}-${safePage}-${index}`);
						}), !slice.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 2 + columns.length,
							children: "Nada coincide con el filtro."
						}) }) : null] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-outline btn-tiny",
						disabled: safePage === 0,
						onClick: () => setPage(safePage - 1),
						children: "Anterior"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm tabular-nums text-muted-foreground",
						children: [
							safePage + 1,
							" / ",
							pages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-outline btn-tiny",
						disabled: safePage >= pages - 1,
						onClick: () => setPage(safePage + 1),
						children: "Siguiente"
					})
				]
			})
		]
	});
}
function detectDelimiter(text) {
	const line = text.split(/\r?\n/, 1)[0] ?? "";
	const commas = (line.match(/,/g) || []).length;
	const semis = (line.match(/;/g) || []).length;
	const tabs = (line.match(/\t/g) || []).length;
	if (tabs >= commas && tabs >= semis && tabs > 0) return "	";
	if (semis > commas) return ";";
	return ",";
}
function parseTable(text) {
	const cleaned = text.replace(/^\uFEFF/, "");
	const delimiter = detectDelimiter(cleaned);
	const rows = [];
	let row = [];
	let current = "";
	let quoted = false;
	for (let i = 0; i < cleaned.length; i++) {
		const char = cleaned[i];
		if (quoted) {
			if (char === "\"") {
				if (cleaned[i + 1] === "\"") {
					current += "\"";
					i++;
				} else quoted = false;
			} else current += char;
			continue;
		}
		if (char === "\"") {
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
	while (rows.length > 0 && rows[rows.length - 1].every((cell) => cell.trim() === "")) rows.pop();
	return rows;
}
function guessHeader(grid) {
	if (grid.length < 2) return false;
	const head = grid[0] ?? [];
	if (head.length < 2) return false;
	const joined = head.join(" ").toLowerCase();
	if (/(respuesta|marca|opinion|opini[oó]n|abierta|texto|comentario|pregunta|verbatim|id\b|folio|entrevista)/.test(joined)) return true;
	return head.every((cell) => cell.trim().length > 0 && cell.trim().length <= 32);
}
function linesToRows(lines) {
	const copy = [...lines];
	while (copy.length > 0 && copy[copy.length - 1].trim() === "") copy.pop();
	return copy.map((text, index) => ({
		id: `R${index + 1}`,
		text,
		cells: { respuesta: text }
	}));
}
function uniqueNames(names) {
	const seen = /* @__PURE__ */ new Map();
	return names.map((name) => {
		const base = name.trim() || "columna";
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		return count === 0 ? base : `${base}_${count + 1}`;
	});
}
function rowsFromGrid(grid, header, textCol, idCol) {
	if (!grid.length) return {
		columns: ["respuesta"],
		textColumn: "respuesta",
		rows: []
	};
	const width = Math.max(...grid.map((row) => row.length));
	const columns = uniqueNames(header ? Array.from({ length: width }, (_, index) => grid[0]?.[index]?.trim() || `columna_${index + 1}`) : Array.from({ length: width }, (_, index) => `columna_${index + 1}`));
	const body = header ? grid.slice(1) : grid;
	const textColumn = columns[Math.min(textCol, columns.length - 1)] ?? columns[0];
	return {
		columns,
		textColumn,
		rows: body.map((cells, index) => {
			const record = {};
			columns.forEach((column, columnIndex) => {
				record[column] = cells[columnIndex] ?? "";
			});
			return {
				id: (idCol != null ? (record[columns[idCol] ?? ""] ?? "").trim() : "") || `R${index + 1}`,
				text: record[textColumn] ?? "",
				cells: record
			};
		})
	};
}
function guessTextColumn(columns) {
	const hit = columns.findIndex((column) => /(respuesta|marca|opinion|opini[oó]n|abierta|texto|comentario|verbatim|pregunta)/i.test(column));
	return hit >= 0 ? hit : columns.length === 1 ? 0 : Math.min(1, columns.length - 1);
}
function guessIdColumn(columns) {
	const hit = columns.findIndex((column) => /^(id|folio|entrevista|resp|caso|codigo|código)$/i.test(column.trim()));
	return hit >= 0 ? hit : null;
}
var MAYO = [
	"Kraft",
	"kraft",
	"KRAFT",
	"Kraf",
	"Craft",
	"Krfat",
	"Mayonesa Kraft",
	"Kraft.",
	"Mavesa",
	"maveza",
	"Mabesa",
	"Mavesaa",
	"mavesa",
	"Mavesa, Kraft",
	"Kraft, Mavesa",
	"Hellmann's",
	"Hellmanns",
	"Hellmans",
	"Helmans",
	"hellman",
	"Heinz",
	"heinz",
	"Heins",
	"Hienz",
	"McCormick",
	"Mc Cormick",
	"Macormick",
	"Mavesa, Hellmann's, Kraft",
	"Natura",
	"natural",
	"Fruco",
	"otros",
	"Otras marcas",
	"no se",
	"No sé",
	"no recuerdo",
	"ns/nr",
	"no aplica",
	"No consumo",
	"ninguna",
	"Kraft, no se",
	""
];
var OPINIONS = [
	"es muy cara",
	"está cara",
	"muy cara",
	"sale cara",
	"buena calidad",
	"es de buena calidad",
	"calidad",
	"me gusta el sabor",
	"por el sabor",
	"sabe rica",
	"está rica",
	"es rica",
	"no me gusta",
	"no es rica",
	"porque la compra mi mamá",
	"la compra mi mama",
	"es la de siempre",
	"la de siempre",
	"rinde más",
	"rinde mas",
	"es cremosa",
	"queda cremosa",
	"no se",
	"no aplica",
	"otros",
	"el empaque es bonito",
	"empaque bonito"
];
function sampleMayo() {
	return buildProject({
		question: "¿Cuáles marcas de mayonesa conoce, aunque sea de nombre?",
		settings: {
			mode: "marca",
			categoryWords: "mayonesa, mayo, aderezo",
			splitAnd: false,
			minFrequency: 2,
			emptyAs99: false
		},
		columns: ["respuesta"],
		textColumn: "respuesta",
		rows: linesToRows(MAYO)
	});
}
function sampleOpinions() {
	return buildProject({
		question: "¿Por qué compra esa mayonesa?",
		settings: {
			mode: "opinion",
			categoryWords: "",
			splitAnd: false,
			minFrequency: 2,
			emptyAs99: false
		},
		columns: ["respuesta"],
		textColumn: "respuesta",
		rows: linesToRows(OPINIONS)
	});
}
function SettingsFields({ settings, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Tipo de abierta"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "seg w-fit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": settings.mode === "marca",
						onClick: () => onChange({
							...settings,
							mode: "marca"
						}),
						children: "Marcas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": settings.mode === "opinion",
						onClick: () => onChange({
							...settings,
							mode: "opinion"
						}),
						children: "Opiniones"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Frecuencia mínima para código propio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field tabular-nums",
					type: "number",
					min: 1,
					max: 50,
					value: settings.minFrequency,
					onChange: (event) => onChange({
						...settings,
						minFrequency: Math.max(1, Math.min(50, Number(event.target.value) || 1))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-2 text-sm sm:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "Palabras de la categoría que no distinguen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: settings.categoryWords,
						placeholder: "mayonesa, mayo, aderezo",
						onChange: (event) => onChange({
							...settings,
							categoryWords: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "«Mayonesa Kraft» y «Kraft» quedan en el mismo código. En opiniones déjelo vacío."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "size-4",
					checked: settings.splitAnd,
					onChange: (event) => onChange({
						...settings,
						splitAnd: event.target.checked
					})
				}), "Separar también por «y» / «e»"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "size-4",
					checked: settings.emptyAs99,
					onChange: (event) => onChange({
						...settings,
						emptyAs99: event.target.checked
					})
				}), "Vacíos como 99"]
			})
		]
	});
}
function Loader({ question, onQuestion, settings, onSettings, onReady, onCancel }) {
	const [paste, setPaste] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(null);
	function adopt(project) {
		setError("");
		onReady(project);
	}
	function codePaste() {
		const rows = linesToRows(paste.split(/\r?\n/));
		if (!rows.some((row) => row.text.trim())) {
			setError("Pegue al menos una respuesta. Una por línea; las marcas van separadas por coma.");
			return;
		}
		adopt(buildProject({
			question: question.trim() || "Pregunta abierta",
			settings,
			columns: ["respuesta"],
			textColumn: "respuesta",
			rows
		}));
	}
	async function onFile(file) {
		const grid = parseTable(await file.text());
		if (!grid.length) {
			setError("El archivo está vacío.");
			return;
		}
		if (Math.max(...grid.map((row) => row.length)) <= 1) {
			const lines = grid.map((row) => row[0] ?? "");
			const header = /^(respuesta|texto|verbatim|comentario)$/i.test(lines[0]?.trim() ?? "");
			adopt(buildProject({
				question: question.trim() || "Pregunta abierta",
				settings,
				columns: ["respuesta"],
				textColumn: "respuesta",
				rows: linesToRows(header ? lines.slice(1) : lines)
			}));
			return;
		}
		const header = guessHeader(grid);
		const columns = header ? grid[0].map((cell, index) => cell.trim() || `columna_${index + 1}`) : grid[0].map((_, index) => `columna_${index + 1}`);
		setPending({
			filename: file.name,
			grid,
			header,
			textCol: guessTextColumn(columns),
			idCol: guessIdColumn(columns)
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
		adopt(buildProject({
			question: question.trim() || "Pregunta abierta",
			settings,
			...shaped
		}));
	}
	const previewColumns = pending ? pending.header ? pending.grid[0].map((cell, index) => cell.trim() || `columna_${index + 1}`) : pending.grid[0].map((_, index) => `columna_${index + 1}`) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.svg",
							alt: "",
							className: "size-10"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-2xl italic",
							children: "Libreto"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "max-w-xl font-serif text-4xl font-medium tracking-tight",
						children: "Del verbatim al diccionario"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-muted-foreground",
						children: "Separe cada marca u opinión, una las que están mal escritas y devuelva la base con códigos. 97 es no sabe / no recuerda, 98 otros y 99 no aplica."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "Así queda la biblioteca"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "data-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Respuesta" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Códigos" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "1_Kraft" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "2_Mavesa" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Kraft" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums font-medium",
										children: "1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums",
										children: "1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Mavesa, Kraft." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums font-medium",
										children: "2;1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums",
										children: "1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums",
										children: "1"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "no sé" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums font-medium",
										children: "97"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {})
								] })
							] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Los números van en el orden en que la persona escribió. Kraf, Craft o Krfat entran al código de Kraft."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "Pregunta"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: question,
						onChange: (event) => onQuestion(event.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsFields, {
					settings,
					onChange: onSettings
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-medium",
							children: "Pegar respuestas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Una respuesta por línea. Dentro de la línea, coma entre marcas."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field font-sans",
							value: paste,
							placeholder: "Kraft\nMavesa, Kraft\nno sé",
							onChange: (event) => setPaste(event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-primary",
							onClick: codePaste,
							children: "Codificar pegado"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel grid content-start gap-3",
					onDragOver: (event) => event.preventDefault(),
					onDrop: (event) => {
						event.preventDefault();
						const file = event.dataTransfer.files[0];
						if (file) onFile(file);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-medium",
							children: "Subir la base"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "CSV o texto separado por coma, punto y coma o tabulador. Se conservan las demás columnas."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "btn btn-outline",
							children: ["Elegir archivo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "sr-only",
								type: "file",
								accept: ".csv,.txt,.tsv,text/csv,text/plain",
								onChange: (event) => {
									const file = event.target.files?.[0];
									if (file) onFile(file);
									event.target.value = "";
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-secondary btn-tiny",
								onClick: () => adopt(sampleMayo()),
								children: "Ejemplo de marcas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-secondary btn-tiny",
								onClick: () => adopt(sampleOpinions()),
								children: "Ejemplo de opiniones"
							})]
						})
					]
				})]
			}),
			pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: "Qué columna es la abierta"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							pending.filename,
							" · ",
							pending.grid.length - (pending.header ? 1 : 0),
							" filas"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-4",
							checked: pending.header,
							onChange: (event) => setPending({
								...pending,
								header: event.target.checked
							})
						}), "La primera fila es encabezado"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Columna de respuestas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "field",
								value: pending.textCol,
								onChange: (event) => setPending({
									...pending,
									textCol: Number(event.target.value)
								}),
								children: previewColumns.map((column, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: index,
									children: column
								}, `${column}-${index}`))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Columna de ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "field",
								value: pending.idCol ?? "",
								onChange: (event) => setPending({
									...pending,
									idCol: event.target.value === "" ? null : Number(event.target.value)
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Consecutivo R1, R2…"
								}), previewColumns.map((column, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: index,
									children: column
								}, `${column}-id-${index}`))]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-primary w-fit",
						onClick: codeGrid,
						children: "Codificar base"
					})
				]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: error
			}) : null,
			onCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-ghost w-fit",
				onClick: onCancel,
				children: "Volver a la codificación"
			}) : null
		]
	});
}
var STORAGE_KEY = "libreto-project-v1";
function isProject(value) {
	if (!value || typeof value !== "object") return false;
	const project = value;
	return Array.isArray(project.rows) && Array.isArray(project.entries) && Boolean(project.settings);
}
function CoderApp() {
	const [project, setProject] = (0, import_react.useState)(null);
	const [question, setQuestion] = (0, import_react.useState)("¿Cuáles marcas conoce, aunque sea de nombre?");
	const [draft, setDraft] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [picking, setPicking] = (0, import_react.useState)(false);
	const [pane, setPane] = (0, import_react.useState)("biblioteca");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [confirmRebuild, setConfirmRebuild] = (0, import_react.useState)(false);
	const skipSave = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (!isProject(parsed)) return;
			setProject(parsed);
			setQuestion(parsed.question);
			setDraft(parsed.settings);
		} catch {} finally {
			skipSave.current = false;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (skipSave.current) return;
		try {
			if (project) localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
			else localStorage.removeItem(STORAGE_KEY);
		} catch {}
	}, [project]);
	const coded = (0, import_react.useMemo)(() => project ? codeRows(project.rows, project.entries, project.settings) : [], [project]);
	function adopt(next) {
		setProject(next);
		setQuestion(next.question);
		setDraft(next.settings);
		setPicking(false);
		setConfirmRebuild(false);
		setNotice("");
		setPane("diccionario");
	}
	function patchEntries(entries) {
		setProject((current) => current ? {
			...current,
			entries,
			edited: true
		} : current);
	}
	function updateQuestion(value) {
		setQuestion(value);
		setProject((current) => current ? {
			...current,
			question: value
		} : current);
	}
	function rebuild() {
		if (!project) return;
		const next = buildProject({
			question: question.trim() || project.question,
			settings: draft,
			columns: project.columns,
			textColumn: project.textColumn,
			rows: project.rows
		});
		setProject(next);
		setConfirmRebuild(false);
		setNotice("Diccionario recalculado.");
	}
	async function exportExcel() {
		if (!project) return;
		try {
			await downloadWorkbook({
				...project,
				question
			});
			setNotice("Biblioteca descargada. Trae las hojas Biblioteca, Diccionario, Menciones y Criterios.");
		} catch {
			setNotice("No se pudo armar el Excel. Use CSV.");
		}
	}
	async function copy() {
		if (!project) return;
		const text = copyCodes({
			...project,
			question
		});
		try {
			await navigator.clipboard.writeText(text);
			setNotice("Códigos copiados: id y códigos, listos para pegar junto a la base.");
		} catch {
			setNotice("No se pudo copiar. Descargue el archivo.");
		}
	}
	if (!project || picking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
			question,
			onQuestion: updateQuestion,
			settings: draft,
			onSettings: setDraft,
			onReady: adopt,
			onCancel: project ? () => setPicking(false) : void 0
		})
	});
	const settingsChanged = settingsSignature(draft) !== settingsSignature(project.settings);
	const propios = project.entries.filter((entry) => entry.kind === "item" && !entry.residual).length;
	const suggestions = project.entries.filter((entry) => entry.suggest).length;
	const reviews = coded.filter((row) => row.review).length;
	const mentions = project.entries.reduce((sum, entry) => sum + mentionCount(entry), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/favicon.svg",
								alt: "",
								className: "size-8"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-2xl italic leading-none",
								children: "Libreto"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Codificación de respuestas abiertas"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-outline",
								onClick: () => void copy(),
								children: "Copiar códigos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-outline",
								onClick: () => downloadCsv({
									...project,
									question
								}),
								children: "CSV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-primary",
								onClick: () => void exportExcel(),
								children: "Descargar Excel"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel grid gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Pregunta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							value: question,
							onChange: (event) => updateQuestion(event.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "grid gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "cursor-pointer text-sm font-medium",
							children: [
								"Criterios: ",
								draft.mode === "marca" ? "marcas" : "opiniones",
								" · mínimo ",
								draft.minFrequency,
								draft.categoryWords.trim() ? ` · ignora ${draft.categoryWords.trim()}` : "",
								settingsChanged ? " · sin recalcular" : ""
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsFields, {
								settings: draft,
								onChange: setDraft
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									settingsChanged ? confirmRebuild && project.edited ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "w-full text-sm text-warn",
											children: "Recalcular borra uniones y nombres que haya corregido a mano."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn btn-primary",
											onClick: rebuild,
											children: "Sí, recalcular"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn btn-ghost",
											onClick: () => setConfirmRebuild(false),
											children: "Cancelar"
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-primary",
										onClick: () => {
											if (project.edited) setConfirmRebuild(true);
											else rebuild();
										},
										children: "Recalcular diccionario"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Cámbielos y recalcule si la base debe leerse de otra forma."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-ghost",
										onClick: () => patchEntries(renumber(project.entries)),
										children: "Renumerar 1…n"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "btn btn-ghost",
										onClick: () => setPicking(true),
										children: "Cambiar base"
									})
								]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm tabular-nums text-muted-foreground",
					children: [
						project.rows.length,
						" respuestas · ",
						mentions,
						" menciones · ",
						propios,
						" códigos propios · ",
						reviews,
						" filas por revisar",
						suggestions ? ` · ${suggestions} parecidos sin confirmar` : "",
						project.columns.length > 1 ? ` · abierta en «${project.textColumn}»` : ""
					]
				}),
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: notice
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "seg w-fit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": pane === "biblioteca",
						onClick: () => setPane("biblioteca"),
						children: "Biblioteca"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": pane === "diccionario",
						onClick: () => setPane("diccionario"),
						children: "Diccionario"
					})]
				}),
				pane === "biblioteca" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {
					project: {
						...project,
						question
					},
					coded
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dictionary, {
					project,
					coded,
					onEntries: patchEntries
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "panel text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer font-medium",
						children: "Cómo se asignan los números"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Cada coma, punto y coma, barra o salto de línea es una mención. Si lo activa, también «y» / «e»." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mayúsculas, acentos y las palabras de la categoría no distinguen. Kraft, Kraf y Craft pueden ser el mismo código." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Lo que llega a la frecuencia mínima recibe 1, 2, 3… según cuántas veces aparece. El resto cae en 98." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "97 no sabe o no recuerda. 98 otros. 99 no aplica, no consume, o —si lo pide— la respuesta vacía." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Si nombra marcas y además dice «no sé», se conservan las marcas y el 97 no se agrega." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "En la biblioteca el orden es el de la frase: Mavesa, Kraft queda 2;1, no 1;2." })
						]
					})]
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoderApp, {});
}
//#endregion
export { Home as component };
