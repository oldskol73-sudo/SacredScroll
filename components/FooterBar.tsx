import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

export function FooterBar() {
  const { palette, setShowDrawer, setShowSettings } = useApp();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: palette.card, borderTopColor: palette.divider },
      ]}
    >
      <Pressable
        onPress={() => setShowDrawer(true)}
        style={[styles.circleBtn, { backgroundColor: palette.cardAlt, borderColor: palette.accent }]}
      >
        <Ionicons name="menu" size={18} color={palette.text} />
      </Pressable>
      <Pressable
        onPress={() => setShowSettings(true)}
        style={[styles.circleBtn, { backgroundColor: palette.cardAlt, borderColor: palette.accent }]}
      >
        <Ionicons name="settings-outline" size={18} color={palette.text} />
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
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
