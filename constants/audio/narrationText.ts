import pronunciations from "./pronunciations.json";

/**
 * Narration-preprocessing layer: turns visible scripture text into text that
 * reads correctly aloud, without ever touching the scripture database itself.
 * Both AppleReaderService (client-side) and the backend generation pipeline
 * (server-side) run text through this same pass before speech, so the two
 * narration paths stay pronunciation-consistent.
 */

const PRONUNCIATIONS = pronunciations as Record<string, string>;

// Longest names first so e.g. a future overlapping substring can't shadow a
// longer, more specific entry.
const PRONUNCIATION_ENTRIES = Object.entries(PRONUNCIATIONS).sort((a, b) => b[0].length - a[0].length);

const PRONUNCIATION_RE = new RegExp(
  `\\b(${PRONUNCIATION_ENTRIES.map(([name]) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

const PRONUNCIATION_LOOKUP = new Map(PRONUNCIATION_ENTRIES.map(([name, spoken]) => [name.toLowerCase(), spoken]));

function applyPronunciations(text: string): string {
  if (!PRONUNCIATION_ENTRIES.length) return text;
  return text.replace(PRONUNCIATION_RE, (match) => PRONUNCIATION_LOOKUP.get(match.toLowerCase()) ?? match);
}

// KJV editions typeset the divine name in small caps ("LORD", "GOD"); most
// digital KJV text (including this app's) already normalizes that to plain
// "Lord"/"God", but where it doesn't, an all-caps run reads oddly aloud.
function titlecaseSacredNames(text: string): string {
  return text.replace(/\bLORD\b/g, "Lord").replace(/\bGOD\b/g, "God");
}

/** Applies the full narration-preprocessing pass to one verse's visible text.
 * The result is speech input only — never written back to the scripture data. */
export function normalizeForNarration(text: string): string {
  return applyPronunciations(titlecaseSacredNames(text));
}
