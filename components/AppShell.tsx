import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { FooterBar } from "@/components/FooterBar";
import { Drawer } from "@/components/Drawer";
import { BookPicker } from "@/components/BookPicker";
import { VerseActionBar } from "@/components/VerseActionBar";
import { NoteComposer } from "@/components/NoteComposer";
import { Toast } from "@/components/Toast";
import { DeskScreen } from "@/components/screens/DeskScreen";
import { TodayScreen } from "@/components/screens/TodayScreen";
import { ReadScreen } from "@/components/screens/ReadScreen";
import { SearchScreen } from "@/components/screens/SearchScreen";
import { PlansScreen } from "@/components/screens/PlansScreen";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { ChronoDetailOverlay } from "@/components/overlays/ChronoDetailOverlay";
import { SinBattlesOverlay } from "@/components/overlays/SinBattlesOverlay";
import { PreceptsOverlay } from "@/components/overlays/PreceptsOverlay";
import { StudyCategoriesOverlay } from "@/components/overlays/StudyCategoriesOverlay";
import { WeeklyStudyOverlay } from "@/components/overlays/WeeklyStudyOverlay";
import { SettingsOverlay } from "@/components/overlays/SettingsOverlay";
import { HowToUseOverlay } from "@/components/overlays/HowToUseOverlay";
import { AboutOverlay } from "@/components/overlays/AboutOverlay";
import { AudioPlayer } from "@/components/AudioPlayer";
import { MiniPlayer } from "@/components/MiniPlayer";

export function AppShell() {
  const { isLoading, palette, tab, desk } = useApp();

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: palette.bg }]}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      {desk ? (
        <DeskScreen />
      ) : (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
          {tab === "read" ? (
            <View style={{ flex: 1 }}>
              <ReadScreen />
              <Header />
            </View>
          ) : (
            <>
              <Header />
              <View style={{ flex: 1 }}>
                {tab === "today" && <TodayScreen />}
                {tab === "search" && <SearchScreen />}
                {tab === "plans" && <PlansScreen />}
                {tab === "library" && <LibraryScreen />}
              </View>
            </>
          )}
          <MiniPlayer />
          <FooterBar />
        </SafeAreaView>
      )}

      <Drawer />
      <BookPicker />
      <VerseActionBar />
      <NoteComposer />
      <ChronoDetailOverlay />
      <SinBattlesOverlay />
      <PreceptsOverlay />
      <StudyCategoriesOverlay />
      <WeeklyStudyOverlay />
      <SettingsOverlay />
      <HowToUseOverlay />
      <AboutOverlay />
      <AudioPlayer />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
