import kjva from "./data/kjva.json";
import rv1909 from "./data/rv1909.json";
import rv1909Apocrypha from "./data/rv1909_apocrypha.json";
import ht from "./data/ht.json";
import htApocrypha from "./data/ht_apocrypha.json";
import { PRECEPT_TOPICS } from "./precepts";

export interface Verse {
  n: number;
  text: string;
}

export type BibleLanguage = "en" | "es" | "ht";

// Full KJV (1769 text) + Apocrypha, 81 books / 1,361 chapters, sourced from a
// public-domain KJVA dataset and normalized to this app's book names in
// scripts (see constants/bible/data/kjva.json). Shape: book -> chapter -> verses.
export const BIBLE = kjva as unknown as Record<string, Record<string, Verse[]>>;

// Reina-Valera 1909 (public domain, CC0) for the 66 canonical books, plus a partial
// Spanish Apocrypha assembled from a public-domain 1823 Torres Amat scan (Internet
// Archive OCR, hand-parsed out of its interleaved Spanish/Latin Vulgate layout — see
// project notes). The Apocrypha coverage is real but incomplete: some books/chapters
// couldn't be reliably separated from the parallel Latin text or footnotes and are
// simply absent here, and verse *numbers* within a captured chapter are sequential
// per-chapter rather than guaranteed to match standard versification exactly (a few
// verse-start boundaries were unrecoverable from the OCR, so verses are numbered by
// reading order, not renumbered against a reference edition). Both are keyed by the
// SAME English canonical book names used throughout this app (so every other lookup —
// bookmarks, notes, search scope, precepts anchors — keeps working unchanged regardless
// of reading language). versesFor() below falls back to English per-chapter for
// anything not covered, and isTranslationAvailable() lets callers show a note about it.
const BIBLE_ES: Record<string, Record<string, Verse[]>> = {
  ...(rv1909 as unknown as Record<string, Record<string, Verse[]>>),
  ...(rv1909Apocrypha as unknown as Record<string, Record<string, Verse[]>>),
};

// Bib La (Haitian Creole, public domain, published 1985 without copyright
// notice) for the 66 canonical books, plus a public-domain Haitian Creole
// Apocrypha covering all 15 deuterocanonical books this app tracks. Both are
// keyed by the same English canonical book names as everything else. Unlike
// the Spanish Apocrypha, this Creole Apocrypha coverage is complete.
const BIBLE_HT: Record<string, Record<string, Verse[]>> = {
  ...(ht as unknown as Record<string, Record<string, Verse[]>>),
  ...(htApocrypha as unknown as Record<string, Record<string, Verse[]>>),
};

let _lang: BibleLanguage = "en";

/** Sets which language versesFor/verseText/search/daily-verse read from. Called from
 * AppContext whenever the user's language setting changes. Invalidates cached flat/daily
 * verse lists so they get rebuilt in the new language. */
export function setBibleLanguage(lang: BibleLanguage) {
  if (lang === _lang) return;
  _lang = lang;
  _flat = null;
  _dailyVersePool = null;
}

export function getBibleLanguage(): BibleLanguage {
  return _lang;
}

/** True when a real (non-fallback) translation exists for this specific chapter
 * in the given language (not just the book — Spanish Apocrypha coverage is
 * partial per-chapter). English is always available. */
export function isTranslationAvailable(book: string, chapter: number, lang: BibleLanguage): boolean {
  if (lang === "en") return true;
  const table = lang === "es" ? BIBLE_ES : BIBLE_HT;
  return !!table[book]?.[String(chapter)]?.length;
}

function activeBible(): Record<string, Record<string, Verse[]>> {
  if (_lang === "es") return BIBLE_ES;
  if (_lang === "ht") return BIBLE_HT;
  return BIBLE;
}

export function versesFor(book: string, chapter: number): Verse[] {
  const primary = activeBible()[book]?.[String(chapter)];
  if (primary?.length) return primary;
  // Fall back to English (e.g. Spanish Apocrypha not sourced yet).
  return BIBLE[book]?.[String(chapter)] || [];
}

export function verseText(book: string, chapter: number, verse: number): string {
  return versesFor(book, chapter).find((v) => v.n === verse)?.text || "";
}

export interface FlatVerse {
  book: string;
  chapter: number;
  n: number;
  text: string;
  ref: string;
}

let _flat: FlatVerse[] | null = null;

function allVersesFlat(): FlatVerse[] {
  if (_flat) return _flat;
  const bible = activeBible();
  const out: FlatVerse[] = [];
  for (const book of Object.keys(BIBLE)) {
    const displayBook = book === "Psalms" ? "Psalm" : book;
    const chapters = bible[book] || BIBLE[book];
    for (const chapterKey of Object.keys(chapters)) {
      const chapter = Number(chapterKey);
      for (const v of chapters[chapterKey]) {
        out.push({ book, chapter, n: v.n, text: v.text, ref: `${displayBook} ${chapter}:${v.n}` });
      }
    }
  }
  _flat = out;
  return out;
}

export interface SearchMatch extends FlatVerse {
  matchStart: number;
  matchEnd: number;
}

const SEARCH_RESULT_LIMIT = 60;

export function searchVerses(query: string, scopeBooks?: string[]): SearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scopeSet = scopeBooks ? new Set(scopeBooks) : null;
  const pool = scopeSet ? allVersesFlat().filter((v) => scopeSet.has(v.book)) : allVersesFlat();
  const results: SearchMatch[] = [];
  for (const v of pool) {
    const idx = v.text.toLowerCase().indexOf(q);
    if (idx !== -1) {
      results.push({ ...v, matchStart: idx, matchEnd: idx + q.length });
      if (results.length >= SEARCH_RESULT_LIMIT) break;
    }
  }
  return results;
}

export interface DailyVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  ref: string;
  note?: string;
}

// The verse the daily rotation starts on. Day 0 (DAILY_VERSE_EPOCH) shows this verse;
// each subsequent calendar day advances one entry through the precepts ref pool below.
const DAILY_VERSE_START_REF = "Jeremiah 14:2";
const DAILY_VERSE_EPOCH = new Date(2026, 7, 24); // 2026-08-24, local midnight

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  const m = ref.match(/^(.+) (\d+):(\d+)(?:-\d+)?$/);
  if (!m) return null;
  const book = m[1] === "Psalm" ? "Psalms" : m[1];
  return { book, chapter: Number(m[2]), verse: Number(m[3]) };
}

let _dailyVersePool: (DailyVerse & { book: string })[] | null = null;

// Every distinct scripture reference cited across PRECEPT_TOPICS, in the order they
// first appear, each resolved to its full text in the active language.
function dailyVersePool(): DailyVerse[] {
  if (_dailyVersePool) return _dailyVersePool;
  const seen = new Set<string>();
  const out: DailyVerse[] = [];
  for (const topic of PRECEPT_TOPICS) {
    for (const r of topic.refs) {
      if (seen.has(r.ref)) continue;
      const parsed = parseRef(r.ref);
      if (!parsed) continue;
      const text = verseText(parsed.book, parsed.chapter, parsed.verse);
      if (!text) continue;
      seen.add(r.ref);
      out.push({ ...parsed, text, ref: r.ref, note: r.note });
    }
  }
  _dailyVersePool = out;
  return out;
}

export function getDailyVerse(date: Date = new Date()): DailyVerse {
  const pool = dailyVersePool();
  const startIdx = Math.max(
    0,
    pool.findIndex((v) => v.ref === DAILY_VERSE_START_REF)
  );
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayIndex = Math.round((today.getTime() - DAILY_VERSE_EPOCH.getTime()) / 86400000);
  const idx = ((startIdx + dayIndex) % pool.length + pool.length) % pool.length;
  return pool[idx];
}

/** Picks a fresh random verse from the same pool as getDailyVerse — used to vary the
 * verse-of-the-day each time the app is opened, rather than once per calendar day. */
export function getRandomVerse(): DailyVerse {
  const pool = dailyVersePool();
  return pool[Math.floor(Math.random() * pool.length)];
}
