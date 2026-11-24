import React, { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { verseText } from "@/constants/bible/verses";
import { localizeStoredRef } from "@/constants/bible/books";
import { BibleLanguage } from "@/constants/bible/verses";
import { HIGHLIGHT_COLORS, HighlightColorKey, Palette } from "@/constants/theme";

type Segment = "bookmarks" | "highlights" | "notes";

// A single row rendered as a Featured-style tile. All three segments share the
// same shape; `color` is only set for highlights and `text` only for notes.
type LibItem = {
  id: string;
  ref: string;
  book: string;
  chapter: number;
  verse: number;
  createdAt: number;
  color?: string;
  text?: string;
};

function snippet(book: string, chapter: number, verse: number) {
  const text = verseText(book, chapter, verse);
  return text.length > 90 ? text.slice(0, 90) + "…" : text;
}

// Buckets items (already sorted newest-first) into Today / This Week / Earlier.
// Returns only non-empty groups so headers never show above an empty grid.
function groupByDate(items: LibItem[], t: (s: string) => string) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

  const today: LibItem[] = [];
  const thisWeek: LibItem[] = [];
  const earlier: LibItem[] = [];
  for (const item of items) {
    if (item.createdAt >= todayStart) today.push(item);
    else if (item.createdAt >= weekStart) thisWeek.push(item);
    else earlier.push(item);
  }

  return [
    { label: t("Today"), items: today },
    { label: t("This Week"), items: thisWeek },
    { label: t("Earlier"), items: earlier },
  ].filter((g) => g.items.length > 0);
}

export function LibraryScreen() {
  const { palette, bookmarks, highlights, notes, goTo, setTab, showToast, language, t } = useApp();
  const [segment, setSegment] = useState<Segment>("bookmarks");

  function newNote() {
    setTab("read");
    showToast(t("Tap a verse, then Note to add one"));
  }

  const remove = (item: LibItem) => {
    if (segment === "bookmarks") bookmarks.removeBookmark(item.id);
    else if (segment === "highlights") highlights.removeHighlight(item.id);
    else notes.removeNote(item.id);
  };

  const items: LibItem[] =
    segment === "bookmarks"
      ? bookmarks.bookmarks
      : segment === "highlights"
      ? highlights.highlights
      : notes.notes;

  const groups = groupByDate(items, t);

  const emptyLabel =
    segment === "bookmarks"
      ? t("No bookmarks yet. Tap a verse in Read to save one.")
      : segment === "highlights"
      ? t("No highlights yet.")
      : t("No notes yet.");

  return (
    <View style={styles.wrap}>
      <View style={styles.segRow}>
        <SegButton label={t("Bookmarks")} active={segment === "bookmarks"} onPress={() => setSegment("bookmarks")} />
        <SegButton label={t("Highlights")} active={segment === "highlights"} onPress={() => setSegment("highlights")} />
        <SegButton label={t("Notes")} active={segment === "notes"} onPress={() => setSegment("notes")} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {segment === "notes" ? (
          <Pressable onPress={newNote} style={[styles.newNoteBtn, { backgroundColor: palette.accent }]}>
            <AppText variant="sansExtraBold" size={13} color="#fff">
              {t("+ New Note")}
            </AppText>
          </Pressable>
        ) : null}

        {items.length === 0 ? (
          <AppText dim>{emptyLabel}</AppText>
        ) : (
          groups.map((group) => (
            <View key={group.label} style={{ marginBottom: 18 }}>
              <AppText variant="sansExtraBold" size={13} dim style={styles.groupLabel}>
                {group.label.toUpperCase()}
              </AppText>
              <View style={styles.grid}>
                {group.items.map((item) => (
                  <LibTile
                    key={item.id}
                    item={item}
                    segment={segment}
                    palette={palette}
                    language={language}
                    onPress={() => goTo(item.book, item.chapter)}
                    onRemove={() => remove(item)}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function LibTile({
  item,
  segment,
  palette,
  language,
  onPress,
  onRemove,
}: {
  item: LibItem;
  segment: Segment;
  palette: Palette;
  language: BibleLanguage;
  onPress: () => void;
  onRemove: () => void;
}) {
  const body =
    segment === "notes" ? item.text || "" : snippet(item.book, item.chapter, item.verse);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, { backgroundColor: palette.card, borderColor: palette.divider }]}
      accessibilityRole="button"
      accessibilityLabel={localizeStoredRef(item.ref, language)}
    >
      <View style={styles.tileHeader}>
        {segment === "highlights" ? (
          <View
            style={[
              styles.dot,
              { backgroundColor: HIGHLIGHT_COLORS[item.color as HighlightColorKey] || palette.accent },
            ]}
          />
        ) : null}
        <AppText variant="sansExtraBold" size={11} color={palette.accent} numberOfLines={1} style={{ flex: 1 }}>
          {localizeStoredRef(item.ref, language)}
        </AppText>
        <Pressable onPress={onRemove} hitSlop={8}>
          <AppText dim size={14}>
            ✕
          </AppText>
        </Pressable>
      </View>
      <AppText variant={segment === "notes" ? "sans" : "serif"} size={13} numberOfLines={3} style={{ lineHeight: 18 }}>
        {body}
      </AppText>
    </Pressable>
  );
}

function SegButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { palette } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.segBtn, { backgroundColor: active ? palette.accent : palette.card }]}
    >
      <AppText variant="sansBold" size={12} color={active ? "#fff" : palette.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  segRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  segBtn: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  content: { paddingBottom: 120 },
  groupLabel: { letterSpacing: 1, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "47%",
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  tileHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  newNoteBtn: { borderRadius: 12, paddingVertical: 12, alignItems: "center", marginBottom: 16 },
});
