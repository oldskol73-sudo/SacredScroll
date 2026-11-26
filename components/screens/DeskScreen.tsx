import React, { useMemo } from "react";
import { View, ScrollView, Pressable, Image, ImageSourcePropType, StyleSheet, Linking, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { getRandomVerse } from "@/constants/bible/verses";
import { displayRef } from "@/constants/bible/books";
import { DayMark, FEAST_LABELS, lunarMarksForGregorianYear } from "@/constants/calendar/lunarYear";
import { feastColor } from "@/constants/calendar/feastColors";
import { monthEvents } from "@/constants/calendar/calendarEvents";
import { CHRONO_PLAN } from "@/constants/bible/plans";
import { PRECEPT_TOPICS } from "@/constants/bible/precepts";
import { useAdRotation, AdKey } from "@/hooks/useAdRotation";

const BIBLE_MAST = require("@/assets/images/bible/Biblemast.jpeg");
const COMPASS = require("@/assets/images/bible/compass.jpg");
const MMOV_ICON = require("@/assets/images/bible/mmov-icon.jpg");
const SCROLL_ROD = require("@/assets/images/bible/scroll-rod.png");

const ADS: Record<AdKey, { image: ImageSourcePropType; title: string; body: string; meta?: string; cta: string; link: string }> = {
  faceJerusalem: {
    image: COMPASS,
    title: "Face Jerusalem",
    body: 'The new compass app designed to "Always Know the Direction of Your Homeland"',
    cta: "See Preview →",
    link: "https://www.twelvescentspub.com",
  },
  mmov: {
    image: MMOV_ICON,
    title: "Mighty Men of Valor",
    body: "Twelve portraits of courage and faith, from Gideon's three hundred to David's mighty men.",
    meta: "6 Books Available",
    cta: "Open Collection →",
    link: "https://www.twelvescentspub.com",
  },
};
// The rod art's own pixel proportions, so it scales full-bleed without distortion.
const ROD_ASPECT = 2000 / 669;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ROD_HEIGHT = SCREEN_WIDTH / ROD_ASPECT;

function dateLabel(language: string) {
  const locale = language === "es" ? "es" : language === "ht" ? "ht" : undefined;
  return new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function todaysLunarMark(): DayMark | undefined {
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  return lunarMarksForGregorianYear(today.getFullYear()).get(key);
}

/** True while a feast (including Dedication, Nicanor and Purim) is still
 * running or yet to begin later in the current month. */
function feastLeftThisMonth(): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return monthEvents(now.getFullYear(), now.getMonth()).some(
    (ev) => ev.kind === "feast" && ev.endDate.getTime() >= today.getTime()
  );
}

/** When the upcoming weekly Sabbath begins — sundown on the Friday before the
 * next Saturday — e.g. "Fri, Nov. 27 Sundown". */
function nextSabbathLabel(language: string, t: (s: string) => string) {
  const locale = language === "es" ? "es" : language === "ht" ? "ht" : undefined;
  const now = new Date();
  const daysToSaturday = (6 - now.getDay() + 7) % 7;
  const friday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSaturday - 1);
  const weekday = friday.toLocaleDateString(locale, { weekday: "short" });
  const monthShort = friday.toLocaleDateString(locale, { month: "short" });
  const monthLong = friday.toLocaleDateString(locale, { month: "long" });
  // Abbreviated months take a period ("Nov."); a month with no abbreviation ("May") doesn't.
  const month = monthShort === monthLong ? monthShort : `${monthShort}.`;
  return `${weekday}, ${month} ${friday.getDate()} ${t("Sundown")}`;
}

export function DeskScreen() {
  const {
    palette,
    location,
    enterContinueReading,
    goToPlans,
    goToCalendar,
    openPrecepts,
    goTo,
    bookmarks,
    notes,
    chronoProgress,
    language,
    isPremium,
    t,
  } = useApp();

  const votd = useMemo(() => getRandomVerse(), []);
  const lunarToday = useMemo(() => todaysLunarMark(), []);
  const feastLeft = useMemo(() => feastLeftThisMonth(), []);
  const adKey = useAdRotation();
  const ad = ADS[adKey];
  const lunarColor = lunarToday?.feast ? feastColor(palette.key, lunarToday.feast) : palette.accent;
  const lunarStatus = lunarToday?.feast
    ? t(FEAST_LABELS[lunarToday.feast])
    : lunarToday?.isSabbath
      ? t("Today is the Sabbath")
      : lunarToday?.isNewMoon
        ? t("New moon tonight")
        : feastLeft
          ? t("No holy day today")
          : // No feast left this month — the weekly Sabbath is the highest holy day.
            `${t("Sabbath")} — ${nextSabbathLabel(language, t)}`;

  const chronoTotal = CHRONO_PLAN.dayList.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={styles.badgeWrap}>
          <Image source={BIBLE_MAST} style={styles.badge} resizeMode="cover" />
        </View>
        <Image source={SCROLL_ROD} style={{ width: SCREEN_WIDTH, height: ROD_HEIGHT }} resizeMode="contain" />

        <View style={styles.body}>
          <AppText variant="sansExtraBold" size={11} color={palette.accent} style={styles.dateLine}>
            {dateLabel(language).toUpperCase()} · {displayRef(location.book, location.chapter, language)}
          </AppText>

          <View style={styles.trail}>
            <View style={[styles.trailLine, { borderColor: palette.gold }]} />

            <Stop kicker={t("Today's Verse")} onPress={() => goTo(votd.book, votd.chapter)}>
              <AppText variant="serif" size={13} style={styles.verseQuote}>
                "{votd.text}"
              </AppText>
              <AppText variant="sansBold" size={10.5} dim style={{ marginTop: 5 }}>
                {votd.ref} · KJV
              </AppText>
            </Stop>

            <Stop kicker={`1 · ${t("Continue Reading")}`} onPress={enterContinueReading}>
              <AppText variant="sansExtraBold" size={14.5}>
                {displayRef(location.book, location.chapter, language)}
              </AppText>
              <AppText size={10.5} dim style={{ marginTop: 4 }}>
                {bookmarks.bookmarks.length} {t("bookmarks")} · {notes.notes.length} {t("notes")}
              </AppText>
            </Stop>

            <Stop kicker={`2 · ${t("Precepts")}`} onPress={() => openPrecepts()}>
              <AppText variant="sansExtraBold" size={14.5}>
                {PRECEPT_TOPICS.length} {t("Topics, A to Z")}
              </AppText>
              <AppText size={10.5} dim style={{ marginTop: 4, lineHeight: 15 }}>
                {t("Trace Sabbath, Marriage, and hundreds more through the whole Bible")}
              </AppText>
            </Stop>

            <Stop kicker={`3 · ${t("Reading Plans")}`} onPress={goToPlans}>
              <AppText variant="sansExtraBold" size={14.5}>
                {t("Chronological Reading")}
              </AppText>
              <AppText size={10.5} dim style={{ marginTop: 4, lineHeight: 15 }}>
                {t("Day")} {chronoProgress.done.size} {t("of")} {chronoTotal} — {t("plus Sin Battles and Study by Category")}
              </AppText>
            </Stop>

            <Stop kicker={`4 · ${t("High Holy Day Calendar")}`} onPress={goToCalendar}>
              <AppText variant="sansExtraBold" size={14.5} color={lunarColor}>
                {lunarStatus}
              </AppText>
              <AppText size={10.5} dim style={{ marginTop: 4 }}>
                {t("Sabbaths, new moons & feast days")}
              </AppText>
            </Stop>

            {!isPremium ? (
              <Stop kicker={`5 · ${t("Discover Something New")}`} onPress={() => Linking.openURL(ad.link)}>
                <View style={styles.adRow}>
                  <Image source={ad.image} style={styles.adIcon} resizeMode="cover" />
                  <AppText variant="sansExtraBold" size={13} style={{ flex: 1 }}>
                    {t(ad.title)}
                  </AppText>
                </View>
                <AppText size={10.5} dim style={{ marginTop: 7, lineHeight: 15 }}>
                  {t(ad.body)}
                </AppText>
                <AppText variant="sansExtraBold" size={10.5} color={palette.accent} style={{ marginTop: 8 }}>
                  {ad.meta ? `${t(ad.meta)} · ` : ""}
                  {t(ad.cta)}
                </AppText>
              </Stop>
            ) : null}
          </View>

          <AppText variant="sansExtraBold" size={9} color={palette.accent} style={styles.endMarker}>
            {t("— End of Today's Scroll —")}
          </AppText>
        </View>

        <Image source={SCROLL_ROD} style={{ width: SCREEN_WIDTH, height: ROD_HEIGHT }} resizeMode="contain" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stop({ kicker, onPress, children }: { kicker: string; onPress: () => void; children: React.ReactNode }) {
  const { palette } = useApp();
  return (
    <View style={styles.stop}>
      <View style={[styles.dot, { backgroundColor: palette.accent, borderColor: palette.bg }]} />
      <AppText variant="sansExtraBold" size={9} color={palette.accent} style={styles.kicker}>
        {kicker.toUpperCase()}
      </AppText>
      <Pressable onPress={onPress} style={[styles.card, { backgroundColor: palette.card, borderColor: palette.divider }]}>
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  badgeWrap: { alignItems: "center", paddingTop: 8, paddingBottom: 4 },
  badge: { width: 110, height: 110, borderRadius: 20 },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  dateLine: { marginTop: 0, letterSpacing: 0.4 },
  trail: { position: "relative", marginTop: 22, paddingLeft: 22 },
  trailLine: { position: "absolute", left: 5, top: 7, bottom: 7, borderLeftWidth: 2, borderStyle: "dashed" },
  stop: { position: "relative", marginBottom: 16 },
  dot: { position: "absolute", left: -22, top: 4, width: 13, height: 13, borderRadius: 6.5, borderWidth: 2 },
  kicker: { letterSpacing: 0.8, marginBottom: 6 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14 },
  verseQuote: { fontStyle: "italic", lineHeight: 19 },
  adRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  adIcon: { width: 36, height: 36, borderRadius: 9 },
  endMarker: { textAlign: "center", letterSpacing: 1.2, marginTop: 6 },
});
