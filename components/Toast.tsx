import React from "react";
import { View, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

export function Toast() {
  const { toast, palette } = useApp();
  if (!toast) return null;
  return (
    <View style={[styles.toast, { backgroundColor: palette.text }]} pointerEvents="none">
      <AppText variant="sansBold" size={13} color={palette.bg}>
        {toast}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 26,
    alignSelf: "center",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 20,
    zIndex: 60,
  },
});
