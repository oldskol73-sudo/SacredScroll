import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

export function FooterBar() {
  const { palette, setShowDrawer, setShowSettings, t } = useApp();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: palette.card, borderTopColor: palette.divider },
      ]}
    >
      <Pressable
        onPress={() => setShowDrawer(true)}
        style={[styles.pillBtn, { backgroundColor: palette.cardAlt, borderColor: palette.accent }]}
      >
        <Ionicons name="menu" size={16} color={palette.text} />
        <View style={[styles.divider, { backgroundColor: palette.divider }]} />
        <AppText variant="sansBold" size={11.5} color={palette.text}>
          {t("Menu")}
        </AppText>
      </Pressable>
      <Pressable
        onPress={() => setShowSettings(true)}
        style={[styles.pillBtn, { backgroundColor: palette.cardAlt, borderColor: palette.accent }]}
      >
        <Ionicons name="settings-outline" size={16} color={palette.text} />
        <View style={[styles.divider, { backgroundColor: palette.divider }]} />
        <AppText variant="sansBold" size={11.5} color={palette.text}>
          {t("Settings")}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  pillBtn: {
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
  },
  divider: {
    width: 1,
    height: 16,
  },
});
