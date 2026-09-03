import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { PRECEPT_KEY_INDEX } from "@/constants/bible/precepts";

/** One topic row within a study-plan category or week: checkbox, title, expandable ref chain. */
export function StudyTopicRow({
  topicKey,
  done,
  onToggleDone,
  expanded,
  onToggleExpand,
}: {
  topicKey: string;
  done: boolean;
  onToggleDone: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const { palette, goTo, setShowStudyCategories, setShowWeeklyStudy, t } = useApp();
  const topic = PRECEPT_KEY_INDEX[topicKey];
  if (!topic) return null;

  function onViewInReader() {
    goTo(topic.anchor.book, topic.anchor.chapter);
    setShowStudyCategories(false);
    setShowWeeklyStudy(false);
  }

  return (
    <View style={[styles.card, { backgroundColor: palette.cardAlt }]}>
      <Pressable onPress={onToggleExpand} style={styles.rowBetween}>
        <View style={styles.rowLeft}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleDone();
            }}
            style={[styles.dot, { borderColor: palette.accent, backgroundColor: done ? palette.accent : "transparent" }]}
          >
            {done ? (
              <AppText size={11} color="#fff" variant="sansExtraBold">
                ✓
              </AppText>
            ) : null}
          </Pressable>
          <AppText variant="sansBold" size={14} style={{ flex: 1 }}>
            {topic.title}
          </AppText>
        </View>
        <AppText dim size={12}>
          {expanded ? "⌃" : "⌄"}
        </AppText>
      </Pressable>
      {expanded ? (
        <View style={{ gap: 8, paddingTop: 10 }}>
          {topic.refs.map((r) => (
            <View key={r.ref} style={[styles.refCard, { backgroundColor: palette.card }]}>
              <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ marginBottom: 3 }}>
                {r.ref}
              </AppText>
              <AppText size={12} style={{ lineHeight: 18 }}>
                {r.note}
              </AppText>
            </View>
          ))}
          <Pressable onPress={onViewInReader} style={[styles.viewBtn, { backgroundColor: palette.accent }]}>
            <AppText variant="sansBold" size={12} color="#fff">
              {t("View in Reader")}
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 12, gap: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  refCard: { borderRadius: 10, padding: 10 },
  viewBtn: { alignSelf: "flex-start", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, marginTop: 2 },
});
