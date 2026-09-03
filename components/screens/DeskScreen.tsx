import React, { useMemo } from "react";
import { View, ScrollView, Pressable, Image, StyleSheet, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { getRandomVerse } from "@/constants/bible/verses";
import { displayRef } from "@/constants/bible/books";

const TSP_LOGO = require("@/assets/images/bible/tsp-logo-cover.jpg");
const FOUNDED_BANNER = require("@/assets/images/bible/founded-banner.jpg");
const BIBLE_MAST = require("@/assets/images/bible/Biblemast.jpeg");

function greeting(t: (s: string) => string) {
  const h = new Date().getHours();
  if (h < 12) return t("Good morning");
  if (h < 18) return t("Good afternoon");
  return t("Good evening");
}

function dateLabel(language: string) {
  return new Date().toLocaleDateString(language === "es" ? "es" : undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function DeskScreen() {
  const { palette, location, enterContinueReading, skipToLibrary, goTo, bookmarks, notes, showToast, language, t } = useApp();
  const insets = useSafeAreaInsets();

  const votd = useMemo(() => getRandomVerse(), []);
  const votdBookmarked = bookmarks.isBookmarked(votd.ref);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["bottom"]}>
      <ScrollView>
        <View style={styles.hero}>
          <LinearGradient colors={["#23160E", "#4B3626"]} style={StyleSheet.absoluteFill} />
          <View style={styles.logoWatermarkWrap} pointerEvents="none">
            <Image source={TSP_LOGO} style={styles.logoWatermark} resizeMode="contain" />
          </View>
          <View style={[styles.heroContent, { paddingTop: insets.top + 22 }]}>
            <View style={styles.greetingRow}>
              <View>
                <AppText variant="sansExtraBold" size={11.5} color="rgba(255,255,255,.7)" style={{ letterSpacing: 0.5 }}>
                  {dateLabel(language).toUpperCase()}
                </AppText>
                <AppText variant="serifBold" size={24} color="#fff" style={{ marginTop: 2 }}>
                  {greeting(t)}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Pressable onPress={enterContinueReading} style={[styles.bookCard, { backgroundColor: palette.card }]}>
            <View style={styles.bookCardRow}>
              <Image source={BIBLE_MAST} style={styles.bookCover} resizeMode="cover" />
              <View style={{ flex: 1, minWidth: 0, alignItems: "center" }}>
                <AppText variant="sansExtraBold" size={15}>
                  {displayRef(location.book, location.chapter, language)}
                </AppText>
                <View style={[styles.statsRow, { marginTop: 8 }]}>
                  <Stat value={bookmarks.bookmarks.length} label={t("Bookmarks")} />
                  <Stat value={notes.notes.length} label={t("Notes")} />
                </View>
              </View>
            </View>
            <View style={[styles.bookCtaBtn, { backgroundColor: palette.accent }]}>
              <AppText variant="sansExtraBold" size={13} color="#fff">
                {t("Continue Reading")}
              </AppText>
            </View>
          </Pressable>

          <View>
            <SectionLabel>{t("Today's Scripture")}</SectionLabel>
            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.divider }]}>
              <AppText variant="serif" size={19} style={{ lineHeight: 28 }}>
                "{votd.text}"
              </AppText>
              <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
                {votd.ref} · KJV
              </AppText>
              <View style={styles.btnRow}>
                <Pressable
                  onPress={() => goTo(votd.book, votd.chapter)}
                  style={[styles.smallBtn, { backgroundColor: palette.accent }]}
                >
                  <AppText variant="sansBold" size={12.5} color="#fff">
                    {t("Read Full Chapter")}
                  </AppText>
                </Pressable>
                <Pressable
                  onPress={() =>
                    bookmarks.toggleBookmark(votd.book, votd.chapter, votd.verse)
                  }
                  style={[
                    styles.smallBtn,
                    { backgroundColor: votdBookmarked ? palette.accent : palette.cardAlt },
                  ]}
                >
                  <AppText variant="sansBold" size={12.5} color={votdBookmarked ? "#fff" : palette.text}>
                    {t("Bookmark")}
                  </AppText>
                </Pressable>
                <Pressable onPress={() => showToast(t("Coming soon"))} style={[styles.smallBtn, { backgroundColor: palette.cardAlt }]}>
                  <AppText variant="sansBold" size={12.5}>
                    {t("Share")}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>

          <View>
            <SectionLabel>{t("Featured Collection")}</SectionLabel>
            <View style={[styles.card, { backgroundColor: palette.card, padding: 0, overflow: "hidden" }]}>
              <Image source={FOUNDED_BANNER} style={styles.collectionArt} resizeMode="cover" />
              <View style={{ padding: 18 }}>
                <AppText variant="serifBold" size={18}>
                  {t("Mighty Men of Valor")}
                </AppText>
                <AppText size={12.5} dim style={{ marginTop: 6, lineHeight: 18 }}>
                  {t("Twelve portraits of courage and faith, from Gideon's three hundred to David's mighty men.")}
                </AppText>
                <AppText variant="sansBold" size={11.5} color={palette.accent} style={{ marginTop: 10 }}>
                  {t("6 Books Available")}
                </AppText>
                <Pressable
                  onPress={() => showToast(t("Coming soon"))}
                  style={[styles.smallBtn, { backgroundColor: palette.accent, marginTop: 14, alignSelf: "flex-start" }]}
                >
                  <AppText variant="sansBold" size={13} color="#fff">
                    {t("Open Collection")}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>

          <View>
            <SectionLabel>{t("Discover Something New")}</SectionLabel>
            <Pressable onPress={() => showToast(t("Coming soon"))} style={[styles.discoverRow, { backgroundColor: palette.cardAlt }]}>
              <View style={[styles.discoverArt, { backgroundColor: palette.accent }]}>
                <Ionicons name="library-outline" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="sansExtraBold" size={14}>
                  {t("Psalms & Proverbs Study Guide")}
                </AppText>
                <AppText size={12} dim style={{ marginTop: 3, lineHeight: 17 }}>
                  {t("A companion volume for daily reflection, newly added to the catalog.")}
                </AppText>
                <AppText variant="sansExtraBold" size={12} color={palette.accent} style={{ marginTop: 6 }}>
                  {t("Learn More ›")}
                </AppText>
              </View>
            </Pressable>
          </View>

          <Pressable
            onPress={() => Linking.openURL("https://apps.apple.com/app/face-jerusalem")}
            style={[styles.adBanner, { backgroundColor: palette.cardAlt }]}
          >
            <View style={[styles.adIcon, { backgroundColor: palette.accent }]}>
              <Ionicons name="compass-outline" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <AppText variant="sansExtraBold" size={9.5} dim style={{ letterSpacing: 0.5 }}>
                {t("ADVERTISEMENT")}
              </AppText>
              <AppText variant="sansExtraBold" size={12.5} style={{ marginTop: 2 }}>
                {t("Face Jerusalem — find true north to the Holy City")}
              </AppText>
            </View>
            <AppText variant="sansExtraBold" size={12} color={palette.accent}>
              {t("Get App ›")}
            </AppText>
          </Pressable>

          <Pressable onPress={skipToLibrary} style={styles.enterLibrary}>
            <AppText variant="sansBold" size={12.5} dim>
              {t("Enter Library →")}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  const { palette } = useApp();
  return (
    <View style={{ alignItems: "center" }}>
      <AppText variant="sansExtraBold" size={15}>
        {value}
      </AppText>
      <AppText size={9} dim style={{ textTransform: "uppercase", letterSpacing: 0.4, marginTop: 1 }}>
        {label}
      </AppText>
    </View>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <AppText variant="sansExtraBold" size={11} dim style={{ letterSpacing: 1, marginBottom: 10 }}>
      {String(children).toUpperCase()}
    </AppText>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroContent: { paddingHorizontal: 20, paddingBottom: 22, gap: 18 },
  greetingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logoWatermarkWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWatermark: { width: "75%", height: "75%", opacity: 0.16 },
  body: { padding: 20, paddingTop: 20, gap: 20 },
  bookCard: { borderRadius: 20, padding: 18 },
  bookCardRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  bookCtaBtn: { marginTop: 14, borderRadius: 12, paddingVertical: 11, alignItems: "center" },
  bookCover: { width: 64, height: 64, borderRadius: 14, overflow: "hidden" },
  statsRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  card: { borderRadius: 20, padding: 20, borderWidth: 1 },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 16, flexWrap: "wrap" },
  smallBtn: { borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14 },
  collectionArt: { width: "100%", height: 140 },
  discoverRow: { flexDirection: "row", gap: 14, alignItems: "center", borderRadius: 20, padding: 16 },
  discoverArt: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  adBanner: { flexDirection: "row", gap: 12, alignItems: "center", borderRadius: 16, padding: 12 },
  adIcon: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  enterLibrary: { alignItems: "center", padding: 6 },
});
