import React, { useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { StudyTopicRow } from "@/components/StudyTopicRow";
import { STUDY_PLAN_CATEGORIES } from "@/constants/bible/studyPlans";

export function StudyCategoriesOverlay() {
  const { palette, showStudyCategories, setShowStudyCategories, studyCategoryProgress, t } = useApp();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  function doneInCategory(topicKeys: string[]) {
    return topicKeys.filter((k) => studyCategoryProgress.done.has(k)).length;
  }

  return (
    <Modal visible={showStudyCategories} animationType="fade" onRequestClose={() => setShowStudyCategories(false)}>
      <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => setShowStudyCategories(false)}
              style={[styles.backBtn, { backgroundColor: palette.cardAlt }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={palette.text} />
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("Study by Category")}
            </AppText>
          </View>
          <AppText dim size={14} style={{ lineHeight: 20, marginVertical: 14 }}>
            {t("Topics grouped into 12 life-topic categories. Check off each topic as you study it.")}
          </AppText>

          <View style={{ gap: 8 }}>
            {STUDY_PLAN_CATEGORIES.map((c) => {
              const isExpanded = expandedCategory === c.id;
              const done = doneInCategory(c.topicKeys);
              const pct = c.topicKeys.length ? Math.round((done / c.topicKeys.length) * 100) : 0;
              return (
                <View key={c.id} style={[styles.card, { backgroundColor: palette.card }]}>
                  <Pressable
                    onPress={() => setExpandedCategory(isExpanded ? null : c.id)}
                    style={styles.rowBetween}
                  >
                    <View style={{ flex: 1 }}>
                      <AppText variant="sansBold" size={15}>
                        {c.title}
                      </AppText>
                      <AppText size={12} dim style={{ marginTop: 2 }}>
                        {done} {t("of")} {c.topicKeys.length} {t("topics")}
                      </AppText>
                    </View>
                    <AppText dim size={13}>
                      {isExpanded ? "⌃" : "⌄"}
                    </AppText>
                  </Pressable>
                  <View style={[styles.track, { backgroundColor: palette.track }]}>
                    <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: palette.accent }]} />
                  </View>
                  {isExpanded ? (
                    <View style={{ gap: 8, paddingTop: 2 }}>
                      <AppText dim size={13} style={{ lineHeight: 18 }}>
                        {c.description}
                      </AppText>
                      {c.topicKeys.map((k) => (
                        <StudyTopicRow
                          key={k}
                          topicKey={k}
                          done={studyCategoryProgress.done.has(k)}
                          onToggleDone={() => studyCategoryProgress.toggle(k)}
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
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  track: { height: 5, borderRadius: 3, overflow: "hidden" },
  trackFill: { height: "100%", borderRadius: 3 },
});
