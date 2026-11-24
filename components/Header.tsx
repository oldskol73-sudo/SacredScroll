import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { displayRef } from "@/constants/bible/books";
import { READER_FONT_SIZES, Palette } from "@/constants/theme";

const TITLE_KEYS: Record<string, string> = {
  today: "Today",
  read: "",
  search: "Search",
  plans: "Reading Plans",
  library: "Library",
  calendar: "High Holy Day Calendar",
};

// The Read tab's hero image now scrolls away as part of the chapter content
// (see ReadScreen) instead of collapsing in place, so this bar's height is
// the one constant amount of space it always reserves at the top.
export const READER_HEADER_HEIGHT = 60;

// A dark scrim matching the hero image's own brand gradient, fading out toward
// the bottom edge so the bar reads as part of the image instead of a blur
// artifact sitting on top of it.
const BAR_GRAD: [string, string] = ["rgba(20,13,8,.65)", "rgba(20,13,8,.15)"];

export function Header() {
  const {
    palette,
    tab,
    location,
    setShowBookPicker,
    readerFontSize,
    setReaderFontSize,
    cycleAtmosphere,
    playChapter,
    narration,
    setTab,
    language,
    t,
  } = useApp();
  const insets = useSafeAreaInsets();

  if (tab === "read") {
    const isCurrentTrack = narration.book === location.book && narration.chapter === location.chapter;
    const isPlayingHere = isCurrentTrack && narration.status === "playing";
    const barHeight = insets.top + READER_HEADER_HEIGHT;

    return (
      <View style={[styles.heroBand, styles.floating, styles.glassBand, { height: barHeight }]}>
        <LinearGradient colors={BAR_GRAD} style={StyleSheet.absoluteFill} />
        <View style={[styles.glassRow, { paddingTop: insets.top + 8 }]}>
          <View style={styles.iconGroup}>
            <IconBtn solid palette={palette} onPress={() => setReaderFontSize(nextFontSize(readerFontSize))} label="Aa" />
            <IconBtn solid palette={palette} onPress={cycleAtmosphere} icon="contrast-outline" />
          </View>

          <Pressable
            onPress={() => setShowBookPicker(true)}
            style={[styles.chapterBtn, { backgroundColor: palette.card, borderColor: palette.accent }]}
          >
            <AppText
              variant="serifBold"
              size={14}
              color={palette.text}
              numberOfLines={1}
              style={styles.chapterBtnText}
            >
              {displayRef(location.book, location.chapter, language)}
            </AppText>
            <Ionicons name="chevron-down" size={10} color={palette.accent} />
          </Pressable>

          <View style={styles.iconGroup}>
            <IconBtn
              solid
              palette={palette}
              onPress={() => (isCurrentTrack ? narration.togglePlayPause() : playChapter(location.book, location.chapter))}
              icon={isPlayingHere ? "pause" : "headset"}
            />
            <IconBtn solid palette={palette} onPress={() => setTab("search")} icon="search" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.simpleHeader, { paddingTop: insets.top + 16 }]}>
      <AppText variant="serifBold" size={19}>
        {t(TITLE_KEYS[tab])}
      </AppText>
    </View>
  );
}

function IconBtn({
  onPress,
  icon,
  label,
  solid,
  palette,
}: {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  solid?: boolean;
  palette?: Palette;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconBtn, solid ? [styles.iconBtnSolid, { backgroundColor: palette?.accent }] : null]}
    >
      {icon ? (
        <Ionicons name={icon} size={14} color="#fff" />
      ) : (
        <AppText variant="sansExtraBold" size={12} color="#fff">
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

function nextFontSize(current: number) {
  const idx = READER_FONT_SIZES.indexOf(current);
  return READER_FONT_SIZES[(idx + 1) % READER_FONT_SIZES.length];
}

const styles = StyleSheet.create({
  heroBand: {
    flexShrink: 0,
  },
  floating: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  glassBand: {
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: "hidden",
  },
  glassRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flexShrink: 0,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnSolid: {
    width: 34,
    height: 34,
    borderRadius: 17,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
  },
  chapterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.2,
    borderColor: "#C8A86B",
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 13,
    flexShrink: 1,
    minWidth: 0,
  },
  chapterBtnText: {
    flexShrink: 1,
  },
  simpleHeader: {
    flexShrink: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});
