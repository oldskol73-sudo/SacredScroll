import React, { useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

const SECTIONS = [
  {
    key: "desk",
    title: "Publisher's Desk",
    body: "The landing screen when you first open the app — your current chapter, bookmarks and notes at a glance, today's scripture, and featured collections from Twelve Scents Publishing.",
  },
  {
    key: "today",
    title: "Today",
    body: "A daily home base with a greeting, the verse of the day, and quick links back into your reading. It refreshes with a new verse each time you open it.",
  },
  {
    key: "read",
    title: "Read",
    body: "Tap the chapter name at the top to jump to any book or chapter. Tap a verse to highlight, bookmark, add a note, copy, or share it. A small ¹ next to a verse links to a Precepts topic for related cross-references.",
  },
  {
    key: "search",
    title: "Search",
    body: "Search the full text of every verse across the KJV and Apocrypha. Narrow results to specific books when you need to.",
  },
  {
    key: "plans",
    title: "Reading Plans",
    body: "The Chronological 1-Year plan, the Sin-Specific Battles topical study, and the topic-based study plans all live here, with progress you can check off as you go.",
  },
  {
    key: "library",
    title: "Library",
    body: "Every verse you've bookmarked and every note you've written, all in one place, organized for quick review.",
  },
  {
    key: "precepts",
    title: "Precepts",
    body: "Topical scripture chains — pick a theme and see every cross-reference tied to it, with a one-tap link back into the Read tab for full context.",
  },
  {
    key: "settings",
    title: "Settings",
    body: "Toggle notifications, switch reading atmosphere (Royal Parchment, Temple Stone, Midnight Scroll), adjust font size, upload your own chapter narrations, and find About Us and Feedback.",
  },
];

export function HowToUseOverlay() {
  const { palette, showHowToUse, setShowHowToUse, t } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Modal visible={showHowToUse} animationType="fade" onRequestClose={() => setShowHowToUse(false)}>
      <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["top", "bottom"]}>
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
                    <AppText size={13} dim style={{ lineHeight: 19, marginTop: 10 }}>
                      {t(s.body)}
                    </AppText>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
      </SafeAreaProvider>
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
});
