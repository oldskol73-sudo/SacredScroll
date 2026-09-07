import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Safe-area wrapper for full-screen Modal overlays. Reads insets from the
 * root SafeAreaProvider (via context, which flows into Modals) instead of
 * mounting a nested SafeAreaProvider inside the Modal — nested providers
 * don't reliably deliver measured insets on the new architecture, which
 * intermittently rendered overlay headers (and their close buttons) under
 * the status bar where taps don't register. The Math.max floor keeps the
 * header reachable even if an inset ever reports 0.
 */
export function OverlaySafeArea({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 16), paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
