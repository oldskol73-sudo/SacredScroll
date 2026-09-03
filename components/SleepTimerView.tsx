import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { SleepTimerOption } from "@/constants/audio/types";

const OPTIONS: { value: SleepTimerOption; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "endOfChapter", label: "End of Chapter" },
];

export function SleepTimerView({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { palette, narration, t } = useApp();

  function choose(option: SleepTimerOption) {
    narration.setSleepTimer(option);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView edges={["bottom"]} style={[styles.sheet, { backgroundColor: palette.card }]}>
        <AppText variant="sansExtraBold" size={13} dim style={{ letterSpacing: 0.5, marginBottom: 12 }}>
          {t("SLEEP TIMER").toUpperCase()}
        </AppText>
        {OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => choose(opt.value)}
            style={styles.row}
            accessibilityLabel={t(opt.label)}
            accessibilityRole="button"
          >
            <AppText variant="sansBold" size={15}>
              {t(opt.label)}
            </AppText>
            {narration.sleepTimer === opt.value ? <Ionicons name="checkmark-circle" size={20} color={palette.accent} /> : null}
          </Pressable>
        ))}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(60,52,30,.4)" },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
});
