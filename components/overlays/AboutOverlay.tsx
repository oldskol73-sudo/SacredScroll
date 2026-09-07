import React from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";

export function AboutOverlay() {
  const { palette, showAbout, setShowAbout, t } = useApp();

  return (
    <Modal visible={showAbout} animationType="fade" onRequestClose={() => setShowAbout(false)}>
      <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => setShowAbout(false)}
              style={[styles.backBtn, { backgroundColor: palette.cardAlt }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={palette.text} />
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("About Us")}
            </AppText>
          </View>

          <View style={[styles.card, { backgroundColor: palette.card, marginTop: 14 }]}>
            <AppText size={15} style={styles.p}>
              <AppText variant="sansExtraBold" size={15}>
                Sacred Scroll
              </AppText>{" "}
              {t("a Twelve Scents Publishing app.")}
            </AppText>

            <AppText size={14} style={styles.p}>
              {t(
                "We started with a simple, stubborn belief: the heroes of the Bible were brown-skinned men and women, and for too long, the books meant to introduce them to our children forgot to mention it."
              )}
            </AppText>

            <AppText size={14} style={styles.p}>
              {t(
                "So we didn't add representation. We restored the record — heroes drawn as Scripture and history actually describe them, rooted in the 1611 King James Bible, built for a generation that deserves to see itself in its own inheritance."
              )}
            </AppText>

            <AppText size={14} style={styles.p}>
              {t("That began as picture books. It didn't end there.")}
            </AppText>

            <AppText size={14} style={styles.p}>
              <AppText variant="sansExtraBold" size={14}>
                {t("Twelve Scents is now home to a growing family of apps")}
              </AppText>
              {t(
                ", each one built on the same conviction: that faith, character, and belonging should be within reach of every child of the diaspora, wherever they are and however they read."
              )}
            </AppText>

            <AppText size={14} style={styles.p}>
              <AppText variant="sansExtraBold" size={14}>
                Sacred Scroll
              </AppText>{" "}
              {t(
                "puts the full Bible in your hands — every hero, every word, ready to be read or heard in your own voice. Alongside it,"
              )}{" "}
              <AppText variant="sansExtraBold" size={14}>
                Compass
              </AppText>{" "}
              {t(
                "helps you and your family navigate Scripture with clarity and purpose. And this is only the beginning; more tools for reading, teaching, and growing in faith are already on the way."
              )}
            </AppText>

            <AppText size={14} style={[styles.p, { marginBottom: 0 }]}>
              {t("Different apps. One publishing house. One mission, carried across every page and every screen:")}
            </AppText>
          </View>

          <View style={[styles.quoteCard, { backgroundColor: palette.cardAlt, borderColor: palette.divider }]}>
            <AppText variant="serif" size={15} style={{ lineHeight: 22, fontStyle: "italic", textAlign: "center" }}>
              {t(
                '"To put a Bible hero who looks like them into the hands of every child of the diaspora — building courage, character, and belonging through stories worth reading again and again."'
              )}
            </AppText>
          </View>

          <View style={[styles.card, { backgroundColor: palette.card, marginTop: 14 }]}>
            <AppText size={14} style={[styles.p, { marginBottom: 0 }]}>
              {t("The shelves were empty. We're filling them — book by book, app by app, generation by generation.")}
            </AppText>
          </View>

          <View style={styles.footer}>
            <AppText variant="sansExtraBold" size={15} color={palette.accent}>
              Twelve Scents Publishing
            </AppText>
            <AppText size={13} dim style={{ fontStyle: "italic", marginTop: 4 }}>
              {t("Real heroes. Real faith. Real legacy.")}
            </AppText>
          </View>
        </ScrollView>
      </SafeAreaView>
      </SafeAreaProvider>
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
  quoteCard: { borderRadius: 14, borderWidth: 1, borderStyle: "dashed", padding: 20, marginTop: 14 },
  footer: { alignItems: "center", marginTop: 24 },
});
