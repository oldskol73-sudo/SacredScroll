import React, { useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { PRECEPT_TOPICS } from "@/constants/bible/precepts";
import { resolveBookName } from "@/constants/bible/books";

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  const match = ref.match(/^(.*)\s(\d+):(\d+)/);
  if (!match) return null;
  return { book: resolveBookName(match[1].trim()), chapter: Number(match[2]), verse: Number(match[3]) };
}

export function PreceptsOverlay() {
  const { palette, showPrecepts, setShowPrecepts, goTo, selectVerse, t } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  function onViewInReader(anchor: { book: string; chapter: number }) {
    goTo(resolveBookName(anchor.book), anchor.chapter);
    setShowPrecepts(false);
  }

  function onViewRef(ref: string) {
    const parsed = parseRef(ref);
    if (!parsed) return;
    goTo(parsed.book, parsed.chapter);
    selectVerse(parsed.verse);
    setShowPrecepts(false);
  }

  return (
    <Modal visible={showPrecepts} animationType="fade" onRequestClose={() => setShowPrecepts(false)}>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => setShowPrecepts(false)}>
              <AppText size={20} dim>
                ←
              </AppText>
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("Precepts")}
            </AppText>
          </View>
          <AppText dim size={14} style={{ lineHeight: 20, marginVertical: 14 }}>
            {t(
              "Topical scripture chains. Each topic's key verse is highlighted in the Read tab with a ¹ footnote linking the rest of the chain."
            )}
          </AppText>

          <View style={{ gap: 8 }}>
            {(() => {
              const FEATURED_COUNT = 18;
              let lastLetter: string | null = null;
              return PRECEPT_TOPICS.map((topic, i) => {
                const isExpanded = expanded === topic.key;
                const isAlphaSection = i >= FEATURED_COUNT;
                const letter = isAlphaSection ? topic.title.charAt(0).toUpperCase() : null;
                const showLetterHeading = isAlphaSection && letter !== lastLetter;
                if (showLetterHeading) lastLetter = letter;

                return (
                  <React.Fragment key={topic.key}>
                    {showLetterHeading ? (
                      <AppText
                        variant="sansExtraBold"
                        size={13}
                        dim
                        style={{ marginTop: 14, marginBottom: 2, letterSpacing: 1 }}
                      >
                        {letter}
                      </AppText>
                    ) : null}
                    <View style={[styles.card, { backgroundColor: palette.card }]}>
                      <Pressable onPress={() => setExpanded(isExpanded ? null : topic.key)} style={styles.rowBetween}>
                        <AppText variant="sansBold" size={15}>
                          {topic.title}
                        </AppText>
                        <AppText dim size={13}>
                          {isExpanded ? "⌃" : "⌄"}
                        </AppText>
                      </Pressable>
                      {isExpanded ? (
                        <View style={{ gap: 8, paddingTop: 4 }}>
                          {topic.refs.map((r) => (
                            <Pressable
                              key={r.ref}
                              onPress={() => onViewRef(r.ref)}
                              style={[styles.refCard, { backgroundColor: palette.cardAlt }]}
                            >
                              <AppText variant="sansExtraBold" size={12} color={palette.accent} style={{ marginBottom: 3 }}>
                                {r.ref}
                              </AppText>
                              <AppText size={13} style={{ lineHeight: 19 }}>
                                {r.note}
                              </AppText>
                            </Pressable>
                          ))}
                          <Pressable
                            onPress={() => onViewInReader(topic.anchor)}
                            style={[styles.viewBtn, { backgroundColor: palette.accent }]}
                          >
                            <AppText variant="sansBold" size={12} color="#fff">
                              {t("View in Reader")}
                            </AppText>
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  </React.Fragment>
                );
              });
            })()}
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
  refCard: { borderRadius: 12, padding: 11 },
  viewBtn: { alignSelf: "flex-start", borderRadius: 10, paddingVertical: 9, paddingHorizontal: 16, marginTop: 2 },
});
