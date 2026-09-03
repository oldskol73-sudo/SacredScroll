import React, { useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { SIN_BATTLES } from "@/constants/bible/plans";

export function SinBattlesOverlay() {
  const { palette, showSinBattles, setShowSinBattles, sinProgress, t } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Modal visible={showSinBattles} animationType="fade" onRequestClose={() => setShowSinBattles(false)}>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => setShowSinBattles(false)}>
              <AppText size={20} dim>
                ←
              </AppText>
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("Sin-Specific Battles")}
            </AppText>
          </View>
          <AppText dim size={14} style={{ lineHeight: 20, marginVertical: 14 }}>
            {t(
              "Mark 7:21-23 — for out of the heart proceed evil thoughts, adulteries, fornications, murders, thefts, covetousness, wickedness, deceit, lasciviousness, an evil eye, blasphemy, pride, foolishness. For each, at least three precepts to overcome."
            )}
          </AppText>

          <View style={{ gap: 8 }}>
            {SIN_BATTLES.map((s) => {
              const isExpanded = expanded === s.key;
              const done = sinProgress.done.has(s.key);
              return (
                <View key={s.key} style={[styles.card, { backgroundColor: palette.card }]}>
                  <Pressable onPress={() => setExpanded(isExpanded ? null : s.key)} style={styles.rowBetween}>
                    <View style={styles.rowLeft}>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          sinProgress.toggle(s.key);
                        }}
                        style={[
                          styles.dot,
                          { borderColor: palette.accent, backgroundColor: done ? palette.accent : "transparent" },
                        ]}
                      />
                      <AppText variant="sansBold" size={15}>
                        {s.sin}
                      </AppText>
                    </View>
                    <AppText dim size={13}>
                      {isExpanded ? "⌃" : "⌄"}
                    </AppText>
                  </Pressable>
                  {isExpanded ? (
                    <View style={{ gap: 10, paddingTop: 4 }}>
                      {s.precepts.map((p) => (
                        <View key={p.ref} style={[styles.preceptCard, { backgroundColor: palette.cardAlt }]}>
                          <AppText variant="sansExtraBold" size={12} color={palette.accent} style={{ marginBottom: 4 }}>
                            {p.ref}
                          </AppText>
                          <AppText size={13} style={{ lineHeight: 19 }}>
                            {p.note}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  card: { borderRadius: 14, padding: 16, gap: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  preceptCard: { borderRadius: 12, padding: 12 },
});
