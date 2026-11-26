import React, { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import {
  useSettings,
  useBookmarks,
  useHighlights,
  useNotes,
  usePlanProgress,
  refKey,
} from "@/hooks/useBibleStore";
import { useNarrations } from "@/hooks/useNarrations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBibleNarration } from "@/hooks/useBibleNarration";
import { useSceneSounds } from "@/hooks/useSceneSounds";
import { ATMOSPHERES, AtmosphereKey, Palette, HighlightColorKey } from "@/constants/theme";
import { Language, translate } from "@/constants/i18n";
import { setBibleLanguage } from "@/constants/bible/verses";
import type { PreceptTopic } from "@/constants/bible/precepts";

export type TabKey = "today" | "read" | "search" | "plans" | "library" | "calendar";

/** Opens the Precepts page on the topics anchored at a Reader verse. */
export interface PreceptFocus {
  verseRef: string;
  topics: PreceptTopic[];
}

export interface Location {
  book: string;
  chapter: number;
}

interface AppContextValue {
  isLoading: boolean;
  userId?: string;

  palette: Palette;
  atmosphere: AtmosphereKey;
  setAtmosphere: (key: AtmosphereKey) => void;
  cycleAtmosphere: () => void;
  readerFontSize: number;
  setReaderFontSize: (n: number) => void;
  notificationsOn: boolean;
  toggleNotifications: () => void;
  redLetterEnabled: boolean;
  toggleRedLetter: () => void;
  /** The ambient scene-sound layer under chosen passages of the narration. */
  sceneSoundsEnabled: boolean;
  toggleSceneSounds: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (s: string) => string;

  desk: boolean;
  goToDesk: () => void;
  enterContinueReading: () => void;
  goToPlans: () => void;
  goToCalendar: () => void;

  tab: TabKey;
  setTab: (t: TabKey) => void;

  location: Location;
  goTo: (book: string, chapter: number) => void;

  selectedVerse: number | null;
  selectVerse: (n: number | null) => void;

  /** Verses picked in the Reader's multi-select mode; null when the mode is off. */
  multiVerses: number[] | null;
  startMultiSelect: (first: number) => void;
  toggleMultiVerse: (n: number) => void;
  endMultiSelect: () => void;

  preceptFocus: PreceptFocus | null;
  setPreceptFocus: (f: PreceptFocus | null) => void;
  openPrecepts: (focus?: PreceptFocus) => void;

  showDrawer: boolean;
  setShowDrawer: (v: boolean) => void;
  showBookPicker: boolean;
  setShowBookPicker: (v: boolean) => void;
  showNoteComposer: boolean;
  setShowNoteComposer: (v: boolean) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  showPrecepts: boolean;
  setShowPrecepts: (v: boolean) => void;
  showHowToUse: boolean;
  setShowHowToUse: (v: boolean) => void;
  showAbout: boolean;
  setShowAbout: (v: boolean) => void;
  showAboutTranslation: boolean;
  setShowAboutTranslation: (v: boolean) => void;
  showChronoDetail: boolean;
  setShowChronoDetail: (v: boolean) => void;
  showSinBattlesMark: boolean;
  setShowSinBattlesMark: (v: boolean) => void;
  showSinBattlesRomans: boolean;
  setShowSinBattlesRomans: (v: boolean) => void;
  showStudyCategories: boolean;
  setShowStudyCategories: (v: boolean) => void;
  showWeeklyStudy: boolean;
  setShowWeeklyStudy: (v: boolean) => void;

  bookmarks: ReturnType<typeof useBookmarks>;
  highlights: ReturnType<typeof useHighlights>;
  notes: ReturnType<typeof useNotes>;
  chronoProgress: ReturnType<typeof usePlanProgress>;
  sinProgress: ReturnType<typeof usePlanProgress>;
  studyCategoryProgress: ReturnType<typeof usePlanProgress>;
  studyWeeklyProgress: ReturnType<typeof usePlanProgress>;

  toast: string | null;
  showToast: (msg: string) => void;

  refKey: typeof refKey;

  narrations: ReturnType<typeof useNarrations>;
  narration: ReturnType<typeof useBibleNarration>;
  playChapter: (book: string, chapter: number) => void;
  showPlayer: boolean;
  setShowPlayer: (v: boolean) => void;

  showOnboarding: boolean;
  dismissOnboarding: () => void;
  replayOnboarding: () => void;

  isPremium: boolean;
  unlockPremium: () => void;
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;
  /** Runs `action` if premium is unlocked, otherwise opens the paywall. */
  requirePremium: (action: () => void) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isLoading: authLoading, user } = useGuestAuth();
  const userId = user?.id;

  const settings = useSettings(userId);
  const bookmarks = useBookmarks(userId);
  const highlights = useHighlights(userId);
  const notes = useNotes(userId);
  const chronoProgress = usePlanProgress(userId, "chrono");
  const sinProgress = usePlanProgress(userId, "sin");
  const studyCategoryProgress = usePlanProgress(userId, "studyCategory");
  const studyWeeklyProgress = usePlanProgress(userId, "studyWeekly");
  const narrations = useNarrations(userId);
  const narration = useBibleNarration();

  // Scene sounds: an optional ambient layer under chosen scenes. Kept on this phone only; on by default.
  const [sceneSoundsEnabled, setSceneSoundsEnabled] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem("sceneSounds")
      .then((v) => {
        if (v === "off") setSceneSoundsEnabled(false);
      })
      .catch(() => {});
  }, []);
  const toggleSceneSounds = useCallback(() => {
    setSceneSoundsEnabled((on) => {
      AsyncStorage.setItem("sceneSounds", on ? "off" : "on").catch(() => {});
      return !on;
    });
  }, []);
  useSceneSounds(narration, sceneSoundsEnabled);

  const [desk, setDesk] = useState(true);
  const [tab, setTab] = useState<TabKey>("today");
  const [location, setLocation] = useState<Location>({ book: "Deuteronomy", chapter: 28 });
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [multiVerses, setMultiVerses] = useState<number[] | null>(null);
  const [preceptFocus, setPreceptFocus] = useState<PreceptFocus | null>(null);

  const [showDrawer, setShowDrawer] = useState(false);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showNoteComposer, setShowNoteComposer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrecepts, setShowPrecepts] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAboutTranslation, setShowAboutTranslation] = useState(false);
  const [showChronoDetail, setShowChronoDetail] = useState(false);
  const [showSinBattlesMark, setShowSinBattlesMark] = useState(false);
  const [showSinBattlesRomans, setShowSinBattlesRomans] = useState(false);
  const [showStudyCategories, setShowStudyCategories] = useState(false);
  const [showWeeklyStudy, setShowWeeklyStudy] = useState(false);

  const [showPlayer, setShowPlayer] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  // The iOS app is a one-time paid download, so every feature is unlocked from
  // the first launch — nothing is gated and the paywall never opens.
  const isPremium = true;
  const requirePremium = useCallback(
    (action: () => void) => {
      if (isPremium) action();
      else setShowPaywall(true);
    },
    [isPremium]
  );

  // Shown once, automatically, the first time settings finish loading and the
  // guest's own saved settings row says they haven't seen it yet.
  const [showOnboarding, setShowOnboarding] = useState(false);
  const onboardingChecked = useRef(false);
  useEffect(() => {
    if (onboardingChecked.current || authLoading || settings.isLoading || !userId) return;
    onboardingChecked.current = true;
    if (!settings.hasSeenOnboarding) setShowOnboarding(true);
  }, [authLoading, settings.isLoading, settings.hasSeenOnboarding, userId]);

  function dismissOnboarding() {
    setShowOnboarding(false);
    settings.completeOnboarding();
  }
  function replayOnboarding() {
    setShowSettings(false);
    setShowOnboarding(true);
  }

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const atmosphere = settings.atmosphere;
  const palette = ATMOSPHERES[atmosphere];
  const language = settings.language;
  // Keep the Bible-text module's active language in sync with the setting on every
  // render (cheap, idempotent) so versesFor/search/daily-verse always read the right
  // language without every consumer needing to thread it through explicitly.
  setBibleLanguage(language);
  const t = useCallback((s: string) => translate(language, s), [language]);

  const goToDesk = useCallback(() => {
    setDesk(true);
    setShowDrawer(false);
  }, []);

  const enterContinueReading = useCallback(() => {
    setDesk(false);
    setTab("read");
  }, []);

  const goToPlans = useCallback(() => {
    setDesk(false);
    setTab("plans");
  }, []);

  const goToCalendar = useCallback(() => {
    setDesk(false);
    setTab("calendar");
  }, []);

  const goTo = useCallback((book: string, chapter: number) => {
    setDesk(false);
    setLocation({ book, chapter });
    setTab("read");
    setSelectedVerse(null);
    setMultiVerses(null);
  }, []);

  const selectVerse = useCallback((n: number | null) => {
    setSelectedVerse(n);
  }, []);

  const startMultiSelect = useCallback((first: number) => {
    setSelectedVerse(null);
    setMultiVerses([first]);
  }, []);

  // Deselecting the last verse leaves the mode rather than showing an empty bar.
  const toggleMultiVerse = useCallback((n: number) => {
    setMultiVerses((cur) => {
      if (!cur) return cur;
      const next = cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n].sort((a, b) => a - b);
      return next.length ? next : null;
    });
  }, []);

  const endMultiSelect = useCallback(() => setMultiVerses(null), []);

  const openPrecepts = useCallback((focus?: PreceptFocus) => {
    setPreceptFocus(focus ?? null);
    setShowPrecepts(true);
  }, []);

  const playChapter = useCallback(
    (book: string, chapter: number) => {
      narration.playChapter(book, chapter);
      setShowPlayer(true);
    },
    [narration]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      isLoading: authLoading,
      userId,
      palette,
      atmosphere,
      setAtmosphere: settings.setAtmosphere,
      cycleAtmosphere: settings.cycleAtmosphere,
      readerFontSize: settings.readerFontSize,
      setReaderFontSize: settings.setReaderFontSize,
      notificationsOn: settings.notificationsOn,
      toggleNotifications: settings.toggleNotifications,
      redLetterEnabled: settings.redLetterEnabled,
      toggleRedLetter: settings.toggleRedLetter,
      sceneSoundsEnabled,
      toggleSceneSounds,
      language,
      setLanguage: settings.setLanguage,
      t,
      desk,
      goToDesk,
      enterContinueReading,
      goToPlans,
      goToCalendar,
      tab,
      setTab,
      location,
      goTo,
      selectedVerse,
      selectVerse,
      multiVerses,
      startMultiSelect,
      toggleMultiVerse,
      endMultiSelect,
      preceptFocus,
      setPreceptFocus,
      openPrecepts,
      showDrawer,
      setShowDrawer,
      showBookPicker,
      setShowBookPicker,
      showNoteComposer,
      setShowNoteComposer,
      showSettings,
      setShowSettings,
      showPrecepts,
      setShowPrecepts,
      showHowToUse,
      setShowHowToUse,
      showAbout,
      setShowAbout,
      showAboutTranslation,
      setShowAboutTranslation,
      showChronoDetail,
      setShowChronoDetail,
      showSinBattlesMark,
      setShowSinBattlesMark,
      showSinBattlesRomans,
      setShowSinBattlesRomans,
      showStudyCategories,
      setShowStudyCategories,
      showWeeklyStudy,
      setShowWeeklyStudy,
      bookmarks,
      highlights,
      notes,
      chronoProgress,
      sinProgress,
      studyCategoryProgress,
      studyWeeklyProgress,
      toast,
      showToast,
      refKey,
      narrations,
      narration,
      playChapter,
      showPlayer,
      setShowPlayer,
      showOnboarding,
      dismissOnboarding,
      replayOnboarding,
      isPremium,
      unlockPremium: settings.unlockPremium,
      showPaywall,
      setShowPaywall,
      requirePremium,
    }),
    [
      authLoading,
      userId,
      palette,
      atmosphere,
      settings,
      language,
      t,
      desk,
      goToDesk,
      enterContinueReading,
      goToPlans,
      goToCalendar,
      tab,
      location,
      goTo,
      selectedVerse,
      selectVerse,
      multiVerses,
      startMultiSelect,
      toggleMultiVerse,
      endMultiSelect,
      preceptFocus,
      openPrecepts,
      showDrawer,
      showBookPicker,
      showNoteComposer,
      showSettings,
      showPrecepts,
      showHowToUse,
      showAbout,
      showAboutTranslation,
      showChronoDetail,
      showSinBattlesMark,
      showSinBattlesRomans,
      showStudyCategories,
      showWeeklyStudy,
      bookmarks,
      highlights,
      notes,
      chronoProgress,
      sinProgress,
      studyCategoryProgress,
      studyWeeklyProgress,
      toast,
      showToast,
      narrations,
      narration,
      playChapter,
      showPlayer,
      showOnboarding,
      isPremium,
      showPaywall,
      requirePremium,
      sceneSoundsEnabled,
      toggleSceneSounds,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export type { HighlightColorKey };
