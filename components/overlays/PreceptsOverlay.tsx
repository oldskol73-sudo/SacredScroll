import React, { useMemo, useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OverlaySafeArea } from "@/components/OverlaySafeArea";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { PRECEPT_TOPICS, PreceptTopic } from "@/constants/bible/precepts";
import { resolveBookName } from "@/constants/bible/books";
import { Palette } from "@/constants/theme";

// The first FEATURED_COUNT entries are hand-curated highlights (not alphabetical);
// everything after that is sorted A-Z and folded into per-letter accordion sections.
const FEATURED_COUNT = 18;

// Groups the 18 featured topics thematically for display — matched by title
// against PRECEPT_TOPICS, so this is purely a presentation grouping and doesn't
// change the underlying data.
const FEATURED_GROUPS: { label: string; titles: string[] }[] = [
  {
    label: "Identity",
    titles: ["Who Are the Saints?", '"Color" in the Bible', "Oppression", "The World", "Whosoever", "Modesty & Dress", "The Day of Destruction"],
  },
  { label: "Relationships & Family", titles: ["Marriage", "Divorce", "Hatred", "What Is Love?"] },
  { label: "Bible Study", titles: ["Study the Whole Bible", "How to Read the Bible", "Study to Show Thyself Approved"] },
  { label: "Spiritual Life", titles: ["The Holy Ghost", "Baptism", "Sabbath"] },
];

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  const match = ref.match(/^(.*)\s(\d+):(\d+)/);
  if (!match) return null;
  return { book: resolveBookName(match[1].trim()), chapter: Number(match[2]), verse: Number(match[3]) };
}

export function PreceptsOverlay() {
  const { palette, showPrecepts, setShowPrecepts, goTo, selectVerse, t } = useApp();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);
  const [selectedFeatured, setSelectedFeatured] = useState<PreceptTopic | null>(null);

  const featuredGroups = useMemo(() => {
    const featured = PRECEPT_TOPICS.slice(0, FEATURED_COUNT);
    const byTitle = new Map(featured.map((topic) => [topic.title, topic]));
    return FEATURED_GROUPS.map((g) => ({
      label: g.label,
      topics: g.titles.map((title) => byTitle.get(title)).filter((topic): topic is PreceptTopic => !!topic),
    })).filter((g) => g.topics.length > 0);
  }, []);

  const letterGroups = useMemo(() => {
    // Grouped by letter globally (not by consecutive run) since the source list
    // isn't guaranteed fully sorted — some letters (A, E, G, W) recur later on.
    const byLetter = new Map<string, PreceptTopic[]>();
    for (const topic of PRECEPT_TOPICS.slice(FEATURED_COUNT)) {
      const letter = topic.title.charAt(0).toUpperCase();
      const bucket = byLetter.get(letter);
      if (bucket) bucket.push(topic);
      else byLetter.set(letter, [topic]);
    }
    return Array.from(byLetter.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, topics]) => ({
        letter,
        topics: [...topics].sort((a, b) => a.title.localeCompare(b.title)),
      }));
  }, []);

  // FeaturedTopicSheet is a Modal NESTED inside this component's own Modal.
  // Confirmed on-device: dismissing a nested Modal and its parent Modal in the
  // same tick (even via two separate setState calls, since React batches them
  // into one commit) strands the screen on a black, undismissable overlay on
  // iOS -- the two native dismissals collide. A single (non-nested) Modal
  // closing alongside goTo()/selectVerse is safe on its own (proven by the
  // Book Picker and the plain A-Z topic list, which do exactly that). So the
  // nested sheet must fully close BEFORE the outer Modal starts closing --
  // never in the same render.
  function closePrecepts() {
    if (selectedFeatured) {
      setSelectedFeatured(null);
      setTimeout(() => setShowPrecepts(false), 350);
    } else {
      setShowPrecepts(false);
    }
  }

  function onViewInReader(anchor: { book: string; chapter: number }) {
    goTo(resolveBookName(anchor.book), anchor.chapter);
    closePrecepts();
  }

  function onViewRef(ref: string) {
    const parsed = parseRef(ref);
    if (!parsed) return;
    goTo(parsed.book, parsed.chapter);
    selectVerse(parsed.verse);
    closePrecepts();
  }

  return (
    <Modal visible={showPrecepts} animationType="fade" onRequestClose={() => setShowPrecepts(false)}>
      <OverlaySafeArea style={[styles.container, { backgroundColor: palette.bg }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => setShowPrecepts(false)}
              style={[styles.backBtn, { backgroundColor: palette.cardAlt }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={palette.text} />
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

          <AppText variant="sansExtraBold" size={13} dim style={{ letterSpacing: 1, marginBottom: 4 }}>
            {t("FEATURED TOPICS")}
          </AppText>
          <AppText dim size={12.5} style={{ lineHeight: 17, marginBottom: 14 }}>
            {t("Hand-picked topics to start with, grouped by theme.")}
          </AppText>

          {featuredGroups.map((group) => (
            <View key={group.label} style={{ marginBottom: 18 }}>
              <AppText variant="sansBold" size={12.5} color={palette.accent} style={{ marginBottom: 8 }}>
                {t(group.label)}
              </AppText>
              <View style={styles.grid}>
                {group.topics.map((topic) => (
                  <FeaturedTile key={topic.key} topic={topic} palette={palette} onPress={() => setSelectedFeatured(topic)} />
                ))}
              </View>
            </View>
          ))}

          <AppText variant="sansExtraBold" size={13} dim style={{ letterSpacing: 1, marginTop: 6, marginBottom: 10 }}>
            {t("A–Z TOPICS")}
          </AppText>

          <View style={{ gap: 8 }}>
            {letterGroups.map(({ letter, topics }) => {
              const isLetterExpanded = expandedLetter === letter;
              return (
                <View key={letter}>
                  <Pressable
                    onPress={() => setExpandedLetter(isLetterExpanded ? null : letter)}
                    style={[styles.letterRow, { backgroundColor: palette.cardAlt }]}
                    accessibilityRole="button"
                    accessibilityLabel={`${letter}, ${topics.length} ${t("topics")}`}
                  >
                    <AppText variant="sansExtraBold" size={17} color={palette.accent} style={{ width: 26 }}>
                      {letter}
                    </AppText>
                    <AppText dim size={12.5} style={{ flex: 1 }}>
                      {topics.length} {t("topics")}
                    </AppText>
                    <AppText dim size={13}>
                      {isLetterExpanded ? "⌃" : "⌄"}
                    </AppText>
                  </Pressable>
                  {isLetterExpanded ? (
                    <View style={{ gap: 8, marginTop: 8 }}>
                      {topics.map((topic) => (
                        <TopicCard
                          key={topic.key}
                          topic={topic}
                          palette={palette}
                          t={t}
                          expanded={expandedTopic === topic.key}
                          onToggle={() => setExpandedTopic(expandedTopic === topic.key ? null : topic.key)}
                          onViewRef={onViewRef}
                          onViewInReader={onViewInReader}
                        />
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </OverlaySafeArea>

      <FeaturedTopicSheet
        topic={selectedFeatured}
        palette={palette}
        t={t}
        onClose={() => setSelectedFeatured(null)}
        onViewRef={onViewRef}
        onViewInReader={onViewInReader}
      />
    </Modal>
  );
}

function FeaturedTile({ topic, palette, onPress }: { topic: PreceptTopic; palette: Palette; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, { backgroundColor: palette.card, borderColor: palette.divider }]}
      accessibilityRole="button"
      accessibilityLabel={topic.title}
    >
      <AppText variant="sansBold" size={13.5} numberOfLines={3} style={{ lineHeight: 18 }}>
        {topic.title}
      </AppText>
    </Pressable>
  );
}

function FeaturedTopicSheet({
  topic,
  palette,
  t,
  onClose,
  onViewRef,
  onViewInReader,
}: {
  topic: PreceptTopic | null;
  palette: Palette;
  t: (s: string) => string;
  onClose: () => void;
  onViewRef: (ref: string) => void;
  onViewInReader: (anchor: { book: string; chapter: number }) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={!!topic} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: palette.card, paddingBottom: 16 + insets.bottom }]}>
        <AppText variant="sansExtraBold" size={17} style={{ marginBottom: 14 }}>
          {topic?.title}
        </AppText>
        <ScrollView style={{ maxHeight: 360 }} contentContainerStyle={{ gap: 8 }}>
          {topic?.refs.map((r) => (
            <Pressable key={r.ref} onPress={() => onViewRef(r.ref)} style={[styles.refCard, { backgroundColor: palette.cardAlt }]}>
              <AppText variant="sansExtraBold" size={12} color={palette.accent} style={{ marginBottom: 3 }}>
                {r.ref}
              </AppText>
              <AppText size={13} style={{ lineHeight: 19 }}>
                {r.note}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable
          onPress={() => topic && onViewInReader(topic.anchor)}
          style={[styles.viewBtn, { backgroundColor: palette.accent, marginTop: 14, alignSelf: "stretch", alignItems: "center" }]}
        >
          <AppText variant="sansBold" size={13} color="#fff">
            {t("View in Reader")}
          </AppText>
        </Pressable>
      </View>
    </Modal>
  );
}

function TopicCard({
  topic,
  palette,
  t,
  expanded,
  onToggle,
  onViewRef,
  onViewInReader,
}: {
  topic: PreceptTopic;
  palette: Palette;
  t: (s: string) => string;
  expanded: boolean;
  onToggle: () => void;
  onViewRef: (ref: string) => void;
  onViewInReader: (anchor: { book: string; chapter: number }) => void;
}) {
  return (
    <View style={[styles.card, { backgroundColor: palette.card }]}>
      <Pressable onPress={onToggle} style={styles.rowBetween}>
        <AppText variant="sansBold" size={15}>
          {topic.title}
        </AppText>
        <AppText dim size={13}>
          {expanded ? "⌃" : "⌄"}
        </AppText>
      </Pressable>
      {expanded ? (
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
          <Pressable onPress={() => onViewInReader(topic.anchor)} style={[styles.viewBtn, { backgroundColor: palette.accent }]}>
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
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 14, padding: 16, gap: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  refCard: { borderRadius: 12, padding: 11 },
  viewBtn: { alignSelf: "flex-start", borderRadius: 10, paddingVertical: 9, paddingHorizontal: 16, marginTop: 2 },
  letterRow: { flexDirection: "row", alignItems: "center", borderRadius: 14, padding: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "47%",
    minHeight: 68,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    justifyContent: "center",
  },
  backdrop: { flex: 1, backgroundColor: "rgba(60,52,30,.4)" },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
});
