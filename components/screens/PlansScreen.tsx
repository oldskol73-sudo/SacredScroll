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
  const {
    palette,
    chronoProgress,
    sinProgress,
    studyCategoryProgress,
    studyWeeklyProgress,
    setShowChronoDetail,
    setShowSinBattlesMark,
    setShowSinBattlesRomans,
    setShowStudyCategories,
    setShowWeeklyStudy,
    t,
  } = useApp();

  const chronoTotal = CHRONO_PLAN.dayList.length;
  const chronoPct = Math.round((chronoProgress.done.size / chronoTotal) * 100);

  const markBattles = SIN_BATTLES.filter((s) => s.source === "mark");
  const romansBattles = SIN_BATTLES.filter((s) => s.source === "romans");
  const markDone = markBattles.filter((s) => sinProgress.done.has(s.key)).length;
  const romansDone = romansBattles.filter((s) => sinProgress.done.has(s.key)).length;
  const markPct = Math.round((markDone / markBattles.length) * 100);
  const romansPct = Math.round((romansDone / romansBattles.length) * 100);

  const categoryKeys = uniqueKeys(STUDY_PLAN_CATEGORIES.map((c) => c.topicKeys));
  const weeklyKeys = uniqueKeys(WEEKLY_STUDY_PLAN.flatMap((p) => p.weeks.map((w) => w.topicKeys)));
  const categoryDone = categoryKeys.filter((k) => studyCategoryProgress.done.has(k)).length;
  const weeklyDone = weeklyKeys.filter((k) => studyWeeklyProgress.done.has(k)).length;
  const categoryPct = Math.round((categoryDone / categoryKeys.length) * 100);
  const weeklyPct = Math.round((weeklyDone / weeklyKeys.length) * 100);

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

      <Pressable onPress={() => setShowSinBattlesMark(true)} style={[styles.card, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {t("TOPICAL STUDY")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Sin Battles: Mark 7")}
        </AppText>
        <ProgressBar pct={markPct} />
        <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
          {markDone} {t("of")} {markBattles.length} {t("sins")}
        </AppText>
      </Pressable>

      <Pressable onPress={() => setShowSinBattlesRomans(true)} style={[styles.card, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {t("TOPICAL STUDY")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Sin Battles: Romans 1")}
        </AppText>
        <ProgressBar pct={romansPct} />
        <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
          {romansDone} {t("of")} {romansBattles.length} {t("sins")}
        </AppText>
      </Pressable>

      <Pressable onPress={() => setShowStudyCategories(true)} style={[styles.card, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {t("12 CATEGORIES")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Study by Category")}
        </AppText>
        <ProgressBar pct={categoryPct} />
        <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
          {categoryDone} {t("of")} {categoryKeys.length} {t("topics")}
        </AppText>
      </Pressable>

      <Pressable onPress={() => setShowWeeklyStudy(true)} style={[styles.card, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 6 }}>
          {WEEKLY_STUDY_PLAN_TOTAL_WEEKS} {t("WEEK PLAN")}
        </AppText>
        <AppText variant="sansExtraBold" size={18} style={{ marginBottom: 10 }}>
          {t("Weekly Study Plan")}
        </AppText>
        <ProgressBar pct={weeklyPct} />
        <AppText variant="sansBold" size={13} dim style={{ marginTop: 10 }}>
          {weeklyDone} {t("of")} {weeklyKeys.length} {t("topics")}
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
