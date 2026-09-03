import { useCallback, useEffect, useRef, useState } from "react";
import { AppleReaderService } from "@/services/appleReaderService";
import { PremiumNarrationService } from "@/services/premiumNarrationService";
import { adjacentChapter } from "@/constants/bible/books";
import {
  NarrationError,
  NarrationPlaybackStatus,
  NarrationSource,
  Narrator,
  PlaybackSpeed,
  SleepTimerOption,
} from "@/constants/audio/types";

const SLEEP_TIMER_MINUTES: Partial<Record<SleepTimerOption, number>> = { "15": 15, "30": 30, "45": 45, "60": 60 };

export interface NarrationState {
  source: NarrationSource | null;
  status: NarrationPlaybackStatus;
  book: string | null;
  chapter: number | null;
  verse: number | null;
  /** Seconds. Meaningful for premium playback; Apple Reader has no continuous
   * scrubbable position, so this stays 0 while it's the active source. */
  position: number;
  duration: number;
  speed: PlaybackSpeed;
  narrator: Narrator | null;
  autoAdvance: boolean;
  sleepTimer: SleepTimerOption;
  /** Seconds remaining, for a minutes-based timer only — null for "off" and for
   * "endOfChapter" (which has no countdown to display, just a pending stop). */
  sleepRemainingSeconds: number | null;
  error: NarrationError | null;
  /** Set when premium playback failed for the chapter currently loaded, so the
   * player UI can show an explicit "Use Apple Reader" offer rather than the
   * app silently switching narrators underneath the listener. */
  canFallbackToAppleReader: boolean;
}

const INITIAL_STATE: NarrationState = {
  source: null,
  status: "idle",
  book: null,
  chapter: null,
  verse: null,
  position: 0,
  duration: 0,
  speed: 1,
  narrator: null,
  autoAdvance: true,
  sleepTimer: "off",
  sleepRemainingSeconds: null,
  error: null,
  canFallbackToAppleReader: false,
};

export interface PlayChapterOptions {
  source?: NarrationSource;
  fromVerse?: number;
}

/**
 * Unifies Twelve Scents premium narration and the Apple Reader fallback behind
 * one interface, so the rest of the app (player UI, verse highlighting, lock
 * screen) only ever talks to this hook and never touches either engine
 * directly. Persistence (resume position) and downloads plug in as later
 * additions to playChapter's options — this hook only owns live playback state.
 */
export function useBibleNarration() {
  const [state, setState] = useState<NarrationState>(INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const appleRef = useRef<AppleReaderService | null>(null);
  const premiumRef = useRef<PremiumNarrationService | null>(null);

  if (!appleRef.current) {
    appleRef.current = new AppleReaderService({
      onVerseChange: (verse) => setState((s) => ({ ...s, verse })),
      onStatusChange: (status) => setState((s) => ({ ...s, status })),
      onChapterDone: () => handleChapterDoneRef.current(),
      onError: (error) => setState((s) => ({ ...s, status: "error", error })),
    });
  }
  if (!premiumRef.current) {
    premiumRef.current = new PremiumNarrationService({
      onVerseChange: (verse) => setState((s) => ({ ...s, verse })),
      onStatusChange: (status) => setState((s) => ({ ...s, status })),
      onProgress: (position, duration) => setState((s) => ({ ...s, position, duration })),
      onChapterDone: () => handleChapterDoneRef.current(),
      onError: (error) =>
        setState((s) => ({
          ...s,
          status: "error",
          error,
          canFallbackToAppleReader: error.code === "chapterAudioUnavailable" || error.code === "networkUnavailable",
        })),
    });
  }

  const playChapter = useCallback(async (book: string, chapter: number, opts: PlayChapterOptions = {}) => {
    const source = opts.source ?? stateRef.current.source ?? "premium";
    setState((s) => ({
      ...s,
      book,
      chapter,
      verse: opts.fromVerse ?? null,
      source,
      status: "loading",
      error: null,
      canFallbackToAppleReader: false,
      position: 0,
      duration: 0,
    }));

    if (source === "apple") {
      appleRef.current!.stop();
      premiumRef.current!.stop();
      appleRef.current!.setRate(stateRef.current.speed);
      appleRef.current!.playChapter(book, chapter, opts.fromVerse);
    } else {
      appleRef.current!.stop();
      await premiumRef.current!.playChapter(book, chapter, { fromVerse: opts.fromVerse, rate: stateRef.current.speed });
    }
  }, []);

  /** Replays the current chapter (from the current verse, where possible) under
   * a different source — used both for a deliberate narrator-picker switch and
   * for the explicit, user-initiated "Use Apple Reader" offer after a premium
   * failure. Never triggered automatically. */
  const switchSource = useCallback(
    (source: NarrationSource) => {
      const { book, chapter, verse } = stateRef.current;
      if (!book || chapter == null) {
        setState((s) => ({ ...s, source }));
        return;
      }
      playChapter(book, chapter, { source, fromVerse: verse ?? undefined });
    },
    [playChapter]
  );

  const useAppleReaderFallback = useCallback(() => switchSource("apple"), [switchSource]);

  const playVerseOnly = useCallback((book: string, chapter: number, verse: number) => {
    // "Read Verse" is always spoken via Apple Reader — a single verse doesn't
    // warrant a premium stream fetch, and this keeps the action instant.
    premiumRef.current!.stop();
    setState((s) => ({ ...s, book, chapter, verse, source: "apple", status: "loading", error: null }));
    appleRef.current!.playVerseOnly(book, chapter, verse);
  }, []);

  const togglePlayPause = useCallback(() => {
    const { source, status } = stateRef.current;
    if (source === "apple") {
      if (status === "playing") appleRef.current!.pause();
      else if (status === "paused") appleRef.current!.resume();
    } else {
      if (status === "playing") premiumRef.current!.pause();
      else if (status === "paused") premiumRef.current!.play();
    }
  }, []);

  const stop = useCallback(() => {
    appleRef.current!.stop();
    premiumRef.current!.stop();
    setState(INITIAL_STATE);
  }, []);

  const nextVerse = useCallback(() => {
    const engine = stateRef.current.source === "apple" ? appleRef.current! : premiumRef.current!;
    engine.nextVerse();
  }, []);

  const previousVerse = useCallback(() => {
    const engine = stateRef.current.source === "apple" ? appleRef.current! : premiumRef.current!;
    engine.previousVerse();
  }, []);

  const goToChapter = useCallback(
    (dir: 1 | -1) => {
      const { book, chapter } = stateRef.current;
      if (!book || chapter == null) return;
      const next = adjacentChapter(book, chapter, dir);
      if (next) playChapter(next.book, next.chapter);
    },
    [playChapter]
  );

  const nextChapter = useCallback(() => goToChapter(1), [goToChapter]);
  const previousChapter = useCallback(() => goToChapter(-1), [goToChapter]);

  const seek = useCallback((seconds: number) => {
    if (stateRef.current.source === "premium") premiumRef.current!.seekToTime(seconds);
    // Apple Reader has no continuous timeline to seek within — verse-level
    // nextVerse/previousVerse is the equivalent granularity for that source.
  }, []);

  const setSpeed = useCallback((speed: PlaybackSpeed) => {
    setState((s) => ({ ...s, speed }));
    appleRef.current!.setRate(speed);
    premiumRef.current!.setRate(speed);
  }, []);

  const setAutoAdvance = useCallback((autoAdvance: boolean) => {
    setState((s) => ({ ...s, autoAdvance }));
  }, []);

  const setSleepTimer = useCallback((option: SleepTimerOption) => {
    const minutes = SLEEP_TIMER_MINUTES[option];
    setState((s) => ({ ...s, sleepTimer: option, sleepRemainingSeconds: minutes ? minutes * 60 : null }));
  }, []);

  const selectNarrator = useCallback((narrator: Narrator) => {
    setState((s) => ({ ...s, narrator }));
    if (narrator.source === "apple") appleRef.current!.setVoice(narrator.appleVoiceIdentifier);
  }, []);

  const dismissError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  // handleChapterDone needs the latest playChapter/goToChapter closures but is
  // itself passed into service constructors before those exist — routed through
  // a ref so the constructors above can call a stable function.
  const handleChapterDoneRef = useRef<() => void>(() => {});
  useEffect(() => {
    handleChapterDoneRef.current = () => {
      // A pending "end of chapter" sleep timer overrides auto-advance — the
      // point of that setting is to stop, not to keep reading into the next chapter.
      if (stateRef.current.sleepTimer === "endOfChapter") {
        appleRef.current!.stop();
        premiumRef.current!.stop();
        setState((s) => ({ ...INITIAL_STATE, sleepTimer: "off" }));
        return;
      }
      if (stateRef.current.autoAdvance) {
        goToChapter(1);
      } else {
        setState((s) => ({ ...s, status: "stopped" }));
      }
    };
  }, [goToChapter]);

  // Sleep timer countdown — only runs for the minutes-based options; "endOfChapter"
  // is handled entirely by the chapter-done handler above, and "off" needs no timer.
  useEffect(() => {
    if (state.sleepTimer === "off" || state.sleepTimer === "endOfChapter") return;
    const interval = setInterval(() => {
      setState((s) => {
        if (s.sleepRemainingSeconds == null) return s;
        const remaining = s.sleepRemainingSeconds - 1;
        if (remaining <= 0) {
          appleRef.current!.stop();
          premiumRef.current!.stop();
          return { ...INITIAL_STATE };
        }
        return { ...s, sleepRemainingSeconds: remaining };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.sleepTimer]);

  useEffect(() => {
    return () => {
      appleRef.current?.stop();
      premiumRef.current?.stop();
    };
  }, []);

  return {
    ...state,
    playChapter,
    playVerseOnly,
    switchSource,
    useAppleReaderFallback,
    togglePlayPause,
    stop,
    nextVerse,
    previousVerse,
    nextChapter,
    previousChapter,
    seek,
    setSpeed,
    setAutoAdvance,
    setSleepTimer,
    selectNarrator,
    dismissError,
  };
}

export type BibleNarrationManager = ReturnType<typeof useBibleNarration>;
