import React from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { OverlaySafeArea } from "@/components/OverlaySafeArea";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

export function AboutTranslationOverlay() {
  const { palette, showAboutTranslation, setShowAboutTranslation, t } = useApp();

  return (
    <Modal visible={showAboutTranslation} animationType="fade" onRequestClose={() => setShowAboutTranslation(false)}>
      <OverlaySafeArea style={[styles.container, { backgroundColor: palette.bg }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => setShowAboutTranslation(false)}
              style={[styles.backBtn, { backgroundColor: palette.cardAlt }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={palette.text} />
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("About This Translation")}
            </AppText>
          </View>

          <View style={[styles.card, { backgroundColor: palette.card, marginTop: 14 }]}>
            <AppText size={15} style={styles.p}>
              <AppText variant="sansExtraBold" size={15}>
                {t("The King James Version (1611)")}
              </AppText>
            </AppText>
            <AppText size={14} style={styles.p}>
              {t(
                "Sacred Scroll's Bible text is the King James Version, first published in 1611 under King James I of England. Commissioned from the Hebrew and Greek source texts by a team of nearly fifty scholars, it remains one of the most widely read and quoted English Bible translations in history."
              )}
            </AppText>
            <AppText size={14} style={[styles.p, { marginBottom: 0 }]}>
              {t(
                "Its language has shaped English literature and worship for over four centuries, and it is the translation this app is built around, cover to cover."
              )}
            </AppText>
          </View>

          <View style={[styles.card, { backgroundColor: palette.card, marginTop: 14 }]}>
            <AppText size={15} style={styles.p}>
              <AppText variant="sansExtraBold" size={15}>
                {t("The Apocrypha")}
              </AppText>
            </AppText>
            <AppText size={14} style={styles.p}>
              {t(
                "Alongside the 66 books of the standard Protestant canon, Sacred Scroll includes the Apocrypha — a collection of historical, wisdom, and devotional books that appeared in the original 1611 King James Bible."
              )}
            </AppText>
            <AppText size={14} style={[styles.p, { marginBottom: 0 }]}>
              {t(
                "These books were part of English Bibles for centuries before later editions removed them. We include them here as they were originally printed, for readers who want the complete 1611 text."
              )}
            </AppText>
          </View>
        </ScrollView>
      </OverlaySafeArea>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 14, padding: 18 },
  p: { lineHeight: 21, marginBottom: 14 },
});
