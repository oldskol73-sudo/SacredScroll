import React from "react";
import { View, Pressable, Modal, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp, TabKey } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

const LOGO_BADGE = require("@/assets/images/bible/logo-badge.png");
const UPGRADE_EMBLEM = require("@/assets/images/bible/Publishing-profie-pic.png");

type NavKey = TabKey | "settings" | "precepts" | "desk" | "howToUse";

const NAV_ITEMS: { key: NavKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "desk", label: "Publisher's Desk", icon: "home-outline" },
  { key: "today", label: "Today", icon: "sunny-outline" },
  { key: "read", label: "Read", icon: "book-outline" },
  { key: "search", label: "Search", icon: "search-outline" },
  { key: "plans", label: "Plans", icon: "calendar-outline" },
  { key: "library", label: "Library", icon: "bookmark-outline" },
  { key: "precepts", label: "Precepts", icon: "list-outline" },
  { key: "howToUse", label: "How to Use", icon: "help-circle-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
];

export function Drawer() {
  const {
    palette,
    showDrawer,
    setShowDrawer,
    tab,
    setTab,
    desk,
    goToDesk,
    setShowSettings,
    setShowPrecepts,
    setShowHowToUse,
    setShowAboutTranslation,
    goTo,
    t,
  } = useApp();

  function onDailyVerse() {
    setShowDrawer(false);
    goTo("Psalms", 119);
  }

  function onTap(key: NavKey) {
    setShowDrawer(false);
    if (key === "desk") {
      goToDesk();
    } else if (key === "settings") {
      setShowSettings(true);
    } else if (key === "precepts") {
      setShowPrecepts(true);
    } else if (key === "howToUse") {
      setShowHowToUse(true);
    } else {
      setTab(key);
    }
  }

  return (
    <Modal visible={showDrawer} transparent animationType="fade" onRequestClose={() => setShowDrawer(false)}>
      <Pressable style={styles.backdrop} onPress={() => setShowDrawer(false)}>
        <Pressable style={[styles.panel, { backgroundColor: palette.bg }]} onPress={(e) => e.stopPropagation()}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[styles.hero, { backgroundColor: "#23160E" }]}>
              <Image source={LOGO_BADGE} style={styles.heroImage} resizeMode="contain" />
            </View>

            <View style={styles.navList}>
              {NAV_ITEMS.map((item) => {
                const active = item.key === "desk" ? desk : !desk && item.key === tab;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => onTap(item.key)}
                    style={[
                      styles.navItem,
                      {
                        backgroundColor: active ? palette.cardAlt : "transparent",
                        borderLeftColor: active ? palette.accent : "transparent",
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={17} color={active ? palette.accent : palette.text} />
                    <AppText variant="sansBold" size={14} color={active ? palette.accent : palette.text}>
                      {t(item.label)}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            <Image source={UPGRADE_EMBLEM} style={styles.upgradeImage} resizeMode="cover" />

            <Pressable onPress={onDailyVerse} style={[styles.verseCard, { borderColor: palette.divider }]}>
              <AppText variant="sansExtraBold" size={10} color={palette.accent} style={{ letterSpacing: 1 }}>
                {t("✧ DAILY VERSE ✧")}
              </AppText>
              <AppText variant="serif" size={13.5} style={{ marginTop: 8, lineHeight: 19, fontStyle: "italic" }}>
                {t("Thy word is a lamp unto my feet, and a light unto my path.")}
              </AppText>
              <AppText variant="sansBold" size={11.5} dim style={{ marginTop: 8 }}>
                Psalm 119:105
              </AppText>
            </Pressable>

            <Pressable onPress={() => setShowAboutTranslation(true)} style={styles.footer}>
              <AppText variant="sansExtraBold" size={11.5} color={palette.accent}>
                {t("KJV 1611 with Apocrypha")}
              </AppText>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(60,52,30,.35)",
    flexDirection: "row",
  },
  panel: {
    width: 250,
    height: "100%",
  },
  hero: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    // logo-badge.png is 600x825 (portrait); size the box to match its real
    // aspect ratio so "contain" doesn't shrink it to fit a short wide box.
    width: 70,
    height: 96,
    borderRadius: 8,
  },
  upgradeImage: {
    marginHorizontal: 14,
    marginTop: 14,
    width: 250 - 28, // panel width (250) minus the 14px margin on each side
    height: 250 - 28,
    borderRadius: 14,
  },
  navList: {
    padding: 10,
    gap: 2,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
  },
  verseCard: {
    margin: 14,
    marginTop: 0,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
});
