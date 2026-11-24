import React from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

const BUNDLE_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: "library", label: "Every Precepts topic — all 442, A to Z" },
  { icon: "map", label: "All 4 specialized study plans" },
  { icon: "mic", label: "Twelve Scents Narrator audio" },
  { icon: "cloud-upload", label: "Upload your own chapter narrations" },
  { icon: "sparkles", label: "An ad-free Desk" },
];

export function PaywallOverlay() {
  const { palette, showPaywall, setShowPaywall, unlockPremium, showToast, t } = useApp();
  const insets = useSafeAreaInsets();

  function onUnlock() {
    unlockPremium();
    setShowPaywall(false);
    showToast(t("Unlocked — thank you!"));
  }

  return (
    <Modal visible={showPaywall} animationType="slide" onRequestClose={() => setShowPaywall(false)} transparent>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: palette.bg, paddingBottom: insets.bottom }]}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }} />
              <Pressable
                onPress={() => setShowPaywall(false)}
                style={[styles.closeBtn, { backgroundColor: palette.cardAlt }]}
                hitSlop={8}
              >
                <Ionicons name="close" size={18} color={palette.text} />
              </Pressable>
            </View>

            <View style={styles.hero}>
              <View style={[styles.heroIcon, { backgroundColor: palette.accent }]}>
                <Ionicons name="star" size={26} color="#fff" />
              </View>
              <AppText variant="serifBold" size={24} style={{ textAlign: "center", marginTop: 14 }}>
                {t("Unlock Sacred Scroll")}
              </AppText>
              <AppText size={14} dim style={{ textAlign: "center", marginTop: 8, lineHeight: 20 }}>
                {t("Go deeper in your study, personalize your experience, and support Sacred Scroll.")}
              </AppText>
            </View>

            <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.divider }]}>
              {BUNDLE_ITEMS.map((item) => (
                <View key={item.label} style={styles.itemRow}>
                  <View style={[styles.itemIcon, { backgroundColor: palette.cardAlt }]}>
                    <Ionicons name={item.icon} size={16} color={palette.accent} />
                  </View>
                  <AppText size={14} style={{ flex: 1 }}>
                    {t(item.label)}
                  </AppText>
                </View>
              ))}
            </View>

            <Pressable onPress={onUnlock} style={[styles.unlockBtn, { backgroundColor: palette.accent }]}>
              <AppText variant="sansExtraBold" size={15.5} color="#fff">
                {t("Upgrade Now")}
              </AppText>
            </Pressable>

            <Pressable onPress={() => setShowPaywall(false)} style={styles.laterBtn} hitSlop={8}>
              <AppText variant="sansBold" size={13} dim>
                {t("Maybe Later")}
              </AppText>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "88%" },
  content: { paddingHorizontal: 22, paddingTop: 6, paddingBottom: 30 },
  headerRow: { flexDirection: "row" },
  closeBtn: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  hero: { alignItems: "center", marginTop: 4, marginBottom: 20 },
  heroIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 18, borderWidth: 1, padding: 18, gap: 16 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  unlockBtn: { borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 22 },
  laterBtn: { alignItems: "center", paddingVertical: 14 },
});
