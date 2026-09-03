import React, { useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { verseText } from "@/constants/bible/verses";
import { localizeStoredRef } from "@/constants/bible/books";
import { HIGHLIGHT_COLORS, HighlightColorKey } from "@/constants/theme";

type Segment = "bookmarks" | "highlights" | "notes";

function snippet(book: string, chapter: number, verse: number) {
  const text = verseText(book, chapter, verse);
  return text.length > 90 ? text.slice(0, 90) + "…" : text;
}

export function LibraryScreen() {
  const { palette, bookmarks, highlights, notes, goTo, setTab, showToast, language, t } = useApp();
  const [segment, setSegment] = useState<Segment>("bookmarks");

  function newNote() {
    setTab("read");
    showToast(t("Tap a verse, then Note to add one"));
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.segRow}>
        <SegButton label={t("Bookmarks")} active={segment === "bookmarks"} onPress={() => setSegment("bookmarks")} />
        <SegButton label={t("Highlights")} active={segment === "highlights"} onPress={() => setSegment("highlights")} />
        <SegButton label={t("Notes")} active={segment === "notes"} onPress={() => setSegment("notes")} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {segment === "bookmarks" ? (
          bookmarks.bookmarks.length === 0 ? (
            <AppText dim>{t("No bookmarks yet. Tap a verse in Read to save one.")}</AppText>
          ) : (
            bookmarks.bookmarks.map((b) => (
              <View key={b.id} style={[styles.row, { backgroundColor: palette.card }]}>
                <Pressable onPress={() => goTo(b.book, b.chapter)} style={{ flex: 1 }}>
                  <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ marginBottom: 4 }}>
                    {localizeStoredRef(b.ref, language)}
                  </AppText>
                  <AppText variant="serif" size={14}>
                    {snippet(b.book, b.chapter, b.verse)}
                  </AppText>
                </Pressable>
                <Pressable onPress={() => bookmarks.removeBookmark(b.id)}>
                  <AppText dim size={16}>
                    ✕
                  </AppText>
                </Pressable>
              </View>
            ))
          )
        ) : null}

        {segment === "highlights" ? (
          highlights.highlights.length === 0 ? (
            <AppText dim>{t("No highlights yet.")}</AppText>
          ) : (
            highlights.highlights.map((h) => (
              <View key={h.id} style={[styles.row, { backgroundColor: palette.card }]}>
                <Pressable onPress={() => goTo(h.book, h.chapter)} style={styles.highlightLeft}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: HIGHLIGHT_COLORS[h.color as HighlightColorKey] || palette.accent },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ marginBottom: 4 }}>
                      {localizeStoredRef(h.ref, language)}
                    </AppText>
                    <AppText variant="serif" size={14}>
                      {snippet(h.book, h.chapter, h.verse)}
                    </AppText>
                  </View>
                </Pressable>
                <Pressable onPress={() => highlights.removeHighlight(h.id)}>
                  <AppText dim size={16}>
                    ✕
                  </AppText>
                </Pressable>
              </View>
            ))
          )
        ) : null}

        {segment === "notes" ? (
          <View style={{ gap: 10 }}>
            <Pressable onPress={newNote} style={[styles.newNoteBtn, { backgroundColor: palette.accent }]}>
              <AppText variant="sansExtraBold" size={13} color="#fff">
                {t("+ New Note")}
              </AppText>
            </Pressable>
            {notes.notes.length === 0 ? (
              <AppText dim>{t("No notes yet.")}</AppText>
            ) : (
              notes.notes.map((n) => (
                <View key={n.id} style={[styles.noteCard, { backgroundColor: palette.card }]}>
                  <View style={styles.rowBetween}>
                    <Pressable onPress={() => goTo(n.book, n.chapter)}>
                      <AppText variant="sansExtraBold" size={11} color={palette.accent}>
                        {localizeStoredRef(n.ref, language)} · {new Date(n.createdAt).toLocaleDateString(language === "es" ? "es" : undefined)}
                      </AppText>
                    </Pressable>
                    <Pressable onPress={() => notes.removeNote(n.id)}>
                      <AppText dim size={15}>
                        ✕
                      </AppText>
                    </Pressable>
                  </View>
                  <AppText size={14} style={{ lineHeight: 20, marginTop: 6 }}>
                    {n.text}
                  </AppText>
                </View>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
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
  content: { paddingBottom: 120, gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, padding: 14 },
  highlightLeft: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  newNoteBtn: { borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  noteCard: { borderRadius: 16, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
