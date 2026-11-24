import React, { useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { OverlaySafeArea } from "@/components/OverlaySafeArea";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

const SECTIONS: { key: string; title: string; items: string[] }[] = [
  {
    key: "desk",
    title: "Publisher's Desk",
    items: [
      "The landing screen when you first open the app.",
      "See your current chapter, bookmarks and notes at a glance, and today's scripture.",
      "Browse featured collections from Twelve Scents Publishing.",
    ],
  },
  {
    key: "today",
    title: "Today",
    items: [
      "A daily home base with a greeting and the verse of the day.",
      "Refreshes with a new verse each time you open the app.",
      "Quick links jump you back into your reading.",
    ],
  },
  {
    key: "read",
    title: "Read",
    items: [
      "Tap the chapter name at the top to jump to any book or chapter.",
      "Swipe left or right on the text to move to the next or previous chapter.",
      "Tap a verse to highlight, bookmark, add a note, copy, or share it.",
      "To select multiple verses, tap a verse then choose \"Select More\" — the modal closes and that verse is selected. Tap any additional verses to add them, then apply highlights, copy, share, or bookmark the whole selection at once.",
      "You can also long-press any verse to jump straight into multi-select mode.",
      "A small ¹ next to a verse opens a Precepts topic with related cross-references.",
      "Turn on Red Letter in Settings to display the words of Christ in red italic.",
    ],
  },
  {
    key: "search",
    title: "Search",
    items: [
      "Search the full text of every verse across the KJV and Apocrypha.",
      "Narrow results to specific books when you need to.",
    ],
  },
  {
    key: "plans",
    title: "Reading Plans",
    items: [
      "The Chronological 1-Year plan walks through Scripture in historical order.",
      "Sin-Specific Battles is a topical study focused on spiritual warfare.",
      "Topic-based study plans let you dig into focused themes.",
      "Check off progress as you go — it's saved automatically.",
    ],
  },
  {
    key: "library",
    title: "Library",
    items: [
      "Every verse you've bookmarked, organized for quick review.",
      "Every note you've written, all in one place.",
    ],
  },
  {
    key: "precepts",
    title: "Precepts",
    items: [
      "Topical scripture chains — pick a theme and see every cross-reference tied to it.",
      "Tap any result to jump directly to that verse in the Read tab.",
    ],
  },
  {
    key: "settings",
    title: "Settings",
    items: [
      "Switch language between English, Español, and Kreyòl.",
      "Toggle notifications on or off.",
      "Choose a reading atmosphere: Royal Parchment, Temple Stone, or Midnight Scroll.",
      "Adjust reader font size.",
      "Enable Red Letter mode to show the words of Christ in red italic.",
      "Upload your own audio narration for any chapter.",
      "Access About Us, Feedback, and Help.",
    ],
  },
];

export function HowToUseOverlay() {
  const { palette, showHowToUse, setShowHowToUse, t } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Modal visible={showHowToUse} animationType="fade" onRequestClose={() => setShowHowToUse(false)}>
      <OverlaySafeArea style={[styles.container, { backgroundColor: palette.bg }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => setShowHowToUse(false)}
            style={[styles.backBtn, { backgroundColor: palette.cardAlt }]}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={20} color={palette.text} />
          </Pressable>
          <AppText variant="sansExtraBold" size={20}>
            {t("How to Use")}
          </AppText>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <AppText dim size={14} style={{ lineHeight: 20, marginBottom: 16 }}>
            {t("A quick guide to each part of the app. Tap a section to expand it.")}
          </AppText>

          <View style={{ gap: 10 }}>
            {SECTIONS.map((s) => {
              const isExpanded = expanded === s.key;
              return (
                <View key={s.key} style={[styles.card, { backgroundColor: palette.card }]}>
                  <Pressable onPress={() => setExpanded(isExpanded ? null : s.key)} style={styles.rowBetween}>
                    <AppText variant="sansExtraBold" size={15}>
                      {t(s.title)}
                    </AppText>
                    <AppText dim size={16}>
                      {isExpanded ? "−" : "+"}
                    </AppText>
                  </Pressable>
                  {isExpanded ? (
                    <View style={styles.itemList}>
                      {s.items.map((item, i) => (
                        <View key={i} style={styles.itemRow}>
                          <AppText size={12} dim style={styles.bullet}>·</AppText>
                          <AppText size={13} dim style={styles.itemText}>
                            {t(item)}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </OverlaySafeArea>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  card: { borderRadius: 16, padding: 18 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  itemList: { marginTop: 10, gap: 8 },
  itemRow: { flexDirection: "row", gap: 8 },
  bullet: { lineHeight: 19, width: 10 },
  itemText: { flex: 1, lineHeight: 19 },
});
