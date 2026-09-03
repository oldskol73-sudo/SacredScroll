import React, { useEffect, useState } from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { AppleReaderService } from "@/services/appleReaderService";
import { Narrator } from "@/constants/audio/types";

const TWELVE_SCENTS_NARRATOR: Narrator = {
  id: "twelve-scents-v1",
  source: "premium",
  name: "Twelve Scents Narrator",
  description: "Premium narration, streamed or downloaded",
};

export function NarratorPickerView({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { palette, narration, t } = useApp();
  const [appleVoices, setAppleVoices] = useState<Narrator[] | null>(null);

  useEffect(() => {
    if (!visible || appleVoices) return;
    AppleReaderService.getAvailableVoices().then(setAppleVoices);
  }, [visible, appleVoices]);

  function choose(pick: Narrator) {
    narration.selectNarrator(pick);
    narration.switchSource(pick.source);
    onClose();
  }

  const activeId = narration.narrator?.id ?? (narration.source === "apple" ? undefined : TWELVE_SCENTS_NARRATOR.id);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView edges={["bottom"]} style={[styles.sheet, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={13} dim style={{ letterSpacing: 0.5, marginBottom: 12 }}>
          {t("NARRATOR").toUpperCase()}
        </AppText>

        <Row
          narrator={TWELVE_SCENTS_NARRATOR}
          active={activeId === TWELVE_SCENTS_NARRATOR.id && narration.source !== "apple"}
          onPress={() => choose(TWELVE_SCENTS_NARRATOR)}
        />

        <View style={[styles.divider, { backgroundColor: palette.divider }]} />

        <AppText variant="sansExtraBold" size={13} dim style={{ letterSpacing: 0.5, marginBottom: 12 }}>
          {t("APPLE READER").toUpperCase()}
        </AppText>

        {!appleVoices ? (
          <ActivityIndicator color={palette.accent} style={{ marginVertical: 12 }} />
        ) : appleVoices.length === 0 ? (
          <AppText size={13} dim>
            {t("No installed voices found.")}
          </AppText>
        ) : (
          <ScrollView style={{ marginBottom: 12 }}>
            {appleVoices.map((voice) => (
              <Row key={voice.id} narrator={voice} active={activeId === voice.id} onPress={() => choose(voice)} />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

function Row({ narrator, active, onPress }: { narrator: Narrator; active: boolean; onPress: () => void }) {
  const { palette } = useApp();
  return (
    <Pressable onPress={onPress} style={styles.row} accessibilityLabel={narrator.name} accessibilityRole="button">
      <View style={{ flex: 1 }}>
        <AppText variant="sansBold" size={15}>
          {narrator.name}
        </AppText>
        <AppText size={12} dim style={{ marginTop: 2 }}>
          {narrator.description}
        </AppText>
      </View>
      {active ? <Ionicons name="checkmark-circle" size={20} color={palette.accent} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(60,52,30,.4)" },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: "70%",
  },
  divider: { height: 1, marginVertical: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});
