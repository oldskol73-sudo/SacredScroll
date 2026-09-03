import React from "react";
import { View, Pressable, Modal, StyleSheet, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { HIGHLIGHT_COLORS, HIGHLIGHT_SWATCH_ORDER, HighlightColorKey } from "@/constants/theme";
import { versesFor } from "@/constants/bible/verses";
import { displayRef } from "@/constants/bible/books";

export function VerseActionBar() {
  const {
    palette,
    location,
    selectedVerse,
    selectVerse,
    bookmarks,
    highlights,
    refKey,
    showNoteComposer,
    setShowNoteComposer,
    showToast,
    setTab,
    language,
    narration,
    setShowPlayer,
    t,
  } = useApp();
  const insets = useSafeAreaInsets();

  // Hide this modal while the note composer is open — two stacked RN Modals
  // at once can swallow touch input in the top one, making it unusable.
  const visible = selectedVerse !== null && !showNoteComposer;
  const verse = selectedVerse !== null ? versesFor(location.book, location.chapter).find((v) => v.n === selectedVerse) : null;
  const ref = selectedVerse !== null ? refKey(location.book, location.chapter, selectedVerse) : "";
  const isBookmarked = selectedVerse !== null && bookmarks.isBookmarked(ref);

  function close() {
    selectVerse(null);
  }

  async function onShare() {
    if (!verse) return;
    await Share.share({ message: `"${verse.text}" — ${displayRef(location.book, location.chapter, language)}:${verse.n}` });
  }

  async function onCopy() {
    if (!verse) return;
    await Clipboard.setStringAsync(`"${verse.text}" — ${displayRef(location.book, location.chapter, language)}:${verse.n}`);
    showToast(t("Copied to clipboard"));
  }

  function onSwatch(color: HighlightColorKey) {
    if (selectedVerse === null) return;
    highlights.setHighlight(location.book, location.chapter, selectedVerse, color);
    showToast(t("Highlight saved"));
  }

  function onClearHighlight() {
    highlights.clearHighlight(ref);
    showToast(t("Highlight cleared"));
  }

  function onToggleBookmark() {
    if (selectedVerse === null) return;
    bookmarks.toggleBookmark(location.book, location.chapter, selectedVerse);
    showToast(isBookmarked ? t("Bookmark removed") : t("Bookmark saved"));
  }

  function onNote() {
    setShowNoteComposer(true);
  }

  function onGoToBookmarks() {
    close();
    setTab("library");
  }

  function onReadVerse() {
    if (selectedVerse === null) return;
    narration.playVerseOnly(location.book, location.chapter, selectedVerse);
    setShowPlayer(true);
    close();
  }

  function onStartReadingHere() {
    if (selectedVerse === null) return;
    narration.playChapter(location.book, location.chapter, { fromVerse: selectedVerse });
    setShowPlayer(true);
    close();
  }

  if (!visible || !verse) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={[styles.closeRow, { paddingTop: insets.top + 10 }]}>
          <Pressable onPress={close} style={[styles.closeBtn, { backgroundColor: palette.card }]}>
            <AppText variant="sansBold" size={13}>
              {t("Close ✕")}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.verseWrap}>
          <View
            style={[
              styles.verseCard,
              { backgroundColor: palette.cardAlt, borderColor: "rgba(200,168,107,.5)" },
            ]}
          >
            <AppText variant="serif" size={17} style={{ textAlign: "center", lineHeight: 25 }}>
              "{verse.text}"
            </AppText>
            <AppText variant="sansBold" size={13} dim style={{ textAlign: "center", marginTop: 14, opacity: 0.85 }}>
              {displayRef(location.book, location.chapter, language)}:{verse.n}
            </AppText>
          </View>
        </View>

        <View style={[styles.sheet, { backgroundColor: palette.card }]}>
          <View style={styles.swatchRow}>
            {HIGHLIGHT_SWATCH_ORDER.map((key) => (
              <Pressable
                key={key}
                onPress={() => onSwatch(key)}
                style={[styles.swatch, { backgroundColor: HIGHLIGHT_COLORS[key], borderColor: palette.divider }]}
              />
            ))}
            <Pressable onPress={onClearHighlight} style={[styles.swatch, { backgroundColor: palette.cardAlt, borderColor: palette.divider, alignItems: "center", justifyContent: "center" }]}>
              <AppText size={12} dim>
                ✕
              </AppText>
            </Pressable>
          </View>
          <View style={[styles.actionRow, { borderTopColor: palette.divider }]}>
            <ActionButton icon="volume-medium-outline" label={t("Read Verse")} onPress={onReadVerse} />
            <ActionButton icon="play-outline" label={t("Start Reading Here")} onPress={onStartReadingHere} />
          </View>

          <View style={[styles.actionRow, { borderTopColor: palette.divider }]}>
            <ActionButton icon="share-outline" label={t("Share")} onPress={onShare} />
            <ActionButton icon="copy-outline" label={t("Copy")} onPress={onCopy} />
            <ActionButton icon={isBookmarked ? "bookmark" : "bookmark-outline"} label={t("Save")} onPress={onToggleBookmark} accent={isBookmarked} />
            <ActionButton icon="create-outline" label={t("Note")} onPress={onNote} />
            <ActionButton icon="list-outline" label={t("Bookmarks")} onPress={onGoToBookmarks} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  accent?: boolean;
}) {
  const { palette } = useApp();
  return (
    <Pressable onPress={onPress} style={styles.actionBtn}>
      <Ionicons name={icon} size={18} color={accent ? palette.accent : palette.text} />
      <AppText variant="sansBold" size={10} color={accent ? palette.accent : palette.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(60,52,30,.4)",
  },
  closeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  closeBtn: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  verseWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  verseCard: {
    width: "100%",
    maxWidth: 280,
    borderRadius: 18,
    borderWidth: 1,
    padding: 26,
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  swatchRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  swatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
  },
});
