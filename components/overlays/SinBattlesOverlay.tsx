import React, { useMemo, useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { OverlaySafeArea } from "@/components/OverlaySafeArea";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { SIN_BATTLES, SinBattle, SinBattleSource } from "@/constants/bible/plans";
import { resolveBookName } from "@/constants/bible/books";
import { Palette } from "@/constants/theme";
import { usePlanProgress } from "@/hooks/useBibleStore";

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  const match = ref.match(/^(.*)\s(\d+):(\d+)/);
  if (!match) return null;
  return { book: resolveBookName(match[1].trim()), chapter: Number(match[2]), verse: Number(match[3]) };
}

const SOURCE_COPY: Record<SinBattleSource, { title: string; intro: string }> = {
  mark: {
    title: "Sin Battles: Mark 7",
    intro:
      "Mark 7:21-23 — for out of the heart proceed evil thoughts, adulteries, fornications, murders, thefts, covetousness, wickedness, deceit, lasciviousness, an evil eye, blasphemy, pride, foolishness. For each, at least three precepts to overcome.",
  },
  romans: {
    title: "Sin Battles: Romans 1",
    intro:
      "Romans 1:29-31 — being filled with all unrighteousness, fornication, wickedness, covetousness, maliciousness; full of envy, murder, debate, deceit, malignity; whisperers, backbiters, haters of God, despiteful, proud, boasters, inventors of evil things, disobedient to parents, without understanding, covenantbreakers, without natural affection, implacable, unmerciful. For each, at least three precepts to overcome.",
  },
};

interface Props {
  source: SinBattleSource;
  visible: boolean;
  onClose: () => void;
}

export function SinBattlesOverlay({ source, visible, onClose }: Props) {
  const { palette, sinProgress, goTo, selectVerse, t } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  const battles = useMemo(() => SIN_BATTLES.filter((s) => s.source === source), [source]);
  const copy = SOURCE_COPY[source];

  function onViewRef(ref: string) {
    const parsed = parseRef(ref);
    if (!parsed) return;
    goTo(parsed.book, parsed.chapter);
    selectVerse(parsed.verse);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <OverlaySafeArea style={[styles.container, { backgroundColor: palette.bg }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable onPress={onClose} style={[styles.backBtn, { backgroundColor: palette.cardAlt }]} hitSlop={8}>
              <Ionicons name="chevron-back" size={20} color={palette.text} />
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t(copy.title)}
            </AppText>
          </View>
          <AppText dim size={14} style={{ lineHeight: 20, marginVertical: 14 }}>
            {t(copy.intro)}
          </AppText>

          <View style={{ gap: 8 }}>
            {battles.map((s) => (
              <SinCard
                key={s.key}
                battle={s}
                palette={palette}
                expanded={expanded === s.key}
                onToggle={setExpanded}
                onViewRef={onViewRef}
                sinProgress={sinProgress}
              />
            ))}
          </View>
        </ScrollView>
      </OverlaySafeArea>
    </Modal>
  );
}

function SinCard({
  battle,
  palette,
  expanded,
  onToggle,
  onViewRef,
  sinProgress,
}: {
  battle: SinBattle;
  palette: Palette;
  expanded: boolean;
  onToggle: (key: string | null) => void;
  onViewRef: (ref: string) => void;
  sinProgress: ReturnType<typeof usePlanProgress>;
}) {
  const done = sinProgress.done.has(battle.key);
  return (
    <View style={[styles.card, { backgroundColor: palette.card }]}>
      <Pressable onPress={() => onToggle(expanded ? null : battle.key)} style={styles.rowBetween}>
        <View style={styles.rowLeft}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              sinProgress.toggle(battle.key);
            }}
            style={[styles.dot, { borderColor: palette.accent, backgroundColor: done ? palette.accent : "transparent" }]}
          />
          <AppText variant="sansBold" size={15}>
            {battle.sin}
          </AppText>
        </View>
        <AppText dim size={13}>
          {expanded ? "⌃" : "⌄"}
        </AppText>
      </Pressable>
      {expanded ? (
        <View style={{ gap: 10, paddingTop: 4 }}>
          {battle.precepts.map((p) => (
            <Pressable key={p.ref} onPress={() => onViewRef(p.ref)} style={[styles.preceptCard, { backgroundColor: palette.cardAlt }]}>
              <AppText variant="sansExtraBold" size={12} color={palette.accent} style={{ marginBottom: 4 }}>
                {p.ref}
              </AppText>
              <AppText size={13} style={{ lineHeight: 19 }}>
                {p.note}
              </AppText>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 14, padding: 16, gap: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  preceptCard: { borderRadius: 12, padding: 12 },
});
