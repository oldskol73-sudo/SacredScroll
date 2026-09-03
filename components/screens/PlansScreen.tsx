import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { SIN_BATTLES, CHRONO_PLAN } from "@/constants/bible/plans";
import { STUDY_PLAN_CATEGORIES, WEEKLY_STUDY_PLAN, WEEKLY_STUDY_PLAN_TOTAL_WEEKS } from "@/constants/bible/studyPlans";

function uniqueKeys(keysList: string[][]) {
  return Array.from(new Set(keysList.flat()));
}

export function PlansScreen() {
  const { palette, chronoProgress, sinProgress, setShowChronoDetail, setShowSinBattles, showToast, t } = useApp();

  const chronoTotal = CHRONO_PLAN.dayList.length;
  const chronoPct = Math.round((chronoProgress.done.size / chronoTotal) * 100);
  const sinPct = Math.round((sinProgress.done.size / SIN_BATTLES.length) * 100);

  const categoryKeys = uniqueKeys(STUDY_PLAN_CATEGORIES.map((c) => c.topicKeys));
  const weeklyKeys = uniqueKeys(WEEKLY_STUDY_PLAN.flatMap((p) => p.weeks.map((w) => w.topicKeys)));

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={() => setShowChronoDetail(true)} style={[styles.card, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {t("1-YEAR PLAN")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Chronological Reading")}
        </AppText>
        <ProgressBar pct={chronoPct} />
        <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
          {chronoProgress.done.size} {t("of")} {chronoTotal} {t("days")}
        </AppText>
      </Pressable>

      <Pressable onPress={() => setShowSinBattles(true)} style={[styles.card, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {t("TOPICAL STUDY")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Sin-Specific Battles")}
        </AppText>
        <ProgressBar pct={sinPct} />
        <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
          {sinProgress.done.size} {t("of")} {SIN_BATTLES.length} {t("sins from Mark 7:21-23")}
        </AppText>
      </Pressable>

      <Pressable
        onPress={() => showToast(t("Coming soon"))}
        style={[styles.card, { backgroundColor: palette.card, opacity: 0.6 }]}
      >
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {t("12 CATEGORIES")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Study by Category")}
        </AppText>
        <AppText variant="sansBold" size={13} dim>
          {t("Coming soon")} · {categoryKeys.length} {t("topics")}
        </AppText>
      </Pressable>

      <Pressable
        onPress={() => showToast(t("Coming soon"))}
        style={[styles.card, { backgroundColor: palette.card, opacity: 0.6 }]}
      >
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {WEEKLY_STUDY_PLAN_TOTAL_WEEKS} {t("WEEK PLAN")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Weekly Study Plan")}
        </AppText>
        <AppText variant="sansBold" size={13} dim>
          {t("Coming soon")} · {weeklyKeys.length} {t("topics")}
        </AppText>
      </Pressable>
    </ScrollView>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const { palette } = useApp();
  return (
    <View style={[styles.track, { backgroundColor: palette.track }]}>
      <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: palette.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  card: { borderRadius: 18, padding: 20 },
  track: { height: 6, borderRadius: 3, overflow: "hidden" },
  trackFill: { height: "100%", borderRadius: 3 },
});
