import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioStatus } from "expo-audio";
import { AudioConfiguration } from "@/constants/audio/config";
import {
  ChapterAudioMetadata,
  NarrationError,
  NarrationErrorCode,
  NarrationPlaybackStatus,
  PlaybackSpeed,
} from "@/constants/audio/types";

export interface PremiumNarrationCallbacks {
  onVerseChange?: (verse: number) => void;
  onStatusChange?: (status: NarrationPlaybackStatus) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  onChapterDone?: () => void;
  onError?: (error: NarrationError) => void;
}

export interface PlayChapterOptions {
  /** Pre-fetched metadata (e.g. already loaded for a downloaded chapter) — skips the network fetch. */
  metadata?: ChapterAudioMetadata;
  /** Plays a local downloaded file instead of streaming from the CDN. */
  localUri?: string;
  /** "Start Reading Here" — begins playback at this verse instead of the chapter's start. */
  fromVerse?: number;
  rate?: PlaybackSpeed;
}

let audioModeConfigured = false;

/** Configures the audio session once for spoken-word background playback:
 * exclusive focus (doNotMix, matching AVAudioSession's `.spokenAudio` intent),
 * plays through the silent switch, and survives backgrounding/lock. */
async function ensureAudioMode() {
  if (audioModeConfigured) return;
  audioModeConfigured = true;
  await setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: "doNotMix",
    shouldPlayInBackground: true,
  });
}

/**
 * Premium narration playback: streamed or downloaded chapter audio via
 * expo-audio's AudioPlayer, with verse-level sync driven by a chapter's
 * VerseTiming metadata and native lock-screen/Now Playing controls.
 * Never uses AVSpeechSynthesizer — that's AppleReaderService's job.
 */
export class PremiumNarrationService {
  private callbacks: PremiumNarrationCallbacks;
  private player: AudioPlayer | null = null;
  private statusSub: { remove: () => void } | null = null;
  private metadata: ChapterAudioMetadata | null = null;
  private book: string | null = null;
  private chapter: number | null = null;
  private currentVerseNum: number | null = null;
  private rate: PlaybackSpeed = 1;

  constructor(callbacks: PremiumNarrationCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /** Looks up a chapter's timing metadata from the CDN. Returns null both when
   * the chapter simply hasn't been generated yet and when the network is
   * unavailable — callers treat both as "fall back," per the no-silent-failure
   * requirement (BibleNarrationManager surfaces which one it was). */
  static async fetchMetadata(book: string, chapter: number): Promise<ChapterAudioMetadata | null> {
    try {
      const res = await fetch(AudioConfiguration.metadataUrl(book, chapter));
      if (!res.ok) return null;
      return (await res.json()) as ChapterAudioMetadata;
    } catch {
      return null;
    }
  }

  async playChapter(book: string, chapter: number, opts: PlayChapterOptions = {}) {
    await ensureAudioMode();
    this.setStatus("loading");

    const metadata = opts.metadata ?? (await PremiumNarrationService.fetchMetadata(book, chapter));
    if (!metadata) {
      this.fail("chapterAudioUnavailable", `No premium narration available for ${book} ${chapter}`);
      return;
    }

    this.teardownPlayer();
    this.metadata = metadata;
    this.book = book;
    this.chapter = chapter;
    this.currentVerseNum = null;
    this.rate = opts.rate ?? this.rate;

    const uri = opts.localUri ?? AudioConfiguration.audioFileUrl(book, metadata.audioFile);
    this.player = createAudioPlayer({ uri });
    this.statusSub = this.player.addListener("playbackStatusUpdate", (status) => this.handleStatus(status));
    this.player.setPlaybackRate(this.rate);
    this.player.setActiveForLockScreen(
      true,
      {
        title: `${book} ${chapter}`,
        artist: "Twelve Scents Publishing Bible",
        albumTitle: "King James Version",
      },
      { showSeekForward: true, showSeekBackward: true }
    );

    if (opts.fromVerse != null) {
      const timing = metadata.verses.find((v) => v.verse === opts.fromVerse);
      if (timing) await this.player.seekTo(timing.start);
    }
    this.player.play();
  }

  play() {
    this.player?.play();
  }

  pause() {
    this.player?.pause();
  }

  stop() {
    this.teardownPlayer();
    this.setStatus("stopped");
  }

  async seekToTime(seconds: number) {
    if (!this.player) return;
    await this.player.seekTo(Math.max(0, seconds));
  }

  async seekToVerse(verse: number) {
    const timing = this.metadata?.verses.find((v) => v.verse === verse);
    if (!timing || !this.player) return;
    await this.player.seekTo(timing.start);
  }

  nextVerse() {
    const target = this.adjacentVerse(1);
    if (target != null) this.seekToVerse(target);
  }

  previousVerse() {
    const target = this.adjacentVerse(-1);
    if (target != null) this.seekToVerse(target);
  }

  setRate(rate: PlaybackSpeed) {
    this.rate = rate;
    this.player?.setPlaybackRate(rate);
  }

  get duration(): number {
    return this.metadata?.duration ?? 0;
  }

  get currentMetadata(): ChapterAudioMetadata | null {
    return this.metadata;
  }

  private adjacentVerse(delta: 1 | -1): number | null {
    const verses = this.metadata?.verses;
    if (!verses?.length || this.currentVerseNum == null) return null;
    const idx = verses.findIndex((v) => v.verse === this.currentVerseNum);
    return verses[idx + delta]?.verse ?? null;
  }

  private verseAt(time: number): number | null {
    const verses = this.metadata?.verses;
    if (!verses?.length) return null;
    for (const v of verses) {
      if (time >= v.start && time < v.end) return v.verse;
    }
    return verses[verses.length - 1].verse;
  }

  private handleStatus(status: AudioStatus) {
    if (!this.player) return;
    this.callbacks.onProgress?.(status.currentTime, status.duration);

    if (status.isBuffering) this.setStatus("buffering");
    else if (status.playing) this.setStatus("playing");
    else if (status.isLoaded) this.setStatus("paused");

    const verse = this.verseAt(status.currentTime);
    if (verse != null && verse !== this.currentVerseNum) {
      this.currentVerseNum = verse;
      this.callbacks.onVerseChange?.(verse);
      if (this.book && this.chapter != null) {
        this.player.updateLockScreenMetadata({
          title: `${this.book} ${this.chapter}`,
          artist: `Twelve Scents Publishing Bible — Verse ${verse}`,
          albumTitle: "King James Version",
        });
      }
    }

    if (status.didJustFinish) {
      this.setStatus("stopped");
      this.callbacks.onChapterDone?.();
    }
  }

  private teardownPlayer() {
    this.statusSub?.remove();
    this.statusSub = null;
    if (this.player) {
      this.player.clearLockScreenControls();
      this.player.remove();
      this.player = null;
    }
    this.metadata = null;
    this.currentVerseNum = null;
  }

  private setStatus(status: NarrationPlaybackStatus) {
    this.callbacks.onStatusChange?.(status);
  }

  private fail(code: NarrationErrorCode, message: string, cause?: unknown) {
    this.setStatus("error");
    this.callbacks.onError?.(new NarrationError(code, message, cause));
  }
}
