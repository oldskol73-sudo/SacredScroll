import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { displayRef } from "@/constants/bible/books";

export function MiniPlayer() {
  const { palette, narration, showPlayer, setShowPlayer, language, t } = useApp();

  if (!narration.book || narration.chapter == null || showPlayer) return null;
  const pct = narration.duration ? Math.min(100, (narration.position / narration.duration) * 100) : 0;
  const isPlaying = narration.status === "playing";
  const isBuffering = narration.status === "loading" || narration.status === "buffering";
  const ref = displayRef(narration.book, narration.chapter, language);
  const subtitle = narration.verse != null ? `${t("Verse")} ${narration.verse}` : "";

  return (
    <Pressable
      onPress={() => setShowPlayer(true)}
      style={[styles.bar, { backgroundColor: palette.card, borderTopColor: palette.divider }]}
      accessibilityRole="button"
      accessibilityLabel={`${ref}${subtitle ? `, ${subtitle}` : ""}`}
    >
      <View style={[styles.artStub, { backgroundColor: palette.accent }]}>
        <Ionicons name="headset" size={16} color="#fff" />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText variant="sansBold" size={12} numberOfLines={1}>
          {ref} {subtitle ? `· ${subtitle}` : ""}
        </AppText>
        <View style={[styles.track, { backgroundColor: palette.track }]}>
          <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: palette.accent }]} />
        </View>
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          narration.togglePlayPause();
        }}
        style={[styles.playBtn, { backgroundColor: palette.accent }]}
        accessibilityRole="button"
        accessibilityLabel={`${isPlaying ? t("Pause") : t("Play")} ${ref}`}
      >
        {isBuffering ? (
          <AppText size={11} color="#fff">
            •••
          </AppText>
        ) : (
          <Ionicons name={isPlaying ? "pause" : "play"} size={14} color="#fff" />
        )}
      </Pressable>
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          narration.stop();
        }}
        style={styles.closeBtn}
        accessibilityRole="button"
        accessibilityLabel={t("Stop narration")}
      >
        <Ionicons name="close" size={18} color={palette.textDim} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderTopWidth: 1,
  },
  artStub: { width: 38, height: 38, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  track: { height: 3, borderRadius: 2, marginTop: 5, overflow: "hidden" },
  trackFill: { height: "100%", borderRadius: 2 },
  playBtn: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  closeBtn: { width: 26, height: 26, alignItems: "center", justifyContent: "center" },
});
