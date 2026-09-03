import { useMemo } from "react";
import { id } from "@instantdb/react-native";
import { db } from "@/lib/db";
import { HighlightColorKey, AtmosphereKey, nextAtmosphere } from "@/constants/theme";
import { Language } from "@/constants/i18n";

export function refKey(book: string, chapter: number, verse: number) {
  const displayBook = book === "Psalms" ? "Psalm" : book;
  return `${displayBook} ${chapter}:${verse}`;
}

const DEFAULT_ATMOSPHERE: AtmosphereKey = "parchment";
const DEFAULT_LANGUAGE: Language = "en";

export function useSettings(userId?: string) {
  const { data, isLoading } = db.useQuery(userId ? { settings: {} } : null);
  const row = data?.settings?.[0];

  const atmosphere = (row?.atmosphere as AtmosphereKey | undefined) ?? DEFAULT_ATMOSPHERE;
  const readerFontSize = row?.readerFontSize ?? 18;
  const notificationsOn = row?.notificationsOn ?? true;
  const language = (row?.language as Language | undefined) ?? DEFAULT_LANGUAGE;

  function ensureRow() {
    if (row || !userId) return null;
    const newId = id();
    db.transact(
      db.tx.settings[newId]
        .update({ atmosphere: DEFAULT_ATMOSPHERE, readerFontSize: 18, notificationsOn: true, language: DEFAULT_LANGUAGE })
        .link({ owner: userId })
    );
    return newId;
  }

  function update(
    patch: Partial<{ atmosphere: AtmosphereKey; readerFontSize: number; notificationsOn: boolean; language: Language }>
  ) {
    if (row) {
      db.transact(db.tx.settings[row.id].update(patch));
    } else if (userId) {
      const newId = id();
      db.transact(
        db.tx.settings[newId]
          .update({ atmosphere: DEFAULT_ATMOSPHERE, readerFontSize: 18, notificationsOn: true, language: DEFAULT_LANGUAGE, ...patch })
          .link({ owner: userId })
      );
    }
  }

  return {
    isLoading,
    atmosphere,
    readerFontSize,
    notificationsOn,
    language,
    setAtmosphere: (key: AtmosphereKey) => update({ atmosphere: key }),
    cycleAtmosphere: () => update({ atmosphere: nextAtmosphere(atmosphere) }),
    setReaderFontSize: (n: number) => update({ readerFontSize: n }),
    toggleNotifications: () => update({ notificationsOn: !notificationsOn }),
    setLanguage: (lang: Language) => update({ language: lang }),
    ensureRow,
  };
}

export function useBookmarks(userId?: string) {
  const { data, isLoading } = db.useQuery(userId ? { bookmarks: { $: { order: { createdAt: "desc" } } } } : null);
  const bookmarks = data?.bookmarks || [];

  const byRef = useMemo(() => {
    const m: Record<string, (typeof bookmarks)[number]> = {};
    bookmarks.forEach((b) => (m[b.ref] = b));
    return m;
  }, [bookmarks]);

  function isBookmarked(ref: string) {
    return !!byRef[ref];
  }

  function toggleBookmark(book: string, chapter: number, verse: number) {
    if (!userId) return;
    const ref = refKey(book, chapter, verse);
    const existing = byRef[ref];
    if (existing) {
      db.transact(db.tx.bookmarks[existing.id].delete());
    } else {
      const newId = id();
      db.transact(
        db.tx.bookmarks[newId]
          .update({ ref, book, chapter, verse, createdAt: Date.now() })
          .link({ owner: userId })
      );
    }
  }

  function removeBookmark(bookmarkId: string) {
    db.transact(db.tx.bookmarks[bookmarkId].delete());
  }

  return { isLoading, bookmarks, isBookmarked, toggleBookmark, removeBookmark };
}

export function useHighlights(userId?: string) {
  const { data, isLoading } = db.useQuery(userId ? { highlights: { $: { order: { createdAt: "desc" } } } } : null);
  const highlights = data?.highlights || [];

  const byRef = useMemo(() => {
    const m: Record<string, (typeof highlights)[number]> = {};
    highlights.forEach((h) => (m[h.ref] = h));
    return m;
  }, [highlights]);

  function highlightFor(ref: string) {
    return byRef[ref];
  }

  function setHighlight(book: string, chapter: number, verse: number, color: HighlightColorKey) {
    if (!userId) return;
    const ref = refKey(book, chapter, verse);
    const existing = byRef[ref];
    if (existing) {
      db.transact(db.tx.highlights[existing.id].update({ color }));
    } else {
      const newId = id();
      db.transact(
        db.tx.highlights[newId]
          .update({ ref, book, chapter, verse, color, createdAt: Date.now() })
          .link({ owner: userId })
      );
    }
  }

  function clearHighlight(ref: string) {
    const existing = byRef[ref];
    if (existing) db.transact(db.tx.highlights[existing.id].delete());
  }

  function removeHighlight(highlightId: string) {
    db.transact(db.tx.highlights[highlightId].delete());
  }

  return { isLoading, highlights, highlightFor, setHighlight, clearHighlight, removeHighlight };
}

export function useNotes(userId?: string) {
  const { data, isLoading } = db.useQuery(userId ? { notes: { $: { order: { createdAt: "desc" } } } } : null);
  const notes = data?.notes || [];

  function addNote(book: string, chapter: number, verse: number, text: string) {
    if (!userId || !text.trim()) return;
    const ref = refKey(book, chapter, verse);
    const newId = id();
    db.transact(
      db.tx.notes[newId]
        .update({ ref, book, chapter, verse, text: text.trim(), createdAt: Date.now() })
        .link({ owner: userId })
    );
  }

  function removeNote(noteId: string) {
    db.transact(db.tx.notes[noteId].delete());
  }

  return { isLoading, notes, addNote, removeNote };
}

export function usePlanProgress(
  userId: string | undefined,
  kind: "chrono" | "sin" | "studyCategory" | "studyWeekly"
) {
  const { data, isLoading } = db.useQuery(userId ? { planProgress: { $: { where: { kind } } } } : null);
  const rows = data?.planProgress || [];

  const done = useMemo(() => new Set(rows.map((r) => r.key)), [rows]);

  function toggle(key: string) {
    if (!userId) return;
    const existing = rows.find((r) => r.key === key);
    if (existing) {
      db.transact(db.tx.planProgress[existing.id].delete());
    } else {
      const newId = id();
      db.transact(db.tx.planProgress[newId].update({ kind, key }).link({ owner: userId }));
    }
  }

  return { isLoading, done, toggle };
}
