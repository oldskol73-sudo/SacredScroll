import { BIBLE, BibleLanguage } from "./verses";
import bookLabelsEs from "./data/book_labels_es.json";
import bookLabelsHt from "./data/book_labels_ht.json";

const BOOK_LABELS_ES = bookLabelsEs as Record<string, string>;
const BOOK_LABELS_HT = bookLabelsHt as Record<string, string>;

export type BookSection = "Old Testament" | "Apocrypha" | "New Testament";

export interface BookInfo {
  name: string;
  count: number;
  section: BookSection;
  available: boolean;
}

const RAW: { section: BookSection; books: { name: string; count: number }[] }[] = [
  {
    section: "Old Testament",
    books: [
      { name: "Genesis", count: 50 },
      { name: "Exodus", count: 40 },
      { name: "Leviticus", count: 27 },
      { name: "Numbers", count: 36 },
      { name: "Deuteronomy", count: 34 },
      { name: "Joshua", count: 24 },
      { name: "Judges", count: 21 },
      { name: "Ruth", count: 4 },
      { name: "1 Samuel", count: 31 },
      { name: "2 Samuel", count: 24 },
      { name: "1 Kings", count: 22 },
      { name: "2 Kings", count: 25 },
      { name: "1 Chronicles", count: 29 },
      { name: "2 Chronicles", count: 36 },
      { name: "Ezra", count: 10 },
      { name: "Nehemiah", count: 13 },
      { name: "Esther", count: 10 },
      { name: "Job", count: 42 },
      { name: "Psalms", count: 150 },
      { name: "Proverbs", count: 31 },
      { name: "Ecclesiastes", count: 12 },
      { name: "Song of Solomon", count: 8 },
      { name: "Isaiah", count: 66 },
      { name: "Jeremiah", count: 52 },
      { name: "Lamentations", count: 5 },
      { name: "Ezekiel", count: 48 },
      { name: "Daniel", count: 12 },
      { name: "Hosea", count: 14 },
      { name: "Joel", count: 3 },
      { name: "Amos", count: 9 },
      { name: "Obadiah", count: 1 },
      { name: "Jonah", count: 4 },
      { name: "Micah", count: 7 },
      { name: "Nahum", count: 3 },
      { name: "Habakkuk", count: 3 },
      { name: "Zephaniah", count: 3 },
      { name: "Haggai", count: 2 },
      { name: "Zechariah", count: 14 },
      { name: "Malachi", count: 4 },
    ],
  },
  {
    section: "Apocrypha",
    books: [
      { name: "1 Esdras", count: 9 },
      { name: "2 Esdras", count: 16 },
      { name: "Tobit", count: 14 },
      { name: "Judith", count: 16 },
      { name: "Additions to Esther", count: 6 },
      { name: "Wisdom of Solomon", count: 19 },
      { name: "Ecclesiasticus (Sirach)", count: 51 },
      { name: "Baruch", count: 5 },
      { name: "Letter of Jeremiah", count: 1 },
      { name: "Prayer of Azariah & Song of the Three", count: 1 },
      { name: "Susanna", count: 1 },
      { name: "Bel and the Dragon", count: 1 },
      { name: "Prayer of Manasseh", count: 1 },
      { name: "1 Maccabees", count: 16 },
      { name: "2 Maccabees", count: 15 },
    ],
  },
  {
    section: "New Testament",
    books: [
      { name: "Matthew", count: 28 },
      { name: "Mark", count: 16 },
      { name: "Luke", count: 24 },
      { name: "John", count: 21 },
      { name: "Acts", count: 28 },
      { name: "Romans", count: 16 },
      { name: "1 Corinthians", count: 16 },
      { name: "2 Corinthians", count: 13 },
      { name: "Galatians", count: 6 },
      { name: "Ephesians", count: 6 },
      { name: "Philippians", count: 4 },
      { name: "Colossians", count: 4 },
      { name: "1 Thessalonians", count: 5 },
      { name: "2 Thessalonians", count: 3 },
      { name: "1 Timothy", count: 6 },
      { name: "2 Timothy", count: 4 },
      { name: "Titus", count: 3 },
      { name: "Philemon", count: 1 },
      { name: "Hebrews", count: 13 },
      { name: "James", count: 5 },
      { name: "1 Peter", count: 5 },
      { name: "2 Peter", count: 3 },
      { name: "1 John", count: 5 },
      { name: "2 John", count: 1 },
      { name: "3 John", count: 1 },
      { name: "Jude", count: 1 },
      { name: "Revelation", count: 22 },
    ],
  },
];

export function isChapterLoaded(book: string, chapter: number): boolean {
  return !!BIBLE[book]?.[String(chapter)]?.length;
}

function bookHasAnyChapter(name: string): boolean {
  const chapters = BIBLE[name];
  return !!chapters && Object.keys(chapters).length > 0;
}

export const BOOKS_PICKER: { section: BookSection; books: BookInfo[] }[] = RAW.map(
  (sec) => ({
    section: sec.section,
    books: sec.books.map((b) => ({
      ...b,
      section: sec.section,
      available: bookHasAnyChapter(b.name),
    })),
  })
);

export const ALL_BOOKS: BookInfo[] = BOOKS_PICKER.flatMap((s) => s.books);

export function bookInfo(name: string): BookInfo | undefined {
  return ALL_BOOKS.find((b) => b.name === name);
}

const BOOK_ALIASES: Record<string, string> = {
  Psalm: "Psalms",
  Revelations: "Revelation",
  "Sirach/Ecclesiasticus": "Ecclesiasticus (Sirach)",
  Sirach: "Ecclesiasticus (Sirach)",
};

/** Resolves alternate spellings (e.g. "Revelations", "Sirach/Ecclesiasticus") to this app's canonical book name. */
export function resolveBookName(name: string): string {
  if (bookInfo(name)) return name;
  return BOOK_ALIASES[name] || name;
}

const SECTION_LABELS_ES: Record<BookSection, string> = {
  "Old Testament": "Antiguo Testamento",
  Apocrypha: "Apócrifos",
  "New Testament": "Nuevo Testamento",
};

const SECTION_LABELS_HT: Record<BookSection, string> = {
  "Old Testament": "Ansyen Testaman",
  Apocrypha: "Apokrif",
  "New Testament": "Nouvo Testaman",
};

export function sectionLabel(section: BookSection, lang: BibleLanguage = "en"): string {
  if (lang === "es") return SECTION_LABELS_ES[section];
  if (lang === "ht") return SECTION_LABELS_HT[section];
  return section;
}

/** Localized display name for a canonical book key (e.g. "Psalms" -> "Salmos" in es). */
export function bookLabel(book: string, lang: BibleLanguage = "en"): string {
  if (lang === "es") return BOOK_LABELS_ES[book] || book;
  if (lang === "ht") return BOOK_LABELS_HT[book] || book;
  return book === "Psalms" ? "Psalm" : book;
}

export function displayRef(book: string, chapter: number, lang: BibleLanguage = "en"): string {
  return `${bookLabel(book, lang)} ${chapter}`;
}

/** Localized "Book Chapter:Verse" for a single verse, e.g. "Salmos 23:1". */
export function displayVerseRef(book: string, chapter: number, verse: number, lang: BibleLanguage = "en"): string {
  return `${bookLabel(book, lang)} ${chapter}:${verse}`;
}

// Matches "Book Chapter:Verse" (book names may contain spaces/parens, e.g. "Ecclesiasticus (Sirach)").
const REF_RE = /^(.+?) (\d+):(\d+)$/;

/** Re-displays an already-stored English ref string (e.g. "Psalm 23:1", the format
 * refKey() produces) in the target language, without changing the underlying stored
 * identifier. Returns the input unchanged if it doesn't parse as a simple ref. */
export function localizeStoredRef(ref: string, lang: BibleLanguage): string {
  if (lang === "en") return ref;
  const m = ref.match(REF_RE);
  if (!m) return ref;
  const book = resolveBookName(m[1]);
  return displayVerseRef(book, Number(m[2]), Number(m[3]), lang);
}

export interface Location {
  book: string;
  chapter: number;
}

/** Previous/next chapter across the whole canon (Old Testament -> Apocrypha -> New Testament). */
export function adjacentChapter(book: string, chapter: number, dir: 1 | -1): Location | null {
  const idx = ALL_BOOKS.findIndex((b) => b.name === book);
  if (idx === -1) return null;
  const info = ALL_BOOKS[idx];

  const targetChapter = chapter + dir;
  if (targetChapter >= 1 && targetChapter <= info.count) {
    return { book, chapter: targetChapter };
  }

  const nextIdx = idx + dir;
  if (nextIdx < 0 || nextIdx >= ALL_BOOKS.length) return null;
  const nextBook = ALL_BOOKS[nextIdx];
  return { book: nextBook.name, chapter: dir === 1 ? 1 : nextBook.count };
}
