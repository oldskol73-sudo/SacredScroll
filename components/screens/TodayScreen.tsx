import React, { useMemo } from "react";
import { View, ScrollView, Pressable, Image, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { getRandomVerse } from "@/constants/bible/verses";

const LOGO_HERO = require("@/assets/images/bible/publishing-masthead.png");
const LOGO_HERO_RATIO = 941 / 1672;

function greeting(t: (s: string) => string) {
  const h = new Date().getHours();
  if (h < 12) return t("Good morning");
  if (h < 18) return t("Good afternoon");
  return t("Good evening");
}

function dateLabel(language: string) {
  const locale = language === "es" ? "es" : language === "ht" ? "ht" : undefined;
  return new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function TodayScreen() {
  const { palette, goTo, language, t } = useApp();
  const votd = useMemo(() => getRandomVerse(), []);
  const windowWidth = useWindowDimensions().width;
  const mastheadWidth = windowWidth - 40;
  const mastheadHeight = mastheadWidth * LOGO_HERO_RATIO;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.mastheadWrap, { width: mastheadWidth, height: mastheadHeight }]}>
        <Image
          source={LOGO_HERO}
          style={{ width: mastheadWidth, height: mastheadHeight }}
          resizeMode="contain"
        />
        <LinearGradient
          colors={["transparent", palette.bg]}
          locations={[0, 1]}
          style={[styles.mastheadFade, { height: mastheadHeight * 0.14 }]}
          pointerEvents="none"
        />
      </View>

      <View>
        <AppText variant="sansBold" size={12} dim style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
          {dateLabel(language)}
        </AppText>
        <AppText variant="sansExtraBold" size={24} style={{ marginTop: 2 }}>
          {greeting(t)}
        </AppText>
      </View>

      <View style={[styles.card, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 10 }}>
          {t("VERSE OF THE DAY")}
        </AppText>
        <AppText variant="serif" size={19} style={{ lineHeight: 28 }}>
          "{votd.text}"
        </AppText>
        <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
          {votd.ref} · KJV
        </AppText>
        <Pressable
          onPress={() => goTo(votd.book, votd.chapter)}
          style={[styles.primaryBtn, { backgroundColor: palette.accent }]}
        >
          <AppText variant="sansBold" size={13} color="#fff">
            {t("Read in context →")}
          </AppText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110, gap: 18 },
  mastheadWrap: { position: "relative", alignSelf: "center" },
  mastheadFade: { position: "absolute", left: 0, right: 0, bottom: 0 },
  card: { borderRadius: 20, padding: 20 },
  primaryBtn: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
});
