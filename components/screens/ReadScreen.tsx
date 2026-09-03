import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { versesFor, isSpanishAvailable } from "@/constants/bible/verses";
import { displayRef, isChapterLoaded, adjacentChapter } from "@/constants/bible/books";
import { PRECEPT_ANCHOR_INDEX } from "@/constants/bible/precepts";
import { HIGHLIGHT_COLORS } from "@/constants/theme";
import { READER_HEADER_EXPANDED_HEIGHT } from "@/components/Header";

// How far below the top of the visible reading area a narrated verse is
// scrolled to, so it lands in a comfortable reading position rather than
// flush against the header.
const NARRATION_SCROLL_OFFSET = 140;
// If the reader manually scrolls further than this from the narrated verse's
// position, auto-follow suspends until they tap "Follow Narration" again.
const FOLLOW_SUSPEND_THRESHOLD = 120;

export function ReadScreen() {
  const {
    palette,
    location,
    selectVerse,
    readerFontSize,
    highlights,
    refKey,
    openFootnote,
    toggleFootnote,
    goTo,
    onReaderScroll,
    language,
    narration,
    t,
  } = useApp();
  const insets = useSafeAreaInsets();

  const verses = versesFor(location.book, location.chapter);
  const loaded = isChapterLoaded(location.book, location.chapter);
  const prev = adjacentChapter(location.book, location.chapter, -1);
  const next = adjacentChapter(location.book, location.chapter, 1);
  const showSpanishFallbackNote = language === "es" && !isSpanishAvailable(location.book, location.chapter);

  const isNarratingChapter = narration.book === location.book && narration.chapter === location.chapter;

  const scrollRef = useRef<ScrollView>(null);
  const versePositions = useRef<Record<number, number>>({});
  const programmaticScroll = useRef(false);
  const [followNarration, setFollowNarration] = useState(true);

  // A fresh chapter has no recorded verse layouts yet, and re-enables auto-follow
  // so switching chapters mid-narration doesn't leave the reader stuck manually scrolling.
  useEffect(() => {
    versePositions.current = {};
    setFollowNarration(true);
  }, [location.book, location.chapter]);

  useEffect(() => {
    if (!isNarratingChapter || narration.verse == null || !followNarration) return;
    const y = versePositions.current[narration.verse];
    if (y == null) return;
    programmaticScroll.current = true;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - NARRATION_SCROLL_OFFSET), animated: true });
    const timer = setTimeout(() => {
      programmaticScroll.current = false;
    }, 500);
    return () => clearTimeout(timer);
  }, [narration.verse, isNarratingChapter, followNarration]);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const y = e.nativeEvent.contentOffset.y;
    onReaderScroll(y);

    if (programmaticScroll.current || !isNarratingChapter || narration.verse == null || !followNarration) return;
    const targetY = versePositions.current[narration.verse];
    if (targetY == null) return;
    if (Math.abs(y - Math.max(0, targetY - NARRATION_SCROLL_OFFSET)) > FOLLOW_SUSPEND_THRESHOLD) {
      setFollowNarration(false);
    }
  }

  function resumeFollowing() {
    setFollowNarration(true);
  }

  const headerSpace = insets.top + READER_HEADER_EXPANDED_HEIGHT;

  if (!loaded || verses.length === 0) {
    return (
      <View style={[styles.emptyWrap, { paddingTop: headerSpace }]}>
        <AppText dim style={{ textAlign: "center" }}>
          {`${displayRef(location.book, location.chapter, language)} ${t("isn't loaded in this build yet.")}`}
          {"\n"}
          {t("Try Genesis 1–2, Psalm 23, or John 3.")}
        </AppText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingTop: headerSpace }]}
        onScroll={onScroll}
        scrollEventThrottle={32}
      >
        {showSpanishFallbackNote ? (
          <View style={[styles.fallbackNote, { backgroundColor: palette.cardAlt }]}>
            <AppText size={12} dim style={{ lineHeight: 17, fontStyle: "italic" }}>
              {t("This chapter's Spanish translation isn't ready yet — showing the English text.")}
            </AppText>
          </View>
        ) : null}
        {verses.map((v) => {
          const ref = refKey(location.book, location.chapter, v.n);
          const displayVerseRef = `${displayRef(location.book, location.chapter)}:${v.n}`;
          const highlight = highlights.highlightFor(ref);
          const topic = PRECEPT_ANCHOR_INDEX[displayVerseRef];
          const footnoteOpen = openFootnote === v.n;
          const isNarratingVerse = isNarratingChapter && narration.verse === v.n;

          function onLayout(e: LayoutChangeEvent) {
            versePositions.current[v.n] = e.nativeEvent.layout.y;
          }

          return (
            <View key={v.n} style={{ position: "relative" }} onLayout={onLayout}>
              <Pressable
                onPress={() => selectVerse(v.n)}
                style={[
                  styles.verseRow,
                  {
                    backgroundColor: isNarratingVerse
                      ? palette.gold + "2E"
                      : highlight
                        ? HIGHLIGHT_COLORS[highlight.color as keyof typeof HIGHLIGHT_COLORS] + "33"
                        : "transparent",
                    borderLeftWidth: isNarratingVerse ? 3 : 0,
                    borderLeftColor: palette.accent,
                  },
                ]}
              >
                <AppText variant="sansExtraBold" size={11} color={palette.accent} style={styles.verseNum}>
                  {v.n}
                </AppText>
                <AppText variant="serif" size={readerFontSize} style={{ flex: 1, lineHeight: readerFontSize * 1.7 }}>
                  {v.text}
                  {topic ? (
                    <AppText
                      variant="sansExtraBold"
                      size={readerFontSize * 0.6}
                      color={palette.accent}
                      onPress={() => toggleFootnote(v.n)}
                    >
                      {" "}
                      ¹
                    </AppText>
                  ) : null}
                </AppText>
              </Pressable>

              {footnoteOpen && topic ? (
                <View style={[styles.footnote, { backgroundColor: palette.card }]}>
                  <AppText variant="sansExtraBold" size={11} color={palette.accent} style={{ letterSpacing: 0.5, marginBottom: 8 }}>
                    {topic.title.toUpperCase()}
                  </AppText>
                  {topic.refs.map((r) => (
                    <View key={r.ref} style={{ marginBottom: 6, flexDirection: "row", flexWrap: "wrap" }}>
                      <AppText variant="sansExtraBold" size={12}>
                        {r.ref}
                      </AppText>
                      <AppText size={12} dim>
                        {" "}
                        — {r.note}
                      </AppText>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      {isNarratingChapter && !followNarration ? (
        <Pressable
          onPress={resumeFollowing}
          style={[styles.followPill, { backgroundColor: palette.accent }]}
          accessibilityRole="button"
          accessibilityLabel={t("Follow Narration")}
        >
          <Ionicons name="locate" size={13} color="#fff" />
          <AppText variant="sansBold" size={12} color="#fff">
            {t("Follow Narration")}
          </AppText>
        </Pressable>
      ) : null}

      {prev ? (
        <Pressable
          onPress={() => goTo(prev.book, prev.chapter)}
          style={[styles.sideArrow, styles.sideArrowLeft, { backgroundColor: palette.cardAlt }]}
        >
          <Ionicons name="chevron-back" size={16} color={palette.accent} />
        </Pressable>
      ) : null}
      {next ? (
        <Pressable
          onPress={() => goTo(next.book, next.chapter)}
          style={[styles.sideArrow, styles.sideArrowRight, { backgroundColor: palette.cardAlt }]}
        >
          <Ionicons name="chevron-forward" size={16} color={palette.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 140 },
  fallbackNote: { borderRadius: 12, padding: 12, marginBottom: 12 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  verseRow: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    marginBottom: 2,
  },
  verseNum: { minWidth: 18, paddingTop: 5 },
  footnote: {
    position: "absolute",
    left: 12,
    right: 12,
    top: "100%",
    marginTop: -4,
    zIndex: 10,
    borderRadius: 12,
    padding: 14,
  },
  followPill: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sideArrow: {
    position: "absolute",
    top: "50%",
    marginTop: -17,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sideArrowLeft: { left: 8 },
  sideArrowRight: { right: 8 },
});
