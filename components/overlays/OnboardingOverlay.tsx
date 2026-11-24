import React, { useEffect, useRef, useState } from "react";
import { View, Modal, Pressable, StyleSheet, Animated, Image, ImageSourcePropType, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { OverlaySafeArea } from "@/components/OverlaySafeArea";

interface Slide {
  key: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
}

// Real screenshots of the current build, in the order a new reader would
// actually reach each screen (Desk first, then the Drawer's own nav order).
const SLIDES: Slide[] = [
  {
    key: "desk",
    title: "Your Desk is home base",
    body: "Every time you open Sacred Scroll, you land here — pick up where you left off, read today's verse, or jump into the High Holy Day Calendar.",
    image: require("@/assets/images/onboarding/01-desk.webp"),
  },
  {
    key: "menu",
    title: "Everything, one tap away",
    body: "Today, Read, Search, Plans, Library, Calendar, and Precepts all live in the menu — plus the daily verse, always close at hand.",
    image: require("@/assets/images/onboarding/02-menu.webp"),
  },
  {
    key: "today",
    title: "A verse for today",
    body: "A fresh scripture each day, with one tap to read it in its full context.",
    image: require("@/assets/images/onboarding/03-today.webp"),
  },
  {
    key: "read",
    title: "Read, mark, and listen",
    body: "Tap the chapter name to jump anywhere in the Bible. Adjust text size, switch atmosphere, or listen to the narration — all from the reading bar.",
    image: require("@/assets/images/onboarding/04-read.webp"),
  },
  {
    key: "search",
    title: "Find any verse, any word",
    body: "Search the full KJV text and your own notes — narrow it to a testament or a single book.",
    image: require("@/assets/images/onboarding/05-search.webp"),
  },
  {
    key: "plans",
    title: "Guided reading plans",
    body: "Follow a year through Scripture chronologically, work through the Sin Battles studies, or track topics one by one.",
    image: require("@/assets/images/onboarding/06-plans.webp"),
  },
  {
    key: "calendar",
    title: "The High Holy Day Calendar",
    body: "Every Sabbath, new moon, and feast for the month — with scripture for each one and a note when two holy days land back to back.",
    image: require("@/assets/images/onboarding/07-calendar.webp"),
  },
  {
    key: "precepts-featured",
    title: "Topical scripture chains",
    body: "Hand-picked topics like Sabbath, Marriage, and The World — each one a chain of cross-references through the whole Bible.",
    image: require("@/assets/images/onboarding/08-precepts-featured.webp"),
  },
  {
    key: "precepts-az",
    title: "Every topic, A to Z",
    body: "Hundreds of topics indexed and ready to open — from Abomination to Zion.",
    image: require("@/assets/images/onboarding/09-precepts-az.webp"),
  },
  {
    key: "settings-atmosphere",
    title: "Choose your atmosphere",
    body: "Royal Parchment, Temple Stone, or Midnight Scroll — three reading moods, switch anytime in Settings.",
    image: require("@/assets/images/onboarding/10-settings-atmosphere.webp"),
  },
  {
    key: "settings-espanol",
    title: "También en Español",
    body: "Toda la aplicación está disponible en español, incluyendo la Reina-Valera 1909.",
    image: require("@/assets/images/onboarding/11-settings-espanol.webp"),
  },
  {
    key: "settings-kreyol",
    title: "Nan Kreyòl tou",
    body: "Tout aplikasyon an disponib an Kreyòl Ayisyen.",
    image: require("@/assets/images/onboarding/12-settings-kreyol.webp"),
  },
  {
    key: "settings-support",
    title: "Make it yours",
    body: "Upload your own chapter narrations, adjust text size, and find Help, Feedback, and this tour again anytime.",
    image: require("@/assets/images/onboarding/13-settings-support.webp"),
  },
];

// Real screenshot aspect ratio (portrait phone capture).
const SHOT_ASPECT = 921 / 1872;

// Base hold time scales with how much there is to read.
function slideDuration(body: string): number {
  return 2600 + body.trim().split(/\s+/).length * 150;
}

export function OnboardingOverlay() {
  const { palette, t, showOnboarding, dismissOnboarding } = useApp();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const progressAnims = useRef(SLIDES.map(() => new Animated.Value(0))).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const windowHeight = Dimensions.get("window").height;
  const imageMaxHeight = Math.min(420, windowHeight * 0.42);
  const imageWidth = imageMaxHeight * SHOT_ASPECT;

  useEffect(() => {
    if (showOnboarding) {
      setIndex(0);
      setPlaying(true);
      progressAnims.forEach((a) => a.setValue(0));
    }
  }, [showOnboarding]);

  useEffect(() => {
    if (!showOnboarding) return;
    animRef.current?.stop();
    progressAnims.forEach((a, i) => a.setValue(i < index ? 1 : 0));

    if (!playing) return;
    const remaining = slideDuration(SLIDES[index].body) * (1 - (progressAnims[index] as any)._value);
    const anim = Animated.timing(progressAnims[index], {
      toValue: 1,
      duration: Math.max(0, remaining),
      useNativeDriver: false,
    });
    animRef.current = anim;
    anim.start(({ finished }) => {
      if (finished) goNext();
    });
    return () => anim.stop();
  }, [index, playing, showOnboarding]);

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(SLIDES.length - 1, i)));
  }
  function goNext() {
    if (index === SLIDES.length - 1) {
      dismissOnboarding();
    } else {
      goTo(index + 1);
    }
  }
  function togglePlay() {
    if (playing) animRef.current?.stop();
    setPlaying((p) => !p);
  }

  const slide = SLIDES[index];

  return (
    <Modal visible={showOnboarding} animationType="fade" onRequestClose={dismissOnboarding}>
      <OverlaySafeArea style={[styles.container, { backgroundColor: palette.bg }]}>
        <View style={styles.progressRow}>
          {SLIDES.map((s, i) => (
            <Pressable key={s.key} onPress={() => goTo(i)} style={[styles.segTrack, { backgroundColor: palette.divider }]}>
              <Animated.View
                style={[styles.segFill, { backgroundColor: palette.accent, transform: [{ scaleX: progressAnims[i] }] }]}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.topActions}>
          <Pressable onPress={togglePlay} style={[styles.iconBtn, { backgroundColor: palette.cardAlt }]} hitSlop={6}>
            <Ionicons name={playing ? "pause" : "play"} size={13} color={palette.text} />
          </Pressable>
          <Pressable onPress={dismissOnboarding} style={[styles.skipBtn, { backgroundColor: palette.cardAlt }]} hitSlop={6}>
            <AppText variant="sansExtraBold" size={11.5} dim>
              {t("Skip")}
            </AppText>
          </Pressable>
        </View>

        <View style={styles.body}>
          <AppText variant="serifBold" size={18} style={styles.title}>
            {t(slide.title)}
          </AppText>

          <View
            style={[
              styles.spotlight,
              { width: imageWidth, height: imageMaxHeight, backgroundColor: palette.card, borderColor: palette.divider },
            ]}
          >
            <Image source={slide.image} style={styles.spotlightImg} resizeMode="contain" />
          </View>

          <AppText dim size={12.5} style={styles.caption}>
            {t(slide.body)}
          </AppText>
        </View>

        <View style={styles.footer}>
          {index > 0 ? (
            <Pressable onPress={() => goTo(index - 1)} style={[styles.backBtn, { backgroundColor: palette.cardAlt }]} hitSlop={6}>
              <Ionicons name="chevron-back" size={18} color={palette.text} />
            </Pressable>
          ) : null}
          <Pressable onPress={goNext} style={[styles.nextBtn, { backgroundColor: palette.accent }]}>
            <AppText variant="sansExtraBold" size={14.5} color="#fff">
              {t(index === SLIDES.length - 1 ? "Get Started" : "Next")}
            </AppText>
          </Pressable>
        </View>
      </OverlaySafeArea>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 22 },
  progressRow: { flexDirection: "row", gap: 4, marginTop: 10 },
  segTrack: { flex: 1, height: 3, borderRadius: 999, overflow: "hidden" },
  segFill: { flex: 1, borderRadius: 999, transformOrigin: "left" } as object,
  topActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 14 },
  iconBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  skipBtn: { paddingHorizontal: 13, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },

  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  title: { textAlign: "center", maxWidth: 280 },
  spotlight: { borderRadius: 20, borderWidth: 1, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  spotlightImg: { width: "100%", height: "100%" },
  caption: { textAlign: "center", maxWidth: 290, lineHeight: 18 },

  footer: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 22 },
  backBtn: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  nextBtn: { flex: 1, borderRadius: 15, paddingVertical: 15, alignItems: "center" },
});
