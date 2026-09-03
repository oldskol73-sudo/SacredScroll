import React, { useState } from "react";
import { View, Modal, Pressable, Image, StyleSheet, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { displayRef } from "@/constants/bible/books";
import { PLAYBACK_SPEEDS, PlaybackSpeed } from "@/constants/audio/types";
import { NarratorPickerView } from "@/components/NarratorPickerView";
import { SleepTimerView } from "@/components/SleepTimerView";

const COVER = require("@/assets/images/bible/tsp-logo-cover.jpg");

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function fmtSleepRemaining(sec: number) {
  const m = Math.ceil(sec / 60);
  return `${m}m`;
}

export function AudioPlayer() {
  const { palette, narration, showPlayer, setShowPlayer, language, t } = useApp();
  const [showNarratorPicker, setShowNarratorPicker] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);

  if (!narration.book || narration.chapter == null) return null;

  const ref = displayRef(narration.book, narration.chapter, language);
  const isPremium = narration.source === "premium";
  const isPlaying = narration.status === "playing";
  const isBuffering = narration.status === "loading" || narration.status === "buffering";
  const narratorLabel = narration.narrator?.name ?? (narration.source === "apple" ? t("Apple Reader") : t("Twelve Scents Narrator"));
  const sleepLabel =
    narration.sleepTimer === "off"
      ? t("Off")
      : narration.sleepTimer === "endOfChapter"
        ? t("End of Chapter")
        : narration.sleepRemainingSeconds != null
          ? fmtSleepRemaining(narration.sleepRemainingSeconds)
          : t("Off");

  return (
    <Modal visible={showPlayer} animationType="slide" onRequestClose={() => setShowPlayer(false)}>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.card }]} edges={["top", "bottom"]}>
        <Pressable
          onPress={() => setShowPlayer(false)}
          style={[styles.closeBtn, { backgroundColor: palette.cardAlt }]}
          accessibilityLabel={t("Close player")}
          accessibilityRole="button"
        >
          <AppText size={16} variant="sansBold">
            ✕
          </AppText>
        </Pressable>

        <View style={styles.content}>
          <Image source={COVER} style={styles.cover} resizeMode="cover" />
          <View style={{ alignItems: "center" }}>
            <AppText variant="sansExtraBold" size={19}>
              {ref}
            </AppText>
            <AppText size={13} dim style={{ marginTop: 4 }}>
              {narration.verse != null ? `${t("Verse")} ${narration.verse}` : t("KJV Narration")}
            </AppText>
          </View>

          {narration.canFallbackToAppleReader ? (
            <View style={[styles.banner, { backgroundColor: palette.cardAlt, borderColor: palette.divider }]}>
              <AppText size={12} style={{ textAlign: "center", lineHeight: 17 }}>
                {t("Twelve Scents narration isn't available for this chapter yet.")}
              </AppText>
              <Pressable
                onPress={narration.useAppleReaderFallback}
                style={[styles.bannerBtn, { backgroundColor: palette.accent }]}
                accessibilityRole="button"
                accessibilityLabel={t("Use Apple Reader")}
              >
                <AppText variant="sansBold" size={13} color="#fff">
                  {t("Use Apple Reader")}
                </AppText>
              </Pressable>
            </View>
          ) : narration.error ? (
            <View style={[styles.banner, { backgroundColor: palette.cardAlt, borderColor: palette.divider }]}>
              <AppText size={12} style={{ textAlign: "center", lineHeight: 17 }}>
                {t("Playback couldn't continue. Please try again.")}
              </AppText>
            </View>
          ) : null}

          <View style={{ width: "100%" }}>
            {isPremium ? (
              <>
                <Slider
                  value={narration.position}
                  minimumValue={0}
                  maximumValue={narration.duration || 1}
                  onSlidingComplete={narration.seek}
                  minimumTrackTintColor={palette.accent}
                  maximumTrackTintColor={palette.track}
                  thumbTintColor={palette.accent}
                  accessibilityLabel={t("Playback progress")}
                />
                <View style={styles.timeRow}>
                  <AppText size={11} dim>
                    {fmtTime(narration.position)}
                  </AppText>
                  <AppText size={11} dim>
                    {fmtTime(narration.duration)}
                  </AppText>
                </View>
              </>
            ) : (
              <View style={[styles.appleProgressTrack, { backgroundColor: palette.track }]}>
                <AppText size={11} dim style={{ textAlign: "center" }}>
                  {isBuffering ? t("Loading…") : t("Reading aloud — Apple Reader")}
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.controlsRow}>
            <Pressable
              onPress={narration.previousChapter}
              accessibilityRole="button"
              accessibilityLabel={`${t("Previous chapter")}`}
            >
              <Ionicons name="play-skip-back" size={20} color={palette.text} />
            </Pressable>
            <Pressable
              onPress={narration.previousVerse}
              accessibilityRole="button"
              accessibilityLabel={t("Previous verse")}
            >
              <Ionicons name="chevron-back" size={26} color={palette.text} />
            </Pressable>
            <Pressable
              onPress={narration.togglePlayPause}
              style={[styles.playBtn, { backgroundColor: palette.accent }]}
              accessibilityRole="button"
              accessibilityLabel={`${isPlaying ? t("Pause") : t("Play")} ${ref}`}
            >
              {isBuffering ? (
                <AppText size={13} color="#fff">
                  •••
                </AppText>
              ) : (
                <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="#fff" />
              )}
            </Pressable>
            <Pressable onPress={narration.nextVerse} accessibilityRole="button" accessibilityLabel={t("Next verse")}>
              <Ionicons name="chevron-forward" size={26} color={palette.text} />
            </Pressable>
            <Pressable onPress={narration.nextChapter} accessibilityRole="button" accessibilityLabel={t("Next chapter")}>
              <Ionicons name="play-skip-forward" size={20} color={palette.text} />
            </Pressable>
          </View>

          <View style={styles.speedRow}>
            {PLAYBACK_SPEEDS.map((speed) => (
              <SpeedPill key={speed} speed={speed} active={narration.speed === speed} onPress={() => narration.setSpeed(speed)} />
            ))}
          </View>

          <View style={styles.settingsList}>
            <SettingRow
              label={t("Narrator")}
              value={narratorLabel}
              onPress={() => setShowNarratorPicker(true)}
            />
            <SettingRow label={t("Sleep Timer")} value={sleepLabel} onPress={() => setShowSleepTimer(true)} />
            <View style={styles.toggleRow}>
              <AppText size={14}>{t("Play Next Chapter Automatically")}</AppText>
              <Switch
                value={narration.autoAdvance}
                onValueChange={narration.setAutoAdvance}
                trackColor={{ true: palette.accent, false: palette.track }}
                accessibilityLabel={t("Play Next Chapter Automatically")}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <NarratorPickerView visible={showNarratorPicker} onClose={() => setShowNarratorPicker(false)} />
      <SleepTimerView visible={showSleepTimer} onClose={() => setShowSleepTimer(false)} />
    </Modal>
  );
}

function SpeedPill({ speed, active, onPress }: { speed: PlaybackSpeed; active: boolean; onPress: () => void }) {
  const { palette, t } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.speedPill, { backgroundColor: active ? palette.accent : palette.track }]}
      accessibilityRole="button"
      accessibilityLabel={`${t("Playback speed")} ${speed}x`}
    >
      <AppText variant="sansBold" size={11} color={active ? "#fff" : palette.text}>
        {speed}x
      </AppText>
    </Pressable>
  );
}

function SettingRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  const { palette } = useApp();
  return (
    <Pressable onPress={onPress} style={styles.toggleRow} accessibilityRole="button" accessibilityLabel={`${label}: ${value}`}>
      <AppText size={14}>{label}</AppText>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <AppText size={13} color={palette.accent}>
          {value}
        </AppText>
        <Ionicons name="chevron-forward" size={14} color={palette.accent} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, paddingHorizontal: 24, paddingBottom: 40 },
  closeBtn: {
    alignSelf: "flex-start",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  content: { flex: 1, alignItems: "center", gap: 18 },
  cover: { width: 150, height: 150, borderRadius: 18, marginTop: 8 },
  banner: { width: "100%", borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 10 },
  bannerBtn: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  appleProgressTrack: { borderRadius: 8, paddingVertical: 14, paddingHorizontal: 10 },
  controlsRow: { flexDirection: "row", alignItems: "center", gap: 22, marginTop: 4 },
  playBtn: { width: 62, height: 62, borderRadius: 31, alignItems: "center", justifyContent: "center" },
  speedRow: { flexDirection: "row", gap: 8 },
  speedPill: { borderRadius: 14, paddingVertical: 7, paddingHorizontal: 11 },
  settingsList: { width: "100%", gap: 2, marginTop: 4 },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
});
