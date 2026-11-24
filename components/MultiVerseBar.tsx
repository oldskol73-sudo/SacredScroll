import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Share, BackHandler } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { HIGHLIGHT_COLORS, HIGHLIGHT_SWATCH_ORDER, HighlightColorKey } from "@/constants/theme";
import { versesFor } from "@/constants/bible/verses";
import { displayRef } from "@/constants/bible/books";

/** [3, 4, 5, 7] -> "3-5, 7" */
function formatVerseList(nums: number[]): string {
  const parts: string[] = [];
  let start = nums[0];
  let prev = nums[0];
  for (const n of [...nums.slice(1), NaN]) {
    if (n === prev + 1) {
      prev = n;
      continue;
    }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = prev = n;
  }
  return parts.join(", ");
}

export function MultiVerseBar() {
  const { palette, location, multiVerses, endMultiSelect, highlights, bookmarks, refKey, showToast, language, t } = useApp();

  useEffect(() => {
    if (!multiVerses) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      endMultiSelect();
      return true;
    });
    return () => sub.remove();
  }, [multiVerses, endMultiSelect]);

  if (!multiVerses) return null;

  const { book, chapter } = location;
  const verses = versesFor(book, chapter).filter((v) => multiVerses.includes(v.n));
  const label = `${displayRef(book, chapter, language)}:${formatVerseList(multiVerses)}`;
  const refs = multiVerses.map((n) => refKey(book, chapter, n));
  const allSaved = refs.every((r) => bookmarks.isBookmarked(r));

  function passageText() {
    const body = verses.length === 1 ? verses[0].text : verses.map((v) => `${v.n} ${v.text}`).join(" ");
    return `"${body}" — ${label}`;
  }

  function onSwatch(color: HighlightColorKey) {
    multiVerses!.forEach((n) => highlights.setHighlight(book, chapter, n, color));
    showToast(t("Highlight saved"));
  }

  function onClearHighlight() {
    refs.forEach((r) => highlights.clearHighlight(r));
    showToast(t("Highlight cleared"));
  }

  async function onShare() {
    await Share.share({ message: passageText() });
  }

  async function onCopy() {
    await Clipboard.setStringAsync(passageText());
    showToast(t("Copied to clipboard"));
  }

  // Saves any unsaved verses; only removes when every selected verse is already saved.
  function onToggleSave() {
    multiVerses!.forEach((n, i) => {
      if (allSaved || !bookmarks.isBookmarked(refs[i])) bookmarks.toggleBookmark(book, chapter, n);
    });
    showToast(allSaved ? t("Bookmark removed") : t("Bookmark saved"));
  }

  return (
    <View style={[styles.bar, { backgroundColor: palette.card, borderTopColor: palette.divider }]}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="sansExtraBold" size={14} numberOfLines={1}>
            {label}
          </AppText>
          <AppText dim size={11.5}>
            {multiVerses.length} {multiVerses.length === 1 ? t("verse") : t("verses")} · {t("Tap verses to add or remove them.")}
          </AppText>
        </View>
        <Pressable
          onPress={endMultiSelect}
          style={[styles.doneBtn, { backgroundColor: palette.accent }]}
          hitSlop={6}
          accessibilityRole="button"
        >
          <AppText variant="sansBold" size={12.5} color="#fff">
            {t("Done")}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.swatchRow}>
        {HIGHLIGHT_SWATCH_ORDER.map((key) => (
          <Pressable
            key={key}
            onPress={() => onSwatch(key)}
            style={[styles.swatch, { backgroundColor: HIGHLIGHT_COLORS[key], borderColor: palette.divider }]}
            accessibilityRole="button"
            accessibilityLabel={`${t("Highlight")} ${key}`}
          />
        ))}
        <Pressable
          onPress={onClearHighlight}
          style={[styles.swatch, styles.clearSwatch, { backgroundColor: palette.cardAlt, borderColor: palette.divider }]}
          accessibilityRole="button"
          accessibilityLabel={t("Clear highlight")}
        >
          <AppText size={12} dim>
            ✕
          </AppText>
        </Pressable>
      </View>

      <View style={[styles.actionRow, { borderTopColor: palette.divider }]}>
        <BarAction icon="share-outline" label={t("Share")} onPress={onShare} />
        <BarAction icon="copy-outline" label={t("Copy")} onPress={onCopy} />
        <BarAction icon={allSaved ? "bookmark" : "bookmark-outline"} label={t("Save")} onPress={onToggleSave} accent={allSaved} />
      </View>
    </View>
  );
}

function BarAction({
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
    <Pressable onPress={onPress} style={styles.actionBtn} accessibilityRole="button">
      <Ionicons name={icon} size={18} color={accent ? palette.accent : palette.text} />
      <AppText variant="sansBold" size={10} color={accent ? palette.accent : palette.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexShrink: 0,
    borderTopWidth: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 12,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  doneBtn: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 16 },
  swatchRow: { flexDirection: "row", justifyContent: "center", gap: 10 },
  swatch: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
  clearSwatch: { alignItems: "center", justifyContent: "center" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
  },
  actionBtn: { alignItems: "center", gap: 4, paddingHorizontal: 12 },
});
