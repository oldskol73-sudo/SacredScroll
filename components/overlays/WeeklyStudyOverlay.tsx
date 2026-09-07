import React, { useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { StudyTopicRow } from "@/components/StudyTopicRow";
import { WEEKLY_STUDY_PLAN, WEEKLY_STUDY_PLAN_TOTAL_WEEKS } from "@/constants/bible/studyPlans";

export function WeeklyStudyOverlay() {
  const { palette, showWeeklyStudy, setShowWeeklyStudy, studyWeeklyProgress, t } = useApp();
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  function uniqueKeys(keysList: string[][]) {
    return Array.from(new Set(keysList.flat()));
  }

  const allKeys = uniqueKeys(WEEKLY_STUDY_PLAN.flatMap((p) => p.weeks.map((w) => w.topicKeys)));
  const totalKeys = allKeys.length;
  const doneTotal = allKeys.filter((k) => studyWeeklyProgress.done.has(k)).length;

  return (
    <Modal visible={showWeeklyStudy} animationType="fade" onRequestClose={() => setShowWeeklyStudy(false)}>
      <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => setShowWeeklyStudy(false)}
              style={[styles.backBtn, { backgroundColor: palette.cardAlt }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={palette.text} />
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("Weekly Study Plan")}
            </AppText>
          </View>
          <AppText dim size={14} style={{ lineHeight: 20, marginVertical: 14 }}>
            {t("A")} {WEEKLY_STUDY_PLAN_TOTAL_WEEKS} {t("week, 14-phase sequenced study")} — {doneTotal} {t("of")} {totalKeys}{" "}
            {t("topics complete.")}
          </AppText>

          <View style={{ gap: 8 }}>
            {WEEKLY_STUDY_PLAN.map((phase) => {
              const isPhaseExpanded = expandedPhase === phase.id;
              const phaseKeys = uniqueKeys(phase.weeks.map((w) => w.topicKeys));
              const phaseDone = phaseKeys.filter((k) => studyWeeklyProgress.done.has(k)).length;
              const pct = phaseKeys.length ? Math.round((phaseDone / phaseKeys.length) * 100) : 0;
              return (
                <View key={phase.id} style={[styles.card, { backgroundColor: palette.card }]}>
                  <Pressable
                    onPress={() => setExpandedPhase(isPhaseExpanded ? null : phase.id)}
                    style={styles.rowBetween}
                  >
                    <View style={{ flex: 1 }}>
                      <AppText variant="sansBold" size={15}>
                        {phase.title}
                      </AppText>
                      <AppText size={12} dim style={{ marginTop: 2 }}>
                        {t("Weeks")} {phase.startWeek}–{phase.endWeek} · {phaseDone}/{phaseKeys.length} {t("topics")}
                      </AppText>
                    </View>
                    <AppText dim size={13}>
                      {isPhaseExpanded ? "⌃" : "⌄"}
                    </AppText>
                  </Pressable>
                  <View style={[styles.track, { backgroundColor: palette.track }]}>
                    <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: palette.accent }]} />
                  </View>
                  {isPhaseExpanded ? (
                    <View style={{ gap: 8, paddingTop: 2 }}>
                      <AppText dim size={13} style={{ lineHeight: 18 }}>
                        {phase.description}
                      </AppText>
                      {phase.weeks.map((w) => {
                        const isWeekExpanded = expandedWeek === w.week;
                        const weekDone = w.topicKeys.filter((k) => studyWeeklyProgress.done.has(k)).length;
                        return (
                          <View key={w.week} style={[styles.weekCard, { backgroundColor: palette.cardAlt }]}>
                            <Pressable
                              onPress={() => setExpandedWeek(isWeekExpanded ? null : w.week)}
                              style={styles.rowBetween}
                            >
                              <AppText variant="sansBold" size={13}>
                                {t("Week")} {w.week}
                              </AppText>
                              <AppText size={11} dim>
                                {weekDone}/{w.topicKeys.length} · {isWeekExpanded ? "⌃" : "⌄"}
                              </AppText>
                            </Pressable>
                            {isWeekExpanded ? (
                              <View style={{ gap: 8, paddingTop: 8 }}>
                                {w.topicKeys.map((k) => (
                                  <StudyTopicRow
                                    key={k}
                                    topicKey={k}
                                    done={studyWeeklyProgress.done.has(k)}
                                    onToggleDone={() => studyWeeklyProgress.toggle(k)}
                                    expanded={expandedTopic === k}
                                    onToggleExpand={() => setExpandedTopic(expandedTopic === k ? null : k)}
                                  />
                                ))}
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
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
  content: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 14, padding: 16, gap: 10 },
  weekCard: { borderRadius: 12, padding: 12, gap: 6 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  track: { height: 5, borderRadius: 3, overflow: "hidden" },
  trackFill: { height: "100%", borderRadius: 3 },
});
