import React from "react";
import { View, Modal, Pressable, ScrollView, StyleSheet, Linking } from "react-native";
import { OverlaySafeArea } from "@/components/OverlaySafeArea";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as StoreReview from "expo-store-review";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { displayRef } from "@/constants/bible/books";
import { READER_FONT_SIZES, ATMOSPHERES, ATMOSPHERE_ORDER } from "@/constants/theme";

export function SettingsOverlay() {
  const {
    palette,
    showSettings,
    setShowSettings,
    notificationsOn,
    toggleNotifications,
    atmosphere,
    setAtmosphere,
    readerFontSize,
    setReaderFontSize,
    location,
    narrations,
    userId,
    showToast,
    showAbout,
    setShowAbout,
    setShowHowToUse,
    language,
    setLanguage,
    t,
  } = useApp();

  const currentRef = displayRef(location.book, location.chapter, language);
  const narration = narrations.narrationFor(location.book, location.chapter);

  async function onUpload() {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    try {
      await narrations.uploadNarration(location.book, location.chapter, asset.uri, asset.name, asset.mimeType);
      showToast(t("Narration uploaded"));
    } catch {
      showToast(t("Upload failed — try again"));
    }
  }

  function onRemove() {
    narrations.removeNarration(location.book, location.chapter);
    showToast(t("Narration removed"));
  }

  function nextFontSize() {
    const idx = READER_FONT_SIZES.indexOf(readerFontSize);
    setReaderFontSize(READER_FONT_SIZES[(idx + 1) % READER_FONT_SIZES.length]);
  }

  function onFeedback() {
    Linking.openURL("mailto:publishing@twelvescentspub.com");
  }

  async function onRateUs() {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    } else {
      showToast(t("Coming soon"));
    }
  }

  function onMoreApp() {
    Linking.openURL("https://www.twelvescentspub.com");
  }

  function onHelp() {
    setShowSettings(false);
    setShowHowToUse(true);
  }

  return (
    <Modal
      visible={showSettings && !showAbout}
      animationType="fade"
      onRequestClose={() => setShowSettings(false)}
    >
      <OverlaySafeArea style={[styles.container, { backgroundColor: palette.bg }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => setShowSettings(false)}
              style={[styles.backBtn, { backgroundColor: palette.cardAlt }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={20} color={palette.text} />
            </Pressable>
            <AppText variant="sansExtraBold" size={20}>
              {t("Settings")}
            </AppText>
          </View>

          <SectionLabel>{t("Language")}</SectionLabel>
          <View style={[styles.card, { backgroundColor: palette.card, marginBottom: 18, flexDirection: "row", gap: 10 }]}>
            <Pressable
              onPress={() => setLanguage("en")}
              style={[styles.langBtn, { backgroundColor: language === "en" ? palette.accent : palette.cardAlt }]}
            >
              <AppText variant="sansBold" size={13} color={language === "en" ? "#fff" : palette.text}>
                {t("English")}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setLanguage("es")}
              style={[styles.langBtn, { backgroundColor: language === "es" ? palette.accent : palette.cardAlt }]}
            >
              <AppText variant="sansBold" size={13} color={language === "es" ? "#fff" : palette.text}>
                Español
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setLanguage("ht")}
              style={[styles.langBtn, { backgroundColor: language === "ht" ? palette.accent : palette.cardAlt }]}
            >
              <AppText variant="sansBold" size={13} color={language === "ht" ? "#fff" : palette.text}>
                Kreyòl
              </AppText>
            </Pressable>
          </View>

          <SectionLabel>{t("Notification")}</SectionLabel>
          <View style={[styles.card, styles.rowBetween, { backgroundColor: palette.card, marginBottom: 18 }]}>
            <AppText size={15} variant="sans">
              {t("Notifications")}
            </AppText>
            <Switch value={notificationsOn} onChange={toggleNotifications} />
          </View>

          <SectionLabel>{t("Reading Atmosphere")}</SectionLabel>
          <View style={{ gap: 10, marginBottom: 18 }}>
            {ATMOSPHERE_ORDER.map((key) => {
              const a = ATMOSPHERES[key];
              const active = atmosphere === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setAtmosphere(key)}
                  style={[
                    styles.atmosphereCard,
                    { backgroundColor: palette.card, borderColor: active ? a.accent : "transparent" },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.rowLeft}>
                      <AppText size={18}>{a.badge}</AppText>
                      <AppText variant="sansExtraBold" size={15}>
                        {t(a.name)}
                      </AppText>
                    </View>
                    {active ? (
                      <View style={[styles.activeBadge, { backgroundColor: a.accent }]}>
                        <AppText variant="sansExtraBold" size={10} color="#fff">
                          {t("ACTIVE")}
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                  <AppText size={11} dim style={{ marginTop: 4 }}>
                    {t(a.tone)}
                  </AppText>
                  <AppText size={12} dim style={{ marginTop: 8, fontStyle: "italic", lineHeight: 17 }}>
                    "{t(a.tagline)}"
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <SectionLabel>{t("Font")}</SectionLabel>
          <View style={[styles.card, { backgroundColor: palette.card, marginBottom: 18 }]}>
            <Pressable onPress={nextFontSize} style={[styles.optionRow, { borderBottomWidth: 0 }]}>
              <AppText size={15}>{t("Reader Font Size")}</AppText>
              <AppText size={13} dim>
                {readerFontSize}px ›
              </AppText>
            </Pressable>
          </View>

          <SectionLabel>{t("Audio Narration")}</SectionLabel>
          <View style={[styles.card, { backgroundColor: palette.card, marginBottom: 18 }]}>
            <AppText variant="sansBold" size={15} style={{ marginBottom: 2 }}>
              {currentRef}
            </AppText>
            <AppText size={12} dim style={{ marginBottom: 12 }}>
              {narration ? `${t("Uploaded:")} ${narration.name}` : t("No custom narration uploaded")}
            </AppText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={onUpload}
                disabled={!userId}
                style={[styles.pillBtn, { backgroundColor: palette.accent }]}
              >
                <AppText variant="sansBold" size={12} color="#fff">
                  {t("Upload Recording")}
                </AppText>
              </Pressable>
              {narration ? (
                <Pressable onPress={onRemove} style={[styles.pillBtn, { backgroundColor: palette.cardAlt }]}>
                  <AppText variant="sansBold" size={12} dim>
                    {t("Remove")}
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          </View>

          <SectionLabel>{t("About App")}</SectionLabel>
          <View style={[styles.card, { backgroundColor: palette.card, marginBottom: 18 }]}>
            <Pressable onPress={onFeedback} style={[styles.optionRow, { borderBottomColor: palette.divider }]}>
              <AppText size={15}>{t("Feedback")}</AppText>
              <AppText dim>›</AppText>
            </Pressable>
            <Pressable onPress={() => setShowAbout(true)} style={[styles.optionRow, { borderBottomColor: palette.divider }]}>
              <AppText size={15}>{t("About Us")}</AppText>
              <AppText dim>›</AppText>
            </Pressable>
            <Pressable onPress={onRateUs} style={styles.optionRow}>
              <AppText size={15}>{t("Rate Us")}</AppText>
            </Pressable>
          </View>

          <SectionLabel>{t("Support")}</SectionLabel>
          <View style={[styles.card, { backgroundColor: palette.card }]}>
            <Pressable onPress={onMoreApp} style={[styles.optionRow, { borderBottomColor: palette.divider }]}>
              <AppText size={15}>{t("Explore the Collection")}</AppText>
            </Pressable>
            <Pressable onPress={onHelp} style={styles.optionRow}>
              <AppText size={15}>{t("Help")}</AppText>
            </Pressable>
          </View>
        </ScrollView>
      </OverlaySafeArea>
    </Modal>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { palette } = useApp();
  return (
    <AppText variant="sansExtraBold" size={11} dim style={{ letterSpacing: 1, paddingVertical: 8 }}>
      {String(children).toUpperCase()}
    </AppText>
  );
}

function Switch({ value, onChange }: { value: boolean; onChange: () => void }) {
  const { palette } = useApp();
  return (
    <Pressable
      onPress={onChange}
      style={[styles.switchTrack, { backgroundColor: value ? palette.accent : palette.track }]}
    >
      <View style={[styles.switchKnob, { left: value ? 21 : 3 }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 28, paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 14, padding: 16 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pillBtn: { borderRadius: 10, paddingVertical: 9, paddingHorizontal: 16 },
  langBtn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: "center" },
  switchTrack: { width: 44, height: 26, borderRadius: 13, justifyContent: "center" },
  switchKnob: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" },
  atmosphereCard: { borderRadius: 16, padding: 16, borderWidth: 2 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 9 },
  activeBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 9 },
});
