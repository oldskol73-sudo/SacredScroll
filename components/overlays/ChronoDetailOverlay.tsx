import React, { useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { CHRONO_PLAN, ChronoDay } from "@/constants/bible/plans";
import { isChapterLoaded } from "@/constants/bible/books";

type ChronoView = "weekly" | "monthly" | "quarterly" | "yearly";

const VIEW_LABEL_EN: Record<ChronoView, string> = { weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" };
const VIEW_LABEL_ES: Record<ChronoView, string> = { weekly: "Semanal", monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" };

export function ChronoDetailOverlay() {
  const { palette, showChronoDetail, setShowChronoDetail, chronoProgress, goTo, showToast, language, t } = useApp();
  const [view, setView] = useState<ChronoView>("weekly");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const VIEW_LABEL = language === "es" ? VIEW_LABEL_ES : VIEW_LABEL_EN;

  const total = CHRONO_PLAN.dayList.length;
  const doneCount = chronoProgress.done.size;
  const pct = Math.round((doneCount / total) * 100);

  function onDayRead(day: ChronoDay) {
    const first = day.groups[0];
    if (!first || !isChapterLoaded(first.book, first.from)) {
      showToast(t("Chapter text coming soon"));
      return;
    }
    goTo(first.book, first.from);
    setShowChronoDetail(false);
  }

  function pctFor(done: number, total2: number) {
    return total2 ? Math.round((done / total2) * 100) : 0;
  }

  function doneInRange(from: number, to: number) {
    let n = 0;
    for (let d = from; d <= to; d++) if (chronoProgress.done.has(String(d))) n++;
    return n;
  }

  return (
    <Modal visible={showChronoDetail} animationType="fade" onRequestClose={() => setShowChronoDetail(false)}>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => setShowChronoDetail(false)}>
              <AppText size={20} dim>
                ←
              </AppText>
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("Chronological Reading")}
            </AppText>
          </View>
          <AppText dim size={14} style={{ lineHeight: 20, marginVertical: 14 }}>
            {t("The whole Bible in one year, ordered by when events happened")} — {doneCount} {t("of")} {total} {t("days complete.")}
          </AppText>

          <View style={styles.tabRow}>
            {(["weekly", "monthly", "quarterly", "yearly"] as ChronoView[]).map((v) => (
              <Pressable
                key={v}
                onPress={() => setView(v)}
                style={[styles.tab, { backgroundColor: view === v ? palette.accent : palette.card }]}
              >
                <AppText variant="sansBold" size={11} color={view === v ? "#fff" : palette.text}>
                  {VIEW_LABEL[v]}
                </AppText>
              </Pressable>
            ))}
          </View>

          {view === "yearly" ? (
            <View style={[styles.yearlyCard, { backgroundColor: palette.card }]}>
              <AppText variant="sansExtraBold" size={13} color={palette.accent} style={{ letterSpacing: 1, marginBottom: 10 }}>
                {t("YEAR PROGRESS")}
              </AppText>
              <AppText variant="sansExtraBold" size={38}>
                {pct}%
              </AppText>
              <View style={[styles.track, { backgroundColor: palette.track, marginVertical: 14 }]}>
                <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: palette.accent }]} />
              </View>
              <AppText dim size={14}>
                {doneCount} {t("of")} {total} {t("days read")}
              </AppText>
            </View>
          ) : null}

          {view === "quarterly" ? (
            <View style={{ gap: 10 }}>
              {CHRONO_PLAN.quarters.map((q) => {
                const done = doneInRange(q.from, q.to);
                const total2 = q.to - q.from + 1;
                return (
                  <View key={q.quarter} style={[styles.rangeCard, { backgroundColor: palette.card }]}>
                    <View style={styles.rowBetween}>
                      <AppText variant="sansBold" size={15}>
                        {t("Quarter")} {q.quarter}
                      </AppText>
                      <AppText size={12} dim>
                        {t("Days")} {q.from}–{q.to}
                      </AppText>
                    </View>
                    <View style={[styles.track, { backgroundColor: palette.track, marginVertical: 6 }]}>
                      <View style={[styles.trackFill, { width: `${pctFor(done, total2)}%`, backgroundColor: palette.accent }]} />
                    </View>
                    <AppText size={12} dim>
                      {done} / {total2} {t("days")}
                    </AppText>
                  </View>
                );
              })}
            </View>
          ) : null}

          {view === "monthly" ? (
            <View style={{ gap: 8 }}>
              {CHRONO_PLAN.months.map((m) => {
                const done = doneInRange(m.from, m.to);
                const total2 = m.to - m.from + 1;
                return (
                  <View key={m.name} style={[styles.monthCard, { backgroundColor: palette.card }]}>
                    <View style={styles.rowBetween}>
                      <AppText variant="sansBold" size={14}>
                        {m.name}
                      </AppText>
                      <AppText size={11} dim>
                        {t("Days")} {m.from}–{m.to}
                      </AppText>
                    </View>
                    <View style={[styles.track, { backgroundColor: palette.track, height: 5, marginTop: 6 }]}>
                      <View
                        style={[styles.trackFill, { width: `${pctFor(done, total2)}%`, backgroundColor: palette.accent }]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {view === "weekly" ? (
            <View style={{ gap: 8 }}>
              {CHRONO_PLAN.weeks.map((w) => {
                const done = doneInRange(w.from, w.to);
                const total2 = w.to - w.from + 1;
                const expanded = expandedWeek === w.week;
                return (
                  <View key={w.week} style={[styles.weekCard, { backgroundColor: palette.card }]}>
                    <Pressable
                      onPress={() => setExpandedWeek(expanded ? null : w.week)}
                      style={styles.rowBetween}
                    >
                      <View>
                        <AppText variant="sansBold" size={14}>
                          {t("Week")} {w.week}
                        </AppText>
                        <AppText size={11} dim style={{ marginTop: 2 }}>
                          {t("Days")} {w.from}–{w.to} · {done}/{total2}
                        </AppText>
                      </View>
                      <AppText dim size={13}>
                        {expanded ? "⌃" : "⌄"}
                      </AppText>
                    </Pressable>
                    <View style={[styles.track, { backgroundColor: palette.track, height: 4, marginVertical: 10 }]}>
                      <View
                        style={[styles.trackFill, { width: `${pctFor(done, total2)}%`, backgroundColor: palette.accent }]}
                      />
                    </View>
                    {expanded ? (
                      <View style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
                        {w.days.map((d) => {
                          const dDone = chronoProgress.done.has(String(d.day));
                          return (
                            <View
                              key={d.day}
                              style={[styles.dayRow, { borderBottomColor: palette.divider }]}
                            >
                              <Pressable
                                onPress={() => chronoProgress.toggle(String(d.day))}
                                style={[
                                  styles.dot,
                                  { borderColor: palette.accent, backgroundColor: dDone ? palette.accent : "transparent" },
                                ]}
                              />
                              <Pressable onPress={() => onDayRead(d)} style={{ flex: 1 }}>
                                <AppText size={12} dim variant="sansBold">
                                  {t("Day")} {d.day}
                                </AppText>
                                <AppText size={13} variant="sansBold" style={{ marginTop: 1 }}>
                                  {d.label}
                                </AppText>
                              </Pressable>
                            </View>
                          );
                        })}
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  tabRow: { flexDirection: "row", gap: 6, marginBottom: 16 },
  tab: { flex: 1, borderRadius: 12, paddingVertical: 9, alignItems: "center" },
  yearlyCard: { borderRadius: 20, padding: 24, alignItems: "center" },
  track: { height: 6, borderRadius: 3, overflow: "hidden" },
  trackFill: { height: "100%", borderRadius: 3 },
  rangeCard: { borderRadius: 16, padding: 16 },
  monthCard: { borderRadius: 14, padding: 13 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  weekCard: { borderRadius: 14, padding: 13 },
  dayRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 1 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
});
